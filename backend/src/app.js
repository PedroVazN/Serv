require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const conectar = require("./db");
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const production = process.env.NODE_ENV === 'production';
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  throw new Error('Configure MONGODB_URI e JWT_SECRET antes de iniciar.');
}
if (production && (process.env.JWT_SECRET.length < 32 || /your_secret|change.?me/i.test(process.env.JWT_SECRET))) {
  throw new Error('JWT_SECRET de produção deve ser aleatório e ter pelo menos 32 caracteres.');
}
const serveFrontend = process.env.SERVE_FRONTEND === 'true';
const frontendPath = path.resolve(__dirname, '../../frontend/dist');
if (serveFrontend && !fs.existsSync(path.join(frontendPath, 'index.html'))) {
  throw new Error('Build do frontend ausente. Execute npm run build na pasta frontend.');
}

const app = express();
const limiterOptions = process.env.VERCEL === '1'
  ? { keyGenerator: require('./middleware/vercelRateLimitKey') }
  : {};
// Configure apenas os proxies/sub-redes conhecidos da hospedagem; nunca true.
if (process.env.TRUST_PROXY) app.set('trust proxy', process.env.TRUST_PROXY.split(',').map(value => value.trim()));

// ── Middlewares globais ────────────────────────────────
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(',') }));
app.use('/api', rateLimit({ ...limiterOptions, windowMs: 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));
app.use('/api/auth', rateLimit({ ...limiterOptions, windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false }));
app.use(express.json({ limit: '32kb' }));
app.disable('x-powered-by');
// Rejeita IDs inválidos antes de consultar o banco, incluindo rotas aninhadas.
app.use('/api', (req, res, next) => {
  const unsafe = value => value && typeof value === 'object' && Object.entries(value).some(([key, child]) =>
    key.startsWith('$') || key.includes('.') || ['__proto__', 'constructor', 'prototype'].includes(key) || unsafe(child));
  if (unsafe(req.body) || unsafe(req.query)) return res.status(400).json({ erro: 'Parâmetros inválidos.' });
  for (const [name, value] of Object.entries(req.query)) {
    if (typeof value !== 'string' || value.length > 200) return res.status(400).json({ erro: 'Consulta inválida.' });
    if (['page', 'limit'].includes(name) && (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > (name === 'limit' ? 100 : 100000))) {
      return res.status(400).json({ erro: 'Paginação inválida.' });
    }
  }
  const segments = req.path.split('/').filter(Boolean);
  const ids = [];
  if (segments[0] === 'usuarios' && segments[1] && !['freelancers'].includes(segments[1])) ids.push(segments[1]);
  if (segments[0] === 'servicos' && segments[1] && segments[1] !== 'meus') ids.push(segments[1]);
  if (segments[0] === 'pedidos' && segments[1] && segments[1] !== 'todos') ids.push(segments[1]);
  if (segments[0] === 'pagamentos' && segments[1]) ids.push(segments[1] === 'pedido' ? segments[2] : segments[1]);
  if (segments[0] === 'avaliacoes' && segments[1] === 'servico') ids.push(segments[2]);
  if (ids.some(id => !require('mongoose').isObjectIdOrHexString(id))) {
    return res.status(400).json({ erro: 'Identificador inválido.' });
  }
  next();
});

// Conexão reutilizada entre requisições, inclusive nas funções da Vercel.
app.use(['/api', '/health'], async (_req, res, next) => {
  try {
    await conectar();
    next();
  } catch {
    res.status(503).json({ erro: 'Banco de dados temporariamente indisponível.' });
  }
});

// ── Rotas ─────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/servicos", require("./routes/servicos"));
app.use("/api/pedidos", require("./routes/pedidos"));
app.use("/api/avaliacoes", require("./routes/avaliacoes"));
app.use("/api/pagamentos", require("./routes/pagamentos"));

// ── Health check ───────────────────────────────────────
app.get("/health", (_req, res) =>
  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'unavailable' })
);

// Rotas desconhecidas da API devem retornar JSON, nunca o HTML do React.
app.use('/api', (_req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
if (serveFrontend) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res, next) => {
    if (path.extname(req.path) || !req.accepts('html')) return next();
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ── 404 ────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ erro: "Rota não encontrada." }));

// ── Erro global ────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.type === 'entity.too.large') return res.status(413).json({ erro: 'Corpo da requisição muito grande.' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido.' });
  res.status(500).json({ erro: "Erro interno do servidor." });
});

// ── Inicialização ──────────────────────────────────────
const PORT = process.env.PORT || 3000;

if (require.main === module) conectar().then(() => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
    console.log(`📋 Endpoints disponíveis:`);
    console.log(`   POST   /api/auth/registro`);
    console.log(`   POST   /api/auth/login`);
    console.log(`   GET    /api/auth/me`);
    console.log(`   GET    /api/usuarios/freelancers`);
    console.log(`   GET    /api/servicos`);
    console.log(`   POST   /api/servicos`);
    console.log(`   GET    /api/pedidos`);
    console.log(`   POST   /api/pedidos`);
    console.log(`   POST   /api/pagamentos`);
    console.log(`   GET    /api/avaliacoes/servico/:id`);
    console.log(`   GET    /health`);
  });
  let closing = false;
  const shutdown = () => {
    if (closing) return;
    closing = true;
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(async () => {
      await mongoose.disconnect();
      clearTimeout(timeout);
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}).catch(() => { process.exitCode = 1; });

module.exports = app;

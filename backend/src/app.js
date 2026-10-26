require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectar = require("./db");

const app = express();

// ── Middlewares globais ────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rotas ─────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/servicos", require("./routes/servicos"));
app.use("/api/pedidos", require("./routes/pedidos"));
app.use("/api/avaliacoes", require("./routes/avaliacoes"));
app.use("/api/pagamentos", require("./routes/pagamentos"));

// ── Health check ───────────────────────────────────────
app.get("/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── 404 ────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ erro: "Rota não encontrada." }));

// ── Erro global ────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

// ── Inicialização ──────────────────────────────────────
const PORT = process.env.PORT || 3000;

conectar().then(() => {
  app.listen(PORT, () => {
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
});

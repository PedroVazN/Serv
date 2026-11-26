const assert = require('node:assert/strict');
const crypto = require('node:crypto');
require('dotenv').config();
const mongoose = require('mongoose');
const database = `serv_test_marketplace_${Date.now()}`;
const uri = new URL(process.env.MONGODB_URI);
uri.pathname = '/' + database;
process.env.MONGODB_URI = uri.toString();
process.env.MONGODB_DB_NAME = database;
process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
process.env.NODE_ENV = 'test';
process.env.SERVE_FRONTEND = 'false';
delete process.env.VERCEL;
const app = require('../src/app');
const Usuario = require('../src/models/Usuario');
const Servico = require('../src/models/Servico');
const Pedido = require('../src/models/Pedido');
const Orcamento = require('../src/models/Orcamento');
const Avaliacao = require('../src/models/Avaliacao');
let server, base, passed = 0;
async function request(method, path, data, token, expected = 200) {
  const r = await fetch(base + '/api' + path, { method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  const body = await r.json().catch(() => null);
  assert.equal(r.status, expected, `${method} ${path}: ${body?.erro || r.status}`);
  passed++;
  return body;
}
async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([Usuario, Servico, Pedido, Orcamento, Avaliacao].map(model => model.init()));
  server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
  const accounts = [];
  for (const [name, tipo] of [['Cliente A', 'cliente'], ['Cliente B', 'cliente'], ['Profissional A', 'freelancer'], ['Profissional B', 'freelancer']]) {
    accounts.push(await request('POST', '/auth/registro', { nome: name, tipo, email: `${accounts.length}@example.invalid`, senha: 'TesteMercado123!' }, undefined, 201));
  }
  const [client, outsider, professional, otherProfessional] = accounts;
  await request('POST', '/auth/registro', { nome: 'Admin', email: 'admin@example.invalid', senha: 'TesteMercado123!', tipo: 'admin' }, undefined, 400);
  await request('PATCH', '/usuarios/' + professional.usuario._id, { perfil_freelancer: { descricao: 'Desenvolvimento de sites acessíveis.', area_atuacao: 'Web', disponibilidade: 'disponivel', portfolio_url: 'https://example.com/portfolio' } }, professional.token);
  await request('PATCH', '/usuarios/' + professional.usuario._id, { nome: 'Invasão' }, outsider.token, 403);
  const publicProfile = await request('GET', '/usuarios/freelancers/' + professional.usuario._id);
  assert(!publicProfile.email && !publicProfile.senha && !publicProfile.info); passed++;
  const directory = await request('GET', '/usuarios/freelancers?area=Web');
  assert.equal(directory.total, 1); assert(!directory.resultados[0].email); passed++;
  await request('GET', '/usuarios/freelancers/' + client.usuario._id, undefined, undefined, 404);
  const service = await request('POST', '/servicos', { titulo: 'Site institucional', descricao: 'Projeto de site responsivo e acessível.', preco: 100, categoria: 'Web', usuario: client.usuario._id }, professional.token, 201);
  assert.equal(service.usuario, professional.usuario._id); passed++;
  const extraService = await request('POST', '/servicos', { titulo: 'Outro serviço', descricao: 'Serviço que não faz parte do pedido.', preco: 50, categoria: 'Design' }, professional.token, 201);
  const services = await request('GET', '/servicos?profissional=' + professional.usuario._id);
  assert.equal(services.total, 2); assert(!services.resultados[0].usuario.email); passed++;
  const input = { servico_id: service._id, descricao: 'Preciso de um site com cinco páginas institucionais.' };
  await request('POST', '/orcamentos', input, undefined, 401);
  await request('POST', '/orcamentos', input, professional.token, 403);
  await request('POST', '/orcamentos', { ...input, descricao: 'curta' }, client.token, 400);
  const quote = await request('POST', '/orcamentos', { ...input, profissional: otherProfessional.usuario._id, status: 'aceito' }, client.token, 201);
  assert.equal(quote.profissional, professional.usuario._id); assert.equal(quote.status, 'solicitado'); passed++;
  assert.equal((await request('GET', '/orcamentos', undefined, outsider.token)).total, 0); passed++;
  assert.equal((await request('GET', '/orcamentos', undefined, professional.token)).total, 1); passed++;
  await request('POST', `/orcamentos/${quote._id}/aceitar`, undefined, client.token, 409);
  const proposal = { valor: 750.5, prazo_dias: 14, escopo: 'Cinco páginas responsivas, publicação e uma rodada de revisão.' };
  await request('PATCH', `/orcamentos/${quote._id}/responder`, proposal, otherProfessional.token, 409);
  await request('PATCH', `/orcamentos/${quote._id}/responder`, { ...proposal, valor: -1 }, professional.token, 400);
  await request('PATCH', `/orcamentos/${quote._id}/responder`, { ...proposal, prazo_dias: 1.5 }, professional.token, 400);
  await request('PATCH', `/orcamentos/${quote._id}/responder`, proposal, professional.token);
  await request('PATCH', `/orcamentos/${quote._id}/responder`, proposal, professional.token, 409);
  await request('POST', `/orcamentos/${quote._id}/aceitar`, undefined, outsider.token, 409);
  const [order, sameOrder] = await Promise.all([
    request('POST', `/orcamentos/${quote._id}/aceitar`, { valor: 1 }, client.token),
    request('POST', `/orcamentos/${quote._id}/aceitar`, undefined, client.token),
  ]);
  assert.equal(order._id, sameOrder._id); assert.equal(order.valor_total, proposal.valor);
  assert.equal(await Pedido.countDocuments({ orcamento: quote._id }), 1);
  assert.equal((await Orcamento.findById(quote._id)).status, 'aceito'); passed++;
  await request('PATCH', `/orcamentos/${quote._id}/recusar`, undefined, client.token, 409);
  await request('GET', '/pedidos/' + order._id, undefined, outsider.token, 403);
  await request('GET', '/pedidos/' + order._id, undefined, professional.token);
  assert.equal((await request('GET', '/pedidos/recebidos', undefined, professional.token)).total, 1); passed++;
  assert.equal((await request('GET', '/pedidos/recebidos', undefined, otherProfessional.token)).total, 0); passed++;
  await request('PATCH', `/pedidos/${order._id}/concluir`, undefined, outsider.token, 409);
  const review = { pedido_id: order._id, servico_id: service._id, nota: 5, comentario: 'Tudo entregue conforme combinado.' };
  await request('POST', '/avaliacoes', review, client.token, 403);
  await request('PATCH', `/pedidos/${order._id}/concluir`, undefined, client.token);
  await request('PATCH', `/pedidos/${order._id}/concluir`, undefined, client.token, 409);
  await request('POST', '/avaliacoes', { ...review, servico_id: extraService._id }, client.token, 400);
  await request('POST', '/avaliacoes', review, client.token, 201);
  await request('POST', '/avaliacoes', review, client.token, 409);
  const rejected = await request('POST', '/orcamentos', input, client.token, 201);
  await request('PATCH', `/orcamentos/${rejected._id}/recusar`, undefined, otherProfessional.token, 409);
  await request('PATCH', `/orcamentos/${rejected._id}/recusar`, undefined, professional.token);
  await request('POST', `/orcamentos/${rejected._id}/aceitar`, undefined, client.token, 409);
  await request('PATCH', '/servicos/' + service._id, { ativo: false }, professional.token);
  await request('POST', '/orcamentos', input, client.token, 404);
  await request('GET', '/servicos/' + service._id, undefined, undefined, 404);
  await request('GET', '/orcamentos?limit=99999', undefined, client.token, 400);
  await request('POST', '/orcamentos/id-invalido/aceitar', undefined, client.token, 400);
  console.log(`PASS: ${passed} verificações, incluindo aceite concorrente e isolamento entre contas.`);
}
run().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  if (mongoose.connection.readyState === 1) {
    assert.equal(mongoose.connection.name, database);
    assert.match(database, /^serv_test_marketplace_\d+$/);
    await mongoose.connection.dropDatabase();
    console.log('Banco temporário de testes removido; banco do aplicativo não foi utilizado.');
  }
  await mongoose.disconnect();
});

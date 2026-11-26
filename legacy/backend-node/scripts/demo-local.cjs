require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../src/models/Usuario');
const Servico = require('../src/models/Servico');
const Pedido = require('../src/models/Pedido');
const Orcamento = require('../src/models/Orcamento');
const Avaliacao = require('../src/models/Avaliacao');

async function main() {
  if (process.env.MONGODB_DB_NAME !== 'serv_desenvolvimento' || process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    throw new Error('Demonstração permitida somente no banco serv_desenvolvimento, fora de produção.');
  }
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'serv_desenvolvimento' });
  await Promise.all([Usuario, Servico, Pedido, Orcamento, Avaliacao].map(model => model.init()));
  const password = 'ServDemo2026!';
  const create = async (email, nome, tipo) => await Usuario.findOne({ email }) || await Usuario.create({ email, nome, tipo, senha: password });
  await create('cliente.demo@example.invalid', 'Cliente de demonstração', 'cliente');
  const professional = await create('profissional.demo@example.invalid', 'Profissional de demonstração', 'freelancer');
  if (!professional.perfil_freelancer?.descricao) {
    professional.perfil_freelancer = { descricao: 'Perfil demonstrativo para conhecer o fluxo de contratação do SERV+. Desenvolvimento de sites acessíveis e responsivos.', area_atuacao: 'Desenvolvimento web', experiencia: 'Demonstração local, sem contratação ou cobrança real.', disponibilidade: 'disponivel' };
    await professional.save();
  }
  if (!await Servico.exists({ usuario: professional._id })) await Servico.create({ usuario: professional._id, titulo: 'Site institucional responsivo', descricao: 'Planejamento e desenvolvimento de um site institucional para apresentar sua empresa. Escopo, prazo e preço final são definidos na proposta.', preco: 1500, categoria: 'Web' });
  console.log('Demonstração preparada apenas no banco serv_desenvolvimento.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());

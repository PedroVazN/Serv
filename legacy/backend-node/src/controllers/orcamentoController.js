const mongoose = require('mongoose');
const Orcamento = require('../models/Orcamento');
const Pedido = require('../models/Pedido');
const Servico = require('../models/Servico');

const populate = query => query.populate('cliente', 'nome').populate('profissional', 'nome');
const failure = (res, error) => {
  console.error('Falha na operação de orçamento:', error.name);
  return res.status(500).json({ erro: 'Não foi possível processar o orçamento.' });
};

exports.listar = async (req, res) => {
  try {
    const filtro = req.usuario.tipo === 'admin' ? {} : {
      [req.usuario.tipo === 'freelancer' ? 'profissional' : 'cliente']: req.usuario._id,
    };
    const page = Number(req.query.page || 1), limit = Number(req.query.limit || 20);
    const [resultados, total] = await Promise.all([
      populate(Orcamento.find(filtro)).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Orcamento.countDocuments(filtro),
    ]);
    res.json({ resultados, total, pagina: page });
  } catch (error) { failure(res, error); }
};

exports.criar = async (req, res) => {
  try {
    const { servico_id, descricao } = req.body;
    if (!mongoose.isObjectIdOrHexString(servico_id) || typeof descricao !== 'string' ||
        descricao.trim().length < 10 || descricao.trim().length > 4000) {
      return res.status(400).json({ erro: 'Escolha um serviço e descreva o projeto em 10 a 4000 caracteres.' });
    }
    const servico = await Servico.findOne({ _id: servico_id, ativo: true }).populate('usuario', 'tipo perfil_freelancer');
    if (!servico || servico.usuario?.tipo !== 'freelancer' || servico.usuario.perfil_freelancer?.disponibilidade === 'indisponivel') {
      return res.status(404).json({ erro: 'Este serviço não está disponível para orçamento.' });
    }
    const orcamento = await Orcamento.create({
      cliente: req.usuario._id, profissional: servico.usuario._id, servico: servico._id,
      titulo_servico: servico.titulo, descricao: descricao.trim(),
    });
    res.status(201).json(orcamento);
  } catch (error) { failure(res, error); }
};

exports.responder = async (req, res) => {
  try {
    const { valor, prazo_dias, escopo } = req.body;
    if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < 0.01 || valor > 1000000 ||
        Math.abs(valor * 100 - Math.round(valor * 100)) > 0.000001 ||
        !Number.isInteger(prazo_dias) || prazo_dias < 1 || prazo_dias > 365 ||
        typeof escopo !== 'string' || escopo.trim().length < 10 || escopo.trim().length > 4000) {
      return res.status(400).json({ erro: 'Informe valor positivo com até duas casas decimais, prazo de 1 a 365 dias e escopo de 10 a 4000 caracteres.' });
    }
    const quote = await Orcamento.findOneAndUpdate({
      _id: req.params.id, profissional: req.usuario._id, status: 'solicitado',
    }, { $set: { status: 'respondido', proposta: { valor, prazo_dias, escopo: escopo.trim() } } }, { new: true, runValidators: true });
    if (!quote) return res.status(409).json({ erro: 'Orçamento indisponível para resposta nesta conta ou já respondido.' });
    res.json(quote);
  } catch (error) { failure(res, error); }
};

exports.aceitar = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    let pedido;
    await session.withTransaction(async () => {
      const quote = await Orcamento.findOne({ _id: req.params.id, cliente: req.usuario._id }).session(session);
      if (!quote || !['respondido', 'aceito'].includes(quote.status)) {
        const error = new Error('Orçamento indisponível para aceite.'); error.status = 409; throw error;
      }
      if (quote.status === 'aceito') {
        pedido = await Pedido.findOne({ orcamento: quote._id }).session(session);
        if (!pedido) throw new Error('Pedido não encontrado para orçamento aceito.');
        return;
      }
      quote.status = 'aceito';
      await quote.save({ session });
      [pedido] = await Pedido.create([{
        cliente: quote.cliente, profissional: quote.profissional, orcamento: quote._id,
        itens: [{ servico: quote.servico, quantidade: 1, preco_unitario: quote.proposta.valor }],
        escopo: quote.proposta.escopo, prazo_dias: quote.proposta.prazo_dias, status: 'em_andamento',
      }], { session });
    });
    res.json(pedido);
  } catch (error) {
    if (error.status === 409) return res.status(409).json({ erro: error.message });
    failure(res, error);
  } finally { if (session) await session.endSession(); }
};

exports.recusar = async (req, res) => {
  try {
    const freelancer = req.usuario.tipo === 'freelancer';
    const quote = await Orcamento.findOneAndUpdate({
      _id: req.params.id,
      [freelancer ? 'profissional' : 'cliente']: req.usuario._id,
      status: freelancer ? 'solicitado' : { $in: ['solicitado', 'respondido'] },
    }, { $set: { status: 'recusado' } }, { new: true });
    if (!quote) return res.status(409).json({ erro: 'Orçamento indisponível para recusa nesta conta.' });
    res.json(quote);
  } catch (error) { failure(res, error); }
};

const Pedido = require("../models/Pedido");
const Servico = require("../models/Servico");
const Avaliacao = require('../models/Avaliacao');

// POST /api/pedidos
exports.criar = async (req, res) => {
  try {
    const { itens } = req.body;
    if (!Array.isArray(itens) || itens.length === 0 || itens.length > 100 ||
        itens.some(item => !item || !require('mongoose').isObjectIdOrHexString(item.servico) ||
          (item.quantidade !== undefined && (!Number.isInteger(item.quantidade) || item.quantidade < 1)))) {
      return res.status(400).json({ erro: 'Informe de 1 a 100 itens com serviço e quantidade válidos.' });
    }

    // Busca preços reais dos serviços no banco
    const itensComPreco = await Promise.all(
      itens.map(async (item) => {
        const servico = await Servico.findById(item.servico);
        if (!servico || !servico.ativo) throw new Error(`Serviço ${item.servico} não encontrado ou inativo.`);
        return {
          servico: servico._id,
          quantidade: item.quantidade || 1,
          preco_unitario: servico.preco,
        };
      })
    );

    const pedido = await Pedido.create({
      cliente: req.usuario._id,
      itens: itensComPreco,
    });

    await pedido.populate("itens.servico", "titulo preco usuario");
    res.status(201).json(pedido);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// GET /api/pedidos — lista pedidos do usuário autenticado
exports.meusPedidos = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filtro = { cliente: req.usuario._id };
    if (status) filtro.status = status;

    const pedidos = await Pedido.find(filtro)
      .populate("itens.servico", "titulo preco")
      .populate('profissional', 'nome')
      .sort({ data_pedido: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Pedido.countDocuments(filtro);
    const reviewed = new Set((await Avaliacao.find({ avaliador: req.usuario._id, pedido: { $in: pedidos.map(p => p._id) } }).distinct('pedido')).map(String));
    res.json({ total, pagina: Number(page), resultados: pedidos.map(pedido => ({ ...pedido.toObject(), avaliado: reviewed.has(String(pedido._id)) })) });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/pedidos/:id
exports.buscarPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("cliente", "nome email")
      .populate("itens.servico", "titulo preco usuario");

    if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado." });

    // Só o próprio cliente ou admin pode ver
    const ehDono = pedido.cliente._id.equals(req.usuario._id);
    const ehProfissional = pedido.profissional?.equals(req.usuario._id);
    if (!ehDono && !ehProfissional && req.usuario.tipo !== "admin") {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    res.json(pedido);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.recebidos = async (req, res) => {
  try {
    const page = Number(req.query.page || 1), limit = Number(req.query.limit || 20);
    const filtro = { profissional: req.usuario._id };
    const [resultados, total] = await Promise.all([
      Pedido.find(filtro).populate('cliente', 'nome').populate('itens.servico', 'titulo')
        .sort({ data_pedido: -1 }).skip((page - 1) * limit).limit(limit),
      Pedido.countDocuments(filtro),
    ]);
    res.json({ resultados, total, pagina: page });
  } catch { res.status(500).json({ erro: 'Não foi possível carregar os pedidos.' }); }
};

exports.concluir = async (req, res) => {
  try {
    const pedido = await Pedido.findOneAndUpdate({ _id: req.params.id, cliente: req.usuario._id,
      orcamento: { $exists: true }, status: 'em_andamento' }, { $set: { status: 'concluido' } }, { new: true });
    if (!pedido) return res.status(409).json({ erro: 'Pedido indisponível para conclusão nesta conta.' });
    res.json(pedido);
  } catch { res.status(500).json({ erro: 'Não foi possível concluir o pedido.' }); }
};

// PATCH /api/pedidos/:id/status
exports.atualizarStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado." });
    res.json(pedido);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// GET /api/pedidos — admin lista todos
exports.listarTodos = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filtro = status ? { status } : {};

    const pedidos = await Pedido.find(filtro)
      .populate("cliente", "nome email")
      .populate("itens.servico", "titulo preco")
      .sort({ data_pedido: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Pedido.countDocuments(filtro);
    res.json({ total, pagina: Number(page), resultados: pedidos });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

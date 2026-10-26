const Pedido = require("../models/Pedido");
const Servico = require("../models/Servico");

// POST /api/pedidos
exports.criar = async (req, res) => {
  try {
    const { itens } = req.body;

    // Busca preços reais dos serviços no banco
    const itensComPreco = await Promise.all(
      itens.map(async (item) => {
        const servico = await Servico.findById(item.servico);
        if (!servico) throw new Error(`Serviço ${item.servico} não encontrado.`);
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
      .sort({ data_pedido: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Pedido.countDocuments(filtro);
    res.json({ total, pagina: Number(page), resultados: pedidos });
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
    if (!ehDono && req.usuario.tipo !== "admin") {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    res.json(pedido);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
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

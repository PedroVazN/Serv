const Pagamento = require("../models/Pagamento");
const Pedido = require("../models/Pedido");

// POST /api/pagamentos
exports.criar = async (req, res) => {
  try {
    const { pedido_id, metodo } = req.body;

    const pedido = await Pedido.findOne({
      _id: pedido_id,
      cliente: req.usuario._id,
    });
    if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado." });

    const pagamento = await Pagamento.create({
      pedido: pedido_id,
      metodo,
      valor: pedido.valor_total,
      status: "processando",
    });

    // Atualiza pedido para em_andamento após pagamento iniciado
    pedido.status = "em_andamento";
    await pedido.save();

    res.status(201).json(pagamento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// GET /api/pagamentos/pedido/:pedidoId
exports.porPedido = async (req, res) => {
  try {
    const pagamentos = await Pagamento.find({ pedido: req.params.pedidoId }).populate(
      "pedido",
      "status valor_total"
    );
    res.json(pagamentos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// PATCH /api/pagamentos/:id/status  (admin)
exports.atualizarStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const pagamento = await Pagamento.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!pagamento) return res.status(404).json({ erro: "Pagamento não encontrado." });
    res.json(pagamento);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

const Avaliacao = require("../models/Avaliacao");
const Pedido = require("../models/Pedido");

// POST /api/avaliacoes
exports.criar = async (req, res) => {
  try {
    const { pedido_id, servico_id, nota, comentario } = req.body;

    // Verifica se o pedido pertence ao usuário e está concluído
    const pedido = await Pedido.findOne({
      _id: pedido_id,
      cliente: req.usuario._id,
      status: "concluido",
    });
    if (!pedido) {
      return res.status(403).json({
        erro: "Só é possível avaliar pedidos concluídos do próprio usuário.",
      });
    }

    const avaliacao = await Avaliacao.create({
      pedido: pedido_id,
      servico: servico_id,
      avaliador: req.usuario._id,
      nota,
      comentario,
    });

    res.status(201).json(avaliacao);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ erro: "Este serviço deste pedido já foi avaliado." });
    }
    res.status(400).json({ erro: err.message });
  }
};

// GET /api/avaliacoes/servico/:servicoId
exports.porServico = async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find({ servico: req.params.servicoId })
      .populate("avaliador", "nome")
      .sort({ data_criacao: -1 });

    const media =
      avaliacoes.length > 0
        ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
        : 0;

    res.json({ media: Number(media.toFixed(1)), total: avaliacoes.length, avaliacoes });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

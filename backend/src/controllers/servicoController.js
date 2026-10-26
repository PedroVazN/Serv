const Servico = require("../models/Servico");

// GET /api/servicos
exports.listar = async (req, res) => {
  try {
    const { categoria, busca, page = 1, limit = 20 } = req.query;
    const filtro = { ativo: true };

    if (categoria) filtro.categoria = categoria;
    if (busca) filtro.$text = { $search: busca };

    const servicos = await Servico.find(filtro)
      .populate("usuario", "nome email perfil_freelancer")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ data_criacao: -1 });

    const total = await Servico.countDocuments(filtro);
    res.json({ total, pagina: Number(page), resultados: servicos });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/servicos/:id
exports.buscarPorId = async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id).populate(
      "usuario",
      "nome email perfil_freelancer"
    );
    if (!servico) return res.status(404).json({ erro: "Serviço não encontrado." });
    res.json(servico);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// POST /api/servicos
exports.criar = async (req, res) => {
  try {
    const servico = await Servico.create({
      ...req.body,
      usuario: req.usuario._id,
    });
    res.status(201).json(servico);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// PATCH /api/servicos/:id
exports.atualizar = async (req, res) => {
  try {
    const servico = await Servico.findOne({
      _id: req.params.id,
      usuario: req.usuario._id,
    });
    if (!servico) return res.status(404).json({ erro: "Serviço não encontrado." });

    Object.assign(servico, req.body);
    await servico.save();
    res.json(servico);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// DELETE /api/servicos/:id
exports.deletar = async (req, res) => {
  try {
    const servico = await Servico.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario._id,
    });
    if (!servico) return res.status(404).json({ erro: "Serviço não encontrado." });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/servicos/meus
exports.meusServicos = async (req, res) => {
  try {
    const servicos = await Servico.find({ usuario: req.usuario._id }).sort({
      data_criacao: -1,
    });
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

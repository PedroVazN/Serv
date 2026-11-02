const Usuario = require("../models/Usuario");

// GET /api/usuarios
exports.listar = async (req, res) => {
  try {
    const { tipo, page = 1, limit = 20 } = req.query;
    const filtro = tipo ? { tipo } : {};

    const usuarios = await Usuario.find(filtro)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Usuario.countDocuments(filtro);

    res.json({ total, pagina: Number(page), resultados: usuarios });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/usuarios/:id
exports.buscarPorId = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'admin' && String(req.usuario._id) !== req.params.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado." });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// PATCH /api/usuarios/:id
exports.atualizar = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'admin' && String(req.usuario._id) !== req.params.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }
    // Não permite alterar senha ou tipo por aqui
    const dados = {};
    for (const campo of ['nome', 'email', 'info', 'perfil_freelancer']) {
      if (Object.prototype.hasOwnProperty.call(req.body, campo)) dados[campo] = req.body[campo];
    }

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, dados, {
      new: true,
      runValidators: true,
    });

    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado." });
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// DELETE /api/usuarios/:id
exports.deletar = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado." });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/usuarios/freelancers
exports.listarFreelancers = async (req, res) => {
  try {
    const { area, page = 1, limit = 20 } = req.query;
    const filtro = { tipo: "freelancer" };
    if (area) filtro["perfil_freelancer.area_atuacao"] = new RegExp(area.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");

    const freelancers = await Usuario.find(filtro)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Usuario.countDocuments(filtro);
    res.json({ total, pagina: Number(page), resultados: freelancers });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

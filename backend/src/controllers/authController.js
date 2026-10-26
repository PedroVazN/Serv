const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const gerarToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/registro
exports.registro = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(409).json({ erro: "E-mail já cadastrado." });
    }

    const usuario = await Usuario.create({ nome, email, senha, tipo });
    const token = gerarToken(usuario._id);

    res.status(201).json({ token, usuario });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
    }

    const usuario = await Usuario.findOne({ email }).select("+senha");
    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const token = gerarToken(usuario._id);
    res.json({ token, usuario });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  res.json(req.usuario);
};

const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// Verifica se o token JWT é válido
exports.proteger = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ erro: "Token não fornecido." });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) return res.status(401).json({ erro: "Usuário não encontrado." });

    req.usuario = usuario;
    next();
  } catch (err) {
    res.status(401).json({ erro: "Token inválido ou expirado." });
  }
};

// Restringe acesso por tipo de usuário
exports.restringir = (...tipos) =>
  (req, res, next) => {
    if (!tipos.includes(req.usuario.tipo)) {
      return res.status(403).json({ erro: "Permissão insuficiente." });
    }
    next();
  };

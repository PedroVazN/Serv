const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Usuario = require("../models/Usuario");

const gerarToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// Configuração do Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/auth/registro
exports.registro = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (
      typeof nome !== "string" ||
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !["cliente", "freelancer"].includes(tipo || "cliente")
    ) {
      return res.status(400).json({
        erro: "Dados de cadastro inválidos.",
      });
    }

    const existe = await Usuario.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existe) {
      return res.status(409).json({
        erro: "E-mail já cadastrado.",
      });
    }

    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      tipo,
    });

    const token = gerarToken(usuario._id);

    res.status(201).json({
      token,
      usuario,
    });
  } catch (err) {
    res.status(400).json({
      erro: err.message,
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (
      typeof email !== "string" ||
      typeof senha !== "string"
    ) {
      return res.status(400).json({
        erro: "Email e senha devem ser textos.",
      });
    }

    if (!email || !senha) {
      return res.status(400).json({
        erro: "E-mail e senha são obrigatórios.",
      });
    }

    const usuario = await Usuario.findOne({
      email: email.trim().toLowerCase(),
    }).select(
      "+senha +mfaCodigoHash +mfaCodigoExpiraEm +mfaTentativas"
    );

    // Verificação da senha
    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({
        erro: "Credenciais inválidas.",
      });
    }

    // Gera código MFA de 6 dígitos
    const codigo = crypto
      .randomInt(100000, 1000000)
      .toString();

    // Cria hash SHA-256 do código
    const codigoHash = crypto
      .createHash("sha256")
      .update(codigo)
      .digest("hex");

    // Salva o desafio MFA
    usuario.mfaCodigoHash = codigoHash;

    // Código válido por 5 minutos
    usuario.mfaCodigoExpiraEm = new Date(
      Date.now() + 5 * 60 * 1000
    );

    usuario.mfaTentativas = 0;

    await usuario.save();

    // Envia o código pelo Gmail
    await transporter.sendMail({
      from: `"SERV+" <${process.env.EMAIL_USER}>`,
      to: usuario.email,
      subject: "Código de verificação - SERV+",

      text: `Olá, ${usuario.nome}!

Seu código de verificação do SERV+ é:

${codigo}

Esse código é válido por 5 minutos.

Se você não solicitou esse código, ignore este e-mail.

SERV+`,
    });

    // IMPORTANTE:
    // Neste momento NÃO entregamos o JWT.
    // O usuário ainda precisa confirmar o MFA.

    res.json({
      mensagem:
        "Código de verificação enviado para o seu e-mail.",
    });
  } catch (err) {
    console.error("Erro no login/MFA:", err);

    res.status(500).json({
      erro: "Não foi possível enviar o código de verificação.",
    });
  }
};

// POST /api/auth/verificar-mfa
exports.verificarMFA = async (req, res) => {
  try {
    const { email, codigo } = req.body;

    if (
      typeof email !== "string" ||
      typeof codigo !== "string"
    ) {
      return res.status(400).json({
        erro: "E-mail e código são obrigatórios.",
      });
    }

    if (!/^\d{6}$/.test(codigo)) {
      return res.status(400).json({
        erro: "O código deve possuir 6 dígitos.",
      });
    }

    const usuario = await Usuario.findOne({
      email: email.trim().toLowerCase(),
    }).select(
      "+mfaCodigoHash +mfaCodigoExpiraEm +mfaTentativas"
    );

    if (!usuario || !usuario.mfaCodigoHash) {
      return res.status(401).json({
        erro: "Código inválido ou expirado.",
      });
    }

    // Limite de 5 tentativas
    if (usuario.mfaTentativas >= 5) {
      usuario.mfaCodigoHash = null;
      usuario.mfaCodigoExpiraEm = null;
      usuario.mfaTentativas = 0;

      await usuario.save();

      return res.status(429).json({
        erro:
          "Número máximo de tentativas excedido. Faça login novamente.",
      });
    }

    // Verifica validade do código
    if (
      !usuario.mfaCodigoExpiraEm ||
      usuario.mfaCodigoExpiraEm.getTime() < Date.now()
    ) {
      usuario.mfaCodigoHash = null;
      usuario.mfaCodigoExpiraEm = null;
      usuario.mfaTentativas = 0;

      await usuario.save();

      return res.status(401).json({
        erro: "Código expirado. Faça login novamente.",
      });
    }

    // Calcula o hash do código informado
    const codigoHash = crypto
      .createHash("sha256")
      .update(codigo)
      .digest("hex");

    // Comparação segura dos hashes
    const hashCorreto = crypto.timingSafeEqual(
      Buffer.from(codigoHash, "hex"),
      Buffer.from(usuario.mfaCodigoHash, "hex")
    );

    if (!hashCorreto) {
      usuario.mfaTentativas += 1;

      await usuario.save();

      return res.status(401).json({
        erro: "Código de verificação incorreto.",
      });
    }

    // Código correto.
    // Apaga o código para impedir reutilização.
    usuario.mfaCodigoHash = null;
    usuario.mfaCodigoExpiraEm = null;
    usuario.mfaTentativas = 0;

    await usuario.save();

    // SOMENTE AGORA o JWT é criado.
    const token = gerarToken(usuario._id);

    res.json({
      mensagem: "Autenticação realizada com sucesso.",
      token,
      usuario,
    });
  } catch (err) {
    console.error("Erro ao verificar MFA:", err);

    res.status(500).json({
      erro: "Não foi possível verificar o código.",
    });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  res.json(req.usuario);
};
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const infoUsuarioSchema = new mongoose.Schema({
  cpf: { type: String, unique: true, sparse: true },
  genero: { type: String, enum: ["M", "F", "NB"] },
  nascimento: Date,
  telefone: String,
  endereco: String,
});

const perfilFreelancerSchema = new mongoose.Schema({
  descricao: String,
  area_atuacao: String,
  experiencia: String,
});

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    senha: { type: String, required: true, minlength: 6 },
    tipo: {
      type: String,
      enum: ["cliente", "freelancer", "admin"],
      required: true,
      default: "cliente",
    },
    info: infoUsuarioSchema,
    perfil_freelancer: perfilFreelancerSchema,
  },
  { timestamps: { createdAt: "data_criacao", updatedAt: "data_atualizacao" } }
);

// Hash da senha antes de salvar
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  this.senha = await bcrypt.hash(this.senha, 12);
  next();
});

// Método para comparar senha
usuarioSchema.methods.compararSenha = async function (senhaCandidata) {
  return bcrypt.compare(senhaCandidata, this.senha);
};

// Remove a senha do JSON retornado
usuarioSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.senha;
  return obj;
};

module.exports = mongoose.model("Usuario", usuarioSchema);

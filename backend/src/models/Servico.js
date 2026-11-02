const mongoose = require("mongoose");

const servicoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    titulo: { type: String, required: true, trim: true, maxlength: 160 },
    descricao: { type: String, required: true, maxlength: 4000 },
    preco: { type: Number, required: true, min: 0, max: 1000000 },
    categoria: {
      type: String,
      enum: [
        "Web",
        "Design",
        "Marketing",
        "Consultoria",
        "Construção",
        "Reformas",
        "Mobile",
        "Data",
        "Outro",
      ],
      default: "Outro",
    },
    ativo: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "data_criacao", updatedAt: "data_atualizacao" } }
);

servicoSchema.index({ titulo: "text", descricao: "text" });

module.exports = mongoose.model("Servico", servicoSchema);

const mongoose = require("mongoose");

const avaliacaoSchema = new mongoose.Schema(
  {
    pedido: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pedido",
      required: true,
    },
    servico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Servico",
      required: true,
    },
    avaliador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    nota: { type: Number, required: true, min: 0, max: 5 },
    comentario: String,
  },
  { timestamps: { createdAt: "data_criacao" } }
);

// Apenas uma avaliação por pedido+serviço
avaliacaoSchema.index({ pedido: 1, servico: 1 }, { unique: true });

module.exports = mongoose.model("Avaliacao", avaliacaoSchema);

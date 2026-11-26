const mongoose = require("mongoose");

const pagamentoSchema = new mongoose.Schema(
  {
    pedido: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pedido",
      required: true,
    },
    metodo: {
      type: String,
      enum: [
        "cartao_credito",
        "boleto",
        "pix",
        "paypal",
        "credito_plataforma",
        "transferencia",
      ],
      required: true,
    },
    valor: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pendente", "processando", "concluido", "cancelado", "reembolsado"],
      default: "pendente",
    },
  },
  { timestamps: { createdAt: "data", updatedAt: "data_atualizacao" } }
);

module.exports = mongoose.model("Pagamento", pagamentoSchema);

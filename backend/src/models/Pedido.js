const mongoose = require("mongoose");

const itemPedidoSchema = new mongoose.Schema({
  servico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Servico",
    required: true,
  },
  quantidade: { type: Number, default: 1, min: 1 },
  preco_unitario: { type: Number, required: true },
});

const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    itens: { type: [itemPedidoSchema], required: true },
    status: {
      type: String,
      enum: ["pendente", "em_andamento", "concluido", "cancelado"],
      default: "pendente",
    },
    valor_total: { type: Number },
  },
  { timestamps: { createdAt: "data_pedido", updatedAt: "data_atualizacao" } }
);

// Calcula o valor total automaticamente
pedidoSchema.pre("save", function (next) {
  this.valor_total = this.itens.reduce(
    (acc, item) => acc + item.preco_unitario * item.quantidade,
    0
  );
  next();
});

module.exports = mongoose.model("Pedido", pedidoSchema);

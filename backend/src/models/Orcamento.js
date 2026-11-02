const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, immutable: true },
  profissional: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, immutable: true },
  servico: { type: mongoose.Schema.Types.ObjectId, ref: 'Servico', required: true, immutable: true },
  titulo_servico: { type: String, required: true, maxlength: 160, immutable: true },
  descricao: { type: String, required: true, minlength: 10, maxlength: 4000 },
  status: { type: String, enum: ['solicitado', 'respondido', 'aceito', 'recusado'], default: 'solicitado' },
  proposta: {
    valor: { type: Number, min: 0.01, max: 1000000 },
    prazo_dias: { type: Number, min: 1, max: 365 },
    escopo: { type: String, maxlength: 4000 },
  },
}, { timestamps: true });
schema.index({ cliente: 1, createdAt: -1 });
schema.index({ profissional: 1, createdAt: -1 });
module.exports = mongoose.model('Orcamento', schema);

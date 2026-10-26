const mongoose = require("mongoose");

const conectar = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB Atlas conectado: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = conectar;

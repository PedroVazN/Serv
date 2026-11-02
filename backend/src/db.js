const mongoose = require("mongoose");

let pending;
const conectar = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (pending) return pending;
  const uri = process.env.MONGODB_URI;

  try {
    pending = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 10 });
    await pending;
    console.log(`✅ MongoDB Atlas conectado: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('Falha ao conectar ao MongoDB.');
    throw err;
  } finally {
    pending = undefined;
  }
};

module.exports = conectar;

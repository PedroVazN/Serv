const mongoose = require("mongoose");

let pending;
const conectar = async () => {
  if (pending) return pending;
  if (mongoose.connection.readyState === 1) return mongoose;
  const uri = process.env.MONGODB_URI;

  try {
    pending = (async () => {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 10,
        ...(process.env.MONGODB_DB_NAME ? { dbName: process.env.MONGODB_DB_NAME } : {}) });
      await Promise.all([require('./models/Pedido').init(), require('./models/Orcamento').init()]);
      return mongoose;
    })();
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

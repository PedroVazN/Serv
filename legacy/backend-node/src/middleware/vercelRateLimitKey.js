const { isIP } = require('node:net');
const { ipKeyGenerator } = require('express-rate-limit');

// Usar somente no runtime Vercel: este cabeçalho é preenchido pela plataforma.
// Não confiar em Forwarded nem em listas de IPs enviadas pelo cliente.
module.exports = function vercelRateLimitKey(req) {
  const forwarded = req.headers['x-vercel-forwarded-for'];
  const ip = typeof forwarded === 'string' && isIP(forwarded)
    ? forwarded
    : req.socket.remoteAddress;
  return ipKeyGenerator(ip || 'unknown');
};

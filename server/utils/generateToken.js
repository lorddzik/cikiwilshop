// server/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Ambil secret key dari file .env
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('ERROR: JWT_SECRET tidak diatur di file .env');
    process.exit(1); // Hentikan aplikasi jika secret tidak ada
  }

  return jwt.sign({ id }, secret, {
    expiresIn: '30d', // Token akan kedaluwarsa dalam 30 hari
  });
};

module.exports = generateToken;
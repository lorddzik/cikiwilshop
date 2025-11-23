// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const secret = process.env.JWT_SECRET || 'cikiwil_secret_default_123';
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Tidak terotorisasi, pengguna tidak ditemukan' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Tidak terotorisasi, token gagal' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak terotorisasi, tidak ada token' });
  }
};

// --- TAMBAHKAN FUNGSI INI ---
// Ini akan mengecek apakah user yang sudah login (dari 'protect') 
// adalah seorang seller atau admin.
exports.seller = (req, res, next) => {
  // Beberapa model menggunakan `role: 'seller'` pada User, jadi cek role.
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin' || req.user.isAdmin)) {
    return next();
  }
  return res.status(403).json({ message: 'Akses ditolak. Hanya untuk seller.' });
};
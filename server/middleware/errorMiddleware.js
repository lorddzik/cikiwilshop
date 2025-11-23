// server/middleware/errorMiddleware.js

// Middleware untuk menangani rute 404 (Tidak Ditemukan)
const notFound = (req, res, next) => {
  const error = new Error(`Tidak Ditemukan - ${req.originalUrl}`);
  res.status(404);
  next(error); // Meneruskan error ke error handler kustom
};

// Middleware Error Handler Kustom
// Ini akan menangkap semua error yang dilempar dari rute-rute Anda
const errorHandler = (err, req, res, next) => {
  // Kadang-kadang error datang dengan status 200, kita ubah jadi 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Tampilkan stack trace hanya jika kita tidak di mode 'production'
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
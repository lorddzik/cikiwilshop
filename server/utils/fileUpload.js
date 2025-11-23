// server/utils/fileUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Fungsi untuk memastikan direktori ada
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Fungsi helper untuk filter tipe file
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya gambar (jpeg, jpg, png, webp) yang diizinkan!'), false);
  }
};

// --- KATEGORI 1: PENYIMPANAN AVATAR USER ---
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads/avatars';
    ensureDirectoryExists(uploadPath); // Pastikan folder ada
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// --- KATEGORI 2: PENYIMPANAN LOGO TOKO ---
const storeLogoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads/stores';
    ensureDirectoryExists(uploadPath); // Pastikan folder ada
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `store-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// --- KATEGORI 3: PENYIMPANAN GAMBAR PRODUK ---
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads/products';
    ensureDirectoryExists(uploadPath); // Pastikan folder ada
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// --- Ekspor Middleware yang Terpisah ---
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

const uploadStoreLogo = multer({
  storage: storeLogoStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit untuk produk
});

module.exports = {
  uploadAvatar,
  uploadStoreLogo,
  uploadProductImage,
};
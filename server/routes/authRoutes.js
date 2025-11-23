// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,     // <-- PERBAIKAN 1: Nama fungsi yang benar
  updateUserProfile,    // <-- Ditambahkan kembali
  upgradeToSeller,    // <-- Ditambahkan kembali
  uploadAvatar,
  uploadStoreLogo,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Impor middleware upload yang baru
const {
  uploadAvatar: uploadAvatarMiddleware,
  uploadStoreLogo: uploadStoreLogoMiddleware,
} = require('../utils/fileUpload');

router.post('/register', registerUser);
router.post('/login', loginUser);

// --- PERBAIKAN ERROR ANDA ADA DI SINI ---
// Menggunakan rute '/profile' dan fungsi 'getUserProfile' yang benar
router.get('/profile', protect, getUserProfile); 
router.put('/profile', protect, updateUserProfile); // Rute 'PUT' untuk update

router.put('/upgrade-to-seller', protect, upgradeToSeller);

// Rute upload avatar (Sudah benar)
router.post(
  '/upload-avatar',
  protect,
  uploadAvatarMiddleware.single('avatar'),
  uploadAvatar
);

// Rute upload logo toko (Sudah benar)
router.post(
  '/upload-store-logo',
  protect,
  uploadStoreLogoMiddleware.single('storeLogo'),
  uploadStoreLogo
);

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

// Address routes
const { getAddresses, addAddress, removeAddress } = require('../controllers/authController');
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:index', protect, removeAddress);

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;
// cikiwil-shop/server/routes/shopRoutes.js
const express = require('express');
const router = express.Router();
// 1. Impor fungsi baru DAN middleware protect
const { getShopDetails, updateShopDetails, getAllShops } = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

// Rute publik untuk melihat semua toko
router.get('/', getAllShops);

// Rute publik untuk melihat toko spesifik
router.get('/:storeName', getShopDetails);

// 2. Tambahkan rute PUT yang dilindungi di bawah ini
router.put('/settings', protect, updateShopDetails);

module.exports = router;
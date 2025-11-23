// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getSellerOrders,      // --- IMPOR FUNGSI BARU ---
    updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Buat pesanan baru (harus login)
router.post('/', protect, createOrder);

// Ambil daftar pesanan milik saya (harus login)
router.get('/myorders', protect, getUserOrders);

router.get('/seller', protect, getSellerOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
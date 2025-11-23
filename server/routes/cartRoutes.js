// server/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {
    getCart,
    addItemToCart,
    removeItemFromCart,
    clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Semua rute keranjang dilindungi, user harus login
router.use(protect);

router.route('/')
    .get(getCart)       // GET /api/cart
    .post(addItemToCart); // POST /api/cart

router.delete('/clear', clearCart); // DELETE /api/cart/clear
router.delete('/:productId', removeItemFromCart); // DELETE /api/cart/:productId

module.exports = router;
// server/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Semua rute message memerlukan login
router.use(protect);

// Dapatkan daftar percakapan user
router.get('/conversations', getConversations);

// Dapatkan pesan antara user dan orang lain untuk produk tertentu
router.get('/:senderId/:productId', getMessages);

// Kirim pesan baru
router.post('/', sendMessage);

module.exports = router;

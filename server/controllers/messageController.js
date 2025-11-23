// server/controllers/messageController.js
const Message = require('../models/Message');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get all conversations for logged in user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Dapatkan semua message unik berdasarkan pasangan sender-receiver-product
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            // Kelompok berdasarkan pair (untuk menghindari duplikat)
            participants: {
              $cond: [
                { $lt: ['$sender', '$receiver'] },
                ['$sender', '$receiver'],
                ['$receiver', '$sender'],
              ],
            },
            product: '$product',
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $limit: 50,
      },
    ]);

    // Populate data lengkap (sender, receiver, product)
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const fullMessage = await Message.findById(conv.lastMessage._id)
          .populate('sender', 'name avatarUrl email role storeDetails.storeName storeDetails.storeAvatarUrl')
          .populate('receiver', 'name avatarUrl email role storeDetails.storeName storeDetails.storeAvatarUrl')
          .populate('product', 'name imageUrls');
        return fullMessage;
      })
    );

    res.json(populatedConversations);
  } catch (error) {
    console.error('Get Conversations Error:', error);
    res.status(500).json({ message: 'Gagal mengambil percakapan' });
  }
};

// @desc    Get messages dalam satu conversation (sender-receiver-product)
// @route   GET /api/messages/:senderId/:productId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { senderId, productId } = req.params;
    const userId = req.user._id;

    // Ambil messages antara user ini dan sender (bisa dari mana saja) untuk produk tertentu
    const messages = await Message.find({
      product: productId,
      $or: [
        { sender: userId, receiver: senderId },
        { sender: senderId, receiver: userId },
      ],
    })
      .populate('sender', 'name avatarUrl email role storeDetails.storeName storeDetails.storeAvatarUrl')
      .populate('receiver', 'name avatarUrl email role storeDetails.storeName storeDetails.storeAvatarUrl')
      .populate('product', 'name imageUrls')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ message: 'Gagal mengambil pesan' });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, productId, text } = req.body;

    if (!receiverId || !productId || !text) {
      return res.status(400).json({ message: 'receiverId, productId, text dibutuhkan' });
    }

    const sender = req.user._id;

    // Validasi receiver ada
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Penerima tidak ditemukan' });
    }

    // Validasi produk ada
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    const message = new Message({
      sender,
      receiver: receiverId,
      product: productId,
      text,
    });

    const saved = await message.save();
    const populated = await Message.findById(saved._id)
      .populate('sender', 'name avatarUrl email role storeDetails.storeName storeDetails.storeAvatarUrl')
      .populate('receiver', 'name avatarUrl email role storeDetails.storeName storeDetails.storeAvatarUrl')
      .populate('product', 'name imageUrls');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ message: 'Gagal mengirim pesan' });
  }
};

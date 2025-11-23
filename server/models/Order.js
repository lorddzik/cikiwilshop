// server/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { // Siapa yang membeli
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: { // Siapa penjualnya
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{ // Daftar barang yang dibeli
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem',
  }],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  // Payment method and discount breakdown
  paymentMethod: {
    type: String,
    required: true,
    enum: ['QRIS', 'COD'], // Hanya izinkan 2 nilai ini
    default: 'QRIS'       // Ganti default
  },
  discounts: {
    sellerDiscountPercent: { type: Number, default: 0 },
    sellerDiscountAmount: { type: Number, default: 0 },
    platformPromoCode: { type: String, default: '' },
    platformDiscountAmount: { type: Number, default: 0 },
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  // --- INI BAGIAN PENTING UNTUK PELACAKAN ---
  status: {
    type: String,
    required: true,
    enum: [
      'Pending',        // Menunggu Konfirmasi Penjual
      'Processing',     // Pesanan Diproses
      'Shipped',        // Pesanan Dikirim
      'Delivered',      // Tiba di Tujuan
      'Cancelled'       // Dibatalkan
    ],
    default: 'Pending',
  },
  statusHistory: [ // Untuk melacak riwayat perubahan status
    {
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      notes: { type: String } // Misal: "No. Resi: JNE123456"
    }
  ]
}, { timestamps: true });

// Saat order baru dibuat, tambahkan status 'Pending' ke history
orderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({ status: this.status, notes: 'Pesanan dibuat' });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
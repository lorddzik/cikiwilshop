// server/models/OrderItem.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Harga satuan saat checkout
  imageUrl: { type: String, required: true },
  variantName: { type: String },
  color: { type: String },
  product: { // Referensi ke produk aslinya
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
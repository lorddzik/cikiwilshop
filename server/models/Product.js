// server/models/Product.js
const mongoose = require("mongoose");

// Skema untuk varian produk
const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Core i5, 16GB RAM'
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' }, // <- TAMBAHAN PENTING
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // Harga dasar
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 }, // Stok total/dasar
  rating: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }, // Jumlah ulasan

  // --- FIELD BARU YANG PENTING ---
  imageUrls: [{ type: String }], // Gambar utama produk
  variants: [variantSchema], // Menyimpan varian produk (sekarang dengan foto)
  // colors: [{ type: String }], // <- HAPUS FIELD INI

  // Reviews array
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      mediaUrls: [{ type: String }], // Foto/video review
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // Menghubungkan produk dengan penjualnya
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
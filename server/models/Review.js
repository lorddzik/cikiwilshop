// server/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  mediaUrls: [{ type: String }], // Array untuk menyimpan URLs foto/video review
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
// cikiwil-shop/server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const cartItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  variantName: { type: String }, // Opsional, jika produk punya varian
  price: { type: Number, required: true }, // Harga satuan saat ditambahkan
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
});

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    avatarUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    isOfficial: { type: Boolean, default: false },
    storeDetails: {
      storeName: String,
      storeDescription: String,
      storeAddress: String,
      phoneNumber: String,
      storeAvatarUrl: { type: String, default: '' }, // Avatar toko (TERPISAH dari avatar user)
      // Voucher / kode diskon yang dibuat oleh penjual
      vouchers: [
        {
          code: { type: String },
          // type: 'percent' or 'fixed'
          type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
          // value: if percent -> percent number (e.g. 10), if fixed -> amount in IDR (e.g. 50000)
          value: { type: Number, default: 0 },
          expiresAt: { type: Date },
          active: { type: Boolean, default: true },
          usageLimit: { type: Number, default: 0 }, // 0 = unlimited
          usedCount: { type: Number, default: 0 },
        }
      ]
    },
    // Alamat tersimpan untuk checkout
    addresses: [
      {
        label: { type: String, default: 'Home' },
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
      }
    ],
    // Wishlist: daftar produk yang disukai user
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    ],
    cart: [cartItemSchema],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  // Generate token random
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token dan set ke field resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (misal 10 menit)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken; // Return token asli (yang belum di-hash) untuk dikirim ke email
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
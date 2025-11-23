// cikiwil-shop/server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken'); // Pastikan ini ada
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// Fungsi generateToken (bisa juga di-import dari utils)
// const generateToken = (id) => {
//   const secret = process.env.JWT_SECRET || 'cikiwil_secret_default_123';
//   return jwt.sign({ id }, secret, { expiresIn: '30d' });
// };

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'buyer',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        location: user.location,
        storeDetails: user.storeDetails,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Data pengguna tidak valid' });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        location: user.location,
        storeDetails: user.storeDetails,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.upgradeToSeller = async (req, res) => {
  try {
    const { storeName, storeAddress, phoneNumber } = req.body;
    if (!storeName || !storeAddress || !phoneNumber) {
      return res.status(400).json({ message: 'Harap isi semua data toko' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      if (user.role === 'seller') {
        return res.status(400).json({ message: 'Anda sudah menjadi penjual.' });
      }

      user.role = 'seller';
      user.storeDetails = {
        storeName,
        storeDescription: '',
        storeAddress,
        phoneNumber,
        storeAvatarUrl: '' // Avatar toko kosong saat pertama mendaftar
      };

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        location: updatedUser.location,
        storeDetails: updatedUser.storeDetails,
        token: generateToken(updatedUser._id.toString()),
      });
    } else {
      res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
  } catch (error) {
    console.error('Upgrade Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user); // Kirim semua data user
    } else {
      res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const { name, location, storeDetails } = req.body;

      // Update data profil pengguna
      user.name = name || user.name;
      user.location = location || user.location;

      // Jika user adalah seller DAN mengirim data storeDetails, update
      if (user.role === 'seller' && storeDetails) {
        user.storeDetails.storeName = storeDetails.storeName || user.storeDetails.storeName;
        user.storeDetails.storeAddress = storeDetails.storeAddress || user.storeDetails.storeAddress;
        user.storeDetails.phoneNumber = storeDetails.phoneNumber || user.storeDetails.phoneNumber;
      }

      const updatedUser = await user.save();

      // Kirim kembali data user yang sudah terupdate
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        location: updatedUser.location,
        storeDetails: updatedUser.storeDetails,
        token: generateToken(updatedUser._id.toString()), // Kirim token juga
      });
    } else {
      res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Gagal update profil', error: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diunggah' });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      // Simpan path relatif ke database
      user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        location: updatedUser.location,
        storeDetails: updatedUser.storeDetails,
        token: generateToken(updatedUser._id.toString()),
        message: 'Avatar berhasil diunggah',
      });
    } else {
      res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Gagal update avatar', error: error.message });
  }
};

exports.uploadStoreLogo = async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Hanya penjual yang bisa upload logo toko' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diunggah' });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      // PENTING: Update HANYA storeAvatarUrl, bukan avatarUrl!
      user.storeDetails.storeAvatarUrl = `/uploads/stores/${req.file.filename}`;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        location: updatedUser.location,
        storeDetails: updatedUser.storeDetails,
        token: generateToken(updatedUser._id.toString()),
        message: 'Logo toko berhasil diunggah',
      });
    } else {
      res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Gagal update logo toko', error: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    res.json(user.wishlist || []);
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    res.status(500).json({ message: 'Gagal mengambil wishlist' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId dibutuhkan' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });

    // Cegah duplikat
    if (!user.wishlist) user.wishlist = [];
    if (user.wishlist.find(id => id.toString() === productId)) {
      return res.status(400).json({ message: 'Produk sudah ada di wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();
    const populated = await User.findById(req.user._id).populate('wishlist');
    res.status(201).json(populated.wishlist);
  } catch (error) {
    console.error('Add Wishlist Error:', error);
    res.status(500).json({ message: 'Gagal menambahkan wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });

    user.wishlist = (user.wishlist || []).filter(id => id.toString() !== productId);
    await user.save();
    const populated = await User.findById(req.user._id).populate('wishlist');
    res.json(populated.wishlist || []);
  } catch (error) {
    console.error('Remove Wishlist Error:', error);
    res.status(500).json({ message: 'Gagal menghapus wishlist' });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    res.json(user.addresses || []);
  } catch (error) {
    console.error('Get Addresses Error:', error);
    res.status(500).json({ message: 'Gagal mengambil alamat' });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { label, address, city, postalCode } = req.body;
    if (!address || !city || !postalCode) return res.status(400).json({ message: 'Alamat, kota, dan kode pos dibutuhkan' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });

    user.addresses = user.addresses || [];
    user.addresses.push({ label: label || 'Home', address, city, postalCode });
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    console.error('Add Address Error:', error);
    res.status(500).json({ message: 'Gagal menambahkan alamat' });
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const idx = Number(req.params.index);
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    if (isNaN(idx) || idx < 0 || idx >= (user.addresses || []).length) return res.status(400).json({ message: 'Index alamat tidak valid' });
    user.addresses.splice(idx, 1);
    await user.save();
    res.json(user.addresses || []);
  } catch (error) {
    console.error('Remove Address Error:', error);
    res.status(500).json({ message: 'Gagal menghapus alamat' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email tidak ditemukan' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false }); // Simpan token ke DB

    // Buat URL Reset (Arahkan ke Frontend React)
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const message = `
      <h1>Anda meminta reset password</h1>
      <p>Silakan klik link berikut untuk mereset password Anda:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>Link ini akan kadaluarsa dalam 10 menit.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Reset Password Token - CikiWil Shop',
        message,
      });

      res.status(200).json({ success: true, data: 'Email terkirim' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email gagal dikirim' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Pastikan belum expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
    }

    // Set password baru
    user.password = req.body.password;
    // Reset field token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); // Middleware pre-save akan meng-hash password baru

    res.status(200).json({
      success: true,
      message: 'Password berhasil diperbarui. Silakan login.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
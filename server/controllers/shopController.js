// cikiwil-shop/server/controllers/shopController.js
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get public shop details and products by storeName
// @route   GET /api/shop/:storeName
exports.getShopDetails = async (req, res) => {
  try {
    const storeName = req.params.storeName;

    // 1. Cari penjual (User) berdasarkan nama tokonya
    const seller = await User.findOne({ 'storeDetails.storeName': storeName });

    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Toko tidak ditemukan' });
    }

    // 2. Cari semua produk yang dijual oleh penjual ini (berdasarkan _id penjual)
    const products = await Product.find({ seller: seller._id });

    // 3. Kembalikan data publik toko dan produk-produknya
    res.json({
      shop: {
        _id: seller._id,
        storeName: seller.storeDetails.storeName,
        storeDescription: seller.storeDetails.storeDescription,
        storeAddress: seller.storeDetails.storeAddress,
        isOfficial: seller.isOfficial,
        avatarUrl: seller.avatarUrl,
        storeAvatarUrl: seller.storeDetails.storeAvatarUrl,
        memberSince: seller.createdAt,
      },
      products: products,
    });

  } catch (error) {
    console.error('Get Shop Details Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// @desc    Update seller's shop details
// @route   PUT /api/shop/settings
exports.updateShopDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    if (user.role !== 'seller' || !user.storeDetails) {
      return res.status(403).json({ message: 'Anda bukan penjual' });
    }

    const { storeName, storeDescription, storeAddress, storeAvatarUrl } = req.body;

    // Update field storeDetails
    user.storeDetails.storeName = storeName || user.storeDetails.storeName;
    user.storeDetails.storeDescription = storeDescription || user.storeDetails.storeDescription;
    user.storeDetails.storeAddress = storeAddress || user.storeDetails.storeAddress;

    // Perbarui avatar toko SAJA, jangan ubah avatar user
    if (storeAvatarUrl) {
      user.storeDetails.storeAvatarUrl = storeAvatarUrl;
    }

    const updatedUser = await user.save();

    // Kirim kembali data user yang sudah di-update
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatarUrl: updatedUser.avatarUrl,
      storeDetails: updatedUser.storeDetails,
    });

  } catch (error) {
    console.error('Error updating store details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all shops (sellers)
// @route   GET /api/shop
exports.getAllShops = async (req, res) => {
  try {
    // Cari semua user dengan role 'seller' dan memiliki storeDetails
    const sellers = await User.find({ role: 'seller', storeDetails: { $exists: true } })
      .select('_id name avatarUrl storeDetails')
      .lean();

    // Format data untuk frontend
    const shops = sellers.map(seller => ({
      _id: seller._id,
      name: seller.name,
      avatarUrl: seller.avatarUrl,
      storeName: seller.storeDetails?.storeName || seller.name,
      storeAvatarUrl: seller.storeDetails?.storeAvatarUrl,
      storeAddress: seller.storeDetails?.storeAddress,
    }));

    res.json(shops);
  } catch (error) {
    console.error('Error fetching all shops:', error);
    res.status(500).json({ message: 'Gagal mengambil data toko' });
  }
};
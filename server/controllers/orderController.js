// server/controllers/orderController.js
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Buat pesanan baru
// @route   POST /api/orders
// @access  Private (terlindungi 'protect')
exports.createOrder = async (req, res) => {
  try {
    const { cartItems, shippingAddress, paymentMethod, discounts } = req.body;
    const buyerId = req.user._id;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Keranjang belanja kosong' });
    }

    // Asumsikan semua item dari 1 seller
    const firstItemProduct = await Product.findById(cartItems[0].product);
    if (!firstItemProduct) {
       return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    const sellerId = firstItemProduct.seller;

    // 1. Buat dulu semua OrderItem
    const orderItemIds = await Promise.all(cartItems.map(async (item) => {
      const newOrderItem = new OrderItem({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl,
        variantName: item.variantName,
        color: item.color,
        product: item.product,
      });
      const savedItem = await newOrderItem.save();
      return savedItem._id;
    }));

    // 2. Hitung total harga
    const rawTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // 3. Terapkan voucher/diskon penjual jika dikirim sebagai kode
    const sellerVoucherCode = discounts && discounts.sellerVoucherCode ? (discounts.sellerVoucherCode || '') : '';
    let sellerDiscountAmount = 0;
    let sellerVoucherInfo = null;
    if (sellerVoucherCode) {
      // Ambil data penjual untuk mengecek voucher
      const sellerUser = await User.findById(sellerId);
      if (!sellerUser) {
        return res.status(404).json({ message: 'Penjual tidak ditemukan untuk validasi voucher' });
      }

      const vouchers = (sellerUser.storeDetails && sellerUser.storeDetails.vouchers) || [];
      const codeUpper = sellerVoucherCode.toString().trim().toUpperCase();
      const foundIndex = vouchers.findIndex(v => (v.code || '').toString().trim().toUpperCase() === codeUpper && v.active);
      if (foundIndex === -1) {
        return res.status(400).json({ message: 'Kode voucher penjual tidak valid atau tidak aktif' });
      }

      const voucher = vouchers[foundIndex];
      // cek expired
      if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
        return res.status(400).json({ message: 'Kode voucher penjual sudah kedaluwarsa' });
      }
      // cek usage limit
      if (voucher.usageLimit && voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
        return res.status(400).json({ message: 'Kode voucher penjual sudah mencapai batas penggunaan' });
      }

      // hitung diskon berdasarkan tipe
      if (voucher.type === 'percent') {
        sellerDiscountAmount = Math.max(0, Math.round((rawTotal * Number(voucher.value || 0)) / 100));
      } else if (voucher.type === 'fixed') {
        sellerDiscountAmount = Math.min(Number(voucher.value || 0), rawTotal);
      }

      sellerVoucherInfo = {
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
      };

      // tingkatkan usedCount dan simpan kembali penjual
      try {
        const path = `storeDetails.vouchers.${foundIndex}.usedCount`;
        sellerUser.set(path, (voucher.usedCount || 0) + 1);
        await sellerUser.save();
      } catch (err) {
        console.warn('Gagal update usedCount voucher:', err.message);
      }
    }

    // 4. Terapkan promo platform (validasi minimal di server)
    const platformCode = discounts && discounts.platformPromo ? (discounts.platformPromo || '') : '';
    let platformDiscountAmount = 0;
    const remainingAfterSeller = Math.max(0, rawTotal - sellerDiscountAmount);
    const code = (platformCode || '').toString().trim().toUpperCase();
    if (code === 'CIKI10') {
      platformDiscountAmount = Math.round(remainingAfterSeller * 0.1);
    } else if (code === 'CIKI50K') {
      platformDiscountAmount = 50000;
    } else {
      platformDiscountAmount = 0;
    }

    const finalTotal = Math.max(0, rawTotal - sellerDiscountAmount - platformDiscountAmount);

    // 5. Buat Order utama dengan breakdown diskon
    const order = new Order({
      buyer: buyerId,
      seller: sellerId,
      items: orderItemIds,
      totalPrice: finalTotal,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod || 'bank_transfer',
      discounts: {
        sellerVoucherCode: sellerVoucherInfo ? sellerVoucherInfo.code : null,
        sellerVoucherType: sellerVoucherInfo ? sellerVoucherInfo.type : null,
        sellerVoucherValue: sellerVoucherInfo ? sellerVoucherInfo.value : null,
        sellerDiscountAmount,
        platformPromoCode: code,
        platformDiscountAmount,
      },
      status: 'Pending',
    });

    const createdOrder = await order.save();
    if (req.user._id) {
        await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });
    }

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Gagal membuat pesanan', error: error.message });
  }
};

// @desc    Dapatkan daftar pesanan milik user yang login (PEMBELI)
// @route   GET /api/orders/myorders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('seller', 'storeDetails.storeName')
      .populate('items')
      .sort({ createdAt: -1 }); 

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar pesanan' });
  }
};


// --- FUNGSI BARU UNTUK PENJUAL ---

// @desc    Dapatkan pesanan yang masuk untuk PENJUAL yang login
// @route   GET /api/orders/seller
// @access  Private
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate('buyer', 'name email') // Ambil nama & email pembeli
      .populate('items') // Ambil detail item-itemnya
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil pesanan penjual' });
  }
};

// @desc    Update status pesanan (oleh PENJUAL)
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body; // status baru, misal: "Processing"
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Keamanan: Pastikan hanya penjual dari pesanan ini yang bisa update
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Tidak terotorisasi' });
    }
    
    // Update status utama
    order.status = status;
    
    // Tambahkan catatan ke riwayat status
    order.statusHistory.push({
      status: status,
      notes: notes || `Status diubah oleh penjual`
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);

  } catch (error) {
    res.status(500).json({ message: 'Gagal update status pesanan' });
  }
};
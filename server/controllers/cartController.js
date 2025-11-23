// server/controllers/cartController.js
const User = require('../models/User');
const Product = require('../models/Product');

// Helper untuk mengambil keranjang yang di-populate
const getPopulatedCart = async (userId) => {
    return await User.findById(userId)
        .select('cart')
        .populate('cart.product', 'name description');
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
    try {
        const user = await getPopulatedCart(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        res.json(user.cart || []);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Add/Update item in cart
// @route   POST /api/cart
// @access  Private
exports.addItemToCart = async (req, res) => {
    const { productId, quantity, variantName, price, imageUrl, name, mode } = req.body;

    if (!productId || !quantity || !price || !name || !imageUrl) {
        return res.status(400).json({ message: 'Data item tidak lengkap' });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        const reqProductId = productId.toString();
        
        // --- PERBAIKAN UTAMA DI SINI ---
        // Jika variantName kosong/null, kita paksa jadi 'Default' agar cocok dengan data di DB
        const normalizeVariant = (v) => (!v || String(v).trim() === '') ? 'Default' : String(v).trim();
        
        const reqVariant = normalizeVariant(variantName);

        const existingItemIndex = user.cart.findIndex((item) => {
            const dbProductId = item.product.toString();
            const dbVariant = normalizeVariant(item.variantName); // Normalisasi juga yang dari DB

            return dbProductId === reqProductId && dbVariant === reqVariant;
        });

        if (existingItemIndex > -1) {
            // === ITEM SUDAH ADA: UPDATE KUANTITAS ===
            if (mode === 'update') {
                user.cart[existingItemIndex].quantity = Number(quantity);
            } else {
                user.cart[existingItemIndex].quantity += Number(quantity);
            }
        } else {
            // === ITEM BELUM ADA: TAMBAHKAN BARU ===
            user.cart.push({
                product: productId,
                quantity: Number(quantity),
                price,
                name,
                imageUrl,
                variantName: reqVariant // Simpan sebagai 'Default' jika kosong
            });
        }

        await user.save();
        const populatedCart = await getPopulatedCart(req.user._id);
        res.status(201).json(populatedCart.cart);

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeItemFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        // Hapus item berdasarkan ID Produk
        user.cart = user.cart.filter(
            (item) => item.product.toString() !== req.params.productId
        );

        await user.save();
        const populatedCart = await getPopulatedCart(req.user._id);
        res.json(populatedCart.cart);

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        user.cart = [];
        await user.save();
        res.json(user.cart);

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};
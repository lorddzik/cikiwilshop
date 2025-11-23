// cikiwil-shop/server/controllers/productController.js
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // Populate seller info so client can read seller.storeDetails without extra queries
    const products = await Product.find({}).populate('seller', 'name avatarUrl location isOfficial storeDetails');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    // Populate seller details so client has access to storeDetails and avatar
    const product = await Product.findById(req.params.id).populate('seller', 'name avatarUrl location isOfficial storeDetails');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, brand, category, stock, imageUrls, variants } = req.body;
    const product = new Product({
      name,
      price,
      seller: req.user._id,
      imageUrls: imageUrls && imageUrls.length > 0 ? imageUrls : ['/uploads/sample.jpg'],
      brand,
      category,
      stock: stock || 0,
      description,
      variants: Array.isArray(variants) ? variants : [],
      numReviews: 0,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, brand, category, stock, imageUrls, variants } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.seller.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Tidak diizinkan' });
      }
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.imageUrls = imageUrls && imageUrls.length > 0 ? imageUrls : product.imageUrls;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.stock = typeof stock !== 'undefined' ? stock : product.stock;
      product.variants = Array.isArray(variants) ? variants : product.variants;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      if (product.seller.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Tidak diizinkan' });
      }
      // Ganti product.remove() yang sudah deprecated
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Produk dihapus' });
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Upload product image (controller)
// @route   POST /api/products/upload
// @access  Private/Seller
exports.uploadProductImage = (req, res) => {
  if (req.file) {
    // Kirim path yang benar sesuai dengan fileUpload.js
    res.json({ imagePath: `/uploads/products/${req.file.filename}` });
  } else {
    res.status(400).json({ message: 'Tidak ada file yang diunggah' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // (Logika cek pembelian - DIPERBAIKI)
    const orders = await Order.find({ buyer: req.user._id }).populate('items');
    const hasPurchased = orders.some(order =>
      order.items.some(item => item.product.toString() === product._id.toString())
    );

    if (!hasPurchased) {
      return res.status(400).json({ message: 'Anda harus membeli produk ini untuk memberi ulasan' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Produk sudah diulas' });
    }

    // Kumpulkan media URLs dari uploaded files
    const mediaUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        mediaUrls.push(`/uploads/reviews/${file.filename}`);
      });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      mediaUrls: mediaUrls, // Simpan media URLs
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Ulasan ditambahkan' });

  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
exports.getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3).populate('seller', 'name avatarUrl location isOfficial storeDetails');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user's seller products
// @route   GET /api/products/seller
// @access  Private/Seller
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).populate('seller', 'name avatarUrl location isOfficial storeDetails');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all unique categories from products
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    // Filter out empty categories dan sort
    const filteredCategories = categories
      .filter(cat => cat && cat.trim() !== '')
      .sort();
    res.json(filteredCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryName
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    // Cari kategori dengan case-insensitive matching
    const allCategories = await Product.distinct('category');
    const matchedCategory = allCategories.find(cat =>
      cat.toLowerCase().replace(/\s+/g, '-') === categoryName.toLowerCase()
    );

    if (!matchedCategory) {
      return res.status(404).json({
        message: 'Kategori tidak ditemukan',
        category: categoryName,
        products: [],
        count: 0
      });
    }

    const products = await Product.find({
      category: matchedCategory
    }).populate('seller', 'name avatarUrl location isOfficial storeDetails');

    res.json({
      category: matchedCategory,
      products: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
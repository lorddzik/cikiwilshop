// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  createProductReview,
  getTopProducts,
  getSellerProducts,
  getCategories,
  getProductsByCategory,
} = require('../controllers/productController');
const { protect, seller } = require('../middleware/authMiddleware');

// --- Impor middleware upload yang baru ---
const {
  uploadProductImage: uploadProductImageMiddleware,
} = require('../utils/fileUpload');

const { uploadReviewMedia } = require('../utils/reviewUpload');

// IMPORTANT: Specific routes before generic ones (/:id) to avoid conflicts
router.get('/categories', getCategories);
router.get('/category/:categoryName', getProductsByCategory);
router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/seller').get(protect, seller, getSellerProducts);
router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, seller, updateProduct)
  .delete(protect, seller, deleteProduct);

// Review route with media upload support (up to 7 files: 5 photos + 2 videos)
router.route('/:id/reviews').post(protect, uploadReviewMedia.array('media', 7), createProductReview);

// --- Gunakan middleware yang sesuai ---
router.post(
  '/upload',
  protect,
  seller,
  uploadProductImageMiddleware.single('image'),
  uploadProductImage
);

module.exports = router;
const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getTopProducts,
  getFeaturedProducts,
  getRelatedProducts,
  getCategories,
  getBrands,
  syncProducts,
  advancedSearch
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/search', advancedSearch);
router.post('/sync', syncProducts);
router.get('/top', getTopProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories/all', getCategories);
router.get('/brands/all', getBrands);
router.get('/:id/related', getRelatedProducts);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;

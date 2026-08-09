const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItem, clearCart, checkoutCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.post('/checkout', checkoutCart);
router.delete('/clear', clearCart);
router.delete('/:productId', removeFromCart);
router.put('/:productId', updateCartItem);

module.exports = router;

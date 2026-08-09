const express = require('express');
const router = express.Router();
const { 
  addOrder, 
  getOrderById,
  getMyOrders, 
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  createPaymentIntent,
  cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrder).get(protect, admin, getAllOrders);
router.get('/myorders', protect, getMyOrders);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;

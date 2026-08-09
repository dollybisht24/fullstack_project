const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { sendOrderConfirmationEmail, sendAdminOrderNotification } = require('../services/emailService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
  
  console.log('🛒 Creating new order for user:', req.user._id);
  console.log('📦 Order items:', orderItems.length);
  console.log('💰 Total price:', totalPrice);
  console.log('📍 Shipping to:', shippingAddress.city);
  
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Create order
  const order = new Order({ 
    user: req.user._id, 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice 
  });
  
  // Save order to MongoDB
  const createdOrder = await order.save();
  
  console.log('✅ ORDER SUCCESSFULLY SAVED TO MONGODB!');
  console.log('📋 Order ID:', createdOrder._id);
  console.log('👤 User:', req.user.email);
  console.log('🏷️ Order Number:', createdOrder._id.toString().slice(-8).toUpperCase());
  console.log('💵 Total Amount: ₹', createdOrder.totalPrice);
  console.log('📅 Created At:', createdOrder.createdAt);
  console.log('🔍 You can now view this order in MongoDB Compass!');

  // Send email to customer
  try {
    const customerEmail = req.user.email;
    const emailResult = await sendOrderConfirmationEmail(createdOrder, customerEmail);
    
    if (emailResult.success) {
      console.log('✅ Order confirmation email sent to:', customerEmail);
    } else {
      console.log('⚠️ Failed to send customer email:', emailResult.error);
    }

    // Send notification to admin
    const adminEmailResult = await sendAdminOrderNotification(createdOrder, customerEmail);
    
    if (adminEmailResult.success) {
      console.log('✅ Admin notification email sent');
    } else {
      console.log('⚠️ Failed to send admin email:', adminEmailResult.error);
    }
  } catch (emailError) {
    console.error('Email sending error:', emailError);
    // Don't fail the order if email fails
  }

  // Clear cart after order
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
  } catch (cartError) {
    console.log('Cart deletion error:', cartError);
  }

  res.status(201).json(createdOrder);
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if (order) {
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
      res.json(order);
    } else {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Get orders for user
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  console.log('📋 Fetching orders for user:', req.user._id);
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  console.log(`✅ Found ${orders.length} orders for user`);
  res.json(orders);
});

// @desc Get all orders (admin)
// @route GET /api/orders
// @access Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  console.log('📋 Fetching all orders (admin request)');
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  console.log(`✅ Found ${orders.length} total orders`);
  res.json(orders);
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    order.orderStatus = 'processing';
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Update order to delivered (admin)
// @route PUT /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = 'delivered';
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Update order status (admin)
// @route PUT /api/orders/:id/status
// @access Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    order.orderStatus = req.body.status || order.orderStatus;
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Create Stripe payment intent
// @route POST /api/orders/create-payment-intent
// @access Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(500);
    throw new Error('Stripe not configured');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'inr',
    metadata: { userId: req.user._id.toString() },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

// @desc Cancel order
// @route PUT /api/orders/:id/cancel
// @access Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to cancel this order');
    }
    
    if (order.isDelivered) {
      res.status(400);
      throw new Error('Cannot cancel delivered order');
    }
    
    order.orderStatus = 'cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = { 
  addOrder, 
  getOrderById,
  getMyOrders, 
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  createPaymentIntent,
  cancelOrder
};

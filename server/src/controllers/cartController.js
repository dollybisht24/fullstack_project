const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc Get cart for user
// @route GET /api/cart
// @access Private
const getCart = asyncHandler(async (req, res) => {
  console.log('🛒 Fetching cart for user:', req.user._id);
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) {
    console.log('⚠️ No cart found, returning empty cart');
    cart = { items: [] };
  } else {
    console.log(`✅ Found cart with ${cart.items.length} items`);
  }
  res.json(cart);
});

// @desc Add item to cart
// @route POST /api/cart
// @access Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  console.log('➕ Adding to cart - User:', req.user._id, 'Product:', productId, 'Qty:', qty);
  
  const product = await Product.findById(productId);
  if (!product) {
    console.log('❌ Product not found:', productId);
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    console.log('Creating new cart for user');
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].qty = cart.items[itemIndex].qty + qty;
    console.log('Updated existing item quantity to:', cart.items[itemIndex].qty);
  } else {
    cart.items.push({ product: productId, qty, price: product.price });
    console.log('Added new item to cart');
  }

  await cart.save();
  console.log('✅ Cart saved successfully');
  res.status(201).json(cart);
});

// @desc Remove item from cart
// @route DELETE /api/cart/:productId
// @access Private
const removeFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  res.json(cart);
});

// @desc Update cart item quantity
// @route PUT /api/cart/:productId
// @access Private
const updateCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { qty } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].qty = qty;
    await cart.save();
  }
  res.json(cart);
});

// @desc Clear cart after order
// @route DELETE /api/cart/clear
// @access Private
const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: 'Cart cleared', items: [] });
});

// @desc Convert cart to order items
// @route POST /api/cart/checkout
// @access Private
const checkoutCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Convert cart items to order items format
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images[0],
    price: item.price,
    qty: item.qty
  }));

  res.json({ orderItems });
});

module.exports = { getCart, addToCart, removeFromCart, updateCartItem, clearCart, checkoutCart };

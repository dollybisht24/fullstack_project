const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

// @desc Get wishlist
// @route GET /api/wishlist
// @access Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
  if (!wishlist) wishlist = { products: [] };
  res.json(wishlist);
});

// @desc Add to wishlist
// @route POST /api/wishlist
// @access Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }
  res.json(wishlist);
});

// @desc Remove from wishlist
// @route DELETE /api/wishlist/:productId
// @access Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }
  wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
  await wishlist.save();
  res.json(wishlist);
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };

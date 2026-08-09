const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc Add review
// @route POST /api/reviews/:productId
// @access Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment, images = [] } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed by user');
  }

  const review = { 
    name: req.user.name, 
    rating: Number(rating), 
    comment, 
    images: Array.isArray(images)
      ? images.filter((image) => typeof image === 'string' && image.trim()).slice(0, 4)
      : [],
    user: req.user._id 
  };
  
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added', review });
});

// @desc Get reviews for product
// @route GET /api/reviews/:productId
// @access Public
const getReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate('reviews.user', 'name');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product.reviews || []);
});

// @desc Update review
// @route PUT /api/reviews/:productId/:reviewId
// @access Private
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment, images } = req.body;
  const product = await Product.findById(req.params.productId);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const review = product.reviews.id(req.params.reviewId);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  if (Array.isArray(images)) {
    review.images = images.filter((image) => typeof image === 'string' && image.trim()).slice(0, 4);
  }
  
  // Recalculate rating
  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
  await product.save();
  
  res.json({ message: 'Review updated', review });
});

// @desc Delete review
// @route DELETE /api/reviews/:productId/:reviewId
// @access Private
const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const review = product.reviews.id(req.params.reviewId);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }

  review.deleteOne();
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length 
    : 0;
  
  await product.save();
  
  res.json({ message: 'Review deleted' });
});

module.exports = { addReview, getReviews, updateReview, deleteReview };

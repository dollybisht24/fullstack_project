const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { getProducts: getProductsFromService, searchProducts, syncProductsFromAPI } = require('../services/makeupApiService');

// Fallback sample data for demo deployment
const sampleProducts = require('../data/sampleProducts');

// @desc Fetch all products (with filters, sorting, pagination)
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const brand = req.query.brand ? { brand: req.query.brand } : {};
    
    // Price filter
    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter.price = {};
      if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    const ratingFilter = req.query.rating 
      ? { rating: { $gte: Number(req.query.rating) } } 
      : {};

    // Sorting
    let sortOption = {};
    switch(req.query.sortBy) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const count = await Product.countDocuments({ 
      ...keyword, 
      ...category, 
      ...brand, 
      ...priceFilter,
      ...ratingFilter 
    });

    const products = await Product.find({ 
      ...keyword, 
      ...category, 
      ...brand, 
      ...priceFilter,
      ...ratingFilter 
    })
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ 
      products, 
      page, 
      pages: Math.ceil(count / pageSize), 
      total: count 
    });
  } catch (error) {
    // Fallback to sample data if database fails
    console.log('Database error, using sample data:', error.message);
    res.json({ 
      products: sampleProducts, 
      page: 1, 
      pages: 1, 
      total: sampleProducts.length 
    });
  }
});

// @desc Get single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
  if (product) res.json(product);
  else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Create product (admin)
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name || 'Sample Product',
    price: req.body.price || 0,
    brand: req.body.brand || '',
    category: req.body.category || '',
    description: req.body.description || '',
    images: req.body.images || [],
    countInStock: req.body.countInStock || 0,
  });
  const created = await product.save();
  res.status(201).json(created);
});

// @desc Update product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.images = req.body.images || product.images;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.countInStock = req.body.countInStock ?? product.countInStock;
    
    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(8);
  res.json(products);
});

// @desc Get featured products
// @route GET /api/products/featured
// @access Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ rating: { $gte: 4 } }).limit(8);
  res.json(products);
});

// @desc Get related products
// @route GET /api/products/:id/related
// @access Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);
    res.json(related);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Get all categories
// @route GET /api/products/categories/all
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

// @desc Get all brands
// @route GET /api/products/brands/all
// @access Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand');
  res.json(brands);
});

// @desc Sync products from Makeup API
// @route POST /api/products/sync
// @access Public (or Private/Admin in production)
const syncProducts = asyncHandler(async (req, res) => {
  const result = await syncProductsFromAPI();
  res.json({
    message: 'Products synced successfully',
    ...result
  });
});

// @desc Advanced search with filters
// @route GET /api/products/search
// @access Public
const advancedSearch = asyncHandler(async (req, res) => {
  const { q, category, brand, minPrice, maxPrice, minRating, sortBy, order, limit } = req.query;
  
  const filters = {
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    sortBy: sortBy || 'createdAt',
    order: order || -1,
    limit: limit || 100
  };

  const products = await searchProducts(q, filters);
  
  res.json({
    success: true,
    count: products.length,
    products
  });
});

module.exports = { 
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
};

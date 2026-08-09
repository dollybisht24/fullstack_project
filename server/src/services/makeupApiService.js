const axios = require('axios');
const Product = require('../models/Product');

const MAKEUP_API_BASE = 'https://makeup-api.herokuapp.com/api/v1/products.json';

// Brand mapping for categories
const BRAND_CATEGORY_MAP = {
  Makeup: ['maybelline', 'covergirl', 'nyx', 'revlon', 'l\'oreal'],
  Skin: ['clinique', 'glossier', 'neutrogena'],
  Hair: ['garnier'],
  'Bath & Body': ['dove', 'nivea'],
  Fragrance: ['dior'],
  Natural: ['burt\'s bees', 'physicians formula'],
  Luxe: ['dior', 'clinique']
};

// Product type to category mapping
const TYPE_CATEGORY_MAP = {
  lipstick: 'Makeup',
  lip_liner: 'Makeup',
  foundation: 'Makeup',
  eyeliner: 'Makeup',
  eyeshadow: 'Makeup',
  mascara: 'Makeup',
  blush: 'Makeup',
  bronzer: 'Makeup',
  nail_polish: 'Makeup',
  lip_gloss: 'Makeup'
};

/**
 * Fetch products from Makeup API by brand
 */
const fetchProductsByBrand = async (brand) => {
  try {
    const response = await axios.get(`${MAKEUP_API_BASE}?brand=${brand}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for brand ${brand}:`, error.message);
    return [];
  }
};

/**
 * Fetch products by category
 */
const fetchProductsByCategory = async (category) => {
  try {
    const brands = BRAND_CATEGORY_MAP[category] || [];
    let allProducts = [];

    for (const brand of brands) {
      const products = await fetchProductsByBrand(brand);
      allProducts = [...allProducts, ...products];
    }

    return allProducts;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error.message);
    return [];
  }
};

/**
 * Fetch all products from Makeup API
 */
const fetchAllProducts = async () => {
  try {
    const response = await axios.get(MAKEUP_API_BASE);
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error.message);
    return [];
  }
};

/**
 * Transform Makeup API product to our schema format
 */
const transformProduct = (apiProduct) => {
  // Determine category based on product type
  const category = TYPE_CATEGORY_MAP[apiProduct.product_type] || 'Makeup';
  
  // Generate multiple images (use same image with different sizes)
  const images = apiProduct.image_link ? [
    apiProduct.image_link,
    apiProduct.api_featured_image || apiProduct.image_link,
    apiProduct.image_link
  ].filter(Boolean) : ['https://via.placeholder.com/400'];

  // Calculate discount if price_sign is available
  const price = parseFloat(apiProduct.price) || 0;
  const originalPrice = price > 0 ? Math.round(price * 1.3) : 0;
  const discount = price > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return {
    name: apiProduct.name || 'Beauty Product',
    brand: apiProduct.brand || 'Unknown Brand',
    category: category,
    description: apiProduct.description || 'A high-quality beauty product that enhances your natural beauty.',
    images: images,
    price: price > 0 ? price : Math.floor(Math.random() * 500) + 100,
    originalPrice: originalPrice > 0 ? originalPrice : null,
    discount: discount > 0 ? discount : null,
    countInStock: Math.floor(Math.random() * 50) + 10,
    rating: parseFloat(apiProduct.rating) || (Math.random() * 2 + 3).toFixed(1),
    numReviews: Math.floor(Math.random() * 100),
    reviews: [],
    externalId: apiProduct.id,
    productType: apiProduct.product_type,
    tagList: apiProduct.tag_list || [],
    productColors: apiProduct.product_colors || []
  };
};

/**
 * Sync products from Makeup API to MongoDB
 */
const syncProductsFromAPI = async () => {
  try {
    console.log('🔄 Starting product sync from Makeup API...');
    
    const apiProducts = await fetchAllProducts();
    console.log(`📦 Fetched ${apiProducts.length} products from API`);

    let syncedCount = 0;
    let updatedCount = 0;

    for (const apiProduct of apiProducts) {
      try {
        // Check if product already exists by external ID
        const existingProduct = await Product.findOne({ externalId: apiProduct.id });

        const transformedProduct = transformProduct(apiProduct);

        if (existingProduct) {
          // Update existing product (keep reviews and ratings)
          await Product.findByIdAndUpdate(existingProduct._id, {
            ...transformedProduct,
            reviews: existingProduct.reviews,
            rating: existingProduct.rating,
            numReviews: existingProduct.numReviews
          });
          updatedCount++;
        } else {
          // Create new product
          await Product.create(transformedProduct);
          syncedCount++;
        }
      } catch (error) {
        console.error(`Error syncing product ${apiProduct.id}:`, error.message);
      }
    }

    console.log(`✅ Sync complete: ${syncedCount} new products, ${updatedCount} updated`);
    return { syncedCount, updatedCount, total: apiProducts.length };
  } catch (error) {
    console.error('❌ Error syncing products:', error.message);
    throw error;
  }
};

/**
 * Get products from DB or fetch from API if empty
 */
const getProducts = async (category = null) => {
  try {
    // Check if we have products in DB
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      console.log('📭 No products in database, fetching from API...');
      await syncProductsFromAPI();
    }

    // Fetch from database
    const query = category ? { category } : {};
    const products = await Product.find(query)
      .select('-reviews') // Exclude reviews for list view
      .sort({ createdAt: -1 });

    return products;
  } catch (error) {
    console.error('Error getting products:', error.message);
    throw error;
  }
};

/**
 * Search products
 */
const searchProducts = async (searchTerm, filters = {}) => {
  try {
    const query = {};

    // Text search
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Category filter
    if (filters.category) {
      query.category = filters.category;
    }

    // Brand filter
    if (filters.brand) {
      query.brand = { $regex: filters.brand, $options: 'i' };
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
    }

    // Rating filter
    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }

    const products = await Product.find(query)
      .select('-reviews')
      .sort({ [filters.sortBy || 'createdAt']: filters.order || -1 })
      .limit(parseInt(filters.limit) || 100);

    return products;
  } catch (error) {
    console.error('Error searching products:', error.message);
    throw error;
  }
};

module.exports = {
  fetchAllProducts,
  fetchProductsByBrand,
  fetchProductsByCategory,
  syncProductsFromAPI,
  getProducts,
  searchProducts,
  transformProduct
};

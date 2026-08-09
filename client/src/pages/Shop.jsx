import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaShoppingCart, FaStar, FaHeart, FaEye, FaFilter, FaSort } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist } from '../store/slices/wishlistSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const cart = useSelector((state) => state.cart.items)

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products')
        setProducts(data.products || data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some(item => {
      const itemProductId = item.product?._id || item.product
      return itemProductId === productId
    })
  }

  // Handle Add to Cart
  const handleAddToCart = async (product) => {
    if (isInCart(product._id)) {
      navigate('/cart')
      return
    }
    
    try {
      await dispatch(addToCart({ productId: product._id, qty: 1 })).unwrap()
      showNotification(`${product.name} added to bag! 🛒`)
    } catch (error) {
      showNotification('Failed to add to cart', 'error')
    }
  }

  // Handle Add to Wishlist
  const handleAddToWishlist = async (product) => {
    try {
      await dispatch(addToWishlist({ productId: product._id })).unwrap()
      showNotification(`${product.name} added to wishlist! ❤️`)
    } catch (error) {
      showNotification('Failed to add to wishlist', 'error')
    }
  }

  // View product details
  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  // Get unique categories
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]

  // Filter and sort products
  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Meenakshi Makeover Shop
          </h1>
          <p className="text-xl text-gray-600">
            Discover premium makeup products with exclusive discounts
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-semibold">
              {filteredProducts.length} Products
            </span>
            <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full font-semibold">
              Up to 44% OFF
            </span>
            <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-semibold">
              Free Shipping
            </span>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaFilter className="text-pink-500" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaSort className="text-pink-500" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Cart Button */}
            <div className="flex items-end">
              <button
                onClick={() => navigate('/cart')}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaShoppingCart className="text-xl" />
                View Bag ({cart.length})
              </button>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group relative"
            >
              {/* Wishlist Button */}
              <button
                onClick={() => handleAddToWishlist(product)}
                className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-pink-500 hover:text-white transition-all"
              >
                <FaHeart className="text-lg" />
              </button>

              {/* Product Image */}
              <div className="relative overflow-hidden h-64 bg-gray-100">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  onClick={() => handleViewProduct(product._id)}
                />
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {product.discount}% OFF
                  </div>
                )}

                {/* Stock Status */}
                <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                  product.countInStock > 0 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
                </div>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleViewProduct(product._id)}
                    className="bg-white text-pink-600 px-6 py-2 rounded-full font-semibold hover:bg-pink-600 hover:text-white transition-all flex items-center gap-2"
                  >
                    <FaEye />
                    Quick View
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                {/* Category Badge */}
                <div className="text-xs text-pink-600 font-semibold mb-2 uppercase tracking-wide">
                  {product.category}
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-pink-600 transition-colors"
                    onClick={() => handleViewProduct(product._id)}>
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.numReviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-pink-600">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.countInStock === 0}
                  className={`w-full py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    product.countInStock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isInCart(product._id)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                  }`}
                >
                  <FaShoppingCart className="text-lg" />
                  {product.countInStock === 0 
                    ? 'Out of Stock' 
                    : isInCart(product._id)
                    ? 'In Bag - View'
                    : 'Add to Bag'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-6 z-[60] px-6 py-4 rounded-2xl shadow-2xl ${
              notification.type === 'success'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-red-500 to-rose-500'
            } text-white font-semibold flex items-center gap-3 max-w-md`}
          >
            <span className="text-2xl">
              {notification.type === 'success' ? '✅' : '⚠️'}
            </span>
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

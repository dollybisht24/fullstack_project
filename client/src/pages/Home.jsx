import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchCategories } from '../store/slices/productSlice'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useMakeupProducts, syncProductsFromAPI } from '../hooks/useMakeupProducts'
import { addToCart } from '../store/slices/cartSlice'
import { FaShoppingCart, FaTimes } from 'react-icons/fa'
import axios from 'axios'

export default function Home() {
  const dispatch = useDispatch()
  const { items: products, status, categories } = useSelector((s) => s.products)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [collectionProducts, setCollectionProducts] = useState([])
  const [loadingCollection, setLoadingCollection] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    dispatch(fetchProducts({ pageSize: 20 }))
    dispatch(fetchCategories())
  }, [dispatch])

  // Auto-rotate hero banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Fetch collection products
  const handleExploreCollection = async () => {
    setShowCollectionModal(true)
    setLoadingCollection(true)
    try {
      const { data } = await axios.get('http://localhost:5000/api/products?brand=Meenakshi Makeover')
      setCollectionProducts(data.products || data)
    } catch (error) {
      console.error('Error fetching collection:', error)
    } finally {
      setLoadingCollection(false)
    }
  }

  // Handle add to cart from collection
  const handleAddToCartFromCollection = async (product) => {
    try {
      await dispatch(addToCart({ productId: product._id, qty: 1 })).unwrap()
      showNotification(`${product.name} added to cart! 🛒`)
    } catch (error) {
      showNotification('Failed to add to cart', 'error')
    }
  }

  // Sync products from Makeup API
  const handleSyncProducts = async () => {
    try {
      setSyncing(true)
      setSyncMessage('')
      const result = await syncProductsFromAPI()
      setSyncMessage(`✅ Synced ${result.syncedCount} products! (${result.updatedCount} updated)`)
      // Refresh products after sync
      setTimeout(() => {
        dispatch(fetchProducts({ pageSize: 20 }))
      }, 1000)
    } catch (error) {
      setSyncMessage('❌ Failed to sync products. Please try again.')
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMessage(''), 5000)
    }
  }

  const heroBanners = [
    {
      title: "Singles Day Sale",
      subtitle: "Get Extra 20% Off",
      label: "Makeup Collection",
      bg: "bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200",
      image: "https://i.pinimg.com/736x/a9/2c/b0/a92cb0733adc0fcf214fd7e1e278057c.jpg"
    },
    {
      title: "Luxury Beauty",
      subtitle: "Premium Brands Collection",
      label: "Bridal Makeup",
      bg: "bg-gradient-to-r from-purple-400 via-purple-300 to-pink-300",
      image: "https://i.pinimg.com/1200x/84/2c/4f/842c4f414eb1f8006fd1a3e47e30001d.jpg"
    },
    {
      title: "Skincare Essentials",
      subtitle: "Glow From Within",
      label: "Beauty Products",
      bg: "bg-gradient-to-r from-blue-300 via-teal-200 to-green-200",
      image: "https://i.pinimg.com/736x/ca/51/8e/ca518e95fe8db4986ea7a51d9af85a0e.jpg"
    },
    {
      title: "Beauty Collection",
      subtitle: "Shop the Latest Trends",
      label: "Fashion Makeup",
      bg: "bg-gradient-to-r from-rose-400 via-pink-300 to-purple-300",
      image: "https://i.pinimg.com/736x/ae/51/af/ae51af40b2fd555f66100b42215cf6c0.jpg"
    },
    {
      title: "Professional Care",
      subtitle: "Expert Beauty Services",
      label: "Facial Treatment",
      bg: "bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-300",
      image: "https://i.pinimg.com/1200x/5f/b5/10/5fb510fd07479ff3f6d5d991ebe47012.jpg"
    },
    {
      title: "Glamorous Look",
      subtitle: "Red Carpet Ready",
      label: "Party Makeup",
      bg: "bg-gradient-to-r from-red-400 via-pink-300 to-rose-300",
      image: "https://i.pinimg.com/1200x/4b/c7/4d/4bc74dcb25c854e0fbb2ca78c4e91688.jpg"
    },
    {
      title: "Natural Beauty",
      subtitle: "Radiant Skin Care",
      label: "Skin Care",
      bg: "bg-gradient-to-r from-green-300 via-emerald-200 to-teal-200",
      image: "https://i.pinimg.com/736x/6e/81/23/6e812397731fad302ae025bae4c3e011.jpg"
    },
    {
      title: "Elegant Style",
      subtitle: "Sophisticated Looks",
      label: "Eye Makeup",
      bg: "bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-300",
      image: "https://i.pinimg.com/736x/6d/2f/85/6d2f85fdafac9d4ec9bf46b5a024f5e4.jpg"
    },
    {
      title: "Premium Products",
      subtitle: "Luxury Beauty Brands",
      label: "Beauty Essentials",
      bg: "bg-gradient-to-r from-pink-300 via-rose-200 to-red-200",
      image: "https://i.pinimg.com/736x/ce/48/c1/ce48c1fa901bbf509623ba954ca2da68.jpg"
    },
    {
      title: "Bridal Glow",
      subtitle: "Your Special Day",
      label: "Bridal Look",
      bg: "bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-200",
      image: "https://i.pinimg.com/1200x/bd/52/b0/bd52b0f560b053ab30e60c14a3a84a79.jpg"
    },
    {
      title: "Makeup Artistry",
      subtitle: "Professional Services",
      label: "Makeup Kit",
      bg: "bg-gradient-to-r from-fuchsia-400 via-pink-300 to-rose-300",
      image: "https://i.pinimg.com/736x/17/f4/5d/17f45db9cd9938c75370719e5d96df27.jpg"
    }
  ]

  const categoryIcons = {
    'Lips': '💋',
    'Face': '✨',
    'Eyes': '👁️',
    'Skin': '🌸',
    'Nails': '💅',
  }

  const brands = ['Maybelline', 'Lakme', 'MAC', 'Nykaa', 'SUGAR', 'The Ordinary', 'Estee Lauder', 'Minimalist']

  const customerReviews = [
    {
      name: 'Aditi Sharma',
      city: 'Delhi',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=900&q=80',
      text: 'The bridal base stayed fresh through the full event. I could read the shade details clearly, ordered the compact, and it matched exactly.'
    },
    {
      name: 'Meera Nair',
      city: 'Kochi',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
      text: 'Loved the lipstick and eye palette combo. The product images helped me compare colors before buying, and delivery was smooth.'
    },
    {
      name: 'Riya Kapoor',
      city: 'Mumbai',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80',
      text: 'The reviews made choosing skincare much easier. Texture, finish, and photos from other customers gave me confidence to try it.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Sync Button - Fixed position */}
      <button
        onClick={handleSyncProducts}
        disabled={syncing}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-pink-500/50 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
      >
        {syncing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Syncing...
          </>
        ) : (
          <>
            🔄 Sync Products
          </>
        )}
      </button>

      {/* Sync Status Message */}
      {syncMessage && (
        <div className="fixed top-20 right-6 z-50 bg-white shadow-xl rounded-lg p-4 max-w-sm animate-slide-in">
          <p className="text-sm font-medium">{syncMessage}</p>
        </div>
      )}

      {/* Hero Carousel - Full Width Edge to Edge */}
      <section className="relative w-screen h-[800px] md:h-[900px] lg:h-[1000px] -mx-[50vw] ml-[calc(50%-50vw)] mb-8 overflow-visible bg-white">
        {heroBanners.map((banner, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Full Background Image - No Overlay */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                imageRendering: 'high-quality',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                filter: 'none'
              }}
            />
            
            {/* Label at Bottom of Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: currentSlide === index ? 1 : 0, y: currentSlide === index ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10"
            >
              <div className="bg-white/95 backdrop-blur-sm px-8 py-3 rounded-full shadow-2xl border-2 border-pink-300">
                <p className="text-gray-800 text-lg md:text-xl font-semibold tracking-wide">
                  {banner.label}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition ${
                currentSlide === index ? 'bg-pink-500 w-8' : 'bg-gray-400/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Text Section Below Carousel */}
      <section className="bg-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl mb-4 text-gray-900"
            >
              {heroBanners[currentSlide].title}
            </motion.h2>
            <motion.p
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl mb-8 text-gray-700"
            >
              {heroBanners[currentSlide].subtitle}
            </motion.p>
            <motion.div
              key={`button-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                to="/shop"
                className="inline-block bg-pink-600 text-white px-10 py-4 rounded-full text-lg hover:shadow-xl transition transform hover:scale-105 hover:bg-pink-700"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Makeup Products Feature Banner */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://www.yesmadam.com/blog/wp-content/uploads/2022/07/Makeup-Products.jpg"
              alt="Makeup Products Collection"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
              <div className="text-white px-8 md:px-16 max-w-2xl">
                <motion.h2
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-3xl md:text-5xl font-bold mb-4"
                >
                  Discover Your Perfect Look
                </motion.h2>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg md:text-xl mb-6"
                >
                  Premium makeup products for every occasion
                </motion.p>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Link
                    to="/products"
                    className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition transform hover:scale-105"
                  >
                    Explore Collection
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Promotional Banner */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-pink-400 rounded-lg p-6 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Get Extra 20% Off</h2>
            <p className="text-lg">On your first order | Use code: <span className="font-bold">FIRST20</span></p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition transform hover:-translate-y-1 group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition">{categoryIcons[cat] || '🎨'}</div>
                <div className="font-semibold text-gray-800">{cat}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Offers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Exclusive Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-pink-900 mb-2">Your Favorite Brands</h3>
              <p className="text-pink-700 mb-4">Now in Pink!</p>
              <Link to="/products" className="inline-block bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700">
                Explore
              </Link>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-purple-900 mb-2">Beauty Bonanza</h3>
              <p className="text-purple-700 mb-4">Up to 40% Off</p>
              <Link to="/shop" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700">
                Shop Now
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Gift Sets</h3>
              <p className="text-blue-700 mb-4">Perfect for Gifting</p>
              <Link to="/shop" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                Discover
              </Link>
            </div>
            <div className="bg-gradient-to-br from-rose-100 to-rose-200 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-rose-900 mb-2">Our Collection</h3>
              <p className="text-rose-700 mb-4">14 Premium Products</p>
              <button 
                onClick={handleExploreCollection}
                className="inline-block bg-rose-600 text-white px-6 py-2 rounded-full hover:bg-rose-700 transition-all hover:scale-105"
              >
                🎨 Explore Collection
              </button>
            </div>
          </div>
        </section>

        {/* Top Brands */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Top Brands</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand}
                to={`/products?brand=${brand}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition flex items-center justify-center aspect-square"
              >
                <span className="text-xs font-semibold text-gray-700">{brand}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-pink-600 hover:text-pink-700 font-semibold">
              View All →
            </Link>
          </div>
          {status === 'loading' && products.length === 0 && <Spinner />}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.slice(0, 10).map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        </section>

        {/* Real Customer Reviews */}
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Real Customer Reviews</h2>
              <p className="text-gray-600 mt-1">Readable stories with photos from shoppers and makeover clients.</p>
            </div>
            <Link to="/products" className="text-pink-600 hover:text-pink-700 font-semibold">
              Review a Product →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((review) => (
              <motion.article
                key={review.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50"
              >
                <img
                  src={review.image}
                  alt={`${review.name} customer review`}
                  className="h-56 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.name}</h3>
                      <p className="text-sm text-gray-500">{review.city}</p>
                    </div>
                    <div className="flex text-yellow-500" aria-label={`${review.rating} star review`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white mb-6">
            <h2 className="text-3xl font-bold mb-2">Best Sellers</h2>
            <p className="text-pink-100">Most loved by our customers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.filter(p => p.rating >= 4.5).slice(0, 5).map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        </section>

        {/* Beauty on a Budget */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Beauty on a Budget</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/products?maxPrice=500" className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 text-center hover:shadow-lg">
              <div className="text-3xl mb-2">Under ₹500</div>
              <div className="font-semibold text-green-800">Shop Now</div>
            </Link>
            <Link to="/products?maxPrice=1000" className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 text-center hover:shadow-lg">
              <div className="text-3xl mb-2">Under ₹1000</div>
              <div className="font-semibold text-blue-800">Shop Now</div>
            </Link>
            <Link to="/products?maxPrice=2000" className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 text-center hover:shadow-lg">
              <div className="text-3xl mb-2">Under ₹2000</div>
              <div className="font-semibold text-purple-800">Shop Now</div>
            </Link>
            <Link to="/products" className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-6 text-center hover:shadow-lg">
              <div className="text-3xl mb-2">All Products</div>
              <div className="font-semibold text-pink-800">Explore</div>
            </Link>
          </div>
        </section>
      </div>

      {/* Collection Modal */}
      <AnimatePresence>
        {showCollectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
            onClick={() => setShowCollectionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b">
                <h2 className="text-3xl font-bold text-pink-600">
                  ✨ Our Exclusive Collection
                </h2>
                <button
                  onClick={() => setShowCollectionModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              {/* Loading State */}
              {loadingCollection ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600"></div>
                </div>
              ) : (
                /* Products Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {collectionProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:border-pink-300"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden bg-gray-100 aspect-square">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-gray-500">({product.numReviews})</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-bold text-pink-600">
                            ₹{product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          {product.countInStock > 0 ? (
                            <span className="text-green-600">✓ In Stock ({product.countInStock})</span>
                          ) : (
                            <span className="text-red-600">Out of Stock</span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCartFromCollection(product)}
                          disabled={product.countInStock === 0}
                          className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                            product.countInStock === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-pink-600 text-white hover:bg-pink-700 hover:scale-105'
                          }`}
                        >
                          <FaShoppingCart />
                          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-6 left-1/2 z-50 px-6 py-4 rounded-lg shadow-2xl ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {notification.type === 'success' ? '✓' : '⚠️'}
              </span>
              <span className="font-semibold">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

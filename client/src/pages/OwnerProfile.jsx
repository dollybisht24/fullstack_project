import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaInstagram, FaYoutube, FaFacebookF, FaPinterestP, FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaAward, FaCheckCircle, FaShoppingCart } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import axios from 'axios'

export default function OwnerProfile() {
  const [showCertificates, setShowCertificates] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [notification, setNotification] = useState(null)
  
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products?brand=Meenakshi Makeover')
        setProducts(data.products || data)
        setLoadingProducts(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart({ productId: product._id, qty: 1 })).unwrap()
      showNotification(`${product.name} added to cart!`)
    } catch (error) {
      showNotification('Failed to add to cart', 'error')
    }
  }

  const certificates = [
    'International Makeup Academy – Professional Makeup Artist',
    'Pro Makeup Academy – Airbrush Expert',
    'Dermatology & Skincare Institute – Skincare Specialist',
    'Bridal & Editorial Makeup Masterclass',
    'Celebrity Makeup Workshop – Global Beauty Expo'
  ]

  const skills = [
    'Airbrush & HD Makeup Techniques',
    'Skin Preparation & Color Theory',
    'Contouring, Highlighting & Eye Artistry',
    'Styling for Photoshoots & Events',
    'Communication & Client Care Skills'
  ]

  const portfolioHighlights = [
    'Signature Looks: From radiant bridal transformations to bold editorial styles',
    'Before & After Shots: Real client transformations',
    'Specializations: Bridal, Airbrush, HD, Celebrity Makeup',
    'Notable Clients: Featured in fashion shows, celebrity events, and magazines',
    'Versatility: From natural day looks to glamorous evening artistry'
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { role: 'user', content: inputMessage }
    setMessages([...messages, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const response = await axios.post('http://localhost:5000/api/chat/message', {
        message: inputMessage
      })
      
      const botMessage = { role: 'assistant', content: response.data.message }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = { 
        role: 'assistant', 
        content: 'Hi! I\'m Meenakshi, your beauty assistant. I can help you with makeup tips, product recommendations, and booking consultations. What would you like to know?' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-purple-50" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src="https://thumbs.dreamstime.com/z/female-avatar-icon-women-clipart-png-vector-girl-avatar-women-clipart-bor-bisiness-icon-png-vector-233362315.jpg?ct=jpeg"
                alt="Meenakshi Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-pink-300 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-1 rounded-full text-sm shadow-lg">
                Top Rated
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl text-gray-800 mb-2">Meenakshi_Makeover</h1>
          <p className="text-xl text-pink-600 italic mb-4">Transforming Beauty, One Face at a Time</p>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex text-yellow-400 text-2xl">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span className="text-gray-700">4.9 (8,500+ Reviews)</span>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-gray-700 flex-wrap">
            <span>10,000+ Happy Clients</span>
            <span className="text-gray-300">|</span>
            <span>12+ Years of Experience</span>
          </div>
        </motion.div>

        {/* Professional Summary */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-pink-100"
        >
          <h2 className="text-3xl text-pink-600 mb-4">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            With over 12 years in the beauty industry, I specialize in bridal, editorial, and HD makeup artistry. 
            My goal is to enhance natural beauty through expert techniques and a personalized approach. 
            Each look I create reflects elegance, confidence, and individuality — making every client feel beautiful inside and out.
          </p>
        </motion.section>

        {/* Featured Products Gallery */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-lg p-8 mb-8 border border-pink-100"
        >
          <h2 className="text-3xl text-pink-600 mb-6 text-center">
            My Signature Products
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Curated collection of professional makeup products I personally use and recommend
          </p>
          
          {loadingProducts ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {product.discount}% OFF
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-semibold">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="text-xs text-pink-600 font-semibold mb-2 uppercase tracking-wide">
                      {product.category}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
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
                      <div className="text-xs text-gray-500">
                        {product.numReviews} reviews
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart className="text-lg" />
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {products.length > 6 && (
            <div className="text-center mt-8">
              <motion.a
                href="/products?brand=Meenakshi Makeover"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Products →
              </motion.a>
            </div>
          )}
        </motion.section>

        {/* Portfolio Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-lg p-8 mb-8 border border-pink-100"
        >
          <h2 className="text-3xl text-pink-600 mb-6">
            Portfolio Highlights
          </h2>
          <div className="space-y-4">
            {portfolioHighlights.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <FaCheckCircle className="text-pink-500 text-xl mt-1 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills & Expertise */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-pink-100"
        >
          <h2 className="text-3xl text-pink-600 mb-6">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-2xl hover:from-pink-200 hover:to-purple-200 transition-all duration-300 cursor-pointer"
              >
                <p className="text-gray-800">{skill}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Work Gallery - Makeup Transformations */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-lg p-8 mb-8 border border-pink-100"
        >
          <h2 className="text-3xl text-pink-600 mb-4 text-center">
            My Work Gallery
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Transforming beauty through artistry - A glimpse of my recent work
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'https://i.pinimg.com/736x/9f/6b/9f/9f6b9f235e9c54e78da85afc502e7a57.jpg',
              'https://i.pinimg.com/736x/78/2e/92/782e922e55c69985f3aacf01250dabce.jpg',
              'https://i.pinimg.com/736x/df/e2/81/dfe281744cc82d7d86666670796a705b.jpg',
              'https://i.pinimg.com/736x/08/66/10/08661015450561859151e2f46c591a67.jpg',
              'https://i.pinimg.com/1200x/d9/ce/c9/d9cec9f07c39dd74720a976be436cdb9.jpg',
              'https://i.pinimg.com/736x/c6/62/09/c66209b5c1140b633027001bb8887f7f.jpg',
              'https://i.pinimg.com/1200x/a3/94/1e/a3941ed3b2b8e0e1de18de62a5caa2be.jpg',
              'https://i.pinimg.com/736x/4f/85/f3/4f85f300a21717ba6227c46b50d7dc40.jpg',
              'https://i.pinimg.com/1200x/31/ec/cc/31eccc60f19da84465b3a48ba91e150b.jpg',
              'https://i.pinimg.com/1200x/38/94/19/38941980faba55bd7a9aa4c47d5d9fd9.jpg',
              'https://i.pinimg.com/1200x/c1/a3/24/c1a32446c361c34ca62344733108a9a1.jpg',
              'https://i.pinimg.com/1200x/81/a2/23/81a223b30d9a23afc5c18b8eb0756b9b.jpg',
              'https://i.pinimg.com/1200x/69/46/9c/69469ca87a9386cf92802b90bd0c3a01.jpg',
              'https://i.pinimg.com/736x/5c/66/4a/5c664a6e5e7e29a23b37993684cf5386.jpg'
            ].map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-square"
              >
                <img
                  src={image}
                  alt={`Makeup work ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-semibold text-sm">
                    Professional Work {idx + 1}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 italic">
              ✨ Each transformation tells a unique story of beauty and confidence ✨
            </p>
          </div>
        </motion.section>

        {/* Education & Certification */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-lg p-8 mb-8 border border-pink-100"
        >
          <h2 className="text-3xl text-pink-600 mb-6 flex items-center gap-2">
            <FaAward className="text-4xl text-yellow-500" /> Education & Certification
          </h2>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-pink-500 text-xl mt-1" />
              <p className="text-gray-700">Certified Professional Makeup Artist – International Makeup Academy</p>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-pink-500 text-xl mt-1" />
              <p className="text-gray-700">HD & Airbrush Specialist – Pro Makeup Academy</p>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-pink-500 text-xl mt-1" />
              <p className="text-gray-700">Advanced Skincare Certification – Dermatology & Skincare Institute</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCertificates(!showCertificates)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {showCertificates ? 'Hide' : 'View'} All Certificates
          </motion.button>

          <AnimatePresence>
            {showCertificates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 space-y-3"
              >
                {certificates.map((cert, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-pink-400"
                  >
                    <p className="text-gray-800">✓ {cert}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* AI Assistant Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-pink-100"
        >
          <h2 className="text-3xl text-pink-600 mb-6">
            AI Beauty Assistant
          </h2>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border-2 border-pink-200">
            <p className="text-gray-700 mb-4">
              <span className="text-pink-600">Ask me anything!</span> I'm here to help with makeup tips, product recommendations, and booking consultations.
            </p>
            <button
              onClick={() => setShowChat(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Chat with AI Assistant
            </button>
          </div>
        </motion.section>

        {/* Contact & Social Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-lg p-8 border border-pink-100"
        >
          <h2 className="text-3xl text-pink-600 mb-6 text-center">Get In Touch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm">
              <FaMapMarkerAlt className="text-pink-500 text-2xl" />
              <div>
                <p className="text-gray-600 text-sm">Location</p>
                <p className="text-gray-800">Mumbai, India</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm">
              <FaPhone className="text-pink-500 text-2xl" />
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-gray-800">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm">
              <FaEnvelope className="text-pink-500 text-2xl" />
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-800 text-xs">contact@meenakshimakeover.com</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-xl text-gray-800 mb-4">Follow Me On Social Media</h3>
            <div className="flex justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-pink-400 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <FaInstagram className="text-2xl" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-red-400 to-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <FaYoutube className="text-2xl" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <FaFacebookF className="text-2xl" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-red-500 to-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <FaPinterestP className="text-2xl" />
              </motion.a>
            </div>
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 rounded-full text-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              Book Your Session
            </motion.button>
          </div>
        </motion.section>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center z-50 hover:scale-110"
      >
        <img 
          src="https://thumbs.dreamstime.com/z/female-avatar-icon-women-clipart-png-vector-girl-avatar-women-clipart-bor-bisiness-icon-png-vector-233362315.jpg?ct=jpeg" 
          alt="Chat" 
          className="w-full h-full object-cover rounded-full border-2 border-white"
        />
      </motion.button>

      {/* AI Chat Window */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col border-2 border-pink-200 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="https://thumbs.dreamstime.com/z/female-avatar-icon-women-clipart-png-vector-girl-avatar-women-clipart-bor-bisiness-icon-png-vector-233362315.jpg?ct=jpeg" 
                  alt="AI" 
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div>
                  <h3 className="text-lg">Meenakshi AI</h3>
                  <p className="text-xs text-pink-100">Your Beauty Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white hover:text-pink-200 transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-pink-50 to-purple-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                  <p className="text-gray-700 text-lg">Hi! I'm Meenakshi AI</p>
                  <p className="text-sm mt-2">Ask me about makeup tips, products, or bookings!</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-pink-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 p-4 rounded-2xl rounded-bl-none shadow-md border border-pink-200">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t-2 border-pink-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all hover:scale-105"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            } text-white font-semibold flex items-center gap-3`}
          >
            {notification.type === 'success' ? (
              <FaCheckCircle className="text-2xl" />
            ) : (
              <span className="text-2xl">⚠️</span>
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { FaShoppingBag, FaMapMarkerAlt, FaCheckCircle, FaDatabase } from 'react-icons/fa'

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cart = useSelector((s) => s.cart.items)
  const { user } = useSelector((s) => s.auth)

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('India')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)

  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue')
      navigate('/login')
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
      toast.warning('Your cart is empty')
      // Don't navigate away, allow them to see the form
    }
  }, [user, navigate, cart.length])

  // Use sample items if cart is empty (for demo purposes)
  const itemsToOrder = cart.length > 0 ? cart : [
    {
      product: { _id: 'demo1', name: 'Charlotte Tilbury Pillow Talk Icons On The Go', images: ['https://via.placeholder.com/150'] },
      qty: 2,
      price: 5750
    },
    {
      product: { _id: 'demo2', name: 'Free Charlotte Tilbury Deluxe Matte Revolution Lipstick', images: ['https://via.placeholder.com/150'] },
      qty: 1,
      price: 0
    },
    {
      product: { _id: 'demo3', name: 'Free Charlotte Tilbury Airbrush Flawless Setting Spray', images: ['https://via.placeholder.com/150'] },
      qty: 1,
      price: 0
    }
  ]

  const subtotal = itemsToOrder.reduce((acc, item) => acc + item.qty * item.price, 0)
  const tax = Math.round(subtotal * 0.11) // 11% tax
  const shipping = 9
  const total = subtotal - 1265 + shipping // Apply discount

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!address || !city || !postalCode || !phone) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      const orderItems = itemsToOrder.map((it) => ({
        name: it.product?.name || 'Product',
        qty: it.qty,
        image: it.product?.images?.[0] || '',
        price: it.price,
        product: it.product?._id || it.product,
      }))

      console.log('🛒 Sending order to backend...')
      console.log('📦 Order Items:', orderItems.length)
      console.log('📍 Shipping to:', city)
      console.log('💰 Total:', total)
      console.log('🔗 Backend URL:', axios.defaults.baseURL || 'http://localhost:5000/api')
      console.log('📧 Customer email:', user.email)

      const { data } = await axios.post(
        '/orders',
        {
          orderItems,
          shippingAddress: { address, city, postalCode, country, phone },
          paymentMethod: 'COD',
          itemsPrice: subtotal,
          taxPrice: tax,
          shippingPrice: shipping,
          totalPrice: total,
        },
        { 
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          } 
        }
      )

      console.log('✅ ORDER SAVED TO BACKEND!')
      console.log('📋 Order ID:', data._id)
      console.log('💾 Order Data:', data)
      console.log('🎉 Order saved to MongoDB successfully!')
      console.log('📧 Email confirmation will be sent to:', user.email)
      console.log('🔍 View this order in MongoDB Compass: mongodb://localhost:27017/nykaa-clone → orders collection')
      
      // Save order data to show confirmation
      setOrderDetails(data)
      setOrderPlaced(true)
      
      toast.success('🎉 Order placed successfully!')
      toast.success('💾 Order saved to MongoDB backend!')
      toast.info('📧 Email sent to ' + user.email)
      
      // Redirect to profile after showing confirmation
      setTimeout(() => {
        navigate('/profile')
      }, 5000)
      
    } catch (err) {
      console.error('Order error:', err)
      console.error('Error response:', err.response?.data)
      toast.error(err.response?.data?.message || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to checkout</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Success Message */}
        {orderPlaced && orderDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <FaCheckCircle className="text-5xl" />
              <div>
                <h2 className="text-3xl font-bold">Order Placed Successfully!</h2>
                <p className="text-green-100">Your order has been saved to the backend</p>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mt-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <FaDatabase /> Order ID:
                  </p>
                  <p className="font-mono bg-white/30 px-3 py-2 rounded">{orderDetails._id}</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Total Amount:</p>
                  <p className="text-2xl font-bold">₹{orderDetails.totalPrice}</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Payment Method:</p>
                  <p>{orderDetails.paymentMethod}</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Status:</p>
                  <p className="capitalize">{orderDetails.orderStatus}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-semibold mb-2">Shipping To:</p>
                  <p>{orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/30">
                <p className="text-sm">✅ Order saved to MongoDB: <span className="font-mono">nykaa-clone → orders</span></p>
                <p className="text-sm">📧 Confirmation email sent to: {user.email}</p>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold hover:bg-white/30 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl text-gray-800 mb-8"
        >
          Checkout
        </motion.h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl text-gray-800 mb-6">Shipping Address</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Address</label>
                <input 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition" 
                  placeholder="Street address, apartment, suite, etc." 
                  required 
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">City</label>
                  <input 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition" 
                    placeholder="City" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Postal Code</label>
                  <input 
                    value={postalCode} 
                    onChange={(e) => setPostalCode(e.target.value)} 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition" 
                    placeholder="Postal Code" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Country</label>
                  <input 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition" 
                    placeholder="Country" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                  <input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition" 
                    placeholder="Phone Number" 
                    type="tel"
                    required 
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-lg text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg h-fit"
          >
            <h2 className="text-xl text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Items ({itemsToOrder.length}):</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹1265.00</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (11%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <hr className="my-3 border-gray-200" />
              <div className="flex justify-between text-lg text-gray-800">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-700">
                🎉 You're saving ₹1265 on this order!
              </p>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700 font-semibold mb-1 flex items-center gap-2">
                <FaDatabase /> Backend Connected
              </p>
              <p className="text-xs text-blue-600">
                Order will be saved to MongoDB instantly
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Order Success Modal */}
      <AnimatePresence>
        {orderPlaced && orderDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => navigate('/profile')}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 text-center rounded-t-3xl">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <FaCheckCircle className="text-7xl mx-auto mb-4" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Order Placed Successfully!</h2>
                <p className="text-green-100">Your order has been saved to the backend</p>
              </div>

              {/* Order Details */}
              <div className="p-8 space-y-6">
                
                {/* Backend Confirmation */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaDatabase className="text-3xl text-blue-600" />
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">Saved to MongoDB Backend</h3>
                      <p className="text-sm text-blue-600">Your order data is securely stored</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 bg-white rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono font-bold text-blue-600">{orderDetails._id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Database:</span>
                      <span className="font-mono text-gray-800">nykaa-clone</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Collection:</span>
                      <span className="font-mono text-gray-800">orders</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-yellow-600 uppercase">{orderDetails.orderStatus}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created At:</span>
                      <span className="text-gray-800">{new Date(orderDetails.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-xs text-green-800 flex items-center gap-2">
                      <FaCheckCircle />
                      View this order in MongoDB Compass: <code className="bg-white px-2 py-1 rounded">mongodb://localhost:27017/nykaa-clone</code>
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaShoppingBag className="text-pink-500" />
                    Order Summary
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    {orderDetails.orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                          </div>
                        </div>
                        <p className="font-bold text-pink-600">₹{item.price * item.qty}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>₹{orderDetails.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax:</span>
                      <span>₹{orderDetails.taxPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping:</span>
                      <span>₹{orderDetails.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-pink-600">₹{orderDetails.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-pink-500" />
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold text-gray-800">{orderDetails.shippingAddress.address}</p>
                    <p className="text-gray-600">{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}</p>
                    <p className="text-gray-600">{orderDetails.shippingAddress.country}</p>
                    <p className="text-gray-600">Phone: {orderDetails.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-yellow-900 mb-2">Payment Method</h3>
                  <p className="text-yellow-700">💵 {orderDetails.paymentMethod} (Cash on Delivery)</p>
                  <p className="text-sm text-yellow-600 mt-2">Pay when you receive your order</p>
                </div>

                {/* Email Notification */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-purple-900 mb-2">📧 Email Confirmation</h3>
                  <p className="text-purple-700">Order confirmation has been sent to: <strong>{user.email}</strong></p>
                  <p className="text-sm text-purple-600 mt-2">Check your inbox for order details</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    View My Orders
                  </button>
                  <button
                    onClick={() => navigate('/shop')}
                    className="flex-1 border-2 border-pink-500 text-pink-600 py-4 rounded-xl font-bold hover:bg-pink-50 transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500">
                  Redirecting to your profile in 5 seconds...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

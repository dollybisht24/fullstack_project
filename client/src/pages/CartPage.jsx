import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCart, removeFromCart, updateCartItemQty } from '../store/slices/cartSlice'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FaShoppingBag, FaTrash, FaTruck, FaLock } from 'react-icons/fa'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cart = useSelector((s) => s.cart.items)
  const auth = useSelector((s) => s.auth)
  const authToken = auth.user?.token

  useEffect(() => {
    if (authToken) dispatch(getCart())
  }, [dispatch, authToken])

  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0)
  const tax = Math.round(subtotal * 0.11)
  const shipping = cart.length > 0 ? 9 : 0
  const total = subtotal + tax + shipping

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId))
    toast.success('Removed from bag')
  }

  const handleQtyChange = (productId, qty) => {
    if (qty < 1) return
    dispatch(updateCartItemQty({ productId, qty }))
  }

  const handleBuyNow = () => {
    if (cart.length === 0) {
      toast.error('Your bag is empty!')
      return
    }
    navigate('/checkout')
  }

  if (!authToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl">
          <FaShoppingBag className="text-6xl text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to view your bag</h2>
          <Link 
            to="/login" 
            className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
          >
            Login Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaShoppingBag className="text-pink-500" />
            Shopping Bag
          </h1>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your bag
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-2xl shadow-lg text-center"
              >
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Your bag is empty</h3>
                <p className="text-gray-600 mb-6">Start adding products to your bag!</p>
                <Link
                  to="/shop"
                  className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            ) : (
              cart.map((it, idx) => (
                <motion.div
                  key={it.product?._id || it.product}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all"
                >
                  {/* Product Image */}
                  <img 
                    src={it.product?.images?.[0] || 'https://via.placeholder.com/120'} 
                    alt={it.product?.name || 'Product'}
                    className="w-24 h-24 object-cover rounded-xl" 
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {it.product?.name || 'Product'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {it.product?.category || 'Makeup'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-pink-600">₹{it.price}</span>
                      <span className="text-sm text-gray-400">per item</span>
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
                    <button 
                      onClick={() => handleQtyChange(it.product?._id || it.product, it.qty - 1)} 
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow hover:bg-pink-500 hover:text-white transition-all font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg min-w-[30px] text-center">{it.qty}</span>
                    <button 
                      onClick={() => handleQtyChange(it.product?._id || it.product, it.qty + 1)} 
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow hover:bg-pink-500 hover:text-white transition-all font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Total</p>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{(it.qty * it.price).toFixed(2)}
                    </p>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => handleRemove(it.product?._id || it.product)} 
                    className="ml-4 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    title="Remove from bag"
                  >
                    <FaTrash />
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl sticky top-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Price Breakdown */}
              <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (11%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <FaTruck className="text-green-500" />
                    Shipping
                  </span>
                  <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-100">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-3xl font-bold text-pink-600">₹{total.toFixed(2)}</span>
              </div>

              {/* Buy Now Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 mb-4 ${
                  cart.length > 0
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaLock />
                Buy Now - Proceed to Checkout
              </motion.button>

              {/* Continue Shopping */}
              <Link
                to="/shop"
                className="block w-full text-center py-3 rounded-xl font-semibold text-pink-600 border-2 border-pink-200 hover:bg-pink-50 transition-all"
              >
                Continue Shopping
              </Link>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <FaLock />
                  <span className="font-semibold">100% Secure Checkout</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Your payment information is safe with us
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

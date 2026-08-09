import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function BagPopup({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const cartItems = useSelector((state) => state.cart.items)
  const bagItems = [
    {
      id: 1,
      name: 'Free Charlotte Tilbury Deluxe Matte Revolution Lipstick - Pillow Talk - Global',
      size: '1.1g',
      quantity: 1,
      price: 0,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Free Charlotte Tilbury Airbrush Flawless Setting Spray',
      size: '15ml',
      quantity: 1,
      price: 0,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Charlotte Tilbury Pillow Talk Icons On The Go',
      size: '4pcs',
      quantity: 2,
      price: 11500,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop'
    }
  ]

  const totalMRP = 11500
  const discount = 1265
  const shippingFee = 9
  const youPay = totalMRP - discount + shippingFee

  const handleProceed = () => {
    if (!user) {
      // If not logged in, redirect to login
      navigate('/login')
      onClose()
    } else {
      // If logged in, go to checkout
      navigate('/checkout')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'tween' }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl text-gray-800">Bag</h2>
                <p className="text-sm text-gray-600">4 items</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Login Banner - Only show if not logged in */}
              {!user && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-3">
                    Get Started & grab best offers!
                  </p>
                  <Link 
                    to="/login"
                    onClick={onClose}
                    className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Login / Register
                  </Link>
                </div>
              )}

              {/* User Info - Show if logged in */}
              {user && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    Welcome back, <span className="text-green-700 font-semibold">{user.name || user.email}!</span>
                  </p>
                </div>
              )}

              {/* Free Items */}
              <div className="mb-6">
                {bagItems.filter(item => item.price === 0).map((item) => (
                  <div key={item.id} className="flex gap-3 mb-4 pb-4 border-b border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 mb-1 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-600 mb-2">{item.size}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paid Items */}
              <div className="mb-6">
                {bagItems.filter(item => item.price > 0).map((item) => (
                  <div key={item.id} className="flex gap-3 mb-4 pb-4 border-b border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 mb-1">{item.name}</p>
                      <p className="text-xs text-gray-600 mb-2">{item.size}</p>
                      <p className="text-sm text-gray-800 mb-2">Quantity: {item.quantity}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-800">You Pay</p>
                        <p className="text-sm text-gray-500 line-through">₹{item.price}</p>
                        <p className="text-sm text-pink-600">₹{item.price - Math.floor(item.price * 0.11)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupons */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-800 mb-2">Coupons</p>
                <p className="text-xs text-gray-600 mb-3">Apply now and save extra!</p>
                <button className="text-sm text-pink-600 hover:underline">
                  View Coupons →
                </button>
              </div>

              {/* Price Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-base text-gray-800 mb-4">Price Details</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Bag MRP (4 items)</p>
                    <p className="text-sm text-gray-800">₹{totalMRP}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Discount</p>
                    <p className="text-sm text-green-600">-₹{discount}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Shipping and Platform Fee</p>
                    <p className="text-sm text-gray-800">₹{shippingFee}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mb-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-800">You Pay</p>
                    <p className="text-base text-gray-800">₹{youPay}</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <p className="text-xs text-green-700">
                    You are saving <span className="font-semibold">₹{discount}</span> on this order
                  </p>
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-base text-gray-800">Grand Total</p>
                  <p className="text-xl text-gray-800">₹{youPay}</p>
                </div>
              </div>

              {/* Proceed Button */}
              <button 
                onClick={handleProceed}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-lg text-lg hover:shadow-xl transition-all"
              >
                {user ? 'Proceed to Checkout' : 'Login to Proceed'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

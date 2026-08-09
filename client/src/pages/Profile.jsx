import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from '../utils/axios'
import { motion } from 'framer-motion'
import { FaBox, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa'

export default function Profile() {
  const auth = useSelector((s) => s.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!auth.user?.token) {
        setLoading(false)
        return
      }
      try {
        const res = await axios.get('/orders/myorders', { 
          headers: { Authorization: `Bearer ${auth.user.token}` } 
        })
        setOrders(res.data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetch()
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetch()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [auth.user?.token])

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <FaCheckCircle className="text-green-500" />
      case 'shipped': return <FaTruck className="text-blue-500" />
      case 'processing': return <FaBox className="text-yellow-500" />
      case 'cancelled': return <FaTimesCircle className="text-red-500" />
      default: return <FaBox className="text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!auth.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          My Profile
        </motion.h1>

        {/* User Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {auth.user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-800">{auth.user.name}</div>
              <div className="text-sm text-gray-600">{auth.user.email}</div>
              {auth.user.isAdmin && (
                <span className="inline-block mt-2 px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
              <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No orders yet</p>
              <p className="text-gray-500 text-sm mt-2">Start shopping to see your orders here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-2xl font-bold text-pink-600">₹{order.totalPrice}</div>
                      <div className="text-sm text-gray-600">{order.orderItems.length} item(s)</div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4 space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.qty} × ₹{item.price}</p>
                        </div>
                        <div className="font-semibold text-gray-800">
                          ₹{item.qty * item.price}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="border-t mt-4 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Shipping Address:</p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                        {order.shippingAddress.phone && ` • ${order.shippingAddress.phone}`}
                      </p>
                    </div>
                  )}

                  {/* Order Status */}
                  <div className="border-t mt-4 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getStatusIcon(order.orderStatus)}
                      <span>Payment: {order.paymentMethod}</span>
                      {order.isPaid && <span className="text-green-600">• Paid ✓</span>}
                    </div>
                    {order.isDelivered && (
                      <div className="text-sm text-green-600 font-semibold">
                        Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN')}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

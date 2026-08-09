import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from '../utils/axios'
import { motion } from 'framer-motion'
import { FaBox, FaUsers, FaShoppingBag, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa'

export default function AdminDashboard() {
  const auth = useSelector((s) => s.auth)
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview') // overview, orders, users

  useEffect(() => {
    const fetch = async () => {
      if (!auth.user?.token) return
      try {
        const [u, o, p] = await Promise.all([
          axios.get('/users', { headers: { Authorization: `Bearer ${auth.user.token}` } }),
          axios.get('/orders', { headers: { Authorization: `Bearer ${auth.user.token}` } }),
          axios.get('/products'),
        ])
        setUsers(u.data)
        setOrders(o.data)
        setProducts(p.data.products || p.data)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [auth.user?.token])

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${auth.user.token}` } }
      )
      // Refresh orders
      const { data } = await axios.get('/orders', { 
        headers: { Authorization: `Bearer ${auth.user.token}` } 
      })
      setOrders(data)
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

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

  if (!auth.user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl font-semibold">Access Denied</p>
          <p className="text-gray-600 mt-2">Admin access required</p>
        </div>
      </div>
    )
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Admin Dashboard
        </motion.h1>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Total Users</div>
                    <div className="text-3xl font-bold text-pink-600">{users.length}</div>
                  </div>
                  <FaUsers className="text-4xl text-pink-300" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Total Orders</div>
                    <div className="text-3xl font-bold text-blue-600">{orders.length}</div>
                  </div>
                  <FaBox className="text-4xl text-blue-300" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Total Products</div>
                    <div className="text-3xl font-bold text-purple-600">{products.length}</div>
                  </div>
                  <FaShoppingBag className="text-4xl text-purple-300" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Total Revenue</div>
                    <div className="text-3xl font-bold text-green-600">₹{totalRevenue}</div>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  selectedTab === 'overview'
                    ? 'bg-pink-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('orders')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  selectedTab === 'orders'
                    ? 'bg-pink-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setSelectedTab('users')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  selectedTab === 'users'
                    ? 'bg-pink-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Users ({users.length})
              </button>
            </div>

            {/* Overview Tab */}
            {selectedTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Orders</h2>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex justify-between items-center border-b pb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {order.user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-pink-600">₹{order.totalPrice}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link 
                      to="/shop" 
                      className="block w-full bg-pink-100 text-pink-800 p-4 rounded-lg hover:bg-pink-200 transition text-center font-semibold"
                    >
                      View All Products
                    </Link>
                    <button 
                      onClick={() => setSelectedTab('orders')}
                      className="w-full bg-blue-100 text-blue-800 p-4 rounded-lg hover:bg-blue-200 transition font-semibold"
                    >
                      Manage Orders
                    </button>
                    <button 
                      onClick={() => setSelectedTab('users')}
                      className="w-full bg-purple-100 text-purple-800 p-4 rounded-lg hover:bg-purple-200 transition font-semibold"
                    >
                      View Users
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Orders Tab */}
            {selectedTab === 'orders' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Orders</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-xl p-4 hover:shadow-md transition">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Customer: {order.user?.name} ({order.user?.email})
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="text-right mt-2 md:mt-0">
                          <p className="text-2xl font-bold text-pink-600">₹{order.totalPrice}</p>
                          <p className="text-sm text-gray-600">{order.orderItems.length} items</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        {getStatusIcon(order.orderStatus)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">
                          Payment: {order.paymentMethod} {order.isPaid && '✓'}
                        </span>
                      </div>

                      {/* Update Status */}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => updateOrderStatus(order._id, 'processing')}
                          className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm hover:bg-yellow-200 transition"
                        >
                          Mark Processing
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'shipped')}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition"
                        >
                          Mark Shipped
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'delivered')}
                          className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition"
                        >
                          Mark Delivered
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'cancelled')}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200 transition"
                        >
                          Cancel Order
                        </button>
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          <strong>Ship to:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                          {order.shippingAddress.phone && ` • ${order.shippingAddress.phone}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Users Tab */}
            {selectedTab === 'users' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Users</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((user) => (
                    <div key={user._id} className="border rounded-xl p-4 hover:shadow-md transition">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.isAdmin && (
                            <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

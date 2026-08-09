import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function OrderCard({ order }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-600">Order ID</p>
          <p className="font-mono text-sm font-medium text-gray-900">
            {order._id?.slice(-8).toUpperCase()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus || 'pending')}`}>
          {(order.orderStatus || 'pending').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600">Order Date</p>
          <p className="text-sm font-medium text-gray-900">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Total Amount</p>
          <p className="text-sm font-medium text-gray-900">
            ₹{order.totalPrice?.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-2">Items ({order.orderItems?.length || 0})</p>
        <div className="flex gap-2 overflow-x-auto">
          {order.orderItems?.slice(0, 3).map((item, index) => (
            <img
              key={index}
              src={item.image || 'https://via.placeholder.com/60'}
              alt={item.name}
              className="w-12 h-12 object-cover rounded border border-gray-200"
            />
          ))}
          {order.orderItems?.length > 3 && (
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded border border-gray-200 text-xs font-medium text-gray-600">
              +{order.orderItems.length - 3}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/order/${order._id}`}
          className="flex-1 text-center bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
        >
          View Details
        </Link>
        {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            Track Order
          </button>
        )}
      </div>

      {order.isPaid && (
        <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Payment Completed</span>
        </div>
      )}
    </motion.div>
  )
}

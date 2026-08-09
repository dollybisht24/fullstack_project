import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

export default function ProductCard({ p }) {
  const dispatch = useDispatch()
  const wishlist = useSelector((s) => s.wishlist.items)
  const [isHovered, setIsHovered] = useState(false)
  
  const isInWishlist = wishlist.some(item => item.product === p._id || item._id === p._id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({ productId: p._id, qty: 1 }))
    toast.success('Added to cart!')
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    if (isInWishlist) {
      dispatch(removeFromWishlist(p._id))
      toast.info('Removed from wishlist')
    } else {
      dispatch(addToWishlist(p._id))
      toast.success('Added to wishlist!')
    }
  }

  const getRatingStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      )
    }
    return stars
  }

  return (
    <Link to={`/product/${p._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative"
      >
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
        >
          <svg
            className={`w-5 h-5 ${isInWishlist ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`}
            fill={isInWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Discount Badge */}
        {p.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {p.discount}% OFF
          </div>
        )}

        {/* Product Image */}
        <div className="relative h-64 bg-gray-50 overflow-hidden">
          <img
            src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Add to Cart Button on Hover */}
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleAddToCart}
              className="absolute bottom-2 left-2 right-2 bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition"
            >
              Add to Cart
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          {p.brand && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {p.brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-medium text-sm text-gray-800 mb-2 line-clamp-2 h-10">
            {p.name}
          </h3>

          {/* Rating */}
          {p.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex text-xs">
                {getRatingStars(p.rating)}
              </div>
              <span className="text-xs text-gray-500">
                ({p.numReviews || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{p.price}
            </span>
            {p.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{p.originalPrice}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {p.countInStock === 0 && (
            <p className="text-xs text-red-500 mt-2">Out of Stock</p>
          )}
          {p.countInStock > 0 && p.countInStock < 5 && (
            <p className="text-xs text-orange-500 mt-2">Only {p.countInStock} left!</p>
          )}
        </div>
      </motion.div>
    </Link>
  )
}

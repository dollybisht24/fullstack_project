import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from '../utils/axios'
import { motion } from 'framer-motion'

export default function ReviewForm({ productId, onReviewAdded }) {
  const { user } = useSelector(state => state.auth)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState([''])
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to write a review')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a comment')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(`/reviews/${productId}`, {
        rating,
        comment,
        images: images.map((image) => image.trim()).filter(Boolean),
      })
      
      toast.success('Review added successfully!')
      setComment('')
      setRating(5)
      setImages([''])
      onReviewAdded && onReviewAdded(data.review)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Please login to write a review</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-3xl focus:outline-none transition-colors"
              >
                <span
                  className={
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            placeholder="Share your thoughts about this product..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Images
          </label>
          <div className="space-y-2">
            {images.map((image, index) => (
              <input
                key={index}
                type="url"
                value={image}
                onChange={(e) => {
                  const nextImages = [...images]
                  nextImages[index] = e.target.value
                  setImages(nextImages)
                }}
                placeholder="Paste an image URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            ))}
          </div>
          <div className="flex gap-3 mt-2">
            {images.length < 4 && (
              <button type="button" onClick={() => setImages([...images, ''])} className="text-sm font-semibold text-pink-600">
                Add image
              </button>
            )}
            {images.length > 1 && (
              <button type="button" onClick={() => setImages(images.slice(0, -1))} className="text-sm font-semibold text-gray-500">
                Remove image
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </motion.div>
  )
}

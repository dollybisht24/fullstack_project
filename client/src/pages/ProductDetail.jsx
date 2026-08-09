import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner.jsx'
import axios from '../utils/axios'
import { formatDistanceToNow } from 'date-fns'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const product = useSelector((s) => s.products.selected)
  const auth = useSelector((s) => s.auth)
  const wishlist = useSelector((s) => s.wishlist.items)

  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewImages, setReviewImages] = useState([''])
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [sortBy, setSortBy] = useState('recent') // 'recent' or 'topRated'
  const [selectedImage, setSelectedImage] = useState(0)

  const authToken = auth.user?.token
  const isInWishlist = wishlist.some((p) => p._id === id)

  useEffect(() => {
    dispatch(fetchProductById(id))
    fetchReviews()
  }, [dispatch, id])

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true)
      const { data } = await axios.get(`/reviews/${id}`)
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleAddToCart = () => {
    if (!authToken) {
      toast.error('Please login to add to cart')
      return
    }
    dispatch(addToCart({ productId: product._id, qty: 1 }))
    toast.success('Added to cart!')
  }

  const handleWishlistToggle = () => {
    if (!authToken) {
      toast.error('Please login to manage wishlist')
      return
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id))
      toast.success('Removed from wishlist')
    } else {
      dispatch(addToWishlist(product._id))
      toast.success('Added to wishlist!')
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!authToken) {
      toast.error('Please login to submit a review')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a comment')
      return
    }

    try {
      setSubmittingReview(true)
      const images = reviewImages.map((image) => image.trim()).filter(Boolean)
      const { data } = await axios.post(`/reviews/${id}`, { rating, comment, images })
      toast.success('Review submitted successfully!')
      setComment('')
      setRating(5)
      setReviewImages([''])
      fetchReviews()
      dispatch(fetchProductById(id)) // Refresh product to update average rating
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const renderStars = (rating, interactive = false, onHover = null, onClick = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition' : ''} ${
              star <= (interactive ? (hoveredRating || rating) : rating)
                ? 'text-yellow-500'
                : 'text-gray-300'
            }`}
            onMouseEnter={() => interactive && onHover && onHover(star)}
            onMouseLeave={() => interactive && onHover && onHover(0)}
            onClick={() => interactive && onClick && onClick(star)}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  const getSortedReviews = () => {
    if (sortBy === 'topRated') {
      return [...reviews].sort((a, b) => b.rating - a.rating)
    }
    return [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  if (!product) return <Spinner />

  const sortedReviews = getSortedReviews()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Details Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="mb-4">
            <img 
              src={product.images && product.images[selectedImage] ? product.images[selectedImage] : 'https://via.placeholder.com/500'} 
              alt={product.name} 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === idx ? 'border-pink-600' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-3 text-lg">{product.brand}</p>
          
          {/* Average Rating */}
          <div className="flex items-center gap-3 mb-4 bg-yellow-50 p-3 rounded-lg inline-flex">
            <div className="flex text-yellow-500 text-xl">
              {renderStars(Math.round(product.rating || 0))}
            </div>
            <span className="font-semibold text-lg">
              {(product.rating || 0).toFixed(1)}
            </span>
            <span className="text-gray-600">
              ({product.numReviews || 0} {product.numReviews === 1 ? 'Review' : 'Reviews'})
            </span>
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>
          
          <div className="text-pink-600 font-bold text-3xl mb-6">₹{product.price}</div>
          
          <div className="flex gap-3 mb-4">
            <button 
              onClick={handleAddToCart} 
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleWishlistToggle} 
              className={`px-6 py-3 rounded-lg border-2 text-2xl transition ${
                isInWishlist 
                  ? 'bg-pink-100 border-pink-600 text-pink-600' 
                  : 'border-gray-300 hover:border-pink-600'
              }`}
            >
              {isInWishlist ? '♥' : '♡'}
            </button>
          </div>
          
          <div className="text-sm">
            {product.countInStock > 0 ? (
              <span className="text-green-600 font-semibold">✓ In Stock ({product.countInStock} available)</span>
            ) : (
              <span className="text-red-600 font-semibold">✗ Out of Stock</span>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews & Ratings</h2>

        {/* Write a Review Form */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          {authToken ? (
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                {renderStars(
                  rating,
                  true,
                  setHoveredRating,
                  setRating
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows="4"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Review Images</label>
                <div className="space-y-2">
                  {reviewImages.map((image, index) => (
                    <input
                      key={index}
                      type="url"
                      value={image}
                      onChange={(e) => {
                        const nextImages = [...reviewImages]
                        nextImages[index] = e.target.value
                        setReviewImages(nextImages)
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Paste an image URL from your product experience"
                    />
                  ))}
                </div>
                <div className="flex gap-3 mt-3">
                  {reviewImages.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setReviewImages([...reviewImages, ''])}
                      className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                    >
                      Add another image
                    </button>
                  )}
                  {reviewImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setReviewImages(reviewImages.slice(0, -1))}
                      className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <p className="text-gray-600">
              Please <a href="/login" className="text-pink-600 font-semibold hover:underline">login</a> to write a review.
            </p>
          )}
        </div>

        {/* Sort & Filter */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">
            All Reviews ({reviews.length})
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="topRated">Top Rated</option>
          </select>
        </div>

        {/* Reviews List */}
        {loadingReviews ? (
          <div className="text-center py-8">
            <Spinner />
          </div>
        ) : sortedReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{review.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-yellow-500">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                {review.images?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {review.images.map((image, index) => (
                      <img
                        key={`${review._id}-image-${index}`}
                        src={image}
                        alt={`${review.name} review ${index + 1}`}
                        className="h-28 w-full rounded-lg object-cover border border-gray-200"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

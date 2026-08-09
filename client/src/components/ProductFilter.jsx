import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, fetchCategories, fetchBrands } from '../store/slices/productSlice'
import { motion } from 'framer-motion'

export default function ProductFilter({ onFilterChange }) {
  const dispatch = useDispatch()
  const { filters, categories, brands } = useSelector(state => state.products)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchBrands())
  }, [dispatch])

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value }
    dispatch(setFilters(newFilters))
    onFilterChange && onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      keyword: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'newest',
    }
    dispatch(setFilters(clearedFilters))
    onFilterChange && onFilterChange(clearedFilters)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-pink-600 hover:text-pink-700"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Category</h4>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Brand</h4>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === String(rating)}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="mr-2 text-pink-600 focus:ring-pink-500"
              />
              <div className="flex items-center">
                {[...Array(rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                {[...Array(5 - rating)].map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
                <span className="ml-1 text-sm text-gray-600">& above</span>
              </div>
            </label>
          ))}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="rating"
              value=""
              checked={filters.rating === ''}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="mr-2 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm text-gray-600">All Ratings</span>
          </label>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Sort By</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </motion.div>
  )
}

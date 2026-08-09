import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../store/slices/productSlice'
import ProductCard from '../components/ProductCard'
import ProductFilter from '../components/ProductFilter'
import Spinner from '../components/Spinner'
import { motion } from 'framer-motion'
import { useProductSearch, getMakeupBrands } from '../hooks/useMakeupProducts'
import { FaSearch, FaSlidersH, FaStar } from 'react-icons/fa'

const makeupCollection = [
  {
    _id: 'makeup-bridal-glow',
    name: 'Bridal Glow Face Kit',
    brand: 'Meenakshi Makeover',
    category: 'Face',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    rating: 4.9,
    numReviews: 128,
    countInStock: 12,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'makeup-lip-luxe',
    name: 'Velvet Matte Lip Collection',
    brand: 'Nykaa',
    category: 'Lips',
    price: 799,
    originalPrice: 1099,
    discount: 27,
    rating: 4.7,
    numReviews: 96,
    countInStock: 20,
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'makeup-eye-edit',
    name: 'Soft Glam Eye Palette',
    brand: 'Maybelline',
    category: 'Eyes',
    price: 999,
    originalPrice: 1399,
    discount: 29,
    rating: 4.8,
    numReviews: 144,
    countInStock: 15,
    images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'makeup-skin-prep',
    name: 'Dewy Skin Prep Essentials',
    brand: 'Lakme',
    category: 'Skin',
    price: 1499,
    originalPrice: 2099,
    discount: 28,
    rating: 4.6,
    numReviews: 83,
    countInStock: 9,
    images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'makeup-pro-base',
    name: 'HD Base and Conceal Set',
    brand: 'MAC',
    category: 'Face',
    price: 1799,
    originalPrice: 2399,
    discount: 25,
    rating: 4.9,
    numReviews: 117,
    countInStock: 7,
    images: ['https://images.unsplash.com/photo-1631214524020-789f3f8378c2?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'makeup-nail-studio',
    name: 'Gloss Finish Nail Studio',
    brand: 'SUGAR',
    category: 'Nails',
    price: 599,
    originalPrice: 899,
    discount: 33,
    rating: 4.5,
    numReviews: 61,
    countInStock: 18,
    images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80'],
  },
]

function CollectionCard({ product }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition hover:shadow-xl"
    >
      <div className="relative h-60 overflow-hidden bg-pink-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-pink-600 shadow">
          {product.discount}% OFF
        </span>
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-pink-500">{product.brand}</p>
        <h3 className="min-h-10 text-sm font-semibold leading-5 text-gray-900">{product.name}</h3>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 font-semibold text-yellow-700">
            <FaStar className="text-xs" /> {product.rating}
          </span>
          <span className="text-gray-500">({product.numReviews} reviews)</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-950">₹{product.price}</span>
          <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-gradient-to-r from-pink-600 to-rose-500 py-3 text-sm font-bold text-white transition hover:shadow-lg"
        >
          View Makeup Collection
        </button>
      </div>
    </motion.article>
  )
}

export default function Products() {
  const dispatch = useDispatch()
  const { items: products, status } = useSelector((s) => s.products)
  const [searchParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    rating: '',
    sortBy: 'createdAt',
    order: 'desc'
  })

  const category = searchParams.get('category')
  const { results: searchResults, loading: searchLoading } = useProductSearch(q, {
    ...filters,
    category
  })

  useEffect(() => {
    if (!q) {
      dispatch(fetchProducts(category ? { category } : {}))
    }
  }, [dispatch, q, category])

  const brands = getMakeupBrands()

  const filteredCollection = useMemo(() => {
    const term = q.trim().toLowerCase()
    return makeupCollection
      .filter((product) => !category || product.category.toLowerCase() === category.toLowerCase())
      .filter((product) => !term || `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(term))
      .filter((product) => !filters.brand || product.brand.toLowerCase() === filters.brand.toLowerCase())
      .filter((product) => !filters.rating || product.rating >= Number(filters.rating))
      .filter((product) => !filters.minPrice || product.price >= Number(filters.minPrice))
      .filter((product) => !filters.maxPrice || product.price <= Number(filters.maxPrice))
      .sort((a, b) => {
        if (filters.sortBy === 'price') return a.price - b.price
        if (filters.sortBy === '-price') return b.price - a.price
        if (filters.sortBy === '-rating') return b.rating - a.rating
        return b.numReviews - a.numReviews
      })
  }, [category, filters, q])

  const displayProducts = q ? searchResults : products
  const showCuratedCollection = displayProducts.length === 0
  const shownCount = showCuratedCollection ? filteredCollection.length : displayProducts.length
  const pageTitle = category ? `${category} Makeup` : 'Makeup Collection'
  const isLoading = status === 'loading' || searchLoading

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Header */}
        <section className="relative mb-8 min-h-[460px] overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-sm">
          <div className="absolute -left-8 top-8 hidden h-72 w-28 -rotate-12 rounded-full bg-orange-200/70 lg:block" />
          <div className="absolute bottom-8 left-1/2 hidden h-20 w-20 rounded-full bg-rose-100 lg:block" />
          <div className="grid min-h-[460px] items-center lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative z-10 px-6 py-10 md:px-12 lg:px-16">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-pink-600">Radiant skin essentials</p>
              <h1 className="max-w-xl text-4xl font-black leading-[0.95] tracking-tight text-gray-950 md:text-6xl">
                Elevate Your Beauty Ritual
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-gray-700 md:text-base">
                Glow from within with our curated makeup collection. From luminous base products to soft glam palettes, shop essentials made for bridal looks, party makeup, and everyday radiance.
              </p>
              <button
                type="button"
                onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-8 rounded-md bg-purple-950 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-pink-700"
              >
                Shop Now
              </button>

              <div className="mt-8 flex items-end gap-5">
                <img
                  src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=220&q=80"
                  alt="Serum bottle"
                  className="h-24 w-16 rounded-lg object-cover shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=260&q=80"
                  alt="Makeup products"
                  className="h-20 w-24 rounded-lg object-cover shadow-md"
                />
                <div className="hidden h-10 w-20 rounded-full bg-stone-200 shadow-inner sm:block" />
              </div>
            </div>

            <div className="relative min-h-[360px] self-stretch lg:min-h-[460px]">
              <div className="absolute right-4 top-6 h-[86%] w-[72%] rounded-l-full bg-emerald-50" />
              <img
                src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1100&q=80"
                alt="Beauty ritual model"
                className="absolute bottom-0 right-0 h-full w-[86%] object-cover object-center"
              />
              <img
                src="https://images.unsplash.com/photo-1614859529896-9adf73ccebe9?auto=format&fit=crop&w=500&q=80"
                alt="Green botanical accent"
                className="absolute right-[38%] top-10 hidden h-48 w-40 rotate-6 rounded-full object-cover opacity-90 mix-blend-multiply lg:block"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Price Filter */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <h3 className="mb-4 font-bold text-gray-900">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <h3 className="mb-4 font-bold text-gray-900">Brand</h3>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">All Brands</option>
                  {[...new Set([...brands, ...makeupCollection.map((product) => product.brand)])].map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <h3 className="mb-4 font-bold text-gray-900">Rating</h3>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">All Ratings</option>
                  <option value="4">4★ & above</option>
                  <option value="3">3★ & above</option>
                  <option value="2">2★ & above</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <h3 className="mb-4 font-bold text-gray-900">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-pink-500"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Rating: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div id="products-grid" className="flex-1 scroll-mt-24">
            {/* Search & Filter Toggle - Mobile */}
            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 focus:border-transparent focus:ring-2 focus:ring-pink-500"
                    placeholder="Search lipstick, base, palette..."
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white hover:bg-pink-700"
                  aria-label="Toggle filters"
                >
                  <FaSlidersH />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between px-1 text-sm text-gray-600">
                <span>
                  Showing <strong className="text-gray-900">{shownCount}</strong> {shownCount === 1 ? 'item' : 'items'}
                </span>
                {showCuratedCollection && (
                  <span className="rounded-full bg-pink-50 px-3 py-1 font-semibold text-pink-700">
                    Makeup collection preview
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 bg-white rounded-lg shadow-lg p-4">
                <ProductFilter />
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="py-16">
                <Spinner />
              </div>
            ) : showCuratedCollection ? (
              filteredCollection.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-10 text-center">
                  <h3 className="text-xl font-bold text-gray-900">No matching makeup found</h3>
                  <p className="mt-2 text-gray-600">Clear one filter or search another beauty product.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCollection.map((product) => (
                    <CollectionCard key={product._id} product={product} />
                  ))}
                </div>
              )
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {displayProducts.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

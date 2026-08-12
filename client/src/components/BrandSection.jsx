import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PEXELS_API_KEY = 'WbyFQmelodpE6HGkwGbAe2HLBHXyBaJ9aqk6pG1OkPXe4Wm43PQWq2yi' // Free public key

export default function BrandSection() {
  const [activeTab, setActiveTab] = useState('luxe')
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'luxe', label: 'Luxe', query: 'luxury beauty brands' },
    { id: 'nykaa', label: 'Only at Nykaa', query: 'nykaa cosmetics exclusive' },
    { id: 'new', label: 'New Launches', query: 'new beauty products 2024' }
  ]

  useEffect(() => {
    fetchBrands(activeTab)
  }, [activeTab])

  const fetchBrands = async (tabId) => {
    const cacheKey = `brands_${tabId}`
    const cached = sessionStorage.getItem(cacheKey)
    
    if (cached) {
      setBrands(JSON.parse(cached))
      return
    }

    setLoading(true)
    const tab = tabs.find(t => t.id === tabId)
    
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(tab.query)}&per_page=12&orientation=square`,
        {
          headers: {
            Authorization: PEXELS_API_KEY
          }
        }
      )
      
      const data = await response.json()
      const photos = data.photos || []
      let brandData = photos.map((photo, idx) => ({
        id: photo.id,
        image: photo.src.medium,
        name: generateBrandName(tabId, idx),
        photographer: photo.photographer
      }))

      // Fallback in case Pexels API fails (e.g. 401 Unauthorized or rate limited)
      if (brandData.length === 0) {
        const fallbacks = [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=500',
          'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=500',
          'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=500',
          'https://images.unsplash.com/photo-1526045431048-f857369aba09?w=500',
        ]
        brandData = Array.from({ length: 12 }).map((_, idx) => ({
          id: `fallback-${tabId}-${idx}`,
          image: fallbacks[idx % fallbacks.length],
          name: generateBrandName(tabId, idx),
          photographer: 'Unsplash'
        }))
      }
      
      setBrands(brandData)
      sessionStorage.setItem(cacheKey, JSON.stringify(brandData))
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateBrandName = (tabId, idx) => {
    const luxeBrands = ['Estée Lauder', 'Lancôme', 'SK-II', 'La Mer', 'Dior', 'Chanel', 'Tom Ford', 'Giorgio Armani', 'YSL', 'Charlotte Tilbury', 'Pat McGrath', 'Huda Beauty']
    const nykaaBrands = ['Nykaa Naturals', 'Nykaa Cosmetics', 'Kay Beauty', 'Nykaa Skin', 'Nykaa Wanderlust', 'Twenty Dresses', 'Nykaa Fashion', 'Dot & Key', 'Earth Rhythm', 'Plum', 'mCaffeine', 'The Face Shop']
    const newBrands = ['Rare Beauty', 'Rhode Skin', 'Fenty Skin', 'Haus Labs', 'Florence by Mills', 'ILIA Beauty', 'Tower 28', 'Jones Road', 'Saie', 'Merit Beauty', 'Kosas', 'Glossier']
    
    if (tabId === 'luxe') return luxeBrands[idx] || `Luxury Brand ${idx + 1}`
    if (tabId === 'nykaa') return nykaaBrands[idx] || `Nykaa Brand ${idx + 1}`
    return newBrands[idx] || `New Brand ${idx + 1}`
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-2 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Brand Cards Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500">Loading brands...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {brands.map((brand, idx) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-1">
                      {brand.name}
                    </h3>
                    <button className="bg-white text-pink-600 text-xs font-semibold py-2 px-4 rounded-lg hover:bg-pink-600 hover:text-white transition-colors duration-200">
                      Shop Now
                    </button>
                  </div>

                  {/* Brand Name Below (Mobile) */}
                  <div className="p-3 md:hidden">
                    <p className="text-xs font-medium text-gray-700 text-center line-clamp-1">
                      {brand.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Link */}
        {!loading && brands.length > 0 && (
          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors">
              View All Brands
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

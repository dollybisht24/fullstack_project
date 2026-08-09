import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function MegaDropdown({ category, data, onClose }) {
  if (!data) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 right-0 top-[160px] bg-white shadow-2xl z-[100] border-t border-gray-100 overflow-hidden"
      style={{ maxHeight: 'calc(100vh - 180px)' }}
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-6 py-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="grid grid-cols-5 gap-8">
          {/* Main Sections (3 columns) */}
          <div className="col-span-3">
            <div className="grid grid-cols-3 gap-6">
              {data.sections?.map((section, index) => (
                <div key={index} className="space-y-3 overflow-hidden">
                  <h3 className="font-bold text-gray-900 text-base mb-3 pb-2 border-b border-pink-100 whitespace-nowrap overflow-hidden text-ellipsis">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items?.map((item, idx) => (
                      <li key={idx} className="overflow-hidden">
                        <Link
                          to={`/products?category=${category}&subcategory=${item}`}
                          onClick={onClose}
                          className="text-sm text-gray-600 hover:text-pink-600 hover:underline transition-colors block py-1 whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Sections (2 columns) */}
          <div className="col-span-2 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 overflow-hidden">
            {data.featured && Object.entries(data.featured).map(([title, items], index) => (
              <div key={index} className="mb-6 last:mb-0 overflow-hidden">
                <h3 className="font-bold text-gray-900 text-base mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {items.map((item, idx) => (
                    <li key={idx} className="overflow-hidden">
                      <Link
                        to={`/products?category=${category}&brand=${item}`}
                        onClick={onClose}
                        className="text-sm text-gray-600 hover:text-pink-600 hover:underline transition-colors block py-1 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

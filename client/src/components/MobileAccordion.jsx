import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'

export default function MobileAccordion({ category, data, onNavigate }) {
  const [expandedSection, setExpandedSection] = useState(null)

  if (!data) return null

  return (
    <div className="space-y-2">
      {data.sections?.map((section, index) => (
        <div key={index} className="border-b border-gray-100">
          <button
            onClick={() => setExpandedSection(expandedSection === index ? null : index)}
            className="flex justify-between items-center w-full py-3 text-left"
          >
            <span className="font-semibold text-gray-800 text-sm">{section.title}</span>
            <FaChevronDown
              className={`text-xs text-gray-500 transition-transform ${
                expandedSection === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          <AnimatePresence>
            {expandedSection === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ul className="space-y-1 pb-3 pl-2">
                  {section.items?.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        to={`/products?category=${category}&subcategory=${item}`}
                        onClick={onNavigate}
                        className="block py-2 text-sm text-gray-600 hover:text-pink-600"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

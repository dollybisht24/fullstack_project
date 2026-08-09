import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaInstagram, FaFacebookF, FaYoutube, FaTwitter, FaPinterestP, FaTruck, FaUndoAlt, FaCheckCircle } from 'react-icons/fa'

export default function Footer() {
  const whoWeAre = [
    'About Us', 'Careers', 'Authenticity', 'Press', 'Testimonials', 
    'CSR', 'Sustainability', 'Responsible Disclosure', 'Investor Relations', 'Smart ODR Link'
  ]

  const help = [
    'Contact Us', 'FAQs', 'Store Locator', 'Cancellations & Returns', 
    'Shipping & Delivery', 'Sell on Nykaa'
  ]

  const inspireMe = ['Beauty Book', 'Games Board', 'Buying Guides']

  const quickLinks = [
    'Offer Zone', 'New Launches', 'Nykaa Man', 'Nykaa Fashion', 
    'Nykaa Pro', 'Sitemap'
  ]

  const topCategories = [
    'Makeup', 'Skin', 'Hair', 'Bath & Body', 'Appliances', 
    'Mom & Baby', 'Health & Wellness', 'Fragrance', 'Natural', 'Luxe'
  ]

  const popularSearches = [
    'Lipstick', 'Highlighter', 'Hair Serum', 'Concealer', 'Face Mask', 'BB Cream', 
    'Perfume for Women', 'Eyeshadow Palette', 'Night Cream', 'Sunscreen', 'Face Wash', 
    'Foundation', 'Hair Color', 'Makeup Pouch', 'Body Mist', 'Shower Gel', 'Toner', 
    'Cleanser', 'Face Scrub', 'Multivitamin Tablets', 'Moisturizers', 'Hair Extensions', 
    'Biotin Tablets', 'Face Serum', 'Kajal', 'Mascara', 'Eyeliner', 'Nail Polish'
  ]

  const socialLinks = [
    { icon: FaInstagram, url: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: FaFacebookF, url: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: FaYoutube, url: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-600' },
    { icon: FaTwitter, url: 'https://twitter.com', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: FaPinterestP, url: 'https://pinterest.com', label: 'Pinterest', color: 'hover:text-red-500' }
  ]

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-t border-gray-200"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="text-sm font-bold uppercase text-[#e91e63] mb-4 tracking-wide">
              Who We Are
            </h3>
            <ul className="space-y-2">
              {whoWeAre.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-[#555555] hover:text-[#e91e63] hover:underline transition-all duration-300 ease-in-out block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase text-[#e91e63] mb-4 tracking-wide">
              Help
            </h3>
            <ul className="space-y-2">
              {help.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-[#555555] hover:text-[#e91e63] hover:underline transition-all duration-300 ease-in-out block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase text-[#e91e63] mb-4 tracking-wide">
              Inspire Me
            </h3>
            <ul className="space-y-2">
              {inspireMe.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-[#555555] hover:text-[#e91e63] hover:underline transition-all duration-300 ease-in-out block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase text-[#e91e63] mb-4 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-[#555555] hover:text-[#e91e63] hover:underline transition-all duration-300 ease-in-out block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase text-[#e91e63] mb-4 tracking-wide">
              Top Categories
            </h3>
            <ul className="space-y-2">
              {topCategories.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/products?category=${item}`}
                    className="text-sm text-[#555555] hover:text-[#e91e63] hover:underline transition-all duration-300 ease-in-out block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-y border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center justify-center gap-3 text-center">
              <FaTruck className="text-3xl text-[#e91e63]" aria-hidden="true" />
              <span className="text-sm font-medium text-[#555555]">
                Free Shipping on Orders Above ₹299
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-center">
              <FaUndoAlt className="text-3xl text-[#e91e63]" aria-hidden="true" />
              <span className="text-sm font-medium text-[#555555]">
                Easy 15-Day Returns
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-center">
              <FaCheckCircle className="text-3xl text-[#e91e63]" aria-hidden="true" />
              <span className="text-sm font-medium text-[#555555]">
                100% Authentic Products
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-[#555555] italic">
              Featuring <span className="font-bold text-[#e91e63]">1900+ Trusted Brands</span> & <span className="font-bold text-[#e91e63]">1.2 Lakh+ Products</span>
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h3 className="text-lg font-bold text-[#e91e63] mb-4 flex items-center justify-center gap-2">
            <span>❤️</span>
            <span>Follow Us on Social Media</span>
          </h3>
          <div className="flex items-center justify-center gap-6">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`text-2xl text-gray-600 ${social.color} transition-all duration-300 ease-in-out`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <social.icon />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h3 className="text-sm font-bold uppercase text-[#e91e63] mb-4 tracking-wide text-center">
            Popular Searches
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {popularSearches.map((search, idx) => (
              <Link
                key={idx}
                to={`/products?search=${search.toLowerCase()}`}
                className="text-xs px-3 py-1.5 bg-white text-[#555555] rounded-full border border-gray-200 hover:border-[#e91e63] hover:text-[#e91e63] hover:shadow-sm transition-all duration-300 ease-in-out whitespace-nowrap"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs text-[#555555]">
            <Link to="/terms" className="hover:text-[#e91e63] hover:underline transition-all duration-300">
              Terms & Conditions
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/shipping-policy" className="hover:text-[#e91e63] hover:underline transition-all duration-300">
              Shipping Policy
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/cancellation-policy" className="hover:text-[#e91e63] hover:underline transition-all duration-300">
              Cancellation Policy
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/privacy-policy" className="hover:text-[#e91e63] hover:underline transition-all duration-300">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center text-xs text-[#555555]">
            <p>© 2025 NYKAA E-RETAIL LIMITED. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

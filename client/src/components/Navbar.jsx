import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import SearchBar from './SearchBar'
import MegaDropdown from './MegaDropdown'
import MobileAccordion from './MobileAccordion'
import BrandSection from './BrandSection'
import BagPopup from './BagPopup'
import { categoriesData } from '../data/categoriesData'
import { AnimatePresence } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'

export default function Navbar() {
  const cart = useSelector((s) => s.cart.items)
  const wishlist = useSelector((s) => s.wishlist.items)
  const auth = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showBagPopup, setShowBagPopup] = useState(false)

  // Handle scroll for sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  const categories = Object.keys(categoriesData)

  return (
    <>
    <nav className={`bg-white sticky top-0 z-50 transition-shadow ${isScrolled ? 'shadow-md' : 'shadow-sm'}`} style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      {/* Top Bar */}
      <div className="bg-pink-600 text-white py-1 text-xs">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <span>💝 Free Shipping on orders above ₹499</span>
          </div>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:underline">Get App</Link>
            <span>|</span>
            <Link to="/stores" className="hover:underline">Store & Events</Link>
            <span>|</span>
            <Link to="/help" className="hover:underline">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
              Nykaa
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Account */}
            {auth.user ? (
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-pink-600 cursor-pointer">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden lg:block text-sm">{auth.user.name?.split(' ')[0]}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 hidden group-hover:block z-[9999]">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-pink-50 transition-colors">My Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-pink-50 transition-colors">My Orders</Link>
                  {auth.user.isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-pink-50 text-purple-600 transition-colors">Admin Panel</Link>
                  )}
                  <hr className="my-2" />
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 cursor-pointer transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1 hover:text-pink-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden lg:block text-sm">Sign In</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="relative hover:text-pink-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Owner Profile Icon */}
            <Link 
              to="/owner-profile" 
              className="relative hover:text-pink-600" 
              title="Meet Meenakshi"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>

            {/* Cart/Bag */}
            <button 
              onClick={() => setShowBagPopup(true)} 
              className="relative hover:text-pink-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mt-3">
          <SearchBar />
        </div>
      </div>

      {/* Categories Bar - Professional Design */}
      <div className="hidden md:block bg-white border-t border-gray-100 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 py-3">
            {categories.map((cat) => (
              <div
                key={cat}
                className="relative"
                onMouseEnter={() => setActiveDropdown(cat)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors py-2">
                  {cat}
                  <FaChevronDown className="text-xs" />
                </button>

                {/* Mega Dropdown */}
                <AnimatePresence>
                  {activeDropdown === cat && (
                    <MegaDropdown
                      category={cat}
                      data={categoriesData[cat]}
                      onClose={() => setActiveDropdown(null)}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link to="/shop" className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors flex items-center gap-1">
              🛍️ Shop Now
            </Link>
            <Link to="/products" className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
              Sale! 🔥
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Accordion */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            {categories.map((cat) => (
              <div key={cat} className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => setMobileActiveCategory(mobileActiveCategory === cat ? null : cat)}
                  className="flex justify-between items-center w-full py-3 text-left"
                >
                  <span className="font-semibold text-gray-800">{cat}</span>
                  <FaChevronDown
                    className={`text-xs text-gray-500 transition-transform ${
                      mobileActiveCategory === cat ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {mobileActiveCategory === cat && (
                    <MobileAccordion
                      category={cat}
                      data={categoriesData[cat]}
                      onNavigate={() => setMobileMenuOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>

    {/* Bag Popup */}
    <BagPopup isOpen={showBagPopup} onClose={() => setShowBagPopup(false)} />

    {/* Brand Section Below Navbar */}
    <BrandSection />
    </>
  )
}

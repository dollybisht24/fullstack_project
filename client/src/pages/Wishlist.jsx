import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Wishlist() {
  const dispatch = useDispatch()
  const wishlist = useSelector((s) => s.wishlist.items)
  const auth = useSelector((s) => s.auth)
  const authToken = auth.user?.token

  useEffect(() => {
    if (authToken) dispatch(getWishlist())
  }, [dispatch, authToken])

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId))
    toast.success('Removed from wishlist')
  }

  if (!authToken) {
    return (
      <div className="text-center py-8">
        <p>Please login to view your wishlist</p>
        <Link to="/login" className="text-pink-600 underline">
          Login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="bg-white p-6 rounded">Your wishlist is empty</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded shadow-sm">
              <div className="h-48 bg-gray-100 flex items-center justify-center mb-4">
                <img src={p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/150'} alt={p.name} className="object-contain h-full" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
              <div className="text-pink-600 font-bold mb-2">₹{p.price}</div>
              <div className="flex gap-2">
                <Link to={`/product/${p._id}`} className="flex-1 text-center text-xs bg-pink-600 text-white py-2 rounded">
                  View
                </Link>
                <button onClick={() => handleRemove(p._id)} className="text-xs text-red-600 border border-red-600 px-3 py-2 rounded">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

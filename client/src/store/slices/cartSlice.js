import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

// Load cart from localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

const initialState = {
  items: cartItemsFromStorage,
  status: 'idle',
  error: null,
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
}

export const getCart = createAsyncThunk('cart/get', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    const config = {
      headers: { Authorization: `Bearer ${auth.user?.token}` }
    }
    const { data } = await axios.get('/cart', config)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart')
  }
})

export const addToCart = createAsyncThunk('cart/add', async ({ productId, qty }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    
    // Get product details
    const { data: product } = await axios.get(`/products/${productId}`)
    
    const cartItem = {
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      countInStock: product.countInStock,
      qty: qty || 1,
    }

    // Update backend if authenticated
    if (auth.user?.token) {
      const config = {
        headers: { Authorization: `Bearer ${auth.user.token}` }
      }
      await axios.post('/cart', { productId, qty }, config)
    }

    return cartItem
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to cart')
  }
})

export const removeFromCart = createAsyncThunk('cart/remove', async (productId, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    
    if (auth.user?.token) {
      const config = {
        headers: { Authorization: `Bearer ${auth.user.token}` }
      }
      await axios.delete(`/cart/${productId}`, config)
    }
    
    return productId
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart')
  }
})

export const updateCartItemQty = createAsyncThunk('cart/updateQty', async ({ productId, qty }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    
    if (auth.user?.token) {
      const config = {
        headers: { Authorization: `Bearer ${auth.user.token}` }
      }
      await axios.put(`/cart/${productId}`, { qty }, config)
    }
    
    return { productId, qty }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update cart')
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = []
      localStorage.removeItem('cartItems')
    },
    saveShippingAddress(state, action) {
      state.shippingAddress = action.payload
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload))
    },
    // Local cart operations (for non-authenticated users)
    addItemToCartLocal(state, action) {
      const item = action.payload
      const existItem = state.items.find(x => x.product === item.product)
      
      if (existItem) {
        state.items = state.items.map(x => 
          x.product === existItem.product ? item : x
        )
      } else {
        state.items.push(item)
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    removeItemFromCartLocal(state, action) {
      state.items = state.items.filter(x => x.product !== action.payload)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    updateItemQtyLocal(state, action) {
      const { productId, qty } = action.payload
      const item = state.items.find(x => x.product === productId)
      if (item) {
        item.qty = qty
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.items = action.payload.items || []
        state.status = 'succeeded'
        localStorage.setItem('cartItems', JSON.stringify(state.items))
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload
        const existItem = state.items.find(x => x.product === item.product)
        
        if (existItem) {
          state.items = state.items.map(x => 
            x.product === existItem.product ? item : x
          )
        } else {
          state.items.push(item)
        }
        localStorage.setItem('cartItems', JSON.stringify(state.items))
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(x => x.product !== action.payload)
        localStorage.setItem('cartItems', JSON.stringify(state.items))
      })
      // Update Cart Item
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        const { productId, qty } = action.payload
        const item = state.items.find(x => x.product === productId)
        if (item) {
          item.qty = qty
        }
        localStorage.setItem('cartItems', JSON.stringify(state.items))
      })
  },
})

export const { 
  clearCart, 
  saveShippingAddress, 
  addItemToCartLocal, 
  removeItemFromCartLocal,
  updateItemQtyLocal 
} = cartSlice.actions

export default cartSlice.reducer

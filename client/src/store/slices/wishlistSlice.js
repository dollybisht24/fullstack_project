import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

export const getWishlist = createAsyncThunk('wishlist/get', async (_, thunkAPI) => {
  const res = await axios.get('/wishlist')
  return res.data
})

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, thunkAPI) => {
  const res = await axios.post('/wishlist', { productId })
  return res.data
})

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, thunkAPI) => {
  const res = await axios.delete(`/wishlist/${productId}`)
  return res.data
})

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.items = action.payload.products || []
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload.products || []
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload.products || []
      })
  },
})

export default wishlistSlice.reducer

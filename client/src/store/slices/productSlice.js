import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

const initialState = {
  items: [],
  featured: [],
  topRated: [],
  related: [],
  selectedProduct: null,
  categories: [],
  brands: [],
  page: 1,
  pages: 1,
  total: 0,
  status: 'idle',
  error: null,
  filters: {
    keyword: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'newest',
  },
}

export const fetchProducts = createAsyncThunk(
  'products/fetch', 
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString()
      const { data } = await axios.get(`/products?${queryString}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById', 
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/products/${id}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Product not found')
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/products/featured')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products')
    }
  }
)

export const fetchTopProducts = createAsyncThunk(
  'products/fetchTop',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/products/top')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top products')
    }
  }
)

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelated',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/products/${productId}/related`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch related products')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/products/categories/all')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories')
    }
  }
)

export const fetchBrands = createAsyncThunk(
  'products/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/products/brands/all')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands')
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters(state) {
      state.filters = initialState.filters
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.products || action.payload
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.total = action.payload.total || action.payload.length
        state.status = 'succeeded'
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        // Don't block other loading
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.featured = []
      })
      // Top Products
      .addCase(fetchTopProducts.pending, (state) => {
        // Don't block other loading
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topRated = action.payload
      })
      .addCase(fetchTopProducts.rejected, (state) => {
        state.topRated = []
      })
      // Related Products
      .addCase(fetchRelatedProducts.pending, (state) => {
        // Don't block other loading
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.related = action.payload
      })
      .addCase(fetchRelatedProducts.rejected, (state) => {
        state.related = []
      })
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        // Don't block other loading
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categories = []
      })
      // Brands
      .addCase(fetchBrands.pending, (state) => {
        // Don't block other loading
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload
      })
      .addCase(fetchBrands.rejected, (state) => {
        state.brands = []
      })
  },
})

export const { setFilters, clearFilters, clearSelectedProduct } = productSlice.actions
export default productSlice.reducer

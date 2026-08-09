import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

const initialState = {
  orders: [],
  currentOrder: null,
  status: 'idle',
  error: null,
}

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/orders', orderData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order')
    }
  }
)

export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/orders/myorders')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
    }
  }
)

export const getOrderById = createAsyncThunk(
  'orders/getById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/orders/${id}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Order not found')
    }
  }
)

export const payOrder = createAsyncThunk(
  'orders/pay',
  async ({ orderId, paymentResult }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/orders/${orderId}/pay`, paymentResult)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment failed')
    }
  }
)

export const createPaymentIntent = createAsyncThunk(
  'orders/createPaymentIntent',
  async (amount, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/orders/create-payment-intent', { amount })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment intent')
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload
        state.status = 'succeeded'
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Get My Orders
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload
      })
      // Get Order By ID
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload
      })
      // Pay Order
      .addCase(payOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload
      })
  },
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer

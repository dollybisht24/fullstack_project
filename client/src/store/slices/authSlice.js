import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

// Get user from localStorage
const getStoredUser = () => {
  const storedUser = localStorage.getItem('userInfo')

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem('userInfo')
    return null
  }
}

const userInfo = getStoredUser()

const initialState = { 
  user: userInfo, 
  status: 'idle', 
  error: null,
  isAuthenticated: !!userInfo 
}

const getAuthErrorMessage = (error, fallback) => {
  const responseData = error.response?.data

  if (responseData?.message) {
    return responseData.message
  }

  if (typeof responseData === 'string') {
    return responseData
  }

  return error.message || fallback
}

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/users/login', credentials)
    localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  } catch (error) {
    return rejectWithValue(getAuthErrorMessage(error, 'Login failed'))
  }
})

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/users/register', userData)
    localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  } catch (error) {
    return rejectWithValue(getAuthErrorMessage(error, 'Registration failed'))
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.put('/users/profile', userData)
    localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  } catch (error) {
    return rejectWithValue(getAuthErrorMessage(error, 'Update failed'))
  }
})

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/users/forgot-password', { email })
    return data
  } catch (error) {
    return rejectWithValue(getAuthErrorMessage(error, 'Request failed'))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.status = 'idle'
      state.error = null
      localStorage.removeItem('userInfo')
      localStorage.removeItem('cartItems')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

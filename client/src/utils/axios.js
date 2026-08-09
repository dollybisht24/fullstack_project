import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Add token to requests if available
instance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch {
        localStorage.removeItem('userInfo')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || ''
    const isAuthRequest =
      requestUrl.includes('/users/login') ||
      requestUrl.includes('/users/register') ||
      requestUrl.includes('/users/forgot-password') ||
      requestUrl.includes('/users/reset-password')

    if (error.response?.status === 401 && !isAuthRequest) {
      // Unauthorized - clear user data
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance

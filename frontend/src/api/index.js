import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Products
export const getProducts = (category) =>
  API.get('/api/products/', { params: category ? { category } : {} })

export const getProductImage = (imageId) =>
  `${API.defaults.baseURL}/api/products/image/${imageId}`

export const createProduct = (formData) =>
  API.post('/api/products/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const updateProduct = (id, formData) =>
  API.put(`/api/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const toggleAvailability = (id, is_available) =>
  API.patch(`/api/products/${id}/availability`, { is_available })

export const deleteProduct = (id) =>
  API.delete(`/api/products/${id}`)

// Orders
export const placeOrder = (orderData) =>
  API.post('/api/orders/', orderData)

export const getOrders = () =>
  API.get('/api/orders/')

export const updateOrderStatus = (id, status) =>
  API.patch(`/api/orders/${id}/status`, { status })

// Admin
export const adminLogin = (credentials) =>
  API.post('/api/admin/login', credentials)

// Store
export const getStoreStatus = () =>
  API.get('/api/store/status')

export const updateStoreStatus = (is_open) =>
  API.put('/api/store/status', { is_open })
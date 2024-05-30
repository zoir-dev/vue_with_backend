import axios from 'axios'

export const API_URL = 'http://localhost:8000/'

const token = localStorage.getItem('accessToken')

export const http = axios.create({
  withCredentials: true,
  baseURL: API_URL + 'api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`
  }
})

// Add a request interceptor to set 'Content-Type' dynamically
http.interceptors.request.use(
  (config) => {
    // If the request data is FormData, set the content type to 'multipart/form-data'
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default http

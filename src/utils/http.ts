import axios from 'axios'

export const API_URL = 'http://localhost:8000/'

export const http = axios.create({
  withCredentials: true,
  baseURL: API_URL + 'api/'
})

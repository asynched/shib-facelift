import axios from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_ENV_API_URL,
})

import axios from 'axios'

/**
 * @description axios instance
 */
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
})

export default instance

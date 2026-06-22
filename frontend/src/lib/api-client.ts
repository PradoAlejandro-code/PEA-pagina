import axios from 'axios'
import { env } from '../env'

export const ADMIN_STORAGE_KEY = 'pea_admin_auth'
export const PADRON_STORAGE_KEY = 'pea_padron_auth'

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

// Injector: si hay credenciales guardadas las inyecta como Basic Auth
apiClient.interceptors.request.use((config) => {
  const adminCreds = sessionStorage.getItem(ADMIN_STORAGE_KEY)
  const padronCreds = sessionStorage.getItem(PADRON_STORAGE_KEY)

  const creds = adminCreds || padronCreds
  if (creds) {
    config.headers['Authorization'] = `Basic ${creds}`
  }

  return config
})

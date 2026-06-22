import axios from 'axios'
import { env } from '../../env'
import { ADMIN_STORAGE_KEY, PADRON_STORAGE_KEY } from '../../lib/api-client'

export type AuthRole = 'admin' | 'user'

export interface MeResponse {
  username: string
  role: AuthRole
}

/** Crea la cadena base64 que va en el header Authorization: Basic <token> */
function makeBasicToken(username: string, password: string): string {
  return btoa(`${username}:${password}`)
}

/**
 * Intenta autenticar con el backend usando Basic Auth.
 * Si es exitoso, guarda el token en sessionStorage y retorna el rol.
 * Si falla, lanza un error con mensaje amigable.
 */
export async function attemptLogin(
  username: string,
  password: string,
  storageKey: typeof ADMIN_STORAGE_KEY | typeof PADRON_STORAGE_KEY,
): Promise<MeResponse> {
  const token = makeBasicToken(username, password)

  const response = await axios.get<MeResponse>(`${env.VITE_API_URL}/me`, {
    headers: {
      Authorization: `Basic ${token}`,
      Accept: 'application/json',
    },
  })

  // Guardar en sessionStorage solo si la petición fue exitosa
  sessionStorage.setItem(storageKey, token)
  return response.data
}

/**
 * Login para el panel de Admin. Solo acepta el rol 'admin'.
 */
export async function loginAdmin(username: string, password: string): Promise<MeResponse> {
  const data = await attemptLogin(username, password, ADMIN_STORAGE_KEY)
  if (data.role !== 'admin') {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY)
    throw new Error('Solo administradores pueden acceder a este panel.')
  }
  return data
}

/**
 * Login para el Padrón. Acepta 'admin' o 'user'.
 */
export async function loginPadron(username: string, password: string): Promise<MeResponse> {
  return attemptLogin(username, password, PADRON_STORAGE_KEY)
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_STORAGE_KEY)
}

export function logoutPadron() {
  sessionStorage.removeItem(PADRON_STORAGE_KEY)
}

export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_STORAGE_KEY)
}

export function getPadronToken(): string | null {
  return sessionStorage.getItem(PADRON_STORAGE_KEY)
}

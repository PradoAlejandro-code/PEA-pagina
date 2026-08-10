import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  loginAdmin,
  loginPadron,
  logoutAdmin,
  logoutPadron,
  getAdminToken,
  getPadronToken,
  type AuthRole,
} from '../features/api/auth'

export type AuthScope = 'admin' | 'padron'

export interface AuthState {
  isAuthenticated: boolean
  role: AuthRole | null
}

/** Lee el estado actual de autenticación desde sessionStorage */
function readAuthState(scope: AuthScope): AuthState {
  const token = scope === 'admin' ? getAdminToken() : getPadronToken()
  if (!token) return { isAuthenticated: false, role: null }

  // Decodificar el token para saber el usuario y asignar rol
  try {
    const decoded = atob(token)
    const username = decoded.split(':')[0]
    const role: AuthRole = username === 'admin' ? 'admin' : 'user'
    return { isAuthenticated: true, role }
  } catch {
    return { isAuthenticated: false, role: null }
  }
}

/** Hook de autenticación para un scope específico (admin o padron) */
export function useAuth(scope: AuthScope) {
  const [state, setState] = useState<AuthState>(() => readAuthState(scope))

  const logout = useCallback(() => {
    if (scope === 'admin') logoutAdmin()
    else logoutPadron()
    setState({ isAuthenticated: false, role: null })
  }, [scope])

  const setAuthenticated = useCallback((role: AuthRole) => {
    setState({ isAuthenticated: true, role })
  }, [])

  return { ...state, logout, setAuthenticated }
}

/** Mutation para login del panel admin */
export function useAdminLogin() {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginAdmin(username, password),
  })
}

/** Mutation para login del padrón */
export function usePadronLogin() {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginPadron(username, password),
  })
}

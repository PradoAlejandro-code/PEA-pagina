import { apiClient } from '../../lib/api-client'

export interface Registro {
  id: number
  orden: number
  nombre: string
  apellido: string
  dni: string
  voto: boolean
}

export type VotoFilter = 'todos' | 'true' | 'false'

export interface CountResponse {
  cantidad: number
}

// ── LIST ──────────────────────────────────────────────────────────────────────

export async function getRegistros(voto: VotoFilter = 'todos'): Promise<Registro[]> {
  const { data } = await apiClient.get<Registro[]>('/registros', {
    params: { voto },
  })
  return data
}

// ── COUNT ─────────────────────────────────────────────────────────────────────

export async function countRegistros(voto: VotoFilter = 'todos'): Promise<number> {
  const { data } = await apiClient.get<CountResponse>('/registros/count', {
    params: { voto },
  })
  return data.cantidad
}

// ── FIND ──────────────────────────────────────────────────────────────────────

export async function getRegistro(id: number): Promise<Registro> {
  const { data } = await apiClient.get<Registro>(`/registros/${id}`)
  return data
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export interface CreateRegistroPayload {
  orden: number
  nombre: string
  apellido: string
  dni: string
}

export async function createRegistro(payload: CreateRegistroPayload): Promise<Registro> {
  const { data } = await apiClient.post<Registro>('/registros', payload)
  return data
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function updateRegistro(id: number, payload: Partial<CreateRegistroPayload>): Promise<Registro> {
  const { data } = await apiClient.put<Registro>(`/registros/${id}`, payload)
  return data
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deleteRegistro(id: number): Promise<void> {
  await apiClient.delete(`/registros/${id}`)
}

// ── PATCH VOTO ────────────────────────────────────────────────────────────────

export async function patchVoto(id: number, voto: boolean): Promise<Registro> {
  const { data } = await apiClient.patch<Registro>(`/registros/${id}/voto`, { voto })
  return data
}

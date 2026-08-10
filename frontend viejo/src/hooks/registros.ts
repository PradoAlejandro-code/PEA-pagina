import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getRegistros,
  countRegistros,
  createRegistro,
  updateRegistro,
  deleteRegistro,
  patchVoto,
  type VotoFilter,
  type CreateRegistroPayload,
} from '../features/api/registros'

// ── Query Keys ────────────────────────────────────────────────────────────────

export const registrosKeys = {
  all: ['registros'] as const,
  list: (voto: VotoFilter) => ['registros', 'list', voto] as const,
  count: (voto: VotoFilter) => ['registros', 'count', voto] as const,
}

// ── Queries ───────────────────────────────────────────────────────────────────

export function useRegistros(voto: VotoFilter = 'todos') {
  return useQuery({
    queryKey: registrosKeys.list(voto),
    queryFn: () => getRegistros(voto),
  })
}

export function useRegistrosCount(voto: VotoFilter = 'todos') {
  return useQuery({
    queryKey: registrosKeys.count(voto),
    queryFn: () => countRegistros(voto),
    refetchInterval: 10_000, // refresca cada 10s para stats en tiempo real
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateRegistro() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateRegistroPayload) => createRegistro(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: registrosKeys.all })
    },
  })
}

export function useUpdateRegistro() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateRegistroPayload> }) =>
      updateRegistro(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: registrosKeys.all })
    },
  })
}

export function useDeleteRegistro() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteRegistro(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: registrosKeys.all })
    },
  })
}

export function usePatchVoto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, voto }: { id: number; voto: boolean }) => patchVoto(id, voto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: registrosKeys.all })
    },
  })
}

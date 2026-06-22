import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEntrepreneurships,
  createEntrepreneurship,
  updateEntrepreneurship,
  deleteEntrepreneurship,
} from '../features/api/entrepreneurships'

export const entrepreneurshipsKeys = {
  all: ['entrepreneurships'] as const,
}

export function useEntrepreneurships() {
  return useQuery({
    queryKey: entrepreneurshipsKeys.all,
    queryFn: getEntrepreneurships,
  })
}

export function useCreateEntrepreneurship() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, contactUrl, img }: { name: string; contactUrl: string; img: File }) =>
      createEntrepreneurship(name, contactUrl, img),
    onSuccess: () => qc.invalidateQueries({ queryKey: entrepreneurshipsKeys.all }),
  })
}

export function useUpdateEntrepreneurship() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name, contactUrl }: { id: number; name: string; contactUrl: string }) =>
      updateEntrepreneurship(id, name, contactUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: entrepreneurshipsKeys.all }),
  })
}

export function useDeleteEntrepreneurship() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteEntrepreneurship(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: entrepreneurshipsKeys.all }),
  })
}

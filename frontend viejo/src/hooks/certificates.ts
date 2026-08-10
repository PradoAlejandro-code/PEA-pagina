import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../features/api/certificates'

export const certificatesKeys = {
  all: ['certificates'] as const,
}

export function useCertificates() {
  return useQuery({
    queryKey: certificatesKeys.all,
    queryFn: getCertificates,
  })
}

export function useCreateCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, isFree, pdf }: { name: string; isFree: boolean; pdf: File }) =>
      createCertificate(name, isFree, pdf),
    onSuccess: () => qc.invalidateQueries({ queryKey: certificatesKeys.all }),
  })
}

export function useUpdateCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name, isFree }: { id: number; name: string; isFree: boolean }) =>
      updateCertificate(id, name, isFree),
    onSuccess: () => qc.invalidateQueries({ queryKey: certificatesKeys.all }),
  })
}

export function useDeleteCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCertificate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: certificatesKeys.all }),
  })
}

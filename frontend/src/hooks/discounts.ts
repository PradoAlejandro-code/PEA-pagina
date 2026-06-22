import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from '../features/api/discounts'

export const discountsKeys = {
  all: ['discounts'] as const,
}

export function useDiscounts() {
  return useQuery({
    queryKey: discountsKeys.all,
    queryFn: getDiscounts,
  })
}

export function useCreateDiscount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      name,
      category,
      description,
      requirements,
      img,
    }: {
      name: string
      category: string
      description: string
      requirements: string
      img: File
    }) => createDiscount(name, category, description, requirements, img),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountsKeys.all }),
  })
}

export function useUpdateDiscount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      name,
      category,
      description,
      requirements,
    }: {
      id: number
      name: string
      category: string
      description: string
      requirements: string
    }) => updateDiscount(id, name, category, description, requirements),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountsKeys.all }),
  })
}

export function useDeleteDiscount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteDiscount(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountsKeys.all }),
  })
}

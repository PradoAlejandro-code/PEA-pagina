import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSuggestions,
  createSuggestion,
  deleteSuggestion,
} from '../features/api/suggestions'

export const suggestionsKeys = {
  all: ['suggestions'] as const,
}

export function useSuggestions() {
  return useQuery({
    queryKey: suggestionsKeys.all,
    queryFn: getSuggestions,
  })
}

export function useCreateSuggestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (text: string) => createSuggestion(text),
    onSuccess: () => qc.invalidateQueries({ queryKey: suggestionsKeys.all }),
  })
}

export function useDeleteSuggestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSuggestion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: suggestionsKeys.all }),
  })
}

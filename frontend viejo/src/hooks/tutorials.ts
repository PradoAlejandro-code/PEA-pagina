import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTutorials,
  createTutorial,
  updateTutorial,
  deleteTutorial,
} from '../features/api/tutorials'

export const tutorialsKeys = {
  all: ['tutorials'] as const,
}

export function useTutorials() {
  return useQuery({
    queryKey: tutorialsKeys.all,
    queryFn: getTutorials,
  })
}

export function useCreateTutorial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, video }: { name: string; video: File }) =>
      createTutorial(name, video),
    onSuccess: () => qc.invalidateQueries({ queryKey: tutorialsKeys.all }),
  })
}

export function useUpdateTutorial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateTutorial(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: tutorialsKeys.all }),
  })
}

export function useDeleteTutorial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTutorial(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tutorialsKeys.all }),
  })
}

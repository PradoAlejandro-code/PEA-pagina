import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCurriculums,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
} from '../features/api/curriculums'

export const curriculumsKeys = {
  all: ['curriculums'] as const,
}

export function useCurriculums() {
  return useQuery({
    queryKey: curriculumsKeys.all,
    queryFn: getCurriculums,
  })
}

export function useCreateCurriculum() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ major, institute, img }: { major: string; institute: string; img: File }) =>
      createCurriculum(major, institute, img),
    onSuccess: () => qc.invalidateQueries({ queryKey: curriculumsKeys.all }),
  })
}

export function useUpdateCurriculum() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, major, institute }: { id: number; major: string; institute: string }) =>
      updateCurriculum(id, major, institute),
    onSuccess: () => qc.invalidateQueries({ queryKey: curriculumsKeys.all }),
  })
}

export function useDeleteCurriculum() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCurriculum(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: curriculumsKeys.all }),
  })
}

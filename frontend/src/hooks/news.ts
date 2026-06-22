import { useQuery } from '@tanstack/react-query'
import { getNews, getNewsById } from '../features/api/get-news'

export const newsKeys = {
  all: ['news'] as const,
  detail: (id: string) => ['news', id] as const,
}

export function useNews() {
  return useQuery({
    queryKey: newsKeys.all,
    queryFn: getNews,
  })
}

export function useNewsById(id: string) {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => getNewsById(id),
    enabled: !!id,
  })
}

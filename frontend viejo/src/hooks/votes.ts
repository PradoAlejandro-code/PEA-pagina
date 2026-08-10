import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVoteSummary, createVote, type CreateVotePayload } from '../features/api/votes'

export const votesKeys = {
  all: ['votes'] as const,
  summary: () => ['votes', 'summary'] as const,
}

export function useVoteSummary() {
  return useQuery({
    queryKey: votesKeys.summary(),
    queryFn: () => getVoteSummary(),
    refetchInterval: 10_000, // Refresh every 10s for real-time updates
  })
}

export function useCreateVote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateVotePayload) => createVote(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: votesKeys.all })
    },
  })
}

import { apiClient } from '../../lib/api-client'

export interface VoteSummary {
  pea_total: number
  upl_total: number
}

export interface CreateVotePayload {
  pea_votes: number
  upl_votes: number
}

export async function createVote(payload: CreateVotePayload): Promise<void> {
  await apiClient.post('/votes', payload)
}

export async function getVoteSummary(): Promise<VoteSummary> {
  const { data } = await apiClient.get<VoteSummary>('/votes/summary')
  return data
}

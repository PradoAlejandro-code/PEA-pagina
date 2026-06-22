import { apiClient } from '../../lib/api-client'

export interface TutorialSuggestion {
  id: number
  Text: string
  created_at: string
}

export async function getSuggestions(): Promise<TutorialSuggestion[]> {
  const response = await apiClient.get<TutorialSuggestion[]>('/tutorial-suggestions')
  return response.data
}

export async function createSuggestion(text: string): Promise<TutorialSuggestion> {
  const response = await apiClient.post<TutorialSuggestion>('/tutorial-suggestions', {
    Text: text,
  })
  return response.data
}

export async function deleteSuggestion(id: number): Promise<void> {
  await apiClient.delete(`/tutorial-suggestions/${id}`)
}

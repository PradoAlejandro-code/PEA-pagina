import { apiClient } from '../../lib/api-client'

export interface Tutorial {
  id: number
  name: string
  video_path: string
  created_at: string
}

export async function getTutorials(): Promise<Tutorial[]> {
  const response = await apiClient.get<Tutorial[]>('/tutorials')
  return response.data
}

export async function createTutorial(name: string, video: File): Promise<Tutorial> {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('video', video)

  const response = await apiClient.post<Tutorial>('/tutorials', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateTutorial(id: number, name: string): Promise<Tutorial> {
  const response = await apiClient.put<Tutorial>(`/tutorials/${id}`, {
    name,
  })
  return response.data
}

export async function deleteTutorial(id: number): Promise<void> {
  await apiClient.delete(`/tutorials/${id}`)
}

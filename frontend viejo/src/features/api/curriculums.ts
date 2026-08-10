import { apiClient } from '../../lib/api-client'

export interface Curriculum {
  id: number
  major: string
  institute: string
  image_path: string
  created_at: string
}

export async function getCurriculums(): Promise<Curriculum[]> {
  const response = await apiClient.get<Curriculum[]>('/curriculums')
  return response.data
}

export async function createCurriculum(major: string, institute: string, img: File): Promise<Curriculum> {
  const formData = new FormData()
  formData.append('major', major)
  formData.append('institute', institute)
  formData.append('img', img)

  const response = await apiClient.post<Curriculum>('/curriculums', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateCurriculum(id: number, major: string, institute: string): Promise<Curriculum> {
  const response = await apiClient.put<Curriculum>(`/curriculums/${id}`, {
    major,
    institute,
  })
  return response.data
}

export async function deleteCurriculum(id: number): Promise<void> {
  await apiClient.delete(`/curriculums/${id}`)
}

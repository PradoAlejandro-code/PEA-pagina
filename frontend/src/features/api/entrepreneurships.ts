import { apiClient } from '../../lib/api-client'

export interface Entrepreneurship {
  id: number
  name: string
  image_path: string
  contact_url: string
}

export async function getEntrepreneurships(): Promise<Entrepreneurship[]> {
  const response = await apiClient.get<Entrepreneurship[]>('/entrepreneurships')
  return response.data
}

export async function createEntrepreneurship(name: string, contactUrl: string, img: File): Promise<Entrepreneurship> {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('contact_url', contactUrl)
  formData.append('img', img)

  const response = await apiClient.post<Entrepreneurship>('/entrepreneurships', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateEntrepreneurship(id: number, name: string, contactUrl: string): Promise<Entrepreneurship> {
  const response = await apiClient.put<Entrepreneurship>(`/entrepreneurships/${id}`, {
    name,
    contact_url: contactUrl,
  })
  return response.data
}

export async function deleteEntrepreneurship(id: number): Promise<void> {
  await apiClient.delete(`/entrepreneurships/${id}`)
}

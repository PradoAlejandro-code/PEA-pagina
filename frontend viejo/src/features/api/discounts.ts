import { apiClient } from '../../lib/api-client'

export interface Discount {
  id: number
  name: string
  category: string
  description: string
  requirements: string
  image_path: string
  created_at: string
}

export async function getDiscounts(): Promise<Discount[]> {
  const response = await apiClient.get<Discount[]>('/discounts')
  return response.data
}

export async function createDiscount(
  name: string,
  category: string,
  description: string,
  requirements: string,
  img: File
): Promise<Discount> {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('category', category)
  formData.append('description', description)
  formData.append('requirements', requirements)
  formData.append('img', img)

  const response = await apiClient.post<Discount>('/discounts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateDiscount(
  id: number,
  name: string,
  category: string,
  description: string,
  requirements: string
): Promise<Discount> {
  const response = await apiClient.put<Discount>(`/discounts/${id}`, {
    name,
    category,
    description,
    requirements,
  })
  return response.data
}

export async function deleteDiscount(id: number): Promise<void> {
  await apiClient.delete(`/discounts/${id}`)
}

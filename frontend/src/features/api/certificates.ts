import { apiClient } from '../../lib/api-client'

export interface Certificate {
  id: number
  name: string
  is_free: boolean
  pdf_path: string
  created_at: string
}

export async function getCertificates(): Promise<Certificate[]> {
  const response = await apiClient.get<Certificate[]>('/certificates')
  return response.data
}

export async function createCertificate(name: string, isFree: boolean, pdf: File): Promise<Certificate> {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('is_free', String(isFree))
  formData.append('pdf', pdf)

  const response = await apiClient.post<Certificate>('/certificates', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateCertificate(id: number, name: string, isFree: boolean): Promise<Certificate> {
  const response = await apiClient.put<Certificate>(`/certificates/${id}`, {
    name,
    is_free: isFree,
  })
  return response.data
}

export async function deleteCertificate(id: number): Promise<void> {
  await apiClient.delete(`/certificates/${id}`)
}

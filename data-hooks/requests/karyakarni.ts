import request from "@/config/request"
import publicRequest from "@/config/public-request"

export interface KaryakarniMember {
  id: string
  name: string
  location?: string | null
  designation: string
  organization?: string | null
  phone?: string | null
  imageUrl?: string | null
  type: "choudah_chokhara" | "chokhara"
  chokhlaId?: string | null
  order: number
  createdAt: string
}

const BASE = "/karyakarni"

// Public
export const getKaryakarni = (params?: { type?: string; chokhlaId?: string }) =>
  publicRequest.get<{ success: boolean; data: KaryakarniMember[] }>(BASE, { params }).then(r => r.data.data)

// Admin
export const getKaryakarniAdmin = (params?: { type?: string }) =>
  request.get<{ success: boolean; data: KaryakarniMember[] }>(`${BASE}/admin/all`, { params }).then(r => r.data.data)

export const createKaryakarniMember = (body: Partial<KaryakarniMember>) =>
  request.post<{ success: boolean; data: KaryakarniMember }>(BASE, body).then(r => r.data.data)

export const updateKaryakarniMember = (id: string, body: Partial<KaryakarniMember>) =>
  request.put<{ success: boolean; data: KaryakarniMember }>(`${BASE}/${id}`, body).then(r => r.data.data)

export const deleteKaryakarniMember = (id: string) =>
  request.delete(`${BASE}/${id}`)

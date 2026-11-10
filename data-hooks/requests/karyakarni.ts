import request from "@/config/request"
import publicRequest from "@/config/public-request"

export interface KaryakarniSession {
  id: string
  name: string
  type: "choudah_chokhara" | "chokhara"
  isActive: boolean
  createdAt: string
  _count?: { members: number }
  members?: KaryakarniMember[]
}

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
  villageId?: string | null
  satraId?: string | null
  order: number
  createdAt: string
}

const BASE = "/karyakarni"

// ── Sessions (public) ─────────────────────────────────────────────────────────

export const getSessions = (params?: { type?: string }) =>
  publicRequest.get<{ success: boolean; data: KaryakarniSession[] }>(`${BASE}/sessions`, { params }).then(r => r.data.data)

export const getSession = (id: string) =>
  publicRequest.get<{ success: boolean; data: KaryakarniSession }>(`${BASE}/sessions/${id}`).then(r => r.data.data)

// ── Sessions (admin) ──────────────────────────────────────────────────────────

export const createSession = (body: Partial<KaryakarniSession>) =>
  request.post<{ success: boolean; data: KaryakarniSession }>(`${BASE}/sessions`, body).then(r => r.data.data)

export const updateSession = (id: string, body: Partial<KaryakarniSession>) =>
  request.put<{ success: boolean; data: KaryakarniSession }>(`${BASE}/sessions/${id}`, body).then(r => r.data.data)

export const deleteSession = (id: string) =>
  request.delete(`${BASE}/sessions/${id}`)

// ── Members (public) ──────────────────────────────────────────────────────────

export const getKaryakarni = (params?: { type?: string; satraId?: string; chokhlaId?: string }) =>
  publicRequest.get<{ success: boolean; data: KaryakarniMember[] }>(BASE, { params }).then(r => r.data.data)

// ── Members (admin) ───────────────────────────────────────────────────────────

export const getKaryakarniAdmin = (params?: { type?: string; satraId?: string }) =>
  request.get<{ success: boolean; data: KaryakarniMember[] }>(`${BASE}/admin/all`, { params }).then(r => r.data.data)

export const createKaryakarniMember = (body: Partial<KaryakarniMember>) =>
  request.post<{ success: boolean; data: KaryakarniMember }>(BASE, body).then(r => r.data.data)

export const updateKaryakarniMember = (id: string, body: Partial<KaryakarniMember>) =>
  request.put<{ success: boolean; data: KaryakarniMember }>(`${BASE}/${id}`, body).then(r => r.data.data)

export const deleteKaryakarniMember = (id: string) =>
  request.delete(`${BASE}/${id}`)

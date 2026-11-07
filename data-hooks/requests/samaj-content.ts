import request from "@/config/request"
import publicRequest from "@/config/public-request"

// ── Types ─────────────────────────────────────────────────────────────────────

export type SamajPost = {
  id: string
  authorName: string
  authorRole?: string | null
  content: string
  imageUrl?: string | null
  likesCount: number
  status: string
  createdAt: string
  updatedAt: string
  _count?: { comments: number }
}

export type SamajPostComment = {
  id: string
  postId: string
  authorName: string
  content: string
  createdAt: string
}

export type SamajNewsComment = {
  id: string
  newsId: string
  authorName: string
  content: string
  createdAt: string
}

export type SamajNews = {
  id: string
  title: string
  tag: string
  summary?: string | null
  content?: string | null
  imageUrl?: string | null
  status: string
  likesCount: number
  publishedAt: string
  createdAt: string
  updatedAt: string
  _count?: { comments: number }
}

export type SamajPressRelease = {
  id: string
  title: string
  summary?: string | null
  content?: string | null
  imageUrl?: string | null
  pdfUrl?: string | null
  publishedBy?: string | null
  status: string
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export type SamajEvent = {
  id: string
  title: string
  description?: string | null
  date: string
  time?: string | null
  venue?: string | null
  imageUrl?: string | null
  contact?: string | null
  status: string
  createdAt: string
  updatedAt: string
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export const getSamajPosts = async (params?: Record<string, string>): Promise<SamajPost[]> => {
  const { data } = await request.get("/samaj-posts", { params })
  return data.data
}

export const createSamajPost = async (payload: Partial<SamajPost>): Promise<SamajPost> => {
  const { data } = await request.post("/samaj-posts", payload)
  return data.data
}

export const updateSamajPost = async (id: string, payload: Partial<SamajPost>): Promise<SamajPost> => {
  const { data } = await request.put(`/samaj-posts/${id}`, payload)
  return data.data
}

export const deleteSamajPost = async (id: string) => {
  const { data } = await request.delete(`/samaj-posts/${id}`)
  return data
}

export const toggleSamajPostLike = async (id: string): Promise<{ liked: boolean; likesCount: number }> => {
  const { data } = await request.post(`/samaj-posts/${id}/like`)
  return data.data
}

export const getSamajPostComments = async (id: string): Promise<SamajPostComment[]> => {
  const { data } = await request.get(`/samaj-posts/${id}/comments`)
  return data.data
}

export const addSamajPostComment = async (id: string, payload: { authorName: string; content: string }): Promise<SamajPostComment> => {
  const { data } = await request.post(`/samaj-posts/${id}/comments`, payload)
  return data.data
}

export const deleteSamajPostComment = async (postId: string, commentId: string) => {
  const { data } = await request.delete(`/samaj-posts/${postId}/comments/${commentId}`)
  return data
}

// ── News ──────────────────────────────────────────────────────────────────────

export const getSamajNews = async (params?: Record<string, string>): Promise<SamajNews[]> => {
  const { data } = await publicRequest.get("/samaj-news", { params })
  return data.data
}

export const getSamajNewsAdmin = async (): Promise<SamajNews[]> => {
  const { data } = await request.get("/samaj-news/admin/all")
  return data.data
}

export const createSamajNews = async (payload: Partial<SamajNews>): Promise<SamajNews> => {
  const { data } = await request.post("/samaj-news", payload)
  return data.data
}

export const updateSamajNews = async (id: string, payload: Partial<SamajNews>): Promise<SamajNews> => {
  const { data } = await request.put(`/samaj-news/${id}`, payload)
  return data.data
}

export const deleteSamajNews = async (id: string) => {
  const { data } = await request.delete(`/samaj-news/${id}`)
  return data
}

export const getSamajNewsById = async (id: string): Promise<SamajNews> => {
  const { data } = await publicRequest.get(`/samaj-news/${id}`)
  return data.data
}

export const likeSamajNews = async (id: string): Promise<{ likesCount: number }> => {
  const { data } = await publicRequest.post(`/samaj-news/${id}/like`)
  return data.data
}

export const getSamajNewsComments = async (id: string): Promise<SamajNewsComment[]> => {
  const { data } = await publicRequest.get(`/samaj-news/${id}/comments`)
  return data.data
}

export const addSamajNewsComment = async (id: string, payload: { authorName: string; content: string }): Promise<SamajNewsComment> => {
  const { data } = await publicRequest.post(`/samaj-news/${id}/comments`, payload)
  return data.data
}

// ── Press Releases ────────────────────────────────────────────────────────────

export const getSamajPress = async (params?: Record<string, string>): Promise<SamajPressRelease[]> => {
  const { data } = await publicRequest.get("/samaj-press", { params })
  return data.data
}

export const getSamajPressAdmin = async (): Promise<SamajPressRelease[]> => {
  const { data } = await request.get("/samaj-press/admin/all")
  return data.data
}

export const createSamajPress = async (payload: Partial<SamajPressRelease>): Promise<SamajPressRelease> => {
  const { data } = await request.post("/samaj-press", payload)
  return data.data
}

export const updateSamajPress = async (id: string, payload: Partial<SamajPressRelease>): Promise<SamajPressRelease> => {
  const { data } = await request.put(`/samaj-press/${id}`, payload)
  return data.data
}

export const deleteSamajPress = async (id: string) => {
  const { data } = await request.delete(`/samaj-press/${id}`)
  return data
}

// ── Events ────────────────────────────────────────────────────────────────────

export const getSamajEvents = async (params?: Record<string, string>): Promise<SamajEvent[]> => {
  const { data } = await request.get("/samaj-events", { params })
  return data.data
}

export const getSamajEventsAdmin = async (): Promise<SamajEvent[]> => {
  const { data } = await request.get("/samaj-events/admin/all")
  return data.data
}

export const createSamajEvent = async (payload: Partial<SamajEvent>): Promise<SamajEvent> => {
  const { data } = await request.post("/samaj-events", payload)
  return data.data
}

export const updateSamajEvent = async (id: string, payload: Partial<SamajEvent>): Promise<SamajEvent> => {
  const { data } = await request.put(`/samaj-events/${id}`, payload)
  return data.data
}

export const deleteSamajEvent = async (id: string) => {
  const { data } = await request.delete(`/samaj-events/${id}`)
  return data
}

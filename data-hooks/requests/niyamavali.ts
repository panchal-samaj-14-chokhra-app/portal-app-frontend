import request from "@/config/request"

export interface NiyamavaliSectionSummary {
  id: string
  title: string
  order: number
}

export interface NiyamavaliSection {
  id: string
  articleId: string
  title: string
  content: string
  order: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface NiyamavaliArticle {
  id: string
  title: string
  articleNumber?: string
  description?: string
  order: number
  status: string
  createdAt: string
  updatedAt: string
  sections?: NiyamavaliSection[]
  _count?: { sections: number }
}

export interface NiyamavaliArticleWithSections extends NiyamavaliArticle {
  sections: NiyamavaliSection[]
}

// ── Public ────────────────────────────────────────────────────────────────────

export const getNiyamavaliArticles = async (): Promise<NiyamavaliArticle[]> => {
  const { data } = await request.get("/niyamavali/articles")
  return data.data
}

export const getNiyamavaliArticle = async (id: string): Promise<NiyamavaliArticleWithSections> => {
  const { data } = await request.get(`/niyamavali/articles/${id}`)
  return data.data
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export const getNiyamavaliArticlesAdmin = async (): Promise<NiyamavaliArticle[]> => {
  const { data } = await request.get("/niyamavali/articles/admin/all")
  return data.data
}

export const createNiyamavaliArticle = async (payload: Partial<NiyamavaliArticle>): Promise<NiyamavaliArticle> => {
  const { data } = await request.post("/niyamavali/articles", payload)
  return data.data
}

export const updateNiyamavaliArticle = async (id: string, payload: Partial<NiyamavaliArticle>): Promise<NiyamavaliArticle> => {
  const { data } = await request.put(`/niyamavali/articles/${id}`, payload)
  return data.data
}

export const deleteNiyamavaliArticle = async (id: string): Promise<void> => {
  await request.delete(`/niyamavali/articles/${id}`)
}

// Sections

export const getNiyamavaliSectionsAdmin = async (articleId: string): Promise<NiyamavaliSection[]> => {
  const { data } = await request.get(`/niyamavali/articles/${articleId}/sections`)
  return data.data
}

export const createNiyamavaliSection = async (payload: Partial<NiyamavaliSection>): Promise<NiyamavaliSection> => {
  const { data } = await request.post("/niyamavali/sections", payload)
  return data.data
}

export const updateNiyamavaliSection = async (id: string, payload: Partial<NiyamavaliSection>): Promise<NiyamavaliSection> => {
  const { data } = await request.put(`/niyamavali/sections/${id}`, payload)
  return data.data
}

export const deleteNiyamavaliSection = async (id: string): Promise<void> => {
  await request.delete(`/niyamavali/sections/${id}`)
}

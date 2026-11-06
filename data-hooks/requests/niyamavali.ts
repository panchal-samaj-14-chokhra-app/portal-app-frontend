import request from "@/config/request"

// ── Types ─────────────────────────────────────────────────────────────────────

export type NiyamavaliPublication = {
  id: string
  title: string
  subtitle?: string | null
  year?: string | null
  introduction?: string | null
  coverImage?: string | null
  status: string
  order: number
  createdAt: string
  updatedAt: string
  categories?: NiyamavaliCategory[]
  _count?: { categories: number }
}

export type NiyamavaliCategory = {
  id: string
  publicationId: string
  title: string
  description?: string | null
  order: number
  status: string
  createdAt: string
  updatedAt: string
  subcategories?: NiyamavaliSubcategory[]
  articles?: NiyamavaliArticleSummary[]
  _count?: { articles: number }
}

export type NiyamavaliSubcategory = {
  id: string
  categoryId: string
  title: string
  description?: string | null
  order: number
  status: string
  createdAt: string
  updatedAt: string
  _count?: { articles: number }
}

export type NiyamavaliArticleSummary = {
  id: string
  title: string
  articleNumber?: string | null
  order: number
  subcategoryId?: string | null
}

export type NiyamavaliArticle = {
  id: string
  categoryId: string
  subcategoryId?: string | null
  title: string
  articleNumber?: string | null
  content: string
  status: string
  order: number
  createdAt: string
  updatedAt: string
  category?: NiyamavaliCategory & {
    publication?: { id: string; title: string; year?: string | null }
    articles?: NiyamavaliArticleSummary[]
  }
  subcategory?: NiyamavaliSubcategory | null
}

// ── Publications ──────────────────────────────────────────────────────────────

export const getNiyamavaliPublications = async (): Promise<NiyamavaliPublication[]> => {
  const { data } = await request.get("/niyamavali/publications")
  return data.data
}

export const getNiyamavaliPublicationsAdmin = async (): Promise<NiyamavaliPublication[]> => {
  const { data } = await request.get("/niyamavali/publications/admin/all")
  return data.data
}

export const getNiyamavaliPublication = async (id: string): Promise<NiyamavaliPublication> => {
  const { data } = await request.get(`/niyamavali/publications/${id}`)
  return data.data
}

export const createNiyamavaliPublication = async (payload: Partial<NiyamavaliPublication>): Promise<NiyamavaliPublication> => {
  const { data } = await request.post("/niyamavali/publications", payload)
  return data.data
}

export const updateNiyamavaliPublication = async (id: string, payload: Partial<NiyamavaliPublication>): Promise<NiyamavaliPublication> => {
  const { data } = await request.put(`/niyamavali/publications/${id}`, payload)
  return data.data
}

export const deleteNiyamavaliPublication = async (id: string) => {
  const { data } = await request.delete(`/niyamavali/publications/${id}`)
  return data
}

// ── Categories ────────────────────────────────────────────────────────────────

export const getNiyamavaliCategoriesAdmin = async (publicationId?: string): Promise<NiyamavaliCategory[]> => {
  const { data } = await request.get("/niyamavali/categories/admin/all", { params: publicationId ? { publicationId } : undefined })
  return data.data
}

export const getNiyamavaliCategory = async (id: string): Promise<NiyamavaliCategory> => {
  const { data } = await request.get(`/niyamavali/categories/${id}`)
  return data.data
}

export const createNiyamavaliCategory = async (payload: Partial<NiyamavaliCategory>): Promise<NiyamavaliCategory> => {
  const { data } = await request.post("/niyamavali/categories", payload)
  return data.data
}

export const updateNiyamavaliCategory = async (id: string, payload: Partial<NiyamavaliCategory>): Promise<NiyamavaliCategory> => {
  const { data } = await request.put(`/niyamavali/categories/${id}`, payload)
  return data.data
}

export const deleteNiyamavaliCategory = async (id: string) => {
  const { data } = await request.delete(`/niyamavali/categories/${id}`)
  return data
}

// ── Subcategories ─────────────────────────────────────────────────────────────

export const getNiyamavaliSubcategoriesAdmin = async (categoryId?: string): Promise<NiyamavaliSubcategory[]> => {
  const { data } = await request.get("/niyamavali/subcategories/admin/all", { params: categoryId ? { categoryId } : undefined })
  return data.data
}

export const createNiyamavaliSubcategory = async (payload: Partial<NiyamavaliSubcategory>): Promise<NiyamavaliSubcategory> => {
  const { data } = await request.post("/niyamavali/subcategories", payload)
  return data.data
}

export const updateNiyamavaliSubcategory = async (id: string, payload: Partial<NiyamavaliSubcategory>): Promise<NiyamavaliSubcategory> => {
  const { data } = await request.put(`/niyamavali/subcategories/${id}`, payload)
  return data.data
}

export const deleteNiyamavaliSubcategory = async (id: string) => {
  const { data } = await request.delete(`/niyamavali/subcategories/${id}`)
  return data
}

// ── Articles ──────────────────────────────────────────────────────────────────

export const getNiyamavaliArticle = async (id: string): Promise<NiyamavaliArticle> => {
  const { data } = await request.get(`/niyamavali/articles/${id}`)
  return data.data
}

export const getNiyamavaliArticlesAdmin = async (categoryId?: string): Promise<NiyamavaliArticle[]> => {
  const { data } = await request.get("/niyamavali/articles/admin/all", { params: categoryId ? { categoryId } : undefined })
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

export const deleteNiyamavaliArticle = async (id: string) => {
  const { data } = await request.delete(`/niyamavali/articles/${id}`)
  return data
}

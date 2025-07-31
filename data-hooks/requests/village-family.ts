import request from "@/config/request"

// Types
export interface Family {
  id: string
  mukhiyaName: string
  familyId: string
  status: "verified" | "pending" | "draft"
  currentAddress: string
  contactNumber?: string
  economicStatus: string
  genderCount: {
    MALE: number
    FEMALE: number
    OTHER: number
  }
  villageId: string
  createdDate: string
  updatedDate: string
}

export interface Village {
  id: string
  name: string
  choklaId: string
  chakolaName: string
  villageMemberName: string
  mobileNumber: string
  age: number
  email: string
  tehsil: string
  district: string
  state: string
  latitude?: number
  longitude?: number
  isVillageHaveSchool: boolean
  isVillageHavePrimaryHealthCare: boolean
  isVillageHaveCommunityHall: boolean
  families: Family[]
  genderCount: {
    MALE: number
    FEMALE: number
    OTHER: number
  }
  createdDate: string
  updatedDate: string
}

export interface Chokhla {
  id: string
  name: string
  description?: string
  villages: Village[]
  createdDate: string
  updatedDate: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "SUPER_ADMIN" | "CHOKHLA_ADMIN" | "VILLAGE_MEMBER"
  mobileNumber?: string
  createdDate: string
  updatedDate: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Family API calls
export const createFamily = async (payload: Partial<Family>): Promise<ApiResponse<Family>> => {
  const { data } = await request.post("/api/family", payload)
  return data
}

export const updateFamily = async (id: string, payload: Partial<Family>): Promise<ApiResponse<Family>> => {
  const { data } = await request.put(`/api/family/${id}`, payload)
  return data
}

export const getFamilyDetails = async (familyId: string): Promise<ApiResponse<Family>> => {
  const { data } = await request.get(`/api/family/${familyId}`)
  return data
}

export const getAllFamilies = async (
  villageId?: string,
  page = 1,
  limit = 10,
): Promise<ApiResponse<PaginatedResponse<Family>>> => {
  const params = new URLSearchParams()
  if (villageId) params.append("villageId", villageId)
  params.append("page", page.toString())
  params.append("limit", limit.toString())

  const { data } = await request.get(`/api/family?${params.toString()}`)
  return data
}

export const deleteFamilyWithId = async (familyId: string): Promise<ApiResponse<{ id: string }>> => {
  const { data } = await request.delete(`/api/family/${familyId}`)
  return data
}

export const searchFamilies = async (query: string, villageId?: string): Promise<ApiResponse<Family[]>> => {
  const params = new URLSearchParams()
  params.append("q", query)
  if (villageId) params.append("villageId", villageId)

  const { data } = await request.get(`/api/family/search?${params.toString()}`)
  return data
}

export const bulkCreateFamilies = async (families: Partial<Family>[]): Promise<ApiResponse<Family[]>> => {
  const { data } = await request.post("/api/family/bulk", { families })
  return data
}

// Village API calls
export const getVillageDetails = async (villageId: string): Promise<Village> => {
  const { data } = await request.get(`/api/village/${villageId}`)
  return data.data || data
}

export const getAllVillages = async (page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<Village>>> => {
  const { data } = await request.get(`/api/village?page=${page}&limit=${limit}`)
  return data
}

export const getAllVillagesWithChokhlaID = async (chokhlaID: string): Promise<Village[]> => {
  const { data } = await request.get(`/api/village/chokhla/${chokhlaID}`)
  return data.data || data
}

export const createVillage = async (payload: Partial<Village>): Promise<ApiResponse<Village>> => {
  const { data } = await request.post("/api/village", payload)
  return data
}

export const updateVillage = async (id: string, payload: Partial<Village>): Promise<ApiResponse<Village>> => {
  const { data } = await request.put(`/api/village/${id}`, payload)
  return data
}

export const deleteVillage = async (villageId: string): Promise<ApiResponse<{ id: string }>> => {
  const { data } = await request.delete(`/api/village/${villageId}`)
  return data
}

export const updateVillageLocation = async (
  id: string,
  payload: { latitude: number; longitude: number },
): Promise<ApiResponse<Village>> => {
  const { data } = await request.patch(`/api/village/${id}/location`, payload)
  return data
}

export const getVillageStatistics = async (villageId: string): Promise<ApiResponse<any>> => {
  const { data } = await request.get(`/api/village/${villageId}/statistics`)
  return data
}

// Chokhla API calls
export const getChokhlaDetails = async (chokhlaId: string): Promise<ApiResponse<Chokhla>> => {
  const { data } = await request.get(`/api/chokhla/${chokhlaId}`)
  return data
}

export const updateChokhla = async (chokhlaId: string, payload: Partial<Chokhla>): Promise<ApiResponse<Chokhla>> => {
  const { data } = await request.put(`/api/chokhla/${chokhlaId}`, payload)
  return data
}

export const getAllChokhlas = async (page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<Chokhla>>> => {
  const { data } = await request.get(`/api/chokhla?page=${page}&limit=${limit}`)
  return data
}

export const createChokhla = async (payload: Partial<Chokhla>): Promise<ApiResponse<Chokhla>> => {
  const { data } = await request.post("/api/chokhla", payload)
  return data
}

export const deleteChokhla = async (chokhlaId: string): Promise<ApiResponse<{ id: string }>> => {
  const { data } = await request.delete(`/api/chokhla/${chokhlaId}`)
  return data
}

// User API calls
export const getAlluserList = async (page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<User>>> => {
  const { data } = await request.get(`/api/auth/users?page=${page}&limit=${limit}`)
  return data
}

export const createUser = async (payload: Partial<User>): Promise<ApiResponse<User>> => {
  const { data } = await request.post("/api/auth/users", payload)
  return data
}

export const updateUser = async (id: string, payload: Partial<User>): Promise<ApiResponse<User>> => {
  const { data } = await request.put(`/api/auth/users/${id}`, payload)
  return data
}

export const deleteUser = async (userId: string): Promise<ApiResponse<{ id: string }>> => {
  const { data } = await request.delete(`/api/auth/users/${userId}`)
  return data
}

// Export/Import operations
export const exportVillageData = async (villageId: string, format: "csv" | "excel"): Promise<Blob> => {
  const { data } = await request.get(`/api/village/${villageId}/export?format=${format}`, {
    responseType: "blob",
  })
  return data
}

export const importFamilyData = async (
  villageId: string,
  file: File,
): Promise<ApiResponse<{ imported: number; errors: string[] }>> => {
  const formData = new FormData()
  formData.append("file", file)

  const { data } = await request.post(`/api/village/${villageId}/import`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}

// Analytics
export const getAnalytics = async (type: "village" | "chokhla" | "overall", id?: string): Promise<ApiResponse<any>> => {
  const url = id ? `/api/analytics/${type}/${id}` : `/api/analytics/${type}`
  const { data } = await request.get(url)
  return data
}

export const generateReport = async (reportType: string, filters: any): Promise<ApiResponse<any>> => {
  const { data } = await request.post("/api/reports/generate", { reportType, filters })
  return data
}

// Health and version
export const getApiHealth = async (): Promise<{ status: string; timestamp: string; version: string }> => {
  const { data } = await request.get("/health")
  return data
}

export const getApiVersion = async (): Promise<{ version: string; buildDate: string }> => {
  const { data } = await request.get("/api/version")
  return data
}

// Backup and sync
export const createBackup = async (): Promise<ApiResponse<{ backupId: string; url: string }>> => {
  const { data } = await request.post("/api/backup")
  return data
}

export const syncWithBackend = async (): Promise<ApiResponse<{ synced: boolean; timestamp: string }>> => {
  const { data } = await request.post("/api/sync")
  return data
}

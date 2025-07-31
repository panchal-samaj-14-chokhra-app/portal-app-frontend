import request from "@/config/request"

// Type definitions for better type safety
export interface FamilyPayload {
  familyHead: string
  members: Array<{
    name: string
    age: number
    relation: string
    occupation?: string
  }>
  address: string
  phoneNumber?: string
  villageId: string
}

export interface VillagePayload {
  name: string
  chokhlaId: string
  latitude?: number
  longitude?: number
  population?: number
  description?: string
}

export interface ChokhlaPayload {
  name: string
  description?: string
  adminId?: string
}

// Health and version endpoints
export const getApiHealth = async () => {
  const { data } = await request.get("/health")
  return data
}

export const getApiVersion = async () => {
  const { data } = await request.get("/api/version")
  return data
}

// Family CRUD operations
export const createFamily = async (payload: FamilyPayload) => {
  const { data } = await request.post("/family/create", payload)
  return data
}

export const updateFamily = async (id: string, payload: Partial<FamilyPayload>) => {
  const { data } = await request.put(`/family/${id}`, payload)
  return data
}

export const getFamilyDetails = async (id: string) => {
  const { data } = await request.get(`/family/${id}`)
  return data
}

export const getAllFamilies = async (villageId?: string, page = 1, limit = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (villageId) {
    params.append("villageId", villageId)
  }

  const { data } = await request.get(`/family?${params}`)
  return data
}

export const deleteFamilyWithId = async (id: string) => {
  const { data } = await request.delete(`/family/delete/${id}`)
  return data
}

export const searchFamilies = async (query: string, villageId?: string) => {
  const params = new URLSearchParams({ query })
  if (villageId) params.append("villageId", villageId)

  const { data } = await request.get(`/family/search?${params}`)
  return data
}

export const bulkCreateFamilies = async (families: FamilyPayload[]) => {
  const { data } = await request.post("/family/bulk-create", { families })
  return data
}

// Village CRUD operations
export const getVillageDetails = async (id: string) => {
  const { data } = await request.get(`/village/${id}`)
  return data
}

export const getAllVillages = async (page = 1, limit = 50) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  const { data } = await request.get(`/village?${params}`)
  return data
}

export const getAllVillagesWithChokhlaID = async (chokhlaID: string) => {
  const { data } = await request.get(`/chokhla/getvillage/${chokhlaID}`)
  return data
}

export const createVillage = async (payload: VillagePayload) => {
  const { data } = await request.post("/village/create", payload)
  return data
}

export const updateVillage = async (id: string, payload: Partial<VillagePayload>) => {
  const { data } = await request.put(`/village/${id}`, payload)
  return data
}

export const deleteVillage = async (id: string) => {
  const { data } = await request.delete(`/village/${id}`)
  return data
}

export const updateVillageLocation = async (id: string, payload: { latitude: number; longitude: number }) => {
  const { data } = await request.put(`/village/${id}/location`, payload)
  return data
}

export const getVillageStatistics = async (id: string) => {
  const { data } = await request.get(`/village/${id}/statistics`)
  return data
}

// Chokhla CRUD operations
export const getChokhlaDetails = async (id: string) => {
  const { data } = await request.get(`/chokhla/${id}`)
  return data
}

export const updateChokhla = async (id: string, payload: Partial<ChokhlaPayload>) => {
  const { data } = await request.put(`/chokhla/${id}`, payload)
  return data
}

export const getAllChokhlas = async (page = 1, limit = 50) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  const { data } = await request.get(`/chokhla?${params}`)
  return data
}

export const createChokhla = async (payload: ChokhlaPayload) => {
  const { data } = await request.post("/chokhla/create", payload)
  return data
}

export const deleteChokhla = async (id: string) => {
  const { data } = await request.delete(`/chokhla/${id}`)
  return data
}

// User management
export const getAlluserList = async (page = 1, limit = 50) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  const { data } = await request.get(`/api/auth/users?${params}`)
  return data
}

export const createUser = async (payload: {
  email: string
  password: string
  role: string
  chokhlaId?: string
  villageId?: string
}) => {
  const { data } = await request.post("/api/auth/users", payload)
  return data
}

export const updateUser = async (id: string, payload: any) => {
  const { data } = await request.put(`/api/auth/users/${id}`, payload)
  return data
}

export const deleteUser = async (id: string) => {
  const { data } = await request.delete(`/api/auth/users/${id}`)
  return data
}

// Export and import operations
export const exportVillageData = async (villageId: string, format: "csv" | "excel" = "csv") => {
  const { data } = await request.get(`/village/${villageId}/export?format=${format}`, {
    responseType: "blob",
  })
  return data
}

export const importFamilyData = async (villageId: string, file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("villageId", villageId)

  const { data } = await request.post("/family/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}

// Analytics and reporting
export const getAnalytics = async (type: "village" | "chokhla" | "overall", id?: string) => {
  const url = id ? `/analytics/${type}/${id}` : `/analytics/${type}`
  const { data } = await request.get(url)
  return data
}

export const generateReport = async (reportType: string, filters: any) => {
  const { data } = await request.post("/reports/generate", {
    type: reportType,
    filters,
  })
  return data
}

// Backup and sync operations
export const createBackup = async () => {
  const { data } = await request.post("/backup/create")
  return data
}

export const syncWithBackend = async () => {
  const { data } = await request.post("/sync/full")
  return data
}

// Legacy API call (keeping for backward compatibility)
export const getApiCall = async () => {
  const { data } = await request.get("/")
  return { data }
}

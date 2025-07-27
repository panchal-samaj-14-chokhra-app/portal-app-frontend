import request from "@/config/request"
import type {
  ApiResponse,
  Family,
  Village,
  Chokhla,
  User,
  CreateFamilyPayload,
  CreateVillagePayload,
  CreateChokhlaPayload,
  UpdateFamilyPayload,
} from "@/types"

// Family API functions
export const createFamily = async (payload: CreateFamilyPayload): Promise<ApiResponse<Family>> => {
  const response = await request.post("/api/families", payload)
  return response.data
}

export const updateFamily = async (id: string, payload: Partial<CreateFamilyPayload>): Promise<ApiResponse<Family>> => {
  const response = await request.put(`/api/families/${id}`, payload)
  return response.data
}

export const getFamilyDetails = async (familyId: string): Promise<ApiResponse<Family>> => {
  const response = await request.get(`/api/families/${familyId}`)
  return response.data
}

export const deleteFamilyWithId = async (familyId: string): Promise<ApiResponse> => {
  const response = await request.delete(`/api/families/${familyId}`)
  return response.data
}

// Village API functions
export const getVillageDetails = async (villageId: string): Promise<ApiResponse<Village>> => {
  const response = await request.get(`/api/villages/${villageId}`)
  return response.data
}

export const getAllVillages = async (): Promise<ApiResponse<Village[]>> => {
  const response = await request.get("/api/villages")
  return response.data
}

export const getAllVillagesWithChokhlaID = async (chokhlaId: string): Promise<ApiResponse<Village[]>> => {
  const response = await request.get(`/api/villages?choklaId=${chokhlaId}`)
  return response.data
}

export const createVillage = async (payload: CreateVillagePayload): Promise<ApiResponse<Village>> => {
  const response = await request.post("/api/villages", payload)
  return response.data
}

// Chokhla API functions
export const getChokhlaDetails = async (chokhlaId: string): Promise<ApiResponse<Chokhla>> => {
  const response = await request.get(`/api/chokhlas/${chokhlaId}`)
  return response.data
}

export const updateChokhla = async (chokhlaId: string, payload: Partial<Chokhla>): Promise<ApiResponse<Chokhla>> => {
  const response = await request.put(`/api/chokhlas/${chokhlaId}`, payload)
  return response.data
}

export const getAllChokhlas = async (): Promise<ApiResponse<Chokhla[]>> => {
  const response = await request.get("/api/chokhlas")
  return response.data
}

export const createChokhla = async (payload: CreateChokhlaPayload): Promise<ApiResponse<Chokhla>> => {
  const response = await request.post("/api/chokhlas", payload)
  return response.data
}

// User API functions
export const getAlluserList = async (): Promise<ApiResponse<User[]>> => {
  const response = await request.get("/api/users")
  return response.data
}

// Export types for use in other files
export type {
  ApiResponse,
  Family,
  Village,
  Chokhla,
  User,
  CreateFamilyPayload,
  CreateVillagePayload,
  CreateChokhlaPayload,
  UpdateFamilyPayload,
}

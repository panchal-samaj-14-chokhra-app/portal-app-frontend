import type {
  ApiResponse,
  PaginatedResponse,
  Family,
  Village,
  Chokhla,
  Person,
  CreateFamilyPayload,
  CreateVillagePayload,
  CreateChokhlaPayload,
  UpdateFamilyPayload,
  DashboardStats,
  FamilyRequest,
  ChandaRecord,
  ChandaSummary,
} from "@/types"

const BASE_URL = process.env.NEXT_PUBLIC_REQUEST_URL || "https://panchal-samaj-backend-node-js.vercel.app"

// Helper function to get auth headers
const getAuthHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
})

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(token),
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    throw error
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) =>
    apiRequest<{ user: any; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: async (token: string) =>
    apiRequest(
      "/api/auth/logout",
      {
        method: "POST",
      },
      token,
    ),

  resetPassword: async (email: string) =>
    apiRequest("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
}

// Dashboard API
export const dashboardAPI = {
  getStats: async (token: string) => apiRequest<DashboardStats>("/api/dashboard/stats", {}, token),
}

// Chokhla API
export const chokhlaAPI = {
  getAll: async (token: string) => apiRequest<Chokhla[]>("/api/chokhlas", {}, token),

  getById: async (id: string, token: string) => apiRequest<Chokhla>(`/api/chokhlas/${id}`, {}, token),

  create: async (data: CreateChokhlaPayload, token: string) =>
    apiRequest<Chokhla>(
      "/api/chokhlas",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token,
    ),

  update: async (id: string, data: Partial<CreateChokhlaPayload>, token: string) =>
    apiRequest<Chokhla>(
      `/api/chokhlas/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token,
    ),

  delete: async (id: string, token: string) =>
    apiRequest(
      `/api/chokhlas/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),
}

// Village API
export const villageAPI = {
  getAll: async (token: string, choklaId?: string) => {
    const params = choklaId ? `?choklaId=${choklaId}` : ""
    return apiRequest<Village[]>(`/api/villages${params}`, {}, token)
  },

  getById: async (id: string, token: string) => apiRequest<Village>(`/api/villages/${id}`, {}, token),

  create: async (data: CreateVillagePayload, token: string) =>
    apiRequest<Village>(
      "/api/villages",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token,
    ),

  update: async (id: string, data: Partial<CreateVillagePayload>, token: string) =>
    apiRequest<Village>(
      `/api/villages/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token,
    ),

  delete: async (id: string, token: string) =>
    apiRequest(
      `/api/villages/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),
}

// Family API
export const familyAPI = {
  getAll: async (token: string, villageId?: string, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(villageId && { villageId }),
    })
    return apiRequest<PaginatedResponse<Family>>(`/api/families?${params}`, {}, token)
  },

  getById: async (id: string, token: string) => apiRequest<Family>(`/api/families/${id}`, {}, token),

  create: async (data: CreateFamilyPayload, token: string) =>
    apiRequest<Family>(
      "/api/families",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token,
    ),

  update: async (id: string, data: UpdateFamilyPayload, token: string) =>
    apiRequest<Family>(
      `/api/families/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token,
    ),

  delete: async (id: string, token: string) =>
    apiRequest(
      `/api/families/${id}`,
      {
        method: "DELETE",
      },
      token,
    ),

  addMember: async (familyId: string, memberData: Omit<Person, "id" | "familyId">, token: string) =>
    apiRequest<Person>(
      `/api/families/${familyId}/members`,
      {
        method: "POST",
        body: JSON.stringify(memberData),
      },
      token,
    ),

  updateMember: async (familyId: string, memberId: string, memberData: Partial<Person>, token: string) =>
    apiRequest<Person>(
      `/api/families/${familyId}/members/${memberId}`,
      {
        method: "PUT",
        body: JSON.stringify(memberData),
      },
      token,
    ),

  deleteMember: async (familyId: string, memberId: string, token: string) =>
    apiRequest(
      `/api/families/${familyId}/members/${memberId}`,
      {
        method: "DELETE",
      },
      token,
    ),
}

// Request API
export const requestAPI = {
  getAll: async (token: string, status?: string) => {
    const params = status ? `?status=${status}` : ""
    return apiRequest<FamilyRequest[]>(`/api/requests${params}`, {}, token)
  },

  approve: async (id: string, token: string) =>
    apiRequest(
      `/api/requests/${id}/approve`,
      {
        method: "POST",
      },
      token,
    ),

  reject: async (id: string, comments: string, token: string) =>
    apiRequest(
      `/api/requests/${id}/reject`,
      {
        method: "POST",
        body: JSON.stringify({ comments }),
      },
      token,
    ),
}

// Chanda API
export const chandaAPI = {
  getSummary: async (token: string, year?: number) => {
    const params = year ? `?year=${year}` : ""
    return apiRequest<ChandaSummary>(`/api/chanda/summary${params}`, {}, token)
  },

  getRecords: async (token: string, villageId?: string, year?: number) => {
    const params = new URLSearchParams()
    if (villageId) params.append("villageId", villageId)
    if (year) params.append("year", year.toString())

    return apiRequest<ChandaRecord[]>(`/api/chanda/records?${params}`, {}, token)
  },

  markPaid: async (id: string, token: string) =>
    apiRequest(
      `/api/chanda/records/${id}/mark-paid`,
      {
        method: "POST",
      },
      token,
    ),
}

// Export all APIs
export const API = {
  auth: authAPI,
  dashboard: dashboardAPI,
  chokhla: chokhlaAPI,
  village: villageAPI,
  family: familyAPI,
  request: requestAPI,
  chanda: chandaAPI,
}

export default API

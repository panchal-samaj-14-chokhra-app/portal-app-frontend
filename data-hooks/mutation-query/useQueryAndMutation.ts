import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import { API } from "@/config/request"
import { useSession } from "next-auth/react"
import type {
  ApiResponse,
  Family,
  Village,
  Chokhla,
  CreateFamilyPayload,
  CreateVillagePayload,
  CreateChokhlaPayload,
  UpdateFamilyPayload,
  DashboardStats,
  FamilyRequest,
  ChandaSummary,
  ChandaRecord,
} from "@/types"

// Custom hook to get auth token
const useAuthToken = () => {
  const { data: session } = useSession()
  return session?.user?.token
}

// Dashboard hooks
export const useDashboardStats = (options?: UseQueryOptions<ApiResponse<DashboardStats>>) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => API.dashboard.getStats(token!),
    enabled: !!token,
    ...options,
  })
}

// Chokhla hooks
export const useChokhlas = (options?: UseQueryOptions<ApiResponse<Chokhla[]>>) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["chokhlas"],
    queryFn: () => API.chokhla.getAll(token!),
    enabled: !!token,
    ...options,
  })
}

export const useChokhla = (id: string, options?: UseQueryOptions<ApiResponse<Chokhla>>) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["chokhlas", id],
    queryFn: () => API.chokhla.getById(id, token!),
    enabled: !!token && !!id,
    ...options,
  })
}

export const useCreateChokhla = (options?: UseMutationOptions<ApiResponse<Chokhla>, Error, CreateChokhlaPayload>) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateChokhlaPayload) => API.chokhla.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
    },
    ...options,
  })
}

export const useUpdateChokhla = (
  options?: UseMutationOptions<ApiResponse<Chokhla>, Error, { id: string; data: Partial<CreateChokhlaPayload> }>,
) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateChokhlaPayload> }) =>
      API.chokhla.update(id, data, token!),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
      queryClient.invalidateQueries({ queryKey: ["chokhlas", id] })
    },
    ...options,
  })
}

export const useDeleteChokhla = (options?: UseMutationOptions<ApiResponse, Error, string>) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => API.chokhla.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
    },
    ...options,
  })
}

// Village hooks
export const useVillages = (choklaId?: string, options?: UseQueryOptions<ApiResponse<Village[]>>) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["villages", choklaId],
    queryFn: () => API.village.getAll(token!, choklaId),
    enabled: !!token,
    ...options,
  })
}

export const useVillage = (id: string, options?: UseQueryOptions<ApiResponse<Village>>) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["villages", id],
    queryFn: () => API.village.getById(id, token!),
    enabled: !!token && !!id,
    ...options,
  })
}

export const useCreateVillage = (options?: UseMutationOptions<ApiResponse<Village>, Error, CreateVillagePayload>) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateVillagePayload) => API.village.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["villages"] })
    },
    ...options,
  })
}

export const useUpdateVillage = (
  options?: UseMutationOptions<ApiResponse<Village>, Error, { id: string; data: Partial<CreateVillagePayload> }>,
) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVillagePayload> }) =>
      API.village.update(id, data, token!),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["villages"] })
      queryClient.invalidateQueries({ queryKey: ["villages", id] })
    },
    ...options,
  })
}

export const useDeleteVillage = (options?: UseMutationOptions<ApiResponse, Error, string>) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => API.village.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["villages"] })
    },
    ...options,
  })
}

// Family hooks
export const useFamilies = (villageId?: string, page = 1, limit = 10, options?: UseQueryOptions<ApiResponse<any>>) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["families", villageId, page, limit],
    queryFn: () => API.family.getAll(token!, villageId, page, limit),
    enabled: !!token,
    ...options,
  })
}

export const useFamily = (id: string, options?: UseQueryOptions<ApiResponse<Family>>) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["families", id],
    queryFn: () => API.family.getById(id, token!),
    enabled: !!token && !!id,
    ...options,
  })
}

export const useCreateFamily = (options?: UseMutationOptions<ApiResponse<Family>, Error, CreateFamilyPayload>) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFamilyPayload) => API.family.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
      queryClient.invalidateQueries({ queryKey: ["villages"] })
    },
    ...options,
  })
}

export const useUpdateFamily = (options?: UseMutationOptions<ApiResponse<Family>, Error, UpdateFamilyPayload>) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateFamilyPayload) => API.family.update(data.id, data, token!),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
      queryClient.invalidateQueries({ queryKey: ["families", data.id] })
      queryClient.invalidateQueries({ queryKey: ["villages"] })
    },
    ...options,
  })
}

export const useDeleteFamily = (options?: UseMutationOptions<ApiResponse, Error, string>) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => API.family.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
      queryClient.invalidateQueries({ queryKey: ["villages"] })
    },
    ...options,
  })
}

// Request hooks
export const useFamilyRequests = (status?: string, options?: UseQueryOptions<ApiResponse<FamilyRequest[]>>) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["requests", status],
    queryFn: () => API.request.getAll(token!, status),
    enabled: !!token,
    ...options,
  })
}

export const useApproveRequest = (options?: UseMutationOptions<ApiResponse, Error, string>) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => API.request.approve(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] })
    },
    ...options,
  })
}

export const useRejectRequest = (
  options?: UseMutationOptions<ApiResponse, Error, { id: string; comments: string }>,
) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments: string }) => API.request.reject(id, comments, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] })
    },
    ...options,
  })
}

// Chanda hooks
export const useChandaSummary = (year?: number, options?: UseQueryOptions<ApiResponse<ChandaSummary>>) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["chanda", "summary", year],
    queryFn: () => API.chanda.getSummary(token!, year),
    enabled: !!token,
    ...options,
  })
}

export const useChandaRecords = (
  villageId?: string,
  year?: number,
  options?: UseQueryOptions<ApiResponse<ChandaRecord[]>>,
) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["chanda", "records", villageId, year],
    queryFn: () => API.chanda.getRecords(token!, villageId, year),
    enabled: !!token,
    ...options,
  })
}

export const useMarkChandaPaid = (options?: UseMutationOptions<ApiResponse, Error, string>) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => API.chanda.markPaid(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chanda"] })
    },
    ...options,
  })
}

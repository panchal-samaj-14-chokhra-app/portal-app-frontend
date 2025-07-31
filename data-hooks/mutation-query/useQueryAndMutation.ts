import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  // Family operations
  createFamily,
  updateFamily,
  getFamilyDetails,
  getAllFamilies,
  deleteFamilyWithId,
  searchFamilies,
  bulkCreateFamilies,
  // Village operations
  getVillageDetails,
  getAllVillages,
  getAllVillagesWithChokhlaID,
  createVillage,
  updateVillage,
  deleteVillage,
  updateVillageLocation,
  getVillageStatistics,
  // Chokhla operations
  getChokhlaDetails,
  updateChokhla,
  // User operations
  getAlluserList,
  createUser,
  updateUser,
  deleteUser,
  // Export/Import operations
  exportVillageData,
  importFamilyData,
  // Analytics
  getAnalytics,
  generateReport,
  // Health and version
  getApiHealth,
  getApiVersion,
  // Backup and sync
  createBackup,
  syncWithBackend,
} from "../requests/village-family"

// Mock data for chokhlas
const mockChokhlas = [
  {
    id: "1",
    name: "मुख्य चौकला",
    adminName: "राम शर्मा",
    adminEmail: "ram@example.com",
    adminPhone: "9876543210",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    villageCount: 25,
    familyCount: 150,
  },
  {
    id: "2",
    name: "उत्तरी चौकला",
    adminName: "श्याम गुप्ता",
    adminEmail: "shyam@example.com",
    adminPhone: "9876543211",
    status: "active",
    createdAt: "2024-01-20T14:15:00Z",
    villageCount: 18,
    familyCount: 120,
  },
]

// Health and version hooks
export const useApiHealth = () => {
  return useQuery({
    queryKey: ["api-health"],
    queryFn: getApiHealth,
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
  })
}

export const useApiVersion = () => {
  return useQuery({
    queryKey: ["api-version"],
    queryFn: getApiVersion,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Family hooks
export const useCreateFamily = (onSuccess?: any, onError?: (error: Error) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFamily,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
      queryClient.invalidateQueries({ queryKey: ["village-details"] })
      queryClient.invalidateQueries({ queryKey: ["village-statistics"] })
      if (onSuccess) onSuccess(data)
    },
    onError: (err: Error) => {
      if (onError) onError(err)
      else console.error("Create family error:", err)
    },
  })
}

export const useUpdateFamily = (onSuccess?: any, onError?: (error: Error) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateFamily(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["family-detail", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["families"] })
      queryClient.invalidateQueries({ queryKey: ["village-details"] })
      if (onSuccess) onSuccess(data)
    },
    onError: (err: Error) => {
      if (onError) onError(err)
      else console.error("Update family error:", err)
    },
  })
}

export const useGetFamilyDetails = (familyId: string) => {
  return useQuery({
    queryKey: ["family-detail", familyId],
    queryFn: () => getFamilyDetails(familyId),
    enabled: !!familyId,
  })
}

export const useGetAllFamilies = (villageId?: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["families", villageId, page, limit],
    queryFn: () => getAllFamilies(villageId, page, limit),
  })
}

export const useDeleteFamilyUsingID = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (familyId: string) => deleteFamilyWithId(familyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
      queryClient.invalidateQueries({ queryKey: ["village-details"] })
      queryClient.invalidateQueries({ queryKey: ["village-statistics"] })
    },
    onError: (error) => {
      console.error("Delete failed:", error)
    },
  })
}

export const useSearchFamilies = (query: string, villageId?: string) => {
  return useQuery({
    queryKey: ["search-families", query, villageId],
    queryFn: () => searchFamilies(query, villageId),
    enabled: query.length > 2,
  })
}

export const useBulkCreateFamilies = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bulkCreateFamilies,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
      queryClient.invalidateQueries({ queryKey: ["village-details"] })
      queryClient.invalidateQueries({ queryKey: ["village-statistics"] })
    },
  })
}

// Village hooks
export const useVillageDetails = (villageId: string) => {
  return useQuery({
    queryKey: ["village-details", villageId],
    queryFn: () => getVillageDetails(villageId),
    enabled: !!villageId,
  })
}

export const useAllVillages = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: ["all-villages", page, limit],
    queryFn: () => getAllVillages(page, limit),
  })
}

export const useGetAllVillageswithChokhlaID = (chokhlaID: string) => {
  return useQuery({
    queryKey: ["all-villages-with-chokhla-id", chokhlaID],
    queryFn: () => getAllVillagesWithChokhlaID(chokhlaID),
    enabled: !!chokhlaID,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const useCreateVillage = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVillage,
    onSuccess: (data) => {
      // Invalidate all village-related queries
      queryClient.invalidateQueries({ queryKey: ["all-villages"] })
      queryClient.invalidateQueries({ queryKey: ["all-villages-with-chokhla-id"] })
      queryClient.invalidateQueries({ queryKey: ["village-statistics"] })

      if (onSuccess) onSuccess(data)
    },
    onError: (error: Error) => {
      console.error("Create village error:", error)
      if (onError) onError(error)
    },
  })
}

export const useUpdateVillage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateVillage(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["village-details", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["all-villages"] })
      queryClient.invalidateQueries({ queryKey: ["all-villages-with-chokhla-id"] })
    },
  })
}

export const useDeleteVillage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteVillage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-villages"] })
      queryClient.invalidateQueries({ queryKey: ["all-villages-with-chokhla-id"] })
    },
  })
}

export const useUpdateVillageLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { latitude: number; longitude: number } }) =>
      updateVillageLocation(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["village-details", variables.id] })
    },
  })
}

export const useVillageStatistics = (villageId: string) => {
  return useQuery({
    queryKey: ["village-statistics", villageId],
    queryFn: () => getVillageStatistics(villageId),
    enabled: !!villageId,
  })
}

// Chokhla hooks
export const useChokhlaDetails = (chokhlaId: string) => {
  return useQuery({
    queryKey: ["chokhla-details", chokhlaId],
    queryFn: () => getChokhlaDetails(chokhlaId),
    enabled: !!chokhlaId,
  })
}

export const useUpdateChokhla = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateChokhla(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chokhla-details"] })
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
    },
  })
}

export const useAllChokhlas = () => {
  return useQuery({
    queryKey: ["chokhlas"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return mockChokhlas
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateChokhla = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newChokhla: any) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return { ...newChokhla, id: Date.now().toString() }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
    },
  })
}

export const useDeleteChokhla = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chokhlas"] })
    },
  })
}

export const useChokhlaById = (id: string) => {
  return useQuery({
    queryKey: ["chokhla", id],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      return mockChokhlas.find((chokhla) => chokhla.id === id) || null
    },
    enabled: !!id,
  })
}

// Alias for backward compatibility
export const useGetAllChokhlas = useAllChokhlas

// User hooks
export const useGetAllUserList = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: ["all-users", page, limit],
    queryFn: () => getAlluserList(page, limit),
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] })
    },
  })
}

// Export/Import hooks
export const useExportVillageData = () => {
  return useMutation({
    mutationFn: ({ villageId, format }: { villageId: string; format: "csv" | "excel" }) =>
      exportVillageData(villageId, format),
  })
}

export const useImportFamilyData = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ villageId, file }: { villageId: string; file: File }) => importFamilyData(villageId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] })
      queryClient.invalidateQueries({ queryKey: ["village-details"] })
      queryClient.invalidateQueries({ queryKey: ["village-statistics"] })
    },
  })
}

// Analytics hooks
export const useAnalytics = (type: "village" | "chokhla" | "overall", id?: string) => {
  return useQuery({
    queryKey: ["analytics", type, id],
    queryFn: () => getAnalytics(type, id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: ({ reportType, filters }: { reportType: string; filters: any }) => generateReport(reportType, filters),
  })
}

// Backup and sync hooks
export const useCreateBackup = () => {
  return useMutation({
    mutationFn: createBackup,
  })
}

export const useSyncWithBackend = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: syncWithBackend,
    onSuccess: () => {
      // Invalidate all queries after sync
      queryClient.invalidateQueries()
    },
  })
}

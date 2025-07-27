import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createFamily,
  deleteFamilyWithId,
  getFamilyDetails,
  getVillageDetails,
  updateFamily,
  getAllVillages,
  createVillage,
  getChokhlaDetails,
  updateChokhla,
  getAllChokhlas,
  createChokhla,
  getAllVillagesWithChokhlaID,
  getAlluserList,
  type CreateFamilyPayload,
  type CreateVillagePayload,
  type CreateChokhlaPayload,
  type Family,
  type Chokhla,
  type ApiResponse,
} from "../requests/village-family"

interface MutationCallbacks<T = any> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export const useCreateFamily = (callbacks?: MutationCallbacks<ApiResponse<Family>>) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: CreateFamilyPayload) => createFamily(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["village-details"] })
      queryClient.invalidateQueries({ queryKey: ["family-list"] })
      callbacks?.onSuccess?.(data)
    },
    onError: (err: Error) => {
      callbacks?.onError?.(err)
      console.error("Create family error:", err)
    },
  })
  return { mutation }
}

export const useUpdateFamily = (callbacks?: MutationCallbacks<ApiResponse<Family>>) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateFamilyPayload> }) => updateFamily(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["family-detail"] })
      queryClient.invalidateQueries({ queryKey: ["village-details"] })
      callbacks?.onSuccess?.(data)
    },
    onError: (err: Error) => {
      callbacks?.onError?.(err)
      console.error("Update family error:", err)
    },
  })

  return { mutation }
}

export const useGetFamilyDetails = (familyId: string) => {
  return useQuery({
    queryKey: ["family-detail", familyId],
    queryFn: () => getFamilyDetails(familyId),
    enabled: !!familyId,
  })
}

export const useDeleteFamilyUsingID = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (familyId: string) => deleteFamilyWithId(familyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-list"] })
      queryClient.invalidateQueries({ queryKey: ["village-details"] })
    },
    onError: (error: Error) => {
      console.error("Delete failed:", error)
    },
  })
}

export const useVillageDetails = (villageId: string) => {
  return useQuery({
    queryKey: ["village-details", villageId],
    queryFn: () => getVillageDetails(villageId),
    enabled: !!villageId,
  })
}

export const useAllVillages = () => {
  return useQuery({
    queryKey: ["all-villages"],
    queryFn: getAllVillages,
  })
}

export const useGetAllVillageswithChokhlaID = (chokhlaID: string) => {
  return useQuery({
    queryKey: ["all-villages-with-chokhla-id", chokhlaID],
    queryFn: () => getAllVillagesWithChokhlaID(chokhlaID),
    enabled: !!chokhlaID,
  })
}

export const useCreateVillage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateVillagePayload) => createVillage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-villages"] })
      queryClient.invalidateQueries({ queryKey: ["all-villages-with-chokhla-id"] })
    },
    onError: (error: Error) => {
      console.error("Create village error:", error)
    },
  })
}

export const useChokhlaDetails = (chokhlaId: string) => {
  return useQuery({
    queryKey: ["chokhla-details", chokhlaId],
    queryFn: () => getChokhlaDetails(chokhlaId),
    enabled: !!chokhlaId,
  })
}

export const useUpdateChokhla = (chokhlaId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Chokhla>) => updateChokhla(chokhlaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chokhla-details", chokhlaId] })
      queryClient.invalidateQueries({ queryKey: ["all-chokhlas"] })
    },
    onError: (error: Error) => {
      console.error("Update chokhla error:", error)
    },
  })
}

export const useAllChokhlas = () => {
  return useQuery({
    queryKey: ["all-chokhlas"],
    queryFn: getAllChokhlas,
  })
}

export const useCreateChokhla = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateChokhlaPayload) => createChokhla(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-chokhlas"] })
    },
    onError: (error: Error) => {
      console.error("Create chokhla error:", error)
    },
  })
}

export const useGetAllUserList = () => {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: getAlluserList,
  })
}

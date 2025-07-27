import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { API } from "@/config/request"
import type { CreateFamilyPayload, UpdateFamilyPayload, Person } from "@/types"

// Custom hook to get auth token
const useAuthToken = () => {
  const { data: session } = useSession()
  return session?.user?.token
}

// Village-specific family hooks
export const useVillageFamilies = (villageId: string, page = 1, limit = 10) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["village-families", villageId, page, limit],
    queryFn: () => API.family.getAll(token!, villageId, page, limit),
    enabled: !!token && !!villageId,
  })
}

export const useVillageFamily = (villageId: string, familyId: string) => {
  const token = useAuthToken()

  return useQuery({
    queryKey: ["village-family", villageId, familyId],
    queryFn: () => API.family.getById(familyId, token!),
    enabled: !!token && !!villageId && !!familyId,
  })
}

export const useCreateVillageFamily = (villageId: string) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFamilyPayload) => {
      const familyData = { ...data, villageId }
      return API.family.create(familyData, token!)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-families", villageId] })
      queryClient.invalidateQueries({ queryKey: ["villages", villageId] })
      queryClient.invalidateQueries({ queryKey: ["families"] })
    },
  })
}

export const useUpdateVillageFamily = (villageId: string) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateFamilyPayload) => API.family.update(data.id, data, token!),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["village-families", villageId] })
      queryClient.invalidateQueries({ queryKey: ["village-family", villageId, data.id] })
      queryClient.invalidateQueries({ queryKey: ["villages", villageId] })
      queryClient.invalidateQueries({ queryKey: ["families", data.id] })
    },
  })
}

export const useDeleteVillageFamily = (villageId: string) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (familyId: string) => API.family.delete(familyId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-families", villageId] })
      queryClient.invalidateQueries({ queryKey: ["villages", villageId] })
      queryClient.invalidateQueries({ queryKey: ["families"] })
    },
  })
}

// Family member management hooks
export const useAddFamilyMember = (villageId: string, familyId: string) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberData: Omit<Person, "id" | "familyId">) => API.family.addMember(familyId, memberData, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-family", villageId, familyId] })
      queryClient.invalidateQueries({ queryKey: ["families", familyId] })
      queryClient.invalidateQueries({ queryKey: ["village-families", villageId] })
    },
  })
}

export const useUpdateFamilyMember = (villageId: string, familyId: string) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ memberId, memberData }: { memberId: string; memberData: Partial<Person> }) =>
      API.family.updateMember(familyId, memberId, memberData, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-family", villageId, familyId] })
      queryClient.invalidateQueries({ queryKey: ["families", familyId] })
      queryClient.invalidateQueries({ queryKey: ["village-families", villageId] })
    },
  })
}

export const useDeleteFamilyMember = (villageId: string, familyId: string) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberId: string) => API.family.deleteMember(familyId, memberId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-family", villageId, familyId] })
      queryClient.invalidateQueries({ queryKey: ["families", familyId] })
      queryClient.invalidateQueries({ queryKey: ["village-families", villageId] })
    },
  })
}

// Bulk operations
export const useBulkUpdateFamilies = (villageId: string) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: UpdateFamilyPayload[]) => {
      const promises = updates.map((update) => API.family.update(update.id, update, token!))
      return Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-families", villageId] })
      queryClient.invalidateQueries({ queryKey: ["villages", villageId] })
      queryClient.invalidateQueries({ queryKey: ["families"] })
    },
  })
}

export const useBulkDeleteFamilies = (villageId: string) => {
  const token = useAuthToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (familyIds: string[]) => {
      const promises = familyIds.map((id) => API.family.delete(id, token!))
      return Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-families", villageId] })
      queryClient.invalidateQueries({ queryKey: ["villages", villageId] })
      queryClient.invalidateQueries({ queryKey: ["families"] })
    },
  })
}

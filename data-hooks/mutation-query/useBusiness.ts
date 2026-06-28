import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAdminBusinesses, createBusiness, updateBusiness, deleteBusiness, getPersonsByVillage } from "@/data-hooks/requests/business"

export const useBusinesses = (chokhlaId?: string) =>
  useQuery({ queryKey: ["admin-businesses", chokhlaId || "all"], queryFn: () => getAdminBusinesses(chokhlaId) })

export const usePersonsByVillage = (villageId?: string) =>
  useQuery({
    queryKey: ["persons-by-village", villageId],
    queryFn: () => getPersonsByVillage(villageId as string),
    enabled: !!villageId,
  })

export const useCreateBusiness = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: any) => createBusiness(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-businesses"] }),
  })
}

export const useUpdateBusiness = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateBusiness(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-businesses"] }),
  })
}

export const useDeleteBusiness = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBusiness(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-businesses"] }),
  })
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getKaryakarni, getKaryakarniAdmin,
  createKaryakarniMember, updateKaryakarniMember, deleteKaryakarniMember,
} from "@/data-hooks/requests/karyakarni"
import type { KaryakarniMember } from "@/data-hooks/requests/karyakarni"

const KEY = ["karyakarni"]

export const useKaryakarni = (type?: string) =>
  useQuery({ queryKey: [...KEY, type], queryFn: () => getKaryakarni(type ? { type } : undefined), staleTime: 60_000 })

export const useKaryakarniAdmin = (type?: string) =>
  useQuery({ queryKey: [...KEY, "admin", type], queryFn: () => getKaryakarniAdmin(type ? { type } : undefined) })

export function useCreateKaryakarniMember() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: createKaryakarniMember, onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) })
}

export function useUpdateKaryakarniMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<KaryakarniMember>) => updateKaryakarniMember(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteKaryakarniMember() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: deleteKaryakarniMember, onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) })
}

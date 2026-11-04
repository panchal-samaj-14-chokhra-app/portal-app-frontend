import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getDutyRegisterList,
  getDutyRegisterStats,
  getDutyRegisterEntry,
  createDutyRegisterEntry,
  updateDutyRegisterEntry,
  deleteDutyRegisterEntry,
  type DutyRegisterEntry,
  type DutyRegisterFilters,
} from "@/data-hooks/requests/duty-register"

export const useDutyRegisterList = (filters: DutyRegisterFilters) =>
  useQuery({
    queryKey: ["duty-register", filters],
    queryFn: () => getDutyRegisterList(filters),
    staleTime: 0,
  })

export const useDutyRegisterStats = () =>
  useQuery({ queryKey: ["duty-register-stats"], queryFn: getDutyRegisterStats, staleTime: 0 })

export const useDutyRegisterEntry = (id: string) =>
  useQuery({
    queryKey: ["duty-register-entry", id],
    queryFn: () => getDutyRegisterEntry(id),
    enabled: !!id,
    staleTime: 0,
  })

export const useCreateDutyRegisterEntry = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<DutyRegisterEntry>) => createDutyRegisterEntry(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["duty-register"] })
      qc.invalidateQueries({ queryKey: ["duty-register-stats"] })
    },
  })
}

export const useUpdateDutyRegisterEntry = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DutyRegisterEntry> }) =>
      updateDutyRegisterEntry(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["duty-register"] })
      qc.invalidateQueries({ queryKey: ["duty-register-stats"] })
    },
  })
}

export const useDeleteDutyRegisterEntry = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDutyRegisterEntry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["duty-register"] })
      qc.invalidateQueries({ queryKey: ["duty-register-stats"] })
    },
  })
}

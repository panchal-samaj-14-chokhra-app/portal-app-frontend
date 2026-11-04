import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getDutyMembersList,
  createDutyMember,
  updateDutyMember,
  deleteDutyMember,
  getDutyMembersChokhlaDirectory,
  getDutyMembersVillageDirectory,
  getDutyMembersPersonDirectory,
  type DutyMember,
  type DutyMemberFilters,
} from "@/data-hooks/requests/duty-members"

export const useDutyMembersList = (filters: DutyMemberFilters) =>
  useQuery({
    queryKey: ["duty-members", filters],
    queryFn: () => getDutyMembersList(filters),
    staleTime: 0,
  })

export const useDutyMembersChokhlas = () =>
  useQuery({ queryKey: ["duty-members-chokhlas"], queryFn: getDutyMembersChokhlaDirectory })

export const useDutyMembersVillages = (chokhlaId?: string) =>
  useQuery({
    queryKey: ["duty-members-villages", chokhlaId],
    queryFn: () => getDutyMembersVillageDirectory(chokhlaId),
    enabled: !!chokhlaId,
  })

export const useDutyMembersPersons = (villageId?: string) =>
  useQuery({
    queryKey: ["duty-members-persons", villageId],
    queryFn: () => getDutyMembersPersonDirectory(villageId),
    enabled: !!villageId,
  })

export const useCreateDutyMember = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<DutyMember>) => createDutyMember(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["duty-members"] }),
  })
}

export const useUpdateDutyMember = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DutyMember> }) => updateDutyMember(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["duty-members"] }),
  })
}

export const useDeleteDutyMember = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDutyMember(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["duty-members"] }),
  })
}

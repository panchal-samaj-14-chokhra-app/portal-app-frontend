import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createDuty, deleteDuty, getDutyStats, listDuties, updateDuty,
  type DutyEntry,
} from "@/data-hooks/requests/duty-register"

const KEY = ["duty-register"]
const STATS_KEY = ["duty-register-stats"]

export const useDutyList = (params?: Record<string, string>) =>
  useQuery({ queryKey: [...KEY, params], queryFn: () => listDuties(params), staleTime: 0, retry: false })

export const useDutyStats = () =>
  useQuery({ queryKey: STATS_KEY, queryFn: getDutyStats, staleTime: 30_000, retry: false })

function useInvalidating<TVars, TRes>(fn: (v: TVars) => Promise<TRes>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      qc.invalidateQueries({ queryKey: STATS_KEY })
    },
  })
}

export const useCreateDuty = () => useInvalidating((p: Partial<DutyEntry>) => createDuty(p))
export const useUpdateDuty = () =>
  useInvalidating((v: { id: string; payload: Partial<DutyEntry> }) => updateDuty(v.id, v.payload))
export const useDeleteDuty = () => useInvalidating((id: string) => deleteDuty(id))

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getDutySettings, updateDutySettings,
  type DutySettingsData,
} from "@/data-hooks/requests/duty-settings"

const KEY = ["duty-settings"]

export const useDutySettings = () =>
  useQuery({ queryKey: KEY, queryFn: getDutySettings, staleTime: 60_000, retry: false })

export const useUpdateDutySettings = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<DutySettingsData>) => updateDutySettings(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

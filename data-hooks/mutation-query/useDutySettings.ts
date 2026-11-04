import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getDutySettings, updateDutySettings, type DutySettingsData } from "@/data-hooks/requests/duty-settings"

export const useDutySettings = () =>
  useQuery({ queryKey: ["duty-settings"], queryFn: getDutySettings, staleTime: 0 })

export const useUpdateDutySettings = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<DutySettingsData>) => updateDutySettings(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["duty-settings"] }),
  })
}

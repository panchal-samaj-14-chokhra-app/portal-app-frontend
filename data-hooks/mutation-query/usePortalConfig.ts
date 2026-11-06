import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getPortalConfig, updatePortalConfig } from "@/data-hooks/requests/portal-config"

const KEY = ["portal-config"]

export function usePortalConfig() {
  return useQuery({ queryKey: KEY, queryFn: getPortalConfig, staleTime: 300_000 })
}

export function usePortalConfigValue(key: string, fallback: string): string {
  const { data } = usePortalConfig()
  if (!data) return fallback
  return data.find(c => c.key === key)?.value ?? fallback
}

export function useUpdatePortalConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => updatePortalConfig(key, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getFeatureFlags, updateFeatureFlag, type FeatureFlag } from "@/data-hooks/requests/feature-flags"

const baseKey = ["feature-flags"]
const key = (section?: string) => section ? [...baseKey, section] : baseKey

export function useFeatureFlags(section?: string) {
  return useQuery({
    queryKey: key(section),
    queryFn: () => getFeatureFlags(section),
    staleTime: 60_000,
  })
}

export function useUpdateFeatureFlag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ key: flagKey, payload }: { key: string; payload: Partial<FeatureFlag> }) =>
      updateFeatureFlag(flagKey, payload),
    onSuccess: () => {
      // Invalidate all flag queries (global + all sections)
      qc.invalidateQueries({ queryKey: baseKey })
    },
  })
}

// Returns true when flag is enabled or not yet loaded (safe default = on)
export function useFlag(flagKey: string): boolean {
  const { data } = useFeatureFlags()
  if (!data) return true
  const flag = data.find(f => f.key === flagKey)
  return flag ? flag.enabled : true
}

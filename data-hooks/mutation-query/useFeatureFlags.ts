import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getFeatureFlags, updateFeatureFlag, type FeatureFlag } from "@/data-hooks/requests/feature-flags"

const KEY = ["feature-flags"]

export function useFeatureFlags() {
  return useQuery({ queryKey: KEY, queryFn: getFeatureFlags, staleTime: 60_000 })
}

export function useUpdateFeatureFlag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: Partial<FeatureFlag> }) =>
      updateFeatureFlag(key, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

// Convenience helper — returns a boolean for a single flag key (true if unknown / still loading)
export function useFlag(key: string): boolean {
  const { data } = useFeatureFlags()
  if (!data) return true
  const flag = data.find(f => f.key === key)
  return flag ? flag.enabled : true
}

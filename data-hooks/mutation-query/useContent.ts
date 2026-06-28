import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getContent, upsertContent, getSubscribers, broadcastEmail } from "@/data-hooks/requests/content"

export const useContent = (key?: string) =>
  useQuery({ queryKey: ["content", key], queryFn: () => getContent(key as string), enabled: !!key })

export const useUpsertContent = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: any }) => upsertContent(key, payload),
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["content", v.key] }),
  })
}

export const useSubscribers = () =>
  useQuery({ queryKey: ["subscribers"], queryFn: getSubscribers })

export const useBroadcast = () =>
  useMutation({ mutationFn: (payload: { subject: string; html: string }) => broadcastEmail(payload) })

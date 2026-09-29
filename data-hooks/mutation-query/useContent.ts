import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getContent, upsertContent, getSubscribers, getContactMessages, broadcastEmail } from "@/data-hooks/requests/content"

export const useContent = (key?: string) =>
  useQuery({ queryKey: ["content", key], queryFn: () => getContent(key as string), enabled: !!key })

export const useUpsertContent = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: any }) => upsertContent(key, payload),
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["content", v.key] }),
  })
}

// Admin should always see subscribers as of "now" (e.g. right after someone
// signs up on the public site), so bypass the app-wide 1-minute staleTime.
export const useSubscribers = () =>
  useQuery({ queryKey: ["subscribers"], queryFn: getSubscribers, staleTime: 0 })

export const useContactMessages = () =>
  useQuery({ queryKey: ["contact-messages"], queryFn: getContactMessages, staleTime: 0 })

export const useBroadcast = () =>
  useMutation({ mutationFn: (payload: { subject: string; html: string }) => broadcastEmail(payload) })

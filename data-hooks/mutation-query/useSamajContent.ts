import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getSamajPosts, createSamajPost, updateSamajPost, deleteSamajPost,
  toggleSamajPostLike, getSamajPostComments, addSamajPostComment, deleteSamajPostComment,
  getSamajNews, getSamajNewsById, getSamajNewsAdmin, createSamajNews, updateSamajNews, deleteSamajNews,
  likeSamajNews, getSamajNewsComments, addSamajNewsComment,
  getSamajPress, getSamajPressAdmin, createSamajPress, updateSamajPress, deleteSamajPress,
  getSamajEvents, getSamajEventsAdmin, createSamajEvent, updateSamajEvent, deleteSamajEvent,
  type SamajPost, type SamajNews, type SamajPressRelease, type SamajEvent,
} from "@/data-hooks/requests/samaj-content"

// ── Posts ─────────────────────────────────────────────────────────────────────

export const useSamajPosts = (params?: Record<string, string>) =>
  useQuery({ queryKey: ["samaj-posts", params], queryFn: () => getSamajPosts(params) })

export const useCreateSamajPost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<SamajPost>) => createSamajPost(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["samaj-posts"] }),
  })
}

export const useUpdateSamajPost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SamajPost> }) => updateSamajPost(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["samaj-posts"] }),
  })
}

export const useDeleteSamajPost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSamajPost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["samaj-posts"] }),
  })
}

export const useToggleSamajPostLike = () =>
  useMutation({ mutationFn: (id: string) => toggleSamajPostLike(id) })

export const useSamajPostComments = (postId?: string) =>
  useQuery({
    queryKey: ["samaj-post-comments", postId],
    queryFn: () => getSamajPostComments(postId as string),
    enabled: !!postId,
  })

export const useAddSamajPostComment = (postId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { authorName: string; content: string }) => addSamajPostComment(postId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["samaj-post-comments", postId] }),
  })
}

export const useDeleteSamajPostComment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      deleteSamajPostComment(postId, commentId),
    onSuccess: (_, { postId }) => qc.invalidateQueries({ queryKey: ["samaj-post-comments", postId] }),
  })
}

// ── News ──────────────────────────────────────────────────────────────────────

export const useSamajNews = (params?: Record<string, string>) =>
  useQuery({ queryKey: ["samaj-news", params], queryFn: () => getSamajNews(params) })

export const useSamajNewsAdmin = () =>
  useQuery({ queryKey: ["samaj-news-admin"], queryFn: getSamajNewsAdmin })

export const useCreateSamajNews = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<SamajNews>) => createSamajNews(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["samaj-news"] }); qc.invalidateQueries({ queryKey: ["samaj-news-admin"] }) },
  })
}

export const useUpdateSamajNews = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SamajNews> }) => updateSamajNews(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["samaj-news"] }); qc.invalidateQueries({ queryKey: ["samaj-news-admin"] }) },
  })
}

export const useDeleteSamajNews = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSamajNews(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["samaj-news"] }); qc.invalidateQueries({ queryKey: ["samaj-news-admin"] }) },
  })
}

export const useSamajNewsById = (id?: string) =>
  useQuery({
    queryKey: ["samaj-news-item", id],
    queryFn: () => getSamajNewsById(id as string),
    enabled: !!id,
  })

export const useLikeSamajNews = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => likeSamajNews(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["samaj-news"] }); qc.invalidateQueries({ queryKey: ["samaj-news-item", id] }) },
  })
}

export const useSamajNewsComments = (newsId?: string) =>
  useQuery({
    queryKey: ["samaj-news-comments", newsId],
    queryFn: () => getSamajNewsComments(newsId as string),
    enabled: !!newsId,
  })

export const useAddSamajNewsComment = (newsId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { authorName: string; content: string }) => addSamajNewsComment(newsId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["samaj-news-comments", newsId] }),
  })
}

// ── Press Releases ────────────────────────────────────────────────────────────

export const useSamajPress = (params?: Record<string, string>) =>
  useQuery({ queryKey: ["samaj-press", params], queryFn: () => getSamajPress(params) })

export const useSamajPressAdmin = () =>
  useQuery({ queryKey: ["samaj-press-admin"], queryFn: getSamajPressAdmin })

export const useCreateSamajPress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<SamajPressRelease>) => createSamajPress(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["samaj-press"] }); qc.invalidateQueries({ queryKey: ["samaj-press-admin"] }) },
  })
}

export const useUpdateSamajPress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SamajPressRelease> }) => updateSamajPress(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["samaj-press"] }); qc.invalidateQueries({ queryKey: ["samaj-press-admin"] }) },
  })
}

export const useDeleteSamajPress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSamajPress(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["samaj-press"] }); qc.invalidateQueries({ queryKey: ["samaj-press-admin"] }) },
  })
}

// ── Events ────────────────────────────────────────────────────────────────────

export const useSamajEvents = (params?: Record<string, string>) =>
  useQuery({ queryKey: ["samaj-events", params], queryFn: () => getSamajEvents(params) })

export const useSamajEventsAdmin = () =>
  useQuery({ queryKey: ["samaj-events-admin"], queryFn: getSamajEventsAdmin })

export const useCreateSamajEvent = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<SamajEvent>) => createSamajEvent(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["samaj-events"] }); qc.invalidateQueries({ queryKey: ["samaj-events-admin"] }) },
  })
}

export const useUpdateSamajEvent = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SamajEvent> }) => updateSamajEvent(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["samaj-events"] }); qc.invalidateQueries({ queryKey: ["samaj-events-admin"] }) },
  })
}

export const useDeleteSamajEvent = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSamajEvent(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["samaj-events"] }); qc.invalidateQueries({ queryKey: ["samaj-events-admin"] }) },
  })
}

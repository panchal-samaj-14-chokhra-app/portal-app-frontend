import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getHeroFeed, getHeroFeedAdmin, createHeroFeed, updateHeroFeed, deleteHeroFeed,
  likeHeroFeed, getHeroFeedComments, addHeroFeedComment,
} from "@/data-hooks/requests/hero-feed"

const KEY = ["hero-feed"]

export const useHeroFeed      = (take?: string) => useQuery({ queryKey: [...KEY, take], queryFn: () => getHeroFeed(take ? { take } : undefined), staleTime: 30_000 })
export const useHeroFeedAdmin = () => useQuery({ queryKey: [...KEY, "admin"], queryFn: getHeroFeedAdmin })

export const useHeroFeedComments = (id: string) =>
  useQuery({ queryKey: [...KEY, id, "comments"], queryFn: () => getHeroFeedComments(id), enabled: !!id })

export function useCreateHeroFeed() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: createHeroFeed, onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) })
}

export function useUpdateHeroFeed() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & any) => updateHeroFeed(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteHeroFeed() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: deleteHeroFeed, onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) })
}

export function useLikeHeroFeed(id: string) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: () => likeHeroFeed(id), onSuccess: () => qc.invalidateQueries({ queryKey: KEY }) })
}

export function useAddHeroFeedComment(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { authorName: string; content: string }) => addHeroFeedComment(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...KEY, id, "comments"] }),
  })
}

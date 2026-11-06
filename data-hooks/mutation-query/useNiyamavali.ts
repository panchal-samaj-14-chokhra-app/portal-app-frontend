import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getNiyamavaliArticles, getNiyamavaliArticle, getNiyamavaliArticlesAdmin,
  createNiyamavaliArticle, updateNiyamavaliArticle, deleteNiyamavaliArticle,
  getNiyamavaliSectionsAdmin, createNiyamavaliSection,
  updateNiyamavaliSection, deleteNiyamavaliSection,
  type NiyamavaliArticle, type NiyamavaliSection,
} from "@/data-hooks/requests/niyamavali"

const inv = (qc: ReturnType<typeof useQueryClient>, ...keys: string[][]) =>
  keys.forEach(k => qc.invalidateQueries({ queryKey: k }))

// ── Articles (public) ─────────────────────────────────────────────────────────

export const useNiyamavaliArticles = () =>
  useQuery({ queryKey: ["niyamavali-articles"], queryFn: getNiyamavaliArticles })

export const useNiyamavaliArticle = (id?: string) =>
  useQuery({ queryKey: ["niyamavali-article", id], queryFn: () => getNiyamavaliArticle(id!), enabled: !!id })

// ── Articles (admin) ──────────────────────────────────────────────────────────

export const useNiyamavaliArticlesAdmin = () =>
  useQuery({ queryKey: ["niyamavali-articles-admin"], queryFn: getNiyamavaliArticlesAdmin })

export const useCreateNiyamavaliArticle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Partial<NiyamavaliArticle>) => createNiyamavaliArticle(p),
    onSuccess: () => inv(qc, ["niyamavali-articles"], ["niyamavali-articles-admin"]),
  })
}

export const useUpdateNiyamavaliArticle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NiyamavaliArticle> }) => updateNiyamavaliArticle(id, payload),
    onSuccess: (data) => inv(qc, ["niyamavali-articles"], ["niyamavali-articles-admin"], ["niyamavali-article", data.id]),
  })
}

export const useDeleteNiyamavaliArticle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNiyamavaliArticle(id),
    onSuccess: () => inv(qc, ["niyamavali-articles"], ["niyamavali-articles-admin"]),
  })
}

// ── Sections ──────────────────────────────────────────────────────────────────

export const useNiyamavaliSectionsAdmin = (articleId?: string) =>
  useQuery({
    queryKey: ["niyamavali-sections-admin", articleId],
    queryFn: () => getNiyamavaliSectionsAdmin(articleId!),
    enabled: !!articleId,
  })

export const useCreateNiyamavaliSection = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Partial<NiyamavaliSection>) => createNiyamavaliSection(p),
    onSuccess: (data) => inv(qc, ["niyamavali-sections-admin", data.articleId], ["niyamavali-article", data.articleId]),
  })
}

export const useUpdateNiyamavaliSection = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NiyamavaliSection> }) => updateNiyamavaliSection(id, payload),
    onSuccess: (data) => inv(qc, ["niyamavali-sections-admin", data.articleId], ["niyamavali-article", data.articleId]),
  })
}

export const useDeleteNiyamavaliSection = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNiyamavaliSection(id),
    onSuccess: () => inv(qc, ["niyamavali-sections-admin"]),
  })
}

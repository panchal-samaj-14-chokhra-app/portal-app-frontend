import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getNiyamavaliPublications, getNiyamavaliPublicationsAdmin, getNiyamavaliPublication,
  createNiyamavaliPublication, updateNiyamavaliPublication, deleteNiyamavaliPublication,
  getNiyamavaliCategoriesAdmin, getNiyamavaliCategory,
  createNiyamavaliCategory, updateNiyamavaliCategory, deleteNiyamavaliCategory,
  getNiyamavaliSubcategoriesAdmin,
  createNiyamavaliSubcategory, updateNiyamavaliSubcategory, deleteNiyamavaliSubcategory,
  getNiyamavaliArticle, getNiyamavaliArticlesAdmin,
  createNiyamavaliArticle, updateNiyamavaliArticle, deleteNiyamavaliArticle,
  type NiyamavaliPublication, type NiyamavaliCategory,
  type NiyamavaliSubcategory, type NiyamavaliArticle,
} from "@/data-hooks/requests/niyamavali"

const inv = (qc: ReturnType<typeof useQueryClient>, ...keys: string[][]) =>
  keys.forEach(k => qc.invalidateQueries({ queryKey: k }))

// ── Publications ──────────────────────────────────────────────────────────────

export const useNiyamavaliPublications = () =>
  useQuery({ queryKey: ["niyamavali-pubs"], queryFn: getNiyamavaliPublications })

export const useNiyamavaliPublicationsAdmin = () =>
  useQuery({ queryKey: ["niyamavali-pubs-admin"], queryFn: getNiyamavaliPublicationsAdmin })

export const useNiyamavaliPublication = (id?: string) =>
  useQuery({ queryKey: ["niyamavali-pub", id], queryFn: () => getNiyamavaliPublication(id!), enabled: !!id })

export const useCreateNiyamavaliPublication = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Partial<NiyamavaliPublication>) => createNiyamavaliPublication(p),
    onSuccess: () => inv(qc, ["niyamavali-pubs"], ["niyamavali-pubs-admin"]),
  })
}

export const useUpdateNiyamavaliPublication = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NiyamavaliPublication> }) => updateNiyamavaliPublication(id, payload),
    onSuccess: (_, { id }) => inv(qc, ["niyamavali-pubs"], ["niyamavali-pubs-admin"], ["niyamavali-pub", id]),
  })
}

export const useDeleteNiyamavaliPublication = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNiyamavaliPublication(id),
    onSuccess: () => inv(qc, ["niyamavali-pubs"], ["niyamavali-pubs-admin"]),
  })
}

// ── Categories ────────────────────────────────────────────────────────────────

export const useNiyamavaliCategoriesAdmin = (publicationId?: string) =>
  useQuery({ queryKey: ["niyamavali-cats-admin", publicationId], queryFn: () => getNiyamavaliCategoriesAdmin(publicationId) })

export const useNiyamavaliCategory = (id?: string) =>
  useQuery({ queryKey: ["niyamavali-cat", id], queryFn: () => getNiyamavaliCategory(id!), enabled: !!id })

export const useCreateNiyamavaliCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Partial<NiyamavaliCategory>) => createNiyamavaliCategory(p),
    onSuccess: (data) => inv(qc, ["niyamavali-cats-admin"], ["niyamavali-cats-admin", data.publicationId], ["niyamavali-pub", data.publicationId]),
  })
}

export const useUpdateNiyamavaliCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NiyamavaliCategory> }) => updateNiyamavaliCategory(id, payload),
    onSuccess: (data) => inv(qc, ["niyamavali-cats-admin"], ["niyamavali-cats-admin", data.publicationId]),
  })
}

export const useDeleteNiyamavaliCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNiyamavaliCategory(id),
    onSuccess: () => inv(qc, ["niyamavali-cats-admin"]),
  })
}

// ── Subcategories ─────────────────────────────────────────────────────────────

export const useNiyamavaliSubcategoriesAdmin = (categoryId?: string) =>
  useQuery({
    queryKey: ["niyamavali-subcats-admin", categoryId],
    queryFn: () => getNiyamavaliSubcategoriesAdmin(categoryId),
    enabled: !!categoryId,
  })

export const useCreateNiyamavaliSubcategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Partial<NiyamavaliSubcategory>) => createNiyamavaliSubcategory(p),
    onSuccess: (data) => inv(qc, ["niyamavali-subcats-admin", data.categoryId]),
  })
}

export const useUpdateNiyamavaliSubcategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NiyamavaliSubcategory> }) => updateNiyamavaliSubcategory(id, payload),
    onSuccess: (data) => inv(qc, ["niyamavali-subcats-admin", data.categoryId]),
  })
}

export const useDeleteNiyamavaliSubcategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNiyamavaliSubcategory(id),
    onSuccess: () => inv(qc, ["niyamavali-subcats-admin"]),
  })
}

// ── Articles ──────────────────────────────────────────────────────────────────

export const useNiyamavaliArticle = (id?: string) =>
  useQuery({ queryKey: ["niyamavali-article", id], queryFn: () => getNiyamavaliArticle(id!), enabled: !!id })

export const useNiyamavaliArticlesAdmin = (categoryId?: string) =>
  useQuery({
    queryKey: ["niyamavali-articles-admin", categoryId],
    queryFn: () => getNiyamavaliArticlesAdmin(categoryId),
    enabled: !!categoryId,
  })

export const useCreateNiyamavaliArticle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Partial<NiyamavaliArticle>) => createNiyamavaliArticle(p),
    onSuccess: (data) => inv(qc, ["niyamavali-articles-admin", data.categoryId], ["niyamavali-cat", data.categoryId]),
  })
}

export const useUpdateNiyamavaliArticle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NiyamavaliArticle> }) => updateNiyamavaliArticle(id, payload),
    onSuccess: (data) => {
      inv(qc, ["niyamavali-articles-admin", data.categoryId], ["niyamavali-article", data.id])
    },
  })
}

export const useDeleteNiyamavaliArticle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNiyamavaliArticle(id),
    onSuccess: () => inv(qc, ["niyamavali-articles-admin"]),
  })
}

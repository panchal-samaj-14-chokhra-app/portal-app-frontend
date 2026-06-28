import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "@/data-hooks/requests/blog"

export const useBlogs = (status = "all") =>
  useQuery({ queryKey: ["blogs", status], queryFn: () => getBlogs(status) })

export const useBlog = (id?: string) =>
  useQuery({ queryKey: ["blog", id], queryFn: () => getBlogById(id as string), enabled: !!id })

export const useCreateBlog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: any) => createBlog(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  })
}

export const useUpdateBlog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateBlog(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  })
}

export const useDeleteBlog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  })
}

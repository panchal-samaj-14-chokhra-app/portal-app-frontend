import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import {
  getMatrimonialProfiles, getMatrimonialProfile, updateMatrimonialProfile,
  deleteMatrimonialProfile, deleteMatrimonialImage, uploadMatrimonialImages, type MatrimonialListParams,
} from "@/data-hooks/requests/matrimonial"

export const useMatrimonialProfiles = (params: MatrimonialListParams) =>
  useQuery({
    queryKey: ["matrimonial-profiles", params],
    queryFn: () => getMatrimonialProfiles(params),
    placeholderData: keepPreviousData, // keep page visible while next page loads
  })

export const useMatrimonialProfile = (id?: string) =>
  useQuery({
    queryKey: ["matrimonial-profile", id],
    queryFn: () => getMatrimonialProfile(id as string),
    enabled: !!id,
  })

export const useUpdateMatrimonialProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateMatrimonialProfile(id, payload),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["matrimonial-profiles"] })
      qc.invalidateQueries({ queryKey: ["matrimonial-profile", v.id] })
    },
  })
}

export const useDeleteMatrimonialProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMatrimonialProfile(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matrimonial-profiles"] }),
  })
}

export const useDeleteMatrimonialImage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (imageId: string) => deleteMatrimonialImage(imageId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matrimonial-profile"] }),
  })
}

export const useUploadMatrimonialImages = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ profileId, files }: { profileId: string; files: File[] }) => uploadMatrimonialImages(profileId, files),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matrimonial-profile"] }),
  })
}

import request from "@/config/request"

export interface MatrimonialListParams {
  page?: number
  limit?: number
  name?: string
  gender?: string
  maritalStatus?: string
}

export const getMatrimonialProfiles = async (params: MatrimonialListParams = {}) => {
  const { page = 1, limit = 10, name = "", gender = "", maritalStatus = "" } = params
  const qs = new URLSearchParams({ all: "true", page: String(page), limit: String(limit) })
  if (name) qs.set("name", name)
  if (gender) qs.set("gender", gender)
  if (maritalStatus) qs.set("maritalStatus", maritalStatus)
  const { data } = await request.get(`/metrimonial/profile-list/?${qs.toString()}`)
  return data // { success, data: [...], meta: { totalCount, currentPage, totalPages } }
}

export const getMatrimonialProfile = async (id: string) => {
  const { data } = await request.get(`/metrimonial/get-profile/${id}`)
  return data.data
}

export const updateMatrimonialProfile = async (id: string, payload: any) => {
  const { data } = await request.patch(`/metrimonial/update-profile/${id}`, payload)
  return data
}

export const deleteMatrimonialProfile = async (id: string) => {
  const { data } = await request.delete(`/metrimonial/${id}`)
  return data
}

export const deleteMatrimonialImage = async (imageId: string) => {
  const { data } = await request.delete(`/metrimonial/image/${imageId}`)
  return data
}

// Resize in the browser so the storage service doesn't reject large photos (413).
async function resizeImage(file: File, maxDim = 1600, quality = 0.82): Promise<File> {
  try {
    if (typeof document === "undefined" || !file.type.startsWith("image/")) return file
    if (file.size < 700 * 1024) return file
    const dataUrl: string = await new Promise((res, rej) => {
      const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(file)
    })
    const img: HTMLImageElement = await new Promise((res, rej) => {
      const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = dataUrl
    })
    let { width, height } = img
    const longest = Math.max(width, height)
    if (longest > maxDim) { const s = maxDim / longest; width = Math.round(width * s); height = Math.round(height * s) }
    const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height
    const ctx = canvas.getContext("2d"); if (!ctx) return file
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, width, height); ctx.drawImage(img, 0, 0, width, height)
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality))
    if (!blob) return file
    return new File([blob], (file.name.replace(/\.[^.]+$/, "") || "photo") + ".jpg", { type: "image/jpeg" })
  } catch { return file }
}

export const uploadMatrimonialImages = async (profileId: string, files: File[]) => {
  const form = new FormData()
  for (const f of files) { const r = await resizeImage(f); form.append("images", r, r.name) }
  const { data } = await request.post(`/metrimonial/update/profile-image/${profileId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data
}

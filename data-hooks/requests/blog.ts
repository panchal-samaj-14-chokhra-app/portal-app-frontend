import request from "@/config/request"

export const getBlogs = async (status = "all") => {
  const { data } = await request.get(`/blog?status=${status}`)
  return data.data
}

export const getBlogById = async (id: string) => {
  const { data } = await request.get(`/blog/id/${id}`)
  return data.data
}

export const createBlog = async (payload: any) => {
  const { data } = await request.post(`/blog`, payload)
  return data.data
}

export const updateBlog = async (id: string, payload: any) => {
  const { data } = await request.put(`/blog/${id}`, payload)
  return data.data
}

export const deleteBlog = async (id: string) => {
  const { data } = await request.delete(`/blog/${id}`)
  return data
}

// Resize/compress an image in the browser so the storage service doesn't reject large files (413).
async function resizeImage(file: File, maxDim = 1600, quality = 0.82): Promise<File> {
  try {
    if (typeof document === "undefined" || !file.type.startsWith("image/")) return file
    // small enough already → keep as-is
    if (file.size < 700 * 1024) return file

    const dataUrl: string = await new Promise((res, rej) => {
      const r = new FileReader()
      r.onload = () => res(r.result as string)
      r.onerror = rej
      r.readAsDataURL(file)
    })
    const img: HTMLImageElement = await new Promise((res, rej) => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = rej
      i.src = dataUrl
    })
    let { width, height } = img
    const longest = Math.max(width, height)
    if (longest > maxDim) {
      const scale = maxDim / longest
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return file
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality))
    if (!blob) return file
    const name = (file.name.replace(/\.[^.]+$/, "") || "image") + ".jpg"
    return new File([blob], name, { type: "image/jpeg" })
  } catch {
    return file
  }
}

export const uploadBlogImage = async (file: File) => {
  const resized = await resizeImage(file)
  const form = new FormData()
  form.append("file", resized)
  const { data } = await request.post(`/blog/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data.url as string
}

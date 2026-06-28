import request from "@/config/request"

export const getContent = async (key: string) => {
  const { data } = await request.get(`/content/${key}`)
  return data.data
}

export const upsertContent = async (key: string, payload: any) => {
  const { data } = await request.put(`/content/${key}`, payload)
  return data.data
}

export const getSubscribers = async () => {
  const { data } = await request.get(`/subscriber`)
  return data
}

export const broadcastEmail = async (payload: { subject: string; html: string }) => {
  const { data } = await request.post(`/subscriber/broadcast`, payload)
  return data
}

import request from "@/config/request"

export const getOrders = async (params?: { status?: string; search?: string; dateFrom?: string; dateTo?: string }) => {
  const q = new URLSearchParams()
  if (params?.status && params.status !== "all") q.set("status", params.status)
  if (params?.search) q.set("search", params.search)
  if (params?.dateFrom) q.set("dateFrom", params.dateFrom)
  if (params?.dateTo) q.set("dateTo", params.dateTo)
  const { data } = await request.get(`/order-book?${q.toString()}`)
  return data.data
}

export const getOrderById = async (id: string) => {
  const { data } = await request.get(`/order-book/${id}`)
  return data.data
}

export const getNextOrderNumber = async (): Promise<string> => {
  const { data } = await request.get(`/order-book/next-number`)
  return data.data.orderNumber
}

export const createOrder = async (payload: any) => {
  const { data } = await request.post(`/order-book`, payload)
  return data.data
}

export const updateOrder = async (id: string, payload: any) => {
  const { data } = await request.put(`/order-book/${id}`, payload)
  return data.data
}

export const deleteOrder = async (id: string) => {
  const { data } = await request.delete(`/order-book/${id}`)
  return data
}

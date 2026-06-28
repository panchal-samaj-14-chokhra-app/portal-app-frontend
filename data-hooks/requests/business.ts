import request from "@/config/request"

export const getAdminBusinesses = async () => {
  const { data } = await request.get(`/businesses?all=true`)
  return data as any[]
}

export const createBusiness = async (payload: any) => {
  const { data } = await request.post(`/businesses/create`, payload)
  return data
}

export const updateBusiness = async (id: string, payload: any) => {
  const { data } = await request.put(`/businesses/${id}`, payload)
  return data
}

export const deleteBusiness = async (id: string) => {
  const { data } = await request.delete(`/businesses/${id}`)
  return data
}

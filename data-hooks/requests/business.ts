import request from "@/config/request"

export const getAdminBusinesses = async (chokhlaId?: string) => {
  const qs = chokhlaId ? `&chokhlaId=${chokhlaId}` : ""
  const { data } = await request.get(`/businesses?all=true${qs}`)
  return data as any[]
}

export const getPersonsByVillage = async (villageId: string) => {
  const { data } = await request.get(`/person?villageId=${villageId}`)
  return data as any[]
}

export const exportBusinesses = async (chokhlaId?: string) => {
  const qs = chokhlaId ? `?chokhlaId=${chokhlaId}` : ""
  const res = await request.get(`/businesses/export${qs}`, { responseType: "blob" })
  return res.data as Blob
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

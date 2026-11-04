import request from "@/config/request"

export type DutyMemberCategory = "permanent" | "non_permanent"

export type DutyMember = {
  id: string
  name: string
  category: DutyMemberCategory
  age?: number | null
  state?: string | null
  district?: string | null
  isSamajMember?: boolean | null
  govtId?: string | null
  shift?: string | null
  chokhlaId?: string | null
  chokhlaName?: string | null
  villageId?: string | null
  villageName?: string | null
  dutyTypes: string[]
  phone?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type DutyMemberFilters = {
  chokhlaId?: string
  villageId?: string
  dutyType?: string
  search?: string
}

export type DirectoryItem = { id: string; name: string }
export type PersonDirectoryItem = { id: string; firstName: string; lastName: string; mobileNumber: string }

export const getDutyMembersList = async (filters: DutyMemberFilters): Promise<DutyMember[]> => {
  const params: Record<string, string> = {}
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params[k] = v
  })
  const { data } = await request.get(`/duty-members`, { params })
  return data.data
}

export const createDutyMember = async (payload: Partial<DutyMember>) => {
  const { data } = await request.post(`/duty-members`, payload)
  return data.data
}

export const updateDutyMember = async (id: string, payload: Partial<DutyMember>) => {
  const { data } = await request.put(`/duty-members/${id}`, payload)
  return data.data
}

export const deleteDutyMember = async (id: string) => {
  const { data } = await request.delete(`/duty-members/${id}`)
  return data
}

export const getDutyMembersChokhlaDirectory = async (): Promise<DirectoryItem[]> => {
  const { data } = await request.get(`/duty-members/chokhlas`)
  return data.data
}

export const getDutyMembersVillageDirectory = async (chokhlaId?: string): Promise<DirectoryItem[]> => {
  const { data } = await request.get(`/duty-members/villages`, { params: chokhlaId ? { chokhlaId } : {} })
  return data.data
}

export const getDutyMembersPersonDirectory = async (villageId?: string): Promise<PersonDirectoryItem[]> => {
  const { data } = await request.get(`/duty-members/persons`, { params: villageId ? { villageId } : {} })
  return data.data
}

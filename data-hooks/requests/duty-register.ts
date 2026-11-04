import request from "@/config/request"

export type DutyRegisterEntry = {
  id: string
  dutyDate: string
  dutyType: string
  title: string
  shift: string
  dutyMemberId?: string | null
  memberName: string
  memberRole?: string | null
  assignedBy?: string | null
  scheduledStart?: string | null
  scheduledEnd?: string | null
  actualCheckin?: string | null
  actualCheckout?: string | null
  attendanceStatus: string
  checkinPhotoUrl?: string | null
  checkinLat?: number | null
  checkinLng?: number | null
  remarks?: string | null
  verifiedBy?: string | null
  createdAt: string
  updatedAt: string
}

export type DutyRegisterFilters = {
  date?: string
  dateFrom?: string
  dateTo?: string
  dutyType?: string
  shift?: string
  attendanceStatus?: string
  memberName?: string
}

export type DutyRegisterStats = { total: number; today: number }

export const getDutyRegisterList = async (filters: DutyRegisterFilters): Promise<DutyRegisterEntry[]> => {
  const params: Record<string, string> = {}
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params[k] = v
  })
  const { data } = await request.get(`/duty-register`, { params })
  return data.data
}

export const getDutyRegisterStats = async (): Promise<DutyRegisterStats> => {
  const { data } = await request.get(`/duty-register/stats`)
  return data.data
}

export const getDutyRegisterEntry = async (id: string): Promise<DutyRegisterEntry> => {
  const { data } = await request.get(`/duty-register/${id}`)
  return data.data
}

export const createDutyRegisterEntry = async (payload: Partial<DutyRegisterEntry>) => {
  const { data } = await request.post(`/duty-register`, payload)
  return data.data
}

export const updateDutyRegisterEntry = async (id: string, payload: Partial<DutyRegisterEntry>) => {
  const { data } = await request.put(`/duty-register/${id}`, payload)
  return data.data
}

export const deleteDutyRegisterEntry = async (id: string) => {
  const { data } = await request.delete(`/duty-register/${id}`)
  return data
}

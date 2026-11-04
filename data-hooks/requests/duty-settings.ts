import request from "@/config/request"

export type DutyTypeItem = { key: string; label: string }
export type ShiftItem = { key: string; label: string; start: string; end: string }
export type StatusItem = { key: string; label: string }

export type DutySettingsData = {
  dutyTypes: DutyTypeItem[]
  shifts: ShiftItem[]
  attendanceStatuses: StatusItem[]
  dutyStatuses: StatusItem[]
}

export const getDutySettings = async (): Promise<DutySettingsData> => {
  const { data } = await request.get(`/duty-settings`)
  return data.data
}

export const updateDutySettings = async (payload: Partial<DutySettingsData>) => {
  const { data } = await request.put(`/duty-settings`, payload)
  return data.data
}

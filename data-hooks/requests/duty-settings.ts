import { endSession, forceRefresh, getAccessToken } from "@/lib/auth/client"

async function call(method: string, body?: unknown, retried = false): Promise<any> {
  const token = await getAccessToken()
  if (!token) throw new Error("सत्र समाप्त हो गया है, कृपया फिर से लॉगिन करें")

  const res = await fetch(`${process.env.NEXT_PUBLIC_REQUEST_URL}/duty-settings`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  })
  const json: any = await res.json().catch(() => ({}))
  if (res.status === 401 && !retried && (await forceRefresh())) return call(method, body, true)
  if (res.status === 401) {
    endSession("expired")
    throw new Error(json.message || "सत्र समाप्त हो गया है")
  }
  if (!res.ok || json.success === false) throw new Error(json.message || "कुछ गड़बड़ हुई")
  return json
}

export type DutyTypeItem = { key: string; label: string }
export type ShiftItem = { key: string; label: string; start: string; end: string }
export type StatusItem = { key: string; label: string }

export type DutySettingsData = {
  dutyTypes: DutyTypeItem[]
  shifts: ShiftItem[]
  attendanceStatuses: StatusItem[]
  dutyStatuses: StatusItem[]
}

export const getDutySettings = () => call("GET") as Promise<{ data: DutySettingsData }>
export const updateDutySettings = (payload: Partial<DutySettingsData>) =>
  call("PUT", payload) as Promise<{ data: DutySettingsData }>

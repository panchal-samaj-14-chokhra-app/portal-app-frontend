import { endSession, forceRefresh, getAccessToken } from "@/lib/auth/client"

const BASE = `${process.env.NEXT_PUBLIC_REQUEST_URL}/duty-settings`
const API_KEY_HEADER = process.env.NEXT_PUBLIC_MANDIR_API_KEY
  ? { "x-api-key": process.env.NEXT_PUBLIC_MANDIR_API_KEY }
  : {}

// GET uses the mandir API key — accessible to any logged-in admin page
async function getCall(): Promise<any> {
  const res = await fetch(BASE, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...API_KEY_HEADER },
    cache: "no-store",
  })
  const json: any = await res.json().catch(() => ({}))
  if (!res.ok || json.success === false) throw new Error(json.message || "कुछ गड़बड़ हुई")
  return json
}

// PUT uses bearer token — requires MANDIR_ADMIN or SUPER_ADMIN login
async function putCall(body: unknown, retried = false): Promise<any> {
  const token = await getAccessToken()
  if (!token) throw new Error("सत्र समाप्त हो गया है, कृपया फिर से लॉगिन करें")
  const res = await fetch(BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...API_KEY_HEADER },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const json: any = await res.json().catch(() => ({}))
  if (res.status === 401 && !retried && (await forceRefresh())) return putCall(body, true)
  if (res.status === 401) { endSession("expired"); throw new Error(json.message || "सत्र समाप्त हो गया है") }
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

export const getDutySettings = () => getCall() as Promise<{ data: DutySettingsData }>
export const updateDutySettings = (payload: Partial<DutySettingsData>) =>
  putCall(payload) as Promise<{ data: DutySettingsData }>

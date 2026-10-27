import { endSession, forceRefresh, getAccessToken } from "@/lib/auth/client"

async function call(method: string, path: string, body?: unknown, retried = false): Promise<any> {
  const token = await getAccessToken()
  if (!token) throw new Error("सत्र समाप्त हो गया है, कृपया फिर से लॉगिन करें")

  const res = await fetch(`${process.env.NEXT_PUBLIC_REQUEST_URL}/duty-register${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  })
  const json: any = await res.json().catch(() => ({}))
  if (res.status === 401 && !retried && (await forceRefresh())) return call(method, path, body, true)
  if (res.status === 401) {
    endSession("expired")
    throw new Error(json.message || "सत्र समाप्त हो गया है")
  }
  if (!res.ok || json.success === false) throw new Error(json.message || "कुछ गड़बड़ हुई")
  return json
}

export type DutyStatus = "Assigned" | "InProgress" | "Completed" | "Cancelled"
export type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave"

export type DutyEntry = {
  id: string
  dutyDate: string
  dutyType: string
  title: string
  shift: string
  memberName: string
  memberRole: string | null
  assignedBy: string | null
  scheduledStart: string | null
  scheduledEnd: string | null
  actualCheckin: string | null
  actualCheckout: string | null
  attendanceStatus: AttendanceStatus
  dutyStatus: DutyStatus
  remarks: string | null
  verifiedBy: string | null
  createdAt: string
  updatedAt: string
}

export type DutyStats = { total: number; today: number; pending: number; completed: number }

export const listDuties = (params?: Record<string, string>) => {
  const q = params ? "?" + new URLSearchParams(params).toString() : ""
  return call("GET", `/${q}`) as Promise<{ data: DutyEntry[] }>
}
export const getDutyStats = () => call("GET", "/stats") as Promise<{ data: DutyStats }>
export const createDuty = (payload: Partial<DutyEntry>) => call("POST", "/", payload)
export const updateDuty = (id: string, payload: Partial<DutyEntry>) => call("PUT", `/${id}`, payload)
export const deleteDuty = (id: string) => call("DELETE", `/${id}`)

import { endSession, forceRefresh, getAccessToken } from "@/lib/auth/client"

// Booking data contains names and phone numbers, so every call carries the admin's login token.
// A dedicated helper (not the shared axios client) so an expired login shows a clear message.
export class SessionExpiredError extends Error {}

async function call(method: string, path: string, body?: unknown, retried = false): Promise<any> {
  const token = await getAccessToken()
  if (!token) throw new SessionExpiredError("सत्र समाप्त हो गया है, कृपया फिर से लॉगिन करें")

  const res = await fetch(`${process.env.NEXT_PUBLIC_REQUEST_URL}/shringar/admin${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  })
  const json: any = await res.json().catch(() => ({}))
  if (res.status === 401 && !retried && (await forceRefresh())) return call(method, path, body, true)
  if (res.status === 401) {
    endSession(json.code === "ACCOUNT_DISABLED" ? "disabled" : "expired")
    throw new SessionExpiredError(json.message || "सत्र समाप्त हो गया है, कृपया फिर से लॉगिन करें")
  }
  if (res.status === 403) throw new SessionExpiredError(json.message || "इस काम की अनुमति नहीं है")
  if (!res.ok || json.success === false) throw new Error(json.message || "कुछ गड़बड़ हुई")
  return json
}

export type Booking = {
  id: string
  date: string
  name: string
  phone: string | null
  email: string | null
  status: "pending" | "confirmed" | "cancelled" | "blocked"
  note: string | null
  source: "website" | "admin"
  createdAt: string
}

export const listBookings = () => call("GET", "/bookings") as Promise<{ data: Booking[]; window: { from: string; to: string } }>
export const createBooking = (payload: Partial<Booking>) => call("POST", "/bookings", payload)
export const updateBooking = (id: string, payload: Partial<Booking>) => call("PUT", `/bookings/${id}`, payload)
export const deleteBooking = (id: string) => call("DELETE", `/bookings/${id}`)
export const blockDates = (payload: { dates: string[]; note?: string }) =>
  call("POST", "/block", payload) as Promise<{ data: { created: string[]; skipped: string[] } }>

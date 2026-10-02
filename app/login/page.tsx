import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { decode } from "next-auth/jwt"
import LoginForm from "./LoginForm"

const COOKIE_NAMES = ["__Secure-next-auth.session-token", "next-auth.session-token"]
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_REQUEST_URL

function homeFor(t: { role?: string; villageId?: string | null; choklaId?: string | null }) {
  if (t.role === "SUPER_ADMIN") return "/admin/superadmin"
  if (t.role === "VILLAGE_MEMBER" && t.villageId) return `/admin/village/${t.villageId}`
  if (t.role === "CHOKHLA_MEMBER" && t.choklaId) return `/admin/chokhla/${t.choklaId}`
  return null
}

// Same-site paths only (blocks open redirects)
function safePath(value?: string) {
  if (!value) return null
  const path = value.startsWith("http") ? (() => { try { const u = new URL(value); return u.pathname + u.search } catch { return null } })() : value
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/login") || path.startsWith("/api/")) return null
  return path
}

export default async function LoginPage({ searchParams }: { searchParams: { callbackUrl?: string; reason?: string; error?: string } }) {
  // Read the login cookie without letting next-auth renew it: a server page cannot save a renewed cookie,
  // and renewing without saving would use up the refresh token.
  const jar = cookies()
  const raw = COOKIE_NAMES.map((n) => jar.get(n)?.value).find(Boolean)
  let hasStoredLogin = false

  if (raw && process.env.NEXTAUTH_SECRET) {
    const token: any = await decode({ token: raw, secret: process.env.NEXTAUTH_SECRET }).catch(() => null)
    hasStoredLogin = !!token
    const usable = token && !token.error && Number(token.refreshTokenExpires) > Date.now() && token.accessToken
    const target = token ? homeFor(token) : null

    // Already signed in with a token the backend accepts: no reason to show the login form
    if (usable && target && Number(token.accessTokenExpires) > Date.now()) {
      const ok = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      })
        .then((r) => r.ok)
        .catch(() => false)
      if (ok) redirect(safePath(searchParams.callbackUrl) || target)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
      <div className="w-full mx-auto">
        {/* hasStoredLogin: an old/expired cookie exists; the form renews it or clears it */}
        <LoginForm hasStoredLogin={hasStoredLogin} />
      </div>
    </div>
  )
}

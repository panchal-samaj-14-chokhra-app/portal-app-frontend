"use client"

import { getSession, signOut } from "next-auth/react"

// Browser-side helpers shared by the API client and the pages.
//
// The login (next-auth cookie) holds a short backend access token plus a long-lived refresh token. Anything
// that asks next-auth for the session (getSession / useSession) gets a fresh access token when the old one
// is about to run out, so callers only ever need `getAccessToken()`.

type Updater = () => Promise<unknown>

let snapshot: { token: string; expires: number } | null = null
let updater: Updater | null = null
let signingOut = false

const FRESH_FOR_MS = 30 * 1000

export function rememberSession(token: string | undefined, expires: number | undefined) {
  snapshot = token && expires ? { token, expires } : null
}

export function registerSessionUpdater(fn: Updater | null) {
  updater = fn
}

export async function getAccessToken(): Promise<string | undefined> {
  if (snapshot && snapshot.expires - Date.now() > FRESH_FOR_MS) return snapshot.token
  const session: any = await getSession()
  if (!session || session.error) return undefined
  rememberSession(session.user?.token, session.accessTokenExpires)
  return session.user?.token
}

let forcing: Promise<string | undefined> | null = null

// The API answered 401 although we thought the token was fine: ask the server to check/refresh it once.
// Several failing requests share one attempt.
export function forceRefresh(): Promise<string | undefined> {
  if (!forcing) {
    forcing = (async () => {
      snapshot = null
      try {
        const session: any = updater ? await updater() : await getSession()
        if (!session || session.error) return undefined
        rememberSession(session.user?.token, session.accessTokenExpires)
        return session.user?.token as string | undefined
      } catch {
        return undefined
      } finally {
        setTimeout(() => {
          forcing = null
        }, 2000)
      }
    })()
  }
  return forcing
}

// Ends the login in this browser and goes to the login page with a short explanation. Runs once.
export function endSession(reason: "expired" | "disabled" = "expired") {
  if (signingOut || typeof window === "undefined") return
  signingOut = true
  snapshot = null
  signOut({ callbackUrl: `/login?reason=${reason}` })
}

// Where each kind of user lands after login. null = no portal page for this role.
export function homeFor(user: { role?: string; villageId?: string | null; choklaId?: string | null } | undefined | null): string | null {
  if (!user) return null
  if (user.role === "SUPER_ADMIN") return "/admin/superadmin"
  if (user.role === "VILLAGE_MEMBER" && user.villageId) return `/admin/village/${user.villageId}`
  if (user.role === "CHOKHLA_MEMBER" && user.choklaId) return `/admin/chokhla/${user.choklaId}`
  return null
}

// Only same-site paths are accepted as "go back to" targets (blocks open redirects such as //evil.com).
export function safeCallbackPath(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value, window.location.origin)
    if (url.origin !== window.location.origin) return null
    const path = url.pathname + url.search
    if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/login") || path.startsWith("/api/")) return null
    return path
  } catch {
    return null
  }
}

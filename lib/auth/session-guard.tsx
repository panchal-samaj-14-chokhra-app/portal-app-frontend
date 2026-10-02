"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { endSession, registerSessionUpdater, rememberSession } from "@/lib/auth/client"

// Lives once inside the SessionProvider:
//  - lets the API client use the current access token and ask for a refresh (see lib/auth/client.ts)
//  - when the server says the login can no longer be renewed, sends the user to the login page once
export function SessionGuard() {
  const { data, update } = useSession()
  const session = data as any
  const ended = useRef(false)

  useEffect(() => {
    // next-auth only runs the server-side `update` step when some data is sent along with the call
    registerSessionUpdater(() => update({ forceRefresh: Date.now() }))
    return () => registerSessionUpdater(null)
  }, [update])

  useEffect(() => {
    rememberSession(session?.user?.token, session?.accessTokenExpires)
  }, [session?.user?.token, session?.accessTokenExpires])

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError" && !ended.current) {
      ended.current = true
      endSession("expired")
    }
  }, [session?.error])

  return null
}

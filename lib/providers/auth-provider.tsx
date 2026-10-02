"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import { SessionGuard } from "@/lib/auth/session-guard"

interface AuthProviderProps {
  children: React.ReactNode
  session?: Session | null
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  // Re-check the session every 4 minutes and when the tab comes back, so the access token is renewed
  // in the background before it runs out.
  return (
    <SessionProvider session={session} refetchInterval={4 * 60} refetchOnWindowFocus>
      <SessionGuard />
      {children}
    </SessionProvider>
  )
}

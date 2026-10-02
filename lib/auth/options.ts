import type { AuthOptions, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

// Backend base URL (server side). Same variable the login always used, with the axios one as a fallback.
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_REQUEST_URL

// Ask for a new access token this long before the current one runs out
const REFRESH_MARGIN_MS = 60 * 1000
// Do not hammer the backend if it is down
const RETRY_AFTER_FAILURE_MS = 10 * 1000
// How long the browser may stay signed in without a password: the backend's refresh-token lifetime
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

// Error codes handed to the login form (next-auth passes the thrown message back as `error`)
export const AUTH_ERRORS = {
  INVALID: "InvalidCredentials",
  DISABLED: "AccountDisabled",
  TOO_MANY: "TooManyAttempts",
  UNAVAILABLE: "ServerUnavailable",
} as const

type BackendAuth = {
  accessToken?: string
  token?: string
  accessTokenExpires: number
  refreshToken: string
  refreshTokenExpires: number
  userId: string
  email: string
  role: string
  choklaId: string
  villageId: string | null
}

async function backendPost(path: string, body: unknown): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  })
}

// Several requests can notice the expired token at the same moment; they all share one refresh call.
const inflightRefresh = new Map<string, Promise<JWT>>()

async function doRefresh(token: JWT): Promise<JWT> {
  try {
    const res = await backendPost("/api/auth/refresh", { refreshToken: token.refreshToken })
    if (res.status === 401 || res.status === 403) {
      // the login was ended (logout elsewhere, password reset, deactivated, too old): a real sign-out
      return { ...token, accessToken: undefined, error: "RefreshAccessTokenError" }
    }
    if (!res.ok) throw new Error(`refresh failed with ${res.status}`)
    const data = (await res.json()) as BackendAuth
    return {
      ...token,
      id: data.userId,
      role: data.role,
      choklaId: data.choklaId,
      villageId: data.villageId,
      accessToken: data.accessToken || data.token,
      accessTokenExpires: data.accessTokenExpires,
      refreshToken: data.refreshToken,
      refreshTokenExpires: data.refreshTokenExpires,
      error: undefined,
      lastRefreshFailure: undefined,
    }
  } catch {
    // backend unreachable / 5xx: stay signed in and try again shortly instead of throwing the user out
    return { ...token, lastRefreshFailure: Date.now() }
  }
}

function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken || !token.refreshTokenExpires || Date.now() >= token.refreshTokenExpires) {
    return Promise.resolve({ ...token, accessToken: undefined, error: "RefreshAccessTokenError" })
  }
  const key = token.refreshToken
  let pending = inflightRefresh.get(key)
  if (!pending) {
    pending = doRefresh(token).finally(() => setTimeout(() => inflightRefresh.delete(key), 5000))
    inflightRefresh.set(key, pending)
  }
  return pending
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error(AUTH_ERRORS.INVALID)

        let res: Response
        try {
          res = await backendPost("/api/auth/login", { email: credentials.email, password: credentials.password })
        } catch {
          throw new Error(AUTH_ERRORS.UNAVAILABLE)
        }
        const data = await res.json().catch(() => null)

        if (res.status === 429) throw new Error(AUTH_ERRORS.TOO_MANY)
        if (res.status === 403 && data?.code === "ACCOUNT_DISABLED") throw new Error(AUTH_ERRORS.DISABLED)
        if (res.status === 400 || res.status === 401) throw new Error(AUTH_ERRORS.INVALID)
        if (!res.ok || !data?.userId || !(data.accessToken || data.token)) throw new Error(AUTH_ERRORS.UNAVAILABLE)

        return {
          id: data.userId,
          email: data.email,
          role: data.role,
          choklaId: data.choklaId,
          villageId: data.villageId,
          accessToken: data.accessToken || data.token,
          accessTokenExpires: data.accessTokenExpires,
          refreshToken: data.refreshToken,
          refreshTokenExpires: data.refreshTokenExpires,
        } as User
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // first call after a successful login
      if (user) {
        const u = user as any
        return {
          id: u.id,
          email: u.email,
          role: u.role,
          choklaId: u.choklaId,
          villageId: u.villageId,
          accessToken: u.accessToken,
          accessTokenExpires: u.accessTokenExpires,
          refreshToken: u.refreshToken,
          refreshTokenExpires: u.refreshTokenExpires,
        }
      }
      if (token.error === "RefreshAccessTokenError") return token

      // `update` = the browser got a 401 although the token looked fine (e.g. revoked): ask the backend again
      const forced = trigger === "update"
      const expiring = !token.accessTokenExpires || Date.now() >= token.accessTokenExpires - REFRESH_MARGIN_MS
      if (!forced && !expiring) return token
      if (!forced && token.lastRefreshFailure && Date.now() - token.lastRefreshFailure < RETRY_AFTER_FAILURE_MS) return token
      return refreshAccessToken(token)
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        const u = session.user as any
        u.id = token.id
        u.role = token.role
        u.choklaId = token.choklaId
        u.villageId = token.villageId
        // the backend access token, as every page already reads it
        u.token = token.accessToken
      }
      ;(session as any).accessTokenExpires = token.accessTokenExpires
      ;(session as any).error = token.error
      return session
    },
  },
  events: {
    // End the login on the server too, so the refresh token stops working right away
    async signOut({ token }) {
      if (!token?.refreshToken) return
      try {
        await backendPost("/api/auth/logout", { refreshToken: token.refreshToken })
      } catch {
        // the token expires by itself; nothing more to do
      }
    },
  },
  pages: {
    signIn: "/login",
    // next-auth problems (e.g. "Callback") land on the login page with ?error=... instead of a dead-end error page
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

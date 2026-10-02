import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    role?: string
    choklaId?: string
    villageId?: string | null
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    refreshTokenExpires?: number
  }
  interface Session {
    user?: User
    error?: string
    accessTokenExpires?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    choklaId?: string
    villageId?: string | null
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    refreshTokenExpires?: number
    error?: string
    lastRefreshFailure?: number
  }
}

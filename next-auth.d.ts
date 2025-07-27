import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      token: string
      choklaId?: string
      villageId?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    token: string
    choklaId?: string
    villageId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    accessToken: string
    choklaId?: string
    villageId?: string
  }
}

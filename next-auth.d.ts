declare module "next-auth" {
  interface User {
    id: string
    email?: string | null
    role?: string
    token?: string
    choklaId?: string
    villageId?: string
  }

  interface Session {
    user: {
      id: string
      email?: string | null
      role?: string
      token?: string
      choklaId?: string
      villageId?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    token?: string
    choklaId?: string
    villageId?: string
  }
}

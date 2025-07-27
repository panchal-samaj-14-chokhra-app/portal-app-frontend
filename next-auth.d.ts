declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      token: string
      choklaId?: string
      villageId?: string
    }
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
    token: string
    choklaId?: string
    villageId?: string
  }
}

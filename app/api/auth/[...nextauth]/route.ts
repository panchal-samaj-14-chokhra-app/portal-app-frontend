import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { AuthOptions, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          console.log("Attempting login with:", credentials.email)

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await res.json()
          console.log("Login response:", data)

          if (res.ok && data?.userId) {
            return {
              id: data.userId,
              email: data.email,
              role: data.role,
              token: data.token,
              choklaId: data.choklaId,
              villageId: data.villageId,
            }
          }

          return null
        } catch (error) {
          console.error("Login error:", error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
        token.token = (user as any).token
        token.choklaId = (user as any).choklaId
        token.villageId = (user as any).villageId
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).token = token.token
        ;(session.user as any).choklaId = token.choklaId
        ;(session.user as any).villageId = token.villageId
      }
      return session
    },
    async redirect({ url, baseUrl, token }) {
      console.log("Redirect callback - URL:", url, "BaseURL:", baseUrl, "Token:", token)

      // If user is signing in, redirect based on their role
      if (token?.role) {
        const role = token.role as string
        const villageId = token.villageId as string
        const choklaId = token.choklaId as string

        if (role === "SUPER_ADMIN") {
          return `${baseUrl}/admin/superadmin`
        } else if (role === "VILLAGE_MEMBER" && villageId) {
          return `${baseUrl}/admin/village/${villageId}`
        } else if (role === "CHOKHLA_MEMBER" && choklaId) {
          return `${baseUrl}/admin/chokhla/${choklaId}`
        }
      }

      // Default redirect
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
export { authOptions }

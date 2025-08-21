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
          console.log("Missing credentials")
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
          console.log("Login API response:", data)

          if (res.ok && data?.userId) {
            // Map the API response to NextAuth user object
            const user = {
              id: data.userId,
              email: data.email,
              role: data.role,
              token: data.token,
              choklaId: data.choklaId,
              villageId: data.villageId,
            }
            console.log("Returning user object:", user)
            return user
          }

          console.log("Login failed:", data.message || "Unknown error")
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
      // If user object exists (first time login), add user data to token
      if (user) {
        console.log("Adding user data to JWT token:", user)
        token.id = user.id
        token.role = (user as any).role
        token.token = (user as any).token
        token.choklaId = (user as any).choklaId
        token.villageId = (user as any).villageId
      }
      console.log("JWT token:", token)
      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // Add token data to session
      if (session.user && token) {
        console.log("Adding token data to session:", token)
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).token = token.token
        ;(session.user as any).choklaId = token.choklaId
        ;(session.user as any).villageId = token.villageId
      }
      console.log("Final session:", session)
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
export { authOptions }

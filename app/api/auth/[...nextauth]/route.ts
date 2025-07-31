import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo credentials for testing
        const validCredentials = [
          {
            id: "1",
            email: "admin@panchalsamaj.org",
            password: "admin123",
            name: "मुकेश पंचाल",
            role: "chokhra_admin",
            chokhra: "लोहारिया",
          },
          {
            id: "2",
            email: "village@panchalsamaj.org",
            password: "village123",
            name: "राम पंचाल",
            role: "village_admin",
            village: "गांव 1",
            chokhra: "लोहारिया",
          },
        ]

        if (credentials?.email && credentials?.password) {
          const user = validCredentials.find(
            (u) => u.email === credentials.email && u.password === credentials.password,
          )

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              chokhra: user.chokhra,
              village: user.village || null,
            }
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.chokhra = user.chokhra
        token.village = user.village
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.chokhra = token.chokhra
        session.user.village = token.village
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }

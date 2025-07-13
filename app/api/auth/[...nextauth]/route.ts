import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Demo users with roles
const users = [
  {
    id: "1",
    email: "admin@panchalsamaj.org",
    password: "admin123",
    name: "मुकेश पंचाल",
    role: "admin",
  },
  {
    id: "2",
    email: "chokhra@panchalsamaj.org",
    password: "chokhra123",
    name: "राम पंचाल",
    role: "chokhra",
  },
  {
    id: "3",
    email: "village@panchalsamaj.org",
    password: "village123",
    name: "श्याम पंचाल",
    role: "village",
  },
]

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find((user) => user.email === credentials.email && user.password === credentials.password)

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }

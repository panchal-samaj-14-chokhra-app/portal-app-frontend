import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                })
                const data = await res.json()
                if (!res.ok || !data?.token) throw new Error(data.message || "Invalid credentials")
                return {
                    id: data.userId,
                    email: data.email,
                    role: data.role,
                    token: data.token,
                    choklaId: data.choklaId,
                    villageId: data.villageId,
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.token = user.token
                token.choklaId = user.choklaId
                token.villageId = user.villageId
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.token = token.token as string
                session.user.choklaId = token.choklaId as string
                session.user.villageId = token.villageId as string | null
            }
            return session
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
}

// Export handler for App Router
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

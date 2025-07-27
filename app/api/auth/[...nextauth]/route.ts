import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";


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
                    return null;
                }
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                });
                const data = await res.json();

                if (data && data.userId) {
                    return {
                        id: data.userId,
                        email: data.email,
                        role: data.role,
                        token: data.token,
                        choklaId: data.choklaId,
                        villageId: data.villageId,
                    };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role;
                token.token = (user as any).token;
                token.choklaId = (user as any).choklaId;
                token.villageId = (user as any).villageId;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                (session.user as any).id = (token as any).id;
                (session.user as any).role = (token as any).role;
                (session.user as any).token = (token as any).token;
                (session.user as any).choklaId = (token as any).choklaId;
                (session.user as any).villageId = (token as any).villageId;

            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions }; 
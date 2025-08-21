import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            token: string
            choklaId: string
            villageId: string | null
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: string
        role: string
        token: string
        choklaId: string
        villageId: string | null
    }
}

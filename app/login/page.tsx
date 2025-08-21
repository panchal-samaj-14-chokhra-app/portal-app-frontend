import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LoginForm from "./LoginForm"
import Image from "next/image"
import Link from "next/link"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button/button"

// Extend NextAuth session types
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

export default async function LoginPage() {
  console.log("LoginPage: Getting server session...")

  try {
    const session = await getServerSession(authOptions)
    console.log("LoginPage: Server session:", session)

    // If user is already logged in, redirect based on their role
    if (session?.user) {
      const { role, villageId, choklaId } = session.user as any
      console.log("LoginPage: User already logged in with role:", role)

      if (role === "SUPER_ADMIN") {
        console.log("LoginPage: Redirecting SUPER_ADMIN to /admin/superadmin")
        redirect("/admin/superadmin")
      } else if (role === "VILLAGE_MEMBER" && villageId) {
        console.log("LoginPage: Redirecting VILLAGE_MEMBER to /admin/village/" + villageId)
        redirect(`/admin/village/${villageId}`)
      } else if (role === "CHOKHLA_MEMBER" && choklaId) {
        console.log("LoginPage: Redirecting CHOKHLA_MEMBER to /admin/chokhla/" + choklaId)
        redirect(`/admin/chokhla/${choklaId}`)
      }
    }
  } catch (error) {
    console.error("LoginPage: Error getting session:", error)
  }

  console.log("LoginPage: Rendering login form")

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={60}
                height={60}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">पंचाल समाज 14 चोखरा</h1>
                <p className="text-orange-100 text-sm md:text-lg">डिजिटल जनगणना 2025 - एडमिन लॉगिन</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl rounded-lg border">
            <div className="text-center p-6 pb-4">
              <h2 className="text-2xl text-orange-700 font-bold">एडमिन लॉगिन पोर्टल</h2>
              <p className="text-gray-600 mt-2">जनगणना प्रबंधन प्रणाली में प्रवेश के लिए साइन इन करें</p>
            </div>
            <div className="p-6 pt-0">
              <LoginForm />

              {/* Support Options */}
              <div className="mt-6 pt-6 border-t border-orange-200">
                <div className="flex justify-between text-sm">
                  <Link href="/reset-password" className="text-orange-600 hover:text-orange-700 hover:underline">
                    पासवर्ड भूल गए?
                  </Link>
                  <Link
                    href="/help"
                    className="text-orange-600 hover:text-orange-700 hover:underline flex items-center"
                  >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    सहायता
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/">
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent">
                मुख्य पेज पर वापस जाएं
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-orange-100">© 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  )
}

import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LoginForm from "./LoginForm"
import { LanguageSwitcher } from "@/components/language-switcher"
import Image from "next/image"

export default async function LoginPage() {
  // Check if user is already logged in
  const session = await getServerSession(authOptions)

  if (session?.user) {
    const role = (session.user as any).role
    const villageId = (session.user as any).villageId
    const choklaId = (session.user as any).choklaId

    console.log("LoginPage: User already logged in with role:", role)

    // Redirect based on role
    if (role === "SUPER_ADMIN") {
      redirect("/admin/superadmin")
    } else if (role === "VILLAGE_MEMBER" && villageId) {
      redirect(`/admin/village/${villageId}`)
    } else if (role === "CHOKHLA_MEMBER" && choklaId) {
      redirect(`/admin/chokhla/${choklaId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">पंचाल समाज जनगणना</h1>
            <p className="text-gray-600">अपने खाते में लॉगिन करें</p>
          </div>

          {/* Development Test Credentials */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Test Credentials:</h3>
              <div className="text-xs text-blue-700">
                <p>
                  <strong>Super Admin:</strong> mehulpanchal2410@gmail.com
                </p>
                <p>
                  <strong>Password:</strong> [Your actual password]
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <LoginForm />

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <a href="/reset-password" className="text-sm text-orange-600 hover:text-orange-700 hover:underline">
              पासवर्ड भूल गए?
            </a>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              सहायता के लिए{" "}
              <a href="/help" className="text-orange-600 hover:text-orange-700 hover:underline">
                यहाँ क्लिक करें
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">© 2024 पंचाल समाज जनगणना। सभी अधिकार सुरक्षित।</p>
        </div>
      </div>
    </div>
  )
}

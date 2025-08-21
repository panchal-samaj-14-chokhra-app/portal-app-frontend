import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LoginForm from "./LoginForm"
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
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 relative mb-4">
            <Image src="/images/main-logo.png" alt="Panchal Samaj Logo" fill className="object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">पंचाल समाज जनगणना</h2>
          <p className="text-gray-600">अपने खाते में लॉगिन करें</p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8">
          <LoginForm />

          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Test Credentials:</h3>
              <p className="text-xs text-blue-600">Super Admin: mehulpanchal2410@gmail.com</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">© 2024 Panchal Samaj. सभी अधिकार सुरक्षित।</p>
        </div>
      </div>
    </div>
  )
}

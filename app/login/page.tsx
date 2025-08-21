import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import LoginForm from "./LoginForm"
import { authOptions } from "../api/auth/[...nextauth]/route"

declare module "next-auth" {
  interface User {
    role?: string
    choklaId?: string
    villageId?: string
  }
  interface Session {
    user?: User
  }
}

export default async function LoginPage() {
  // Get the session on the server
  const session = await getServerSession(authOptions)

  // If already logged in, redirect based on role
  if (session?.user?.role === "SUPER_ADMIN") {
    redirect("/admin/superadmin")
  } else if (session?.user?.role === "VILLAGE_MEMBER") {
    redirect(`/admin/village/${session.user.villageId}`)
  } else if (session?.user?.role === "CHOKHLA_MEMBER") {
    redirect(`/admin/chokhla/${session?.user?.choklaId}`)
  }

  // Otherwise, render the clean login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      {/* Main Login Container */}
      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">पंचाल समाज जनगणना</h1>
          <p className="text-sm text-gray-600">Panchal Samaj Census System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">साइन इन करें</h2>
            <p className="text-sm text-gray-600">अपने खाते में प्रवेश करें</p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>

        {/* User Roles Info */}
        <div className="bg-white/80 rounded-xl p-4 mb-4">
          <div className="text-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">उपयोगकर्ता प्रकार</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="text-blue-600 text-xs font-medium">सुपर एडमिन</div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <div className="text-green-600 text-xs font-medium">गांव सदस्य</div>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <div className="text-purple-600 text-xs font-medium">चोखला सदस्य</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mb-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>सिस्टम ऑनलाइन</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>सुरक्षित</span>
            </div>
          </div>

          <p className="text-xs text-gray-400">© 2024 पंचाल समाज जनगणना सिस्टम</p>

          <div className="mt-2">
            <a href="/help" className="text-xs text-orange-600 hover:text-orange-700 underline">
              सहायता चाहिए? यहाँ क्लिक करें
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

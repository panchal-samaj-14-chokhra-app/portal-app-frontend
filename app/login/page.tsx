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

  // Otherwise, render the login form with enhanced UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-3 sm:p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="w-full h-full bg-orange-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f97316' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                </svg>
              </div>
              {/* Status Indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">पंचाल समाज जनगणना</h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Panchal Samaj Census System</p>

          {/* Subtitle */}
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-xs sm:text-sm text-orange-800 font-medium">🔐 सुरक्षित लॉगिन पोर्टल</p>
            <p className="text-xs text-orange-600 mt-1">Secure Login Portal</p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">साइन इन करें</h2>
            <p className="text-sm text-gray-600">अपने खाते में प्रवेश करने के लिए अपनी जानकारी दर्ज करें</p>
          </div>

          {/* Login Form Component */}
          <LoginForm />

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 font-medium text-xs sm:text-sm">👥 सुपर एडमिन</div>
                <div className="text-blue-500 text-xs mt-1">Super Admin Access</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-green-600 font-medium text-xs sm:text-sm">🏘️ गांव सदस्य</div>
                <div className="text-green-500 text-xs mt-1">Village Member</div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-purple-600 font-medium text-xs sm:text-sm">🏛️ चोखला सदस्य</div>
              <div className="text-purple-500 text-xs mt-1">Chokhla Member Access</div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="flex items-center justify-center space-x-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>सिस्टम ऑनलाइन</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>सुरक्षित</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">© 2024 पंचाल समाज जनगणना सिस्टम | सभी अधिकार सुरक्षित</p>
              <p className="text-xs text-gray-400 mt-1">Panchal Samaj Census System | All Rights Reserved</p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-xs sm:text-sm text-gray-600 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>सहायता चाहिए?</span>
            <a href="/help" className="text-orange-600 hover:text-orange-700 font-medium underline">
              यहाँ क्लिक करें
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

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

  // Otherwise, render the enhanced login page
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f97316' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Branding & Info */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8">
              {/* Logo & Title */}
              <div className="space-y-4">
                <div className="flex justify-center lg:justify-start">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">पंचाल समाज जनगणना</h1>
                  <p className="text-lg sm:text-xl text-orange-600 font-medium">Panchal Samaj Census System 2025</p>
                  <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto lg:mx-0">
                    डिजिटल जनगणना प्रबंधन प्रणाली में आपका स्वागत है। कृपया अपने खाते में लॉगिन करें।
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="hidden lg:block space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">सिस्टम की विशेषताएं:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">सुरक्षित डेटा प्रबंधन</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">रियल-टाइम रिपोर्टिंग</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">मोबाइल फ्रेंडली इंटरफेस</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden lg:flex justify-center lg:justify-start space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">14</div>
                  <div className="text-sm text-gray-600">चोखरा</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">100+</div>
                  <div className="text-sm text-gray-600">गांव</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">1000+</div>
                  <div className="text-sm text-gray-600">परिवार</div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:max-w-lg">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">साइन इन करें</h2>
                  <p className="text-gray-600">अपने खाते में प्रवेश करें</p>
                </div>

                {/* Login Form */}
                <LoginForm />

                {/* User Roles Info */}
                <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-semibold text-orange-800">उपयोगकर्ता प्रकार</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-blue-700 text-xs font-medium">सुपर एडमिन</div>
                    </div>
                    <div className="text-center p-2 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <div className="text-green-700 text-xs font-medium">गांव सदस्य</div>
                    </div>
                    <div className="text-center p-2 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="text-purple-700 text-xs font-medium">चोखला सदस्य</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Links */}
              <div className="text-center mt-6 space-y-4">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>सिस्टम ऑनलाइन</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>सुरक्षित</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400">© 2024 पंचाल समाज जनगणना सिस्टम। सभी अधिकार सुरक्षित।</p>

                <div className="flex justify-center space-x-4 text-sm">
                  <a href="/help" className="text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                    सहायता केंद्र
                  </a>
                  <span className="text-gray-300">•</span>
                  <a
                    href="/privacy"
                    className="text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                  >
                    गोपनीयता नीति
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import LoginForm from "./LoginForm"
import { authOptions } from "../api/auth/[...nextauth]/route"
import Image from "next/image"

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full opacity-20"></div>
      </div>

      <div className="relative min-h-screen flex">
        {/* Left side - Branding (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 p-12 flex-col justify-center items-center text-white">
          <div className="max-w-md text-center space-y-8">
            {/* Logo */}
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={60}
                height={60}
                className="rounded-xl"
              />
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">पंचाल समाज जनगणना</h1>
              <p className="text-xl text-orange-100">Panchal Samaj Census System</p>
              <p className="text-orange-100 leading-relaxed">
                डिजिटल जनगणना प्रबंधन प्रणाली में आपका स्वागत है। एक सुरक्षित और आधुनिक प्लेटफॉर्म।
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-orange-100">सुरक्षित डेटा प्रबंधन</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-orange-100">रियल-टाइम रिपोर्टिंग</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-orange-100">मोबाइल अनुकूल</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center space-x-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">14</div>
                <div className="text-sm text-orange-200">चोखरा</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm text-orange-200">गांव</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-orange-200">परिवार</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/images/main-logo.png"
                  alt="Panchal Samaj Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">पंचाल समाज जनगणना</h1>
              <p className="text-gray-600 mt-1">Census Management System</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">साइन इन करें</h2>
                <p className="text-gray-600">अपने खाते में प्रवेश करें</p>
              </div>

              {/* Login Form */}
              <LoginForm />
            </div>

            {/* Footer */}
            <div className="text-center mt-8 space-y-4">
              {/* Status indicators */}
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

              {/* Links */}
              <div className="flex justify-center space-x-4 text-sm">
                <a href="/help" className="text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                  सहायता
                </a>
                <span className="text-gray-300">•</span>
                <a href="/privacy" className="text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                  गोपनीयता
                </a>
              </div>

              {/* Copyright */}
              <p className="text-xs text-gray-400">© 2024 पंचाल समाज जनगणना सिस्टम। सभी अधिकार सुरक्षित।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

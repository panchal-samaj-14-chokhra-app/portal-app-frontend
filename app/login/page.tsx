import { Suspense } from "react"
import LoginForm from "./LoginForm"
import LoginLoading from "./loading"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl flex items-center justify-center gap-8">
        {/* Logo/Branding Section */}
        <div className="hidden lg:flex flex-col items-center space-y-6">
          <div className="relative w-32 h-32">
            <Image src="/images/main-logo.png" alt="Panchal Samaj Logo" fill className="object-contain" priority />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Panchal Samaj</h1>
            <p className="text-lg text-gray-600">Census Portal</p>
            <p className="text-sm text-gray-500 max-w-md">
              Digital census management system for the Panchal Samaj community. Manage families, members, and community
              data efficiently.
            </p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full max-w-md">
          <Suspense fallback={<LoginLoading />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

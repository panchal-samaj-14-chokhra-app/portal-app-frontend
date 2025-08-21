"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
    rememberMe: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("अमान्य ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।")
      } else if (result?.ok) {
        router.refresh()
      }
    } catch (error) {
      setError("लॉगिन में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setLoading(false)
    }
  }

  const fillTestCredentials = () => {
    setFormData((prev) => ({
      ...prev,
      email: "mehulpanchal2410@gmail.com",
      password: "test123",
    }))
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            ईमेल पता
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="आपका ईमेल पता दर्ज करें"
              className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            पासवर्ड
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={formData.showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="आपका पासवर्ड दर्ज करें"
              className="pl-10 pr-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              {formData.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
              disabled={loading}
            />
            <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
              मुझे याद रखें
            </Label>
          </div>
          <a
            href="/reset-password"
            className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors"
          >
            पासवर्ड भूल गए?
          </a>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={loading || !formData.email || !formData.password}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>लॉगिन हो रहा है...</span>
            </div>
          ) : (
            "लॉगिन करें"
          )}
        </Button>
      </form>

      {/* User Roles Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center mb-3">
          <h3 className="text-sm font-medium text-gray-700">उपयोगकर्ता प्रकार</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-blue-700 text-xs font-medium">सुपर एडमिन</div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <div className="text-green-700 text-xs font-medium">गांव सदस्य</div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
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

      {/* Development Helper */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800">डेवलपमेंट मोड</h3>
              <p className="text-xs text-blue-600 mt-1">टेस्ट क्रेडेंशियल का उपयोग करें</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillTestCredentials}
              className="text-blue-600 border-blue-300 hover:bg-blue-100 bg-transparent"
              disabled={loading}
            >
              टेस्ट भरें
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
        setError("गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।")
      } else if (result?.ok) {
        router.refresh()
      }
    } catch (error) {
      setError("लॉगिन में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Alert */}
      {error && (
        <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          ईमेल पता *
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="आपका ईमेल पता दर्ज करें"
            className="pl-10 h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          पासवर्ड *
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="password"
            type={formData.showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="आपका पासवर्ड दर्ज करें"
            className="pl-10 pr-10 h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            {formData.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
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
        className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
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

      {/* Development Helper */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800">डेवलपमेंट मोड</h3>
              <p className="text-xs text-blue-600 mt-1">टेस्ट: mehulpanchal2410@gmail.com</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  email: "mehulpanchal2410@gmail.com",
                  password: "test123",
                }))
              }}
              className="text-blue-600 border-blue-300 hover:bg-blue-100 bg-transparent"
              disabled={loading}
            >
              भरें
            </Button>
          </div>
        </div>
      )}

      {/* Additional Help */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-2">पहली बार लॉगिन कर रहे हैं?</p>
        <a
          href="/help"
          className="text-sm text-orange-600 hover:text-orange-700 hover:underline font-medium transition-colors"
        >
          सहायता केंद्र पर जाएं →
        </a>
      </div>
    </form>
  )
}

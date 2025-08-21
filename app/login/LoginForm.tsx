"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "", showPassword: false })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("LoginForm: Attempting to sign in with:", formData.email)

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: true, // Let NextAuth handle the redirect
        callbackUrl: "/login", // This will trigger the redirect callback
      })

      console.log("LoginForm: Sign in result:", result)

      // If we reach here and there's an error, show it
      if (result?.error) {
        console.log("LoginForm: Sign in error:", result.error)
        setError("गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।")
        setLoading(false)
      }
      // If successful, NextAuth will handle the redirect automatically
    } catch (error) {
      console.error("LoginForm: Login error:", error)
      setError("लॉगिन के दौरान एक त्रुटि हुई। कृपया पुनः प्रयास करें।")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-orange-700 font-medium">
          ईमेल पता *
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="अपना ईमेल पता दर्ज करें"
            className="border-orange-200 focus:border-orange-400 pl-10"
            required
            disabled={loading}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="password" className="text-orange-700 font-medium">
          पासवर्ड *
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="password"
            type={formData.showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="पासवर्ड दर्ज करें"
            className="border-orange-200 focus:border-orange-400 pl-10 pr-10"
            required
            disabled={loading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
            disabled={loading}
          >
            {formData.showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
      <Button
        type="submit"
        disabled={loading || !formData.email || !formData.password}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            लॉगिन हो रहा है...
          </>
        ) : (
          "लॉगिन करें"
        )}
      </Button>
    </form>
  )
}

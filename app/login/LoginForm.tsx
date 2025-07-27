"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button/button"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

interface LoginFormData {
  email: string
  password: string
}

interface LoginError {
  message: string
  field?: keyof LoginFormData
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<LoginError | null>(null)
  const router = useRouter()

  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const validateForm = (): boolean => {
    if (!formData.email) {
      setError({ message: "ईमेल आवश्यक है", field: "email" })
      return false
    }
    if (!formData.email.includes("@")) {
      setError({ message: "वैध ईमेल पता दर्ज करें", field: "email" })
      return false
    }
    if (!formData.password) {
      setError({ message: "पासवर्ड आवश्यक है", field: "password" })
      return false
    }
    if (formData.password.length < 6) {
      setError({ message: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए", field: "password" })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError({ message: "गलत ईमेल या पासवर्ड" })
        return
      }

      if (result?.ok) {
        // Get the session to check user role
        const session = await getSession()

        if (session?.user?.role === "SUPER_ADMIN") {
          router.push("/admin/superadmin")
        } else if (session?.user?.role === "CHOKHLA_ADMIN") {
          router.push(`/admin/chokhla/${session.user.choklaId}`)
        } else if (session?.user?.role === "VILLAGE_ADMIN") {
          router.push(`/admin/village/${session.user.villageId}`)
        } else {
          router.push("/admin")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setError({ message: "लॉगिन में त्रुटि हुई। कृपया पुनः प्रयास करें।" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">लॉगिन</CardTitle>
        <CardDescription className="text-center">अपने खाते में प्रवेश करें</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">ईमेल पता</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange("email")}
              disabled={isLoading}
              className={error?.field === "email" ? "border-red-500" : ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">पासवर्ड</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="आपका पासवर्ड"
                value={formData.password}
                onChange={handleInputChange("password")}
                disabled={isLoading}
                className={error?.field === "password" ? "border-red-500" : ""}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                लॉगिन हो रहा है...
              </div>
            ) : (
              "लॉगिन करें"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

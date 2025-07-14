"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("from") || "/village"

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
      } else {
        // Redirect based on user role
        if (formData.email === "admin@panchalsamaj.org") {
          router.push("/admin")
        } else if (formData.email === "chokhra@panchalsamaj.org") {
          router.push("/chokhra")
        } else if (formData.email === "village@panchalsamaj.org") {
          // Redirect village user to specific village ID
          router.push("/village/village-1")
        } else {
          router.push(callbackUrl)
        }
      }
    } catch (error) {
      setError("लॉगिन में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={60}
                height={60}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">पंचाल समाज 14 चोखरा</h1>
                <p className="text-orange-100 text-sm md:text-lg">डिजिटल जनगणना 2025 - एडमिन लॉगिन</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          {/* Demo Credentials Alert */}
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>डेमो क्रेडेंशियल्स:</strong>
              <br />
              <strong>एडमिन:</strong> admin@panchalsamaj.org / admin123
              <br />
              <strong>चोखरा:</strong> chokhra@panchalsamaj.org / chokhra123
              <br />
              <strong>गांव:</strong> village@panchalsamaj.org / village123
            </AlertDescription>
          </Alert>

          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-700">एडमिन लॉगिन पोर्टल</CardTitle>
              <CardDescription>जनगणना प्रबंधन प्रणाली में प्रवेश के लिए साइन इन करें</CardDescription>
            </CardHeader>
            <CardContent>
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
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
                  {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
                </Button>
              </form>

              {/* Support Options */}
              <div className="mt-6 pt-6 border-t border-orange-200">
                <div className="flex justify-between text-sm">
                  <Link href="/reset-password" className="text-orange-600 hover:text-orange-700 hover:underline">
                    पासवर्ड भूल गए?
                  </Link>
                  <Link
                    href="/help"
                    className="text-orange-600 hover:text-orange-700 hover:underline flex items-center"
                  >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    सहायता
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/">
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent">
                मुख्य पेज पर वापस जाएं
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-orange-100">© 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  )
}

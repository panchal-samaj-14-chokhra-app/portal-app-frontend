"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, HelpCircle, Shield, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
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

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })

    if (result?.error) {
      setError("गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।")
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={50}
                height={50}
                className="rounded-full shadow-lg"
              />
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">पंचाल समाज 14 चोखरा</h1>
                <p className="text-orange-100 text-sm">डिजिटल जनगणना 2025</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center max-w-6xl mx-auto">
          {/* Left Side - Branding (Desktop Only) */}
          <div className="hidden lg:block">
            <div className="space-y-8">
              {/* Logo and Title */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                  <Image
                    src="/images/main-logo.png"
                    alt="Panchal Samaj Logo"
                    width={80}
                    height={80}
                    className="rounded-full shadow-xl"
                  />
                  <div>
                    <h1 className="text-3xl xl:text-4xl font-bold text-gray-800">पंचाल समाज 14 चोखरा</h1>
                    <p className="text-lg text-orange-600 font-medium">डिजिटल जनगणना 2025</p>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  आधुनिक तकनीक के साथ हमारे समुदाय की संपूर्ण जनगणना प्रबंधन प्रणाली में आपका स्वागत है।
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm border border-orange-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">परिवार प्रबंधन</h3>
                    <p className="text-sm text-gray-600">संपूर्ण परिवारिक जानकारी का डिजिटल रिकॉर्ड</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm border border-orange-100">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">डेटा एनालिटिक्स</h3>
                    <p className="text-sm text-gray-600">विस्तृत रिपोर्ट और सांख्यिकीय विश्लेषण</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm border border-orange-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">सुरक्षित प्रणाली</h3>
                    <p className="text-sm text-gray-600">उन्नत सुरक्षा के साथ डेटा संरक्षण</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">वर्तमान आंकड़े</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">14</div>
                    <div className="text-sm text-orange-100">चोखरा</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">100+</div>
                    <div className="text-sm text-orange-100">गांव</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-sm text-orange-100">परिवार</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:max-w-none">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl lg:text-3xl text-orange-700 font-bold">एडमिन लॉगिन पोर्टल</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  जनगणना प्रबंधन प्रणाली में प्रवेश के लिए साइन इन करें
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-orange-700 font-medium text-sm">
                      ईमेल पता *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="आपका ईमेल पता दर्ज करें"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 pl-10 h-12 text-base"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-orange-700 font-medium text-sm">
                      पासवर्ड *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="password"
                        type={formData.showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="पासवर्ड दर्ज करें"
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 pl-10 pr-12 h-12 text-base"
                        required
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-gray-100"
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

                  {/* Error Alert */}
                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Login Button */}
                  <Button
                    type="submit"
                    disabled={loading || !formData.email || !formData.password}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
                  </Button>
                </form>

                {/* User Types */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-medium text-gray-700">उपयोगकर्ता प्रकार</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-blue-700 text-xs font-medium">सुपर एडमिन</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-green-700 text-xs font-medium">गांव सदस्य</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-purple-700 text-xs font-medium">चोखला सदस्य</div>
                    </div>
                  </div>
                </div>

                {/* Support Links */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 text-sm">
                    <Link
                      href="/reset-password"
                      className="text-orange-600 hover:text-orange-700 hover:underline transition-colors text-center sm:text-left"
                    >
                      पासवर्ड भूल गए?
                    </Link>
                    <Link
                      href="/help"
                      className="text-orange-600 hover:text-orange-700 hover:underline flex items-center justify-center sm:justify-start transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 mr-1" />
                      सहायता केंद्र
                    </Link>
                  </div>
                </div>

                {/* System Status */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>सिस्टम ऑनलाइन</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>सुरक्षित कनेक्शन</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-white/80 backdrop-blur-sm shadow-lg"
                >
                  मुख्य पेज पर वापस जाएं
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-orange-100 text-sm">© 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  )
}

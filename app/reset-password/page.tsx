"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSubmitted(true)
    } catch (error) {
      setError("पासवर्ड रीसेट भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src="/images/main-logo.png"
                  alt="Panchal Samaj Logo"
                  width={60}
                  height={60}
                  className="rounded-full shadow-lg"
                />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">पासवर्ड रीसेट</h1>
                  <p className="text-orange-100 text-sm md:text-lg">पंचाल समाज 14 चोखरा</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-700 mb-4">ईमेल भेजा गया!</h2>
                <p className="text-gray-600 mb-6">
                  पासवर्ड रीसेट करने के लिए निर्देश <strong>{email}</strong> पर भेजे गए हैं। कृपया अपना ईमेल चेक करें।
                </p>
                <div className="space-y-3">
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                      लॉगिन पेज पर वापस जाएं
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    दूसरा ईमेल भेजें
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={60}
                height={60}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">पासवर्ड रीसेट</h1>
                <p className="text-orange-100 text-sm md:text-lg">पंचाल समाज 14 चोखरा</p>
              </div>
            </div>
            <Link href="/login">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस जाएं
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-700">पासवर्ड रीसेट करें</CardTitle>
              <CardDescription>अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट करने के लिए एक लिंक भेजेंगे</CardDescription>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="अपना ईमेल पता दर्ज करें"
                      className="border-orange-200 focus:border-orange-400 pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {loading ? "भेजा जा रहा है..." : "रीसेट लिंक भेजें"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-orange-200 text-center">
                <p className="text-sm text-gray-600 mb-4">पासवर्ड याद आ गया?</p>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    लॉगिन पेज पर वापस जाएं
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSuccess(true)
    } catch (error) {
      setError("पासवर्ड रीसेट लिंक भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">ईमेल भेजा गया!</CardTitle>
              <CardDescription>पासवर्ड रीसेट लिंक आपके ईमेल पर भेजा गया है</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">कृपया अपना ईमेल चेक करें और पासवर्ड रीसेट करने के लिए लिंक पर क्लिक करें।</p>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  लॉगिन पर वापस जाएं
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            <Image
              src="/images/main-logo.png"
              alt="Panchal Samaj Logo"
              width={60}
              height={60}
              className="rounded-full shadow-lg"
            />
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">पंचाल समाज 14 चोखरा</h1>
              <p className="text-orange-100 text-sm md:text-lg">पासवर्ड रीसेट</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-orange-700">अपना पासवर्ड रीसेट करें</CardTitle>
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
                <Link
                  href="/login"
                  className="text-orange-600 hover:text-orange-700 hover:underline flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  लॉगिन पर वापस जाएं
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

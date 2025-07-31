"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simple email validation
    if (!email || !email.includes("@")) {
      setError("कृपया एक वैध ईमेल पता दर्ज करें")
      setLoading(false)
      return
    }

    // Simulate success
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-50 via-white to-success-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
            <CardTitle className="text-success-700 hindi-text">ईमेल भेजा गया</CardTitle>
            <CardDescription className="hindi-text">पासवर्ड रीसेट करने के लिए निर्देश आपके ईमेल पर भेजे गए हैं।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-success-50 p-4 rounded-lg">
              <p className="text-sm text-success-700 hindi-text">
                <strong>अगले कदम:</strong>
              </p>
              <ul className="text-sm text-success-600 mt-2 space-y-1 hindi-text">
                <li>• अपना ईमेल इनबॉक्स चेक करें</li>
                <li>• स्पैम फोल्डर भी देखें</li>
                <li>• ईमेल में दिए गए लिंक पर क्लिक करें</li>
                <li>• नया पासवर्ड सेट करें</li>
              </ul>
            </div>
            <div className="flex flex-col space-y-2">
              <Link href="/routes/api/signin">
                <Button className="w-full panchal-gradient text-white mobile-touch">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hindi-text">लॉगिन पेज पर वापस जाएं</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                }}
                className="w-full mobile-touch"
              >
                <span className="hindi-text">दूसरा ईमेल भेजें</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-panchal-orange-50 via-white to-panchal-orange-100">
      {/* Header */}
      <header className="panchal-gradient shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            <Image
              src="/images/main-logo.png"
              alt="Panchal Samaj Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white hindi-text">पंचाल समाज 14 चोखरा</h1>
              <p className="text-panchal-orange-100 text-lg hindi-text">पासवर्ड रीसेट</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-white to-panchal-orange-50 border-panchal-orange-200 card-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-panchal-orange-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-panchal-orange-600" />
              </div>
              <CardTitle className="text-2xl text-panchal-orange-700 hindi-text">पासवर्ड रीसेट करें</CardTitle>
              <CardDescription className="hindi-text">
                अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट करने के लिए निर्देश भेजेंगे।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-panchal-orange-700 font-medium hindi-text">
                    ईमेल पता *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="आपका ईमेल पता दर्ज करें"
                    className="border-panchal-orange-200 focus:border-panchal-orange-400 mobile-touch"
                    required
                  />
                </div>

                {error && (
                  <Alert className="border-error-200 bg-error-50">
                    <AlertCircle className="h-4 w-4 text-error-600" />
                    <AlertDescription className="text-error-800 hindi-text">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="bg-panchal-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-panchal-orange-800 mb-2 hindi-text">महत्वपूर्ण जानकारी:</h4>
                  <ul className="text-sm text-panchal-orange-700 space-y-1 hindi-text">
                    <li>• केवल पंजीकृत ईमेल पते पर ही रीसेट लिंक भेजा जाएगा</li>
                    <li>• रीसेट लिंक 24 घंटे के लिए वैध होगा</li>
                    <li>• यदि ईमेल नहीं मिलता तो स्पैम फोल्डर चेक करें</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full panchal-gradient hover:from-panchal-orange-600 hover:to-panchal-orange-700 mobile-touch"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="hindi-text">{loading ? "भेजा जा रहा है..." : "रीसेट लिंक भेजें"}</span>
                </Button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 pt-6 border-t border-panchal-orange-200">
                <Link href="/routes/api/signin">
                  <Button
                    variant="ghost"
                    className="w-full text-panchal-orange-600 hover:bg-panchal-orange-50 mobile-touch"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hindi-text">लॉगिन पेज पर वापस जाएं</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <Card className="mt-6 bg-gradient-to-br from-white to-secondary-50 border-secondary-200">
            <CardHeader>
              <CardTitle className="text-secondary-700 hindi-text">सहायता चाहिए?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 hindi-text">
                यदि आपको अभी भी समस्या आ रही है, तो कृपया निम्नलिखित में से किसी भी तरीके से संपर्क करें:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-secondary-600" />
                  <span className="text-gray-600">support@panchalsamaj.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 text-secondary-600 text-center">📞</span>
                  <span className="text-gray-600">+91 98765 43210</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="panchal-gradient text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-panchal-orange-100 hindi-text">
            © 2025 पंचाल समाज 14 चोखरा डिजिटल जनगणना। सभी अधिकार सुरक्षित।
          </p>
        </div>
      </footer>
    </div>
  )
}

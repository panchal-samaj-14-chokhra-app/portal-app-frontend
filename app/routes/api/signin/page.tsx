"use client"

import { useState } from "react"
import Image from "next/image"
import { Shield, Users, Eye, EyeOff, HelpCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Temporary credentials for demo
const DEMO_CREDENTIALS = {
  chokhra: {
    id: "chokhra_admin",
    password: "admin123",
    name: "मुकेश पंचाल",
    chokhra: "लोहारिया",
  },
  village: {
    id: "village_admin",
    password: "village123",
    name: "राम पंचाल",
    village: "गांव 1",
    chokhra: "लोहारिया",
  },
}

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState("chokhra")
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    showPassword: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (userType: "chokhra" | "village") => {
    setLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const credentials = DEMO_CREDENTIALS[userType]

    if (formData.loginId === credentials.id && formData.password === credentials.password) {
      // Store session data
      sessionStorage.setItem("userType", userType)
      sessionStorage.setItem("userData", JSON.stringify(credentials))

      // Redirect based on user type
      if (userType === "chokhra") {
        router.push("/routes/admin")
      } else {
        router.push(`/routes/village/${credentials.village}`)
      }
    } else {
      setError("गलत लॉगिन ID या पासवर्ड। कृपया पुनः प्रयास करें।")
    }

    setLoading(false)
  }

  const resetForm = () => {
    setFormData({ loginId: "", password: "", showPassword: false })
    setError("")
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
              <p className="text-panchal-orange-100 text-lg hindi-text">डिजिटल जनगणना 2025 - एडमिन लॉगिन</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Demo Credentials Alert */}
          <Alert className="mb-6 border-secondary-200 bg-secondary-50">
            <HelpCircle className="h-4 w-4 text-secondary-600" />
            <AlertDescription className="text-secondary-800 hindi-text">
              <strong>डेमो क्रेडेंशियल्स:</strong>
              <br />
              <strong>चोखरा एडमिन:</strong> chokhra_admin / admin123
              <br />
              <strong>गांव एडमिन:</strong> village_admin / village123
            </AlertDescription>
          </Alert>

          <Card className="bg-gradient-to-br from-white to-panchal-orange-50 border-panchal-orange-200 card-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-panchal-orange-700 hindi-text">एडमिन लॉगिन पोर्टल</CardTitle>
              <CardDescription className="hindi-text">अपनी भूमिका चुनें और लॉगिन करें</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value)
                  resetForm()
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chokhra" className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span className="hindi-text">चोखरा एडमिन</span>
                  </TabsTrigger>
                  <TabsTrigger value="village" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span className="hindi-text">गांव एडमिन</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chokhra" className="space-y-4 mt-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 panchal-gradient rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-panchal-orange-700 hindi-text">चोखरा एडमिन लॉगिन</h3>
                    <p className="text-sm text-gray-600 hindi-text">पूर्ण प्रबंधन अधिकार</p>
                  </div>

                  <LoginForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={() => handleLogin("chokhra")}
                    loading={loading}
                    error={error}
                  />
                </TabsContent>

                <TabsContent value="village" className="space-y-4 mt-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 panchal-gradient-blue rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-secondary-700 hindi-text">गांव एडमिन लॉगिन</h3>
                    <p className="text-sm text-gray-600 hindi-text">गांव स्तर प्रबंधन</p>
                  </div>

                  <LoginForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={() => handleLogin("village")}
                    loading={loading}
                    error={error}
                  />
                </TabsContent>
              </Tabs>

              {/* Support Options */}
              <div className="mt-6 pt-6 border-t border-panchal-orange-200">
                <div className="flex justify-between text-sm">
                  <Link href="/routes/api/reset-password">
                    <Button variant="ghost" size="sm" className="text-panchal-orange-600 hover:bg-panchal-orange-50">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="hindi-text">पासवर्ड भूल गए?</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-panchal-orange-600 hover:bg-panchal-orange-50">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    <span className="hindi-text">सहायता</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/">
              <Button
                variant="outline"
                className="border-panchal-orange-200 text-panchal-orange-600 hover:bg-panchal-orange-50 bg-transparent"
              >
                <span className="hindi-text">मुख्य पेज पर वापस जाएं</span>
              </Button>
            </Link>
          </div>
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

// Login Form Component
function LoginForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  error,
}: {
  formData: any
  setFormData: any
  onSubmit: () => void
  loading: boolean
  error: string
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="loginId" className="text-panchal-orange-700 font-medium hindi-text">
          लॉगिन ID *
        </Label>
        <Input
          id="loginId"
          type="text"
          value={formData.loginId}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, loginId: e.target.value }))}
          placeholder="अपनी लॉगिन ID दर्ज करें"
          className="border-panchal-orange-200 focus:border-panchal-orange-400 mobile-touch"
          required
        />
      </div>

      <div>
        <Label htmlFor="password" className="text-panchal-orange-700 font-medium hindi-text">
          पासवर्ड *
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={formData.showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, password: e.target.value }))}
            placeholder="पासवर्ड दर्ज करें"
            className="border-panchal-orange-200 focus:border-panchal-orange-400 pr-10 mobile-touch"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setFormData((prev: any) => ({ ...prev, showPassword: !prev.showPassword }))}
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
        <Alert className="border-error-200 bg-error-50">
          <AlertDescription className="text-error-800 hindi-text">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={loading || !formData.loginId || !formData.password}
        className="w-full panchal-gradient hover:from-panchal-orange-600 hover:to-panchal-orange-700 mobile-touch"
      >
        <span className="hindi-text">{loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}</span>
      </Button>
    </form>
  )
}

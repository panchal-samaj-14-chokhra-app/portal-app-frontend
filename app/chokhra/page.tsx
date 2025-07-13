"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import { Users, Home, FileText, BarChart3, Settings, LogOut, MapPin, TrendingUp, Database } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"

export default function ChokhraPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) router.push("/login") // Not authenticated
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
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
                width={50}
                height={50}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">चोखरा प्रबंधन पोर्टल</h1>
                <p className="text-orange-100 text-sm">स्वागत है, {session.user?.name}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              लॉगआउट
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">कुल गांव</p>
                  <p className="text-2xl font-bold text-blue-700">12</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">कुल परिवार</p>
                  <p className="text-2xl font-bold text-green-700">1,847</p>
                </div>
                <Home className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">कुल जनसंख्या</p>
                  <p className="text-2xl font-bold text-purple-700">7,623</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">पूर्णता दर</p>
                  <p className="text-2xl font-bold text-orange-700">87%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Village Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-2" />
                गांव प्रबंधन
              </CardTitle>
              <CardDescription>सभी गांवों की स्थिति देखें</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-700">लोहारिया</p>
                    <p className="text-sm text-green-600">156 परिवार • 642 सदस्य</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">पूर्ण</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-700">धनसुरा</p>
                    <p className="text-sm text-yellow-600">203 परिवार • 834 सदस्य</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">प्रगति में</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-700">वडाली</p>
                    <p className="text-sm text-blue-600">178 परिवार • 723 सदस्य</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">शुरुआत</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <BarChart3 className="w-5 h-5 mr-2" />
                डेटा विश्लेषण
              </CardTitle>
              <CardDescription>जनसंख्या आंकड़े और रुझान</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">पुरुष</span>
                  <span className="text-sm text-gray-600">3,912 (51.3%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "51.3%" }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">महिला</span>
                  <span className="text-sm text-gray-600">3,711 (48.7%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-600 h-2 rounded-full" style={{ width: "48.7%" }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">बच्चे (0-18)</span>
                  <span className="text-sm text-gray-600">2,287 (30%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Database className="w-5 h-5 mr-2" />
                डेटा निर्यात
              </CardTitle>
              <CardDescription>सभी डेटा को Excel या PDF में निर्यात करें</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">डेटा निर्यात करें</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <FileText className="w-5 h-5 mr-2" />
                रिपोर्ट जेनरेट करें
              </CardTitle>
              <CardDescription>विस्तृत विश्लेषण रिपोर्ट बनाएं</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                रिपोर्ट बनाएं
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <Settings className="w-5 h-5 mr-2" />
                सिस्टम सेटिंग्स
              </CardTitle>
              <CardDescription>चोखरा स्तर की सेटिंग्स प्रबंधित करें</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
              >
                सेटिंग्स खोलें
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

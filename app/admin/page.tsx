"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import {
  Users,
  Home,
  FileText,
  BarChart3,
  LogOut,
  Shield,
  Database,
  Globe,
  Activity,
  UserCheck,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"

export default function AdminPage() {
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
                <h1 className="text-xl md:text-2xl font-bold text-white">मुख्य प्रशासन पोर्टल</h1>
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
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">कुल चोखरा</p>
                  <p className="text-2xl font-bold text-blue-700">14</p>
                </div>
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">कुल गांव</p>
                  <p className="text-2xl font-bold text-green-700">168</p>
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
                  <p className="text-2xl font-bold text-purple-700">1,28,456</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">सक्रिय उपयोगकर्ता</p>
                  <p className="text-2xl font-bold text-orange-700">342</p>
                </div>
                <UserCheck className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <Activity className="w-5 h-5 mr-2" />
                सिस्टम स्थिति
              </CardTitle>
              <CardDescription>वर्तमान सिस्टम प्रदर्शन और स्वास्थ्य</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-green-700">डेटाबेस कनेक्शन</p>
                      <p className="text-sm text-green-600">सामान्य</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">ऑनलाइन</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-green-700">सर्वर प्रदर्शन</p>
                      <p className="text-sm text-green-600">उत्कृष्ट</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">98%</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-yellow-700">बैकअप स्थिति</p>
                      <p className="text-sm text-yellow-600">2 घंटे पहले</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">चेतावनी</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <BarChart3 className="w-5 h-5 mr-2" />
                डेटा पूर्णता रिपोर्ट
              </CardTitle>
              <CardDescription>चोखरा-वार डेटा संग्रह की स्थिति</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">लोहारिया चोखरा</span>
                  <span className="text-sm text-gray-600">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "95%" }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">धनसुरा चोखरा</span>
                  <span className="text-sm text-gray-600">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "87%" }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">वडाली चोखरा</span>
                  <span className="text-sm text-gray-600">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <Shield className="w-5 h-5 mr-2" />
                उपयोगकर्ता प्रबंधन
              </CardTitle>
              <CardDescription>सिस्टम उपयोगकर्ताओं को प्रबंधित करें</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-red-500 hover:bg-red-600">उपयोगकर्ता प्रबंधन</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Database className="w-5 h-5 mr-2" />
                डेटाबेस प्रबंधन
              </CardTitle>
              <CardDescription>डेटाबेस बैकअप और रखरखाव</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
              >
                डेटाबेस टूल्स
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <FileText className="w-5 h-5 mr-2" />
                मास्टर रिपोर्ट
              </CardTitle>
              <CardDescription>संपूर्ण सिस्टम रिपोर्ट जेनरेट करें</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                रिपोर्ट जेनरेट करें
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <AlertTriangle className="w-5 h-5 mr-2" />
              सिस्टम अलर्ट
            </CardTitle>
            <CardDescription>महत्वपूर्ण सिस्टम सूचनाएं</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div>
                  <p className="font-medium text-yellow-700">डेटा बैकअप आवश्यक</p>
                  <p className="text-sm text-yellow-600">अंतिम बैकअप 2 घंटे पहले लिया गया था</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">चेतावनी</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div>
                  <p className="font-medium text-blue-700">नया अपडेट उपलब्ध</p>
                  <p className="text-sm text-blue-600">सिस्टम अपडेट v2.1.3 उपलब्ध है</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700">सूचना</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

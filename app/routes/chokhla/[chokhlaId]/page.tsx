"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Users, BarChart3, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"

interface ChokhlaData {
  id: string
  name: string
  totalVillages: number
  totalFamilies: number
  totalMembers: number
  adminName: string
  adminContact: string
  description: string
  villages: Village[]
}

interface Village {
  id: string
  name: string
  familyCount: number
  memberCount: number
  adminName: string
  status: "Active" | "Inactive"
}

const mockChokhlaData: Record<string, ChokhlaData> = {
  लोहारिया: {
    id: "लोहारिया",
    name: "लोहारिया चोखरा",
    totalVillages: 8,
    totalFamilies: 245,
    totalMembers: 1024,
    adminName: "मुकेश पंचाल",
    adminContact: "9876543210",
    description: "लोहारिया चोखरा पंचाल समाज का मुख्य केंद्र है जो 8 गांवों को मिलाकर बना है।",
    villages: [
      { id: "v1", name: "गांव 1", familyCount: 45, memberCount: 189, adminName: "राम पंचाल", status: "Active" },
      { id: "v2", name: "गांव 2", familyCount: 38, memberCount: 156, adminName: "श्याम पंचाल", status: "Active" },
      { id: "v3", name: "गांव 3", familyCount: 52, memberCount: 218, adminName: "गोपाल पंचाल", status: "Active" },
      { id: "v4", name: "गांव 4", familyCount: 29, memberCount: 124, adminName: "विकास पंचाल", status: "Active" },
      { id: "v5", name: "गांव 5", familyCount: 34, memberCount: 142, adminName: "अमित पंचाल", status: "Active" },
      { id: "v6", name: "गांव 6", familyCount: 21, memberCount: 89, adminName: "सुनील पंचाल", status: "Active" },
      { id: "v7", name: "गांव 7", familyCount: 16, memberCount: 67, adminName: "राजेश पंचाल", status: "Active" },
      { id: "v8", name: "गांव 8", familyCount: 10, memberCount: 39, adminName: "दीपक पंचाल", status: "Active" },
    ],
  },
  चौरासी: {
    id: "चौरासी",
    name: "चौरासी चोखरा",
    totalVillages: 6,
    totalFamilies: 189,
    totalMembers: 876,
    adminName: "रमेश पंचाल",
    adminContact: "9876543211",
    description: "चौरासी चोखरा में 6 गांव शामिल हैं और यह पारंपरिक शिल्प के लिए प्रसिद्ध है।",
    villages: [
      { id: "v9", name: "गांव 9", familyCount: 42, memberCount: 178, adminName: "हरीश पंचाल", status: "Active" },
      { id: "v10", name: "गांव 10", familyCount: 35, memberCount: 149, adminName: "प्रकाश पंचाल", status: "Active" },
      { id: "v11", name: "गांव 11", familyCount: 28, memberCount: 119, adminName: "संजय पंचाल", status: "Active" },
      { id: "v12", name: "गांव 12", familyCount: 31, memberCount: 132, adminName: "अशोक पंचाल", status: "Active" },
      { id: "v13", name: "गांव 13", familyCount: 26, memberCount: 111, adminName: "मनोज पंचाल", status: "Active" },
      { id: "v14", name: "गांव 14", familyCount: 27, memberCount: 187, adminName: "कमल पंचाल", status: "Active" },
    ],
  },
}

export default function ChokhlaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const chokhlaId = decodeURIComponent(params.chokhlaId as string)
  const [chokhlaData, setChokhlaData] = useState<ChokhlaData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = mockChokhlaData[chokhlaId]
      setChokhlaData(data || null)
      setLoading(false)
    }, 1000)
  }, [chokhlaId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-panchal-orange-50 via-white to-panchal-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-panchal-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 hindi-text">लॉड हो रहा है...</p>
        </div>
      </div>
    )
  }

  if (!chokhlaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-error-50 via-white to-error-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-error-700 hindi-text">चोखरा नहीं मिला</CardTitle>
            <CardDescription className="hindi-text">आपके द्वारा खोजा गया चोखरा मौजूद नहीं है।</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full panchal-gradient text-white mobile-touch">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hindi-text">होम पेज पर वापस जाएं</span>
            </Button>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/images/main-logo.png" alt="Logo" width={60} height={60} className="rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-white hindi-text">{chokhlaData.name}</h1>
                <p className="text-panchal-orange-100 hindi-text">चोखरा विवरण और गांव सूची</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-panchal-orange-300 text-white hover:bg-panchal-orange-400 bg-panchal-orange-500/20 mobile-touch"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hindi-text">होम</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Chokhra Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 bg-gradient-to-br from-white to-panchal-orange-50 border-panchal-orange-200 card-shadow">
            <CardHeader>
              <CardTitle className="text-panchal-orange-700 hindi-text">चोखरा जानकारी</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 hindi-text">{chokhlaData.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-panchal-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600 hindi-text">चोखरा एडमिन</p>
                    <p className="font-semibold">{chokhlaData.adminName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-panchal-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600 hindi-text">संपर्क</p>
                    <p className="font-semibold">{chokhlaData.adminContact}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-secondary-50 border-secondary-200 card-shadow">
            <CardHeader>
              <CardTitle className="text-secondary-700 hindi-text">त्वरित आंकड़े</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600">{chokhlaData.totalVillages}</div>
                <p className="text-sm text-gray-600 hindi-text">कुल गांव</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-600">{chokhlaData.totalFamilies}</div>
                <p className="text-sm text-gray-600 hindi-text">कुल परिवार</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning-600">{chokhlaData.totalMembers}</div>
                <p className="text-sm text-gray-600 hindi-text">कुल सदस्य</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Villages Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 hindi-text">गांव सूची</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {chokhlaData.villages.map((village) => (
              <Card
                key={village.id}
                className="bg-gradient-to-br from-white to-secondary-50 border-secondary-200 card-shadow cursor-pointer hover:scale-105 transition-transform"
                onClick={() => router.push(`/routes/village/${encodeURIComponent(village.name)}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-secondary-700 flex items-center hindi-text">
                      <MapPin className="w-5 h-5 mr-2" />
                      {village.name}
                    </CardTitle>
                    <Badge className={village.status === "Active" ? "bg-success-500" : "bg-error-500"}>
                      {village.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 hindi-text">परिवार:</span>
                      <span className="font-bold text-secondary-600">{village.familyCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 hindi-text">सदस्य:</span>
                      <span className="font-bold text-success-600">{village.memberCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 hindi-text">एडमिन:</span>
                      <span className="font-medium text-gray-800">{village.adminName}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 panchal-gradient-blue text-white mobile-touch">
                    <span className="hindi-text">विवरण देखें</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="hindi-text">त्वरित कार्य</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push("/routes/api/signin")}
                className="panchal-gradient text-white mobile-touch"
              >
                <Users className="w-4 h-4 mr-2" />
                <span className="hindi-text">एडमिन लॉगिन</span>
              </Button>
              <Button variant="outline" className="border-secondary-200 text-secondary-600 mobile-touch bg-transparent">
                <BarChart3 className="w-4 h-4 mr-2" />
                <span className="hindi-text">रिपोर्ट देखें</span>
              </Button>
              <Button variant="outline" className="border-success-200 text-success-600 mobile-touch bg-transparent">
                <Mail className="w-4 h-4 mr-2" />
                <span className="hindi-text">संपर्क करें</span>
              </Button>
            </div>
          </CardContent>
        </Card>
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

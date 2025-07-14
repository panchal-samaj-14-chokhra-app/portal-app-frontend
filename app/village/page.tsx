"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Users, Home, Search, LogOut, MapPin, Eye } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Input } from "@/components/ui/input/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"

interface Village {
  id: string
  name: string
  familyCount: number
  memberCount: number
  maleCount: number
  femaleCount: number
}

// Mock data - in real app this would come from API
const mockVillages: Village[] = [
  {
    id: "village-1",
    name: "गांव 1",
    familyCount: 45,
    memberCount: 189,
    maleCount: 98,
    femaleCount: 91,
  },
  {
    id: "village-2",
    name: "गांव 2",
    familyCount: 38,
    memberCount: 156,
    maleCount: 82,
    femaleCount: 74,
  },
  {
    id: "village-3",
    name: "गांव 3",
    familyCount: 52,
    memberCount: 218,
    maleCount: 112,
    femaleCount: 106,
  },
]

export default function VillagePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [villages, setVillages] = useState<Village[]>(mockVillages)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700 hindi-text">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  const filteredVillages = villages.filter((village) => village.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalStats = villages.reduce(
    (acc, village) => ({
      families: acc.families + village.familyCount,
      members: acc.members + village.memberCount,
      males: acc.males + village.maleCount,
      females: acc.females + village.femaleCount,
    }),
    { families: 0, members: 0, males: 0, females: 0 },
  )

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
                <h1 className="text-xl md:text-2xl font-bold text-white hindi-text">गांव प्रबंधन पोर्टल</h1>
                <p className="text-orange-100 text-sm">स्वागत है, {session.user?.name}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hindi-text">लॉगआउट</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium hindi-text">कुल गांव</p>
                  <p className="text-2xl font-bold text-blue-700">{villages.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium hindi-text">कुल परिवार</p>
                  <p className="text-2xl font-bold text-green-700">{totalStats.families}</p>
                </div>
                <Home className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium hindi-text">कुल सदस्य</p>
                  <p className="text-2xl font-bold text-purple-700">{totalStats.members}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-600 text-sm font-medium hindi-text">पुरुष/महिला</p>
                  <p className="text-2xl font-bold text-pink-700">
                    {totalStats.males}/{totalStats.females}
                  </p>
                </div>
                <Users className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="hindi-text">गांव खोजें</CardTitle>
            <CardDescription className="hindi-text">अपने गांव को खोजें और प्रबंधित करें</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="गांव का नाम खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Villages Table */}
        <Card>
          <CardHeader>
            <CardTitle className="hindi-text">गांव की सूची</CardTitle>
            <CardDescription className="hindi-text">सभी गांवों की जानकारी और आंकड़े</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hindi-text">गांव का नाम</TableHead>
                  <TableHead className="hindi-text">परिवार</TableHead>
                  <TableHead className="hindi-text">कुल सदस्य</TableHead>
                  <TableHead className="hindi-text">पुरुष</TableHead>
                  <TableHead className="hindi-text">महिला</TableHead>
                  <TableHead className="hindi-text">कार्य</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVillages.map((village) => (
                  <TableRow key={village.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{village.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {village.familyCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {village.memberCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        {village.maleCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-pink-50 text-pink-700">
                        {village.femaleCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/village/${village.id}`)}
                          className="bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="hindi-text">देखें</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredVillages.length === 0 && (
              <div className="text-center py-8">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2 hindi-text">कोई गांव नहीं मिला</h3>
                <p className="text-gray-600 hindi-text">खोज मापदंड के अनुसार कोई गांव नहीं मिला</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Users, Home, Plus, Search, LogOut, Eye, Edit, Trash2, UserCheck, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Input } from "@/components/ui/input/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"

interface Family {
  id: string
  familyId: string
  mukhiyaName: string
  totalMembers: number
  maleMembers: number
  femaleMembers: number
  address: string
  contactNumber?: string
  registrationDate: string
  status: "verified" | "pending" | "draft"
}

interface VillageData {
  id: string
  name: string
  totalFamilies: number
  totalMembers: number
  maleCount: number
  femaleCount: number
}

// Mock data - in real app this would come from API
const mockVillageData: VillageData = {
  id: "village-1",
  name: "गांव 1 - राजपुरा",
  totalFamilies: 45,
  totalMembers: 189,
  maleCount: 98,
  femaleCount: 91,
}

const mockFamilies: Family[] = [
  {
    id: "fam-1",
    familyId: "FAM001",
    mukhiyaName: "राम प्रसाद पंचाल",
    totalMembers: 5,
    maleMembers: 3,
    femaleMembers: 2,
    address: "मुख्य सड़क, राजपुरा",
    contactNumber: "9876543210",
    registrationDate: "2025-01-10",
    status: "verified",
  },
  {
    id: "fam-2",
    familyId: "FAM002",
    mukhiyaName: "श्याम लाल पंचाल",
    totalMembers: 4,
    maleMembers: 2,
    femaleMembers: 2,
    address: "गली नंबर 2, राजपुरा",
    contactNumber: "9876543211",
    registrationDate: "2025-01-11",
    status: "pending",
  },
  {
    id: "fam-3",
    familyId: "FAM003",
    mukhiyaName: "गीता देवी पंचाल",
    totalMembers: 3,
    maleMembers: 1,
    femaleMembers: 2,
    address: "पुराना बाजार, राजपुरा",
    registrationDate: "2025-01-12",
    status: "draft",
  },
]

export default function VillageDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.id as string

  const [villageData, setVillageData] = useState<VillageData>(mockVillageData)
  const [families, setFamilies] = useState<Family[]>(mockFamilies)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")
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

  const filteredFamilies = families.filter((family) => {
    const matchesSearch =
      family.mukhiyaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.familyId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || family.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-700 border-green-200">सत्यापित</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">लंबित</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">मसौदा</Badge>
      default:
        return <Badge variant="outline">अज्ञात</Badge>
    }
  }

  const handleDeleteFamily = (familyId: string) => {
    if (confirm("क्या आप वाकई इस परिवार को हटाना चाहते हैं?")) {
      setFamilies(families.filter((f) => f.id !== familyId))
    }
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
                <h1 className="text-xl md:text-2xl font-bold text-white">{villageData.name}</h1>
                <p className="text-orange-100 text-sm">स्वागत है, {session.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push(`/village/${villageId}/add-family`)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                नया परिवार
              </Button>
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
                  <p className="text-blue-600 text-sm font-medium">कुल परिवार</p>
                  <p className="text-2xl font-bold text-blue-700">{villageData.totalFamilies}</p>
                </div>
                <Home className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">कुल सदस्य</p>
                  <p className="text-2xl font-bold text-green-700">{villageData.totalMembers}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">पुरुष</p>
                  <p className="text-2xl font-bold text-purple-700">{villageData.maleCount}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-600 text-sm font-medium">महिला</p>
                  <p className="text-2xl font-bold text-pink-700">{villageData.femaleCount}</p>
                </div>
                <Users className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>परिवार खोजें और फ़िल्टर करें</CardTitle>
            <CardDescription>परिवारों को खोजें और स्थिति के अनुसार फ़िल्टर करें</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="मुखिया का नाम या परिवार ID खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                >
                  सभी
                </Button>
                <Button
                  variant={statusFilter === "verified" ? "default" : "outline"}
                  onClick={() => setStatusFilter("verified")}
                  size="sm"
                >
                  सत्यापित
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  size="sm"
                >
                  लंबित
                </Button>
                <Button
                  variant={statusFilter === "draft" ? "default" : "outline"}
                  onClick={() => setStatusFilter("draft")}
                  size="sm"
                >
                  मसौदा
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Families Table */}
        <Card>
          <CardHeader>
            <CardTitle>परिवारों की सूची</CardTitle>
            <CardDescription>गांव के सभी पंजीकृत परिवारों की जानकारी</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>परिवार ID</TableHead>
                    <TableHead>मुखिया का नाम</TableHead>
                    <TableHead>कुल सदस्य</TableHead>
                    <TableHead>पुरुष/महिला</TableHead>
                    <TableHead>पता</TableHead>
                    <TableHead>संपर्क</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead>कार्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFamilies.map((family) => (
                    <TableRow key={family.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{family.familyId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-orange-600" />
                          {family.mukhiyaName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {family.totalMembers}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                            पु: {family.maleMembers}
                          </Badge>
                          <Badge variant="outline" className="bg-pink-50 text-pink-700 text-xs">
                            म: {family.femaleMembers}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={family.address}>
                        {family.address}
                      </TableCell>
                      <TableCell>{family.contactNumber || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(family.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/village/${villageId}/family/${family.id}`)}
                            className="bg-transparent"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/village/${villageId}/family/${family.id}/edit`)}
                            className="bg-transparent"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFamily(family.id)}
                            className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredFamilies.length === 0 && (
              <div className="text-center py-8">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई परिवार नहीं मिला</h3>
                <p className="text-gray-600 mb-4">खोज मापदंड के अनुसार कोई परिवार नहीं मिला</p>
                <Button
                  onClick={() => router.push(`/village/${villageId}/add-family`)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  पहला परिवार जोड़ें
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <Plus className="w-5 h-5 mr-2" />
                नया परिवार जोड़ें
              </CardTitle>
              <CardDescription>नए परिवार का पंजीकरण करें</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => router.push(`/village/${villageId}/add-family`)}
              >
                परिवार पंजीकरण शुरू करें
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <MapPin className="w-5 h-5 mr-2" />
                गांव की जानकारी
              </CardTitle>
              <CardDescription>गांव के बारे में विस्तृत जानकारी</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>गांव ID:</strong> {villageData.id}
                </p>
                <p>
                  <strong>कुल परिवार:</strong> {villageData.totalFamilies}
                </p>
                <p>
                  <strong>कुल जनसंख्या:</strong> {villageData.totalMembers}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Users className="w-5 h-5 mr-2" />
                त्वरित आंकड़े
              </CardTitle>
              <CardDescription>जनसंख्या का विवरण</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>पुरुष:</span>
                  <Badge className="bg-purple-100 text-purple-700">{villageData.maleCount}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>महिला:</span>
                  <Badge className="bg-pink-100 text-pink-700">{villageData.femaleCount}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>औसत परिवार आकार:</span>
                  <Badge variant="outline">{Math.round(villageData.totalMembers / villageData.totalFamilies)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

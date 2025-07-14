"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Users, Home, Plus, Search, ArrowLeft, Eye, Edit, Trash2, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Input } from "@/components/ui/input/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select"

interface Family {
  id: string
  familyId: string
  mukhiyaName: string
  totalMembers: number
  address: string
  mobile: string
  email: string
  registrationDate: string
  verificationStatus: "Verified" | "Pending" | "Draft"
}

// Mock data - in real app this would come from API
const mockFamilies: Family[] = [
  {
    id: "family-1",
    familyId: "PID001",
    mukhiyaName: "राम पंचाल",
    totalMembers: 5,
    address: "मुख्य सड़क, गांव 1, उदयपुर",
    mobile: "9876543210",
    email: "ram.panchal@example.com",
    registrationDate: "2024-01-15",
    verificationStatus: "Verified",
  },
  {
    id: "family-2",
    familyId: "PID002",
    mukhiyaName: "श्याम पंचाल",
    totalMembers: 4,
    address: "गली नंबर 2, गांव 1, उदयपुर",
    mobile: "9876543211",
    email: "shyam.panchal@example.com",
    registrationDate: "2024-01-20",
    verificationStatus: "Pending",
  },
  {
    id: "family-3",
    familyId: "PID003",
    mukhiyaName: "गीता पंचाल",
    totalMembers: 3,
    address: "मंदिर के पास, गांव 1, उदयपुर",
    mobile: "9876543212",
    email: "",
    registrationDate: "2024-02-01",
    verificationStatus: "Draft",
  },
]

export default function VillageDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.id as string

  const [families, setFamilies] = useState<Family[]>(mockFamilies)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  // Mock village data
  const villageData = {
    id: villageId,
    name: villageId === "village-1" ? "गांव 1" : villageId === "village-2" ? "गांव 2" : "गांव 3",
    totalFamilies: families.length,
    totalMembers: families.reduce((sum, f) => sum + f.totalMembers, 0),
    verifiedFamilies: families.filter((f) => f.verificationStatus === "Verified").length,
    pendingFamilies: families.filter((f) => f.verificationStatus === "Pending").length,
  }

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")

    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [session, status, router])

  if (status === "loading" || loading) {
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

  const filteredFamilies = families.filter((family) => {
    const matchesSearch =
      family.mukhiyaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.familyId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || family.verificationStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDeleteFamily = (familyId: string) => {
    setFamilies((prev) => prev.filter((f) => f.id !== familyId))
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
                <h1 className="text-xl md:text-2xl font-bold text-white hindi-text">
                  {villageData.name} - परिवार प्रबंधन
                </h1>
                <p className="text-orange-100 text-sm">
                  {villageData.totalFamilies} परिवार • {villageData.totalMembers} सदस्य
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/village")}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hindi-text">वापस</span>
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
                  <p className="text-blue-600 text-sm font-medium hindi-text">कुल परिवार</p>
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
                  <p className="text-green-600 text-sm font-medium hindi-text">कुल सदस्य</p>
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
                  <p className="text-purple-600 text-sm font-medium hindi-text">सत्यापित</p>
                  <p className="text-2xl font-bold text-purple-700">{villageData.verifiedFamilies}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium hindi-text">लंबित</p>
                  <p className="text-2xl font-bold text-yellow-700">{villageData.pendingFamilies}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="hindi-text">परिवार प्रबंधन</CardTitle>
                <CardDescription className="hindi-text">परिवारों को खोजें, जोड़ें और प्रबंधित करें</CardDescription>
              </div>
              <Button
                onClick={() => router.push(`/village/${villageId}/add-family`)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hindi-text">नया परिवार जोड़ें</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="परिवार का नाम या ID खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सभी स्थिति</SelectItem>
                  <SelectItem value="Verified">सत्यापित</SelectItem>
                  <SelectItem value="Pending">लंबित</SelectItem>
                  <SelectItem value="Draft">ड्राफ्ट</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Families Table */}
        <Card>
          <CardHeader>
            <CardTitle className="hindi-text">परिवारों की सूची</CardTitle>
            <CardDescription className="hindi-text">{filteredFamilies.length} परिवार मिले</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hindi-text">परिवार ID</TableHead>
                  <TableHead className="hindi-text">मुखिया का नाम</TableHead>
                  <TableHead className="hindi-text">सदस्य</TableHead>
                  <TableHead className="hindi-text">पता</TableHead>
                  <TableHead className="hindi-text">मोबाइल</TableHead>
                  <TableHead className="hindi-text">स्थिति</TableHead>
                  <TableHead className="hindi-text">कार्य</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFamilies.map((family) => (
                  <TableRow key={family.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{family.familyId}</TableCell>
                    <TableCell>{family.mukhiyaName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {family.totalMembers}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={family.address}>
                      {family.address}
                    </TableCell>
                    <TableCell>{family.mobile}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          family.verificationStatus === "Verified"
                            ? "bg-green-100 text-green-700"
                            : family.verificationStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }
                      >
                        {family.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/village/${villageId}/family/${family.id}`)}
                          className="bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="hindi-text">देखें</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/village/${villageId}/family/${family.id}/edit`)}
                          className="bg-transparent"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <span className="hindi-text">संपादित</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteFamily(family.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="hindi-text">हटाएं</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredFamilies.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2 hindi-text">कोई परिवार नहीं मिला</h3>
                <p className="text-gray-600 mb-4 hindi-text">
                  {searchTerm || statusFilter !== "all"
                    ? "खोज मापदंड के अनुसार कोई परिवार नहीं मिला"
                    : "अभी तक कोई परिवार पंजीकृत नहीं है"}
                </p>
                <Button
                  onClick={() => router.push(`/village/${villageId}/add-family`)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hindi-text">पहला परिवार जोड़ें</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

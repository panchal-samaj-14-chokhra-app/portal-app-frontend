"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Shield,
  Users,
  Home,
  FileText,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Check,
  X,
  BarChart3,
  MapPin,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Badge } from "@/components/ui/badge/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"

interface UserData {
  name: string
  chokhra: string
}

interface Village {
  id: string
  name: string
  villageId: string
  adminName: string
  adminId: string
  adminPassword: string
  familyCount: number
  memberCount: number
  status: "Active" | "Inactive"
  controller: string
}

interface Family {
  id: string
  parivarId: string
  familyHead: string
  mobile: string
  email: string
  address: string
  pinCode: string
  familyCardIssued: boolean
  verificationStatus: string
  memberCount: number
  villageId: string
  villageName: string
}

interface FamilyRequest {
  id: string
  familyHead: string
  village: string
  memberCount: number
  requestDate: string
  status: "Pending" | "Approved" | "Rejected"
  requestedBy: string
}

interface ChandaRecord {
  village: string
  totalAmount: number
  receivedAmount: number
  pendingAmount: number
  familyCount: number
  contributingFamilies: number
}

export default function AdminDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedVillageForFamilies, setSelectedVillageForFamilies] = useState<Village | null>(null)

  const [villages, setVillages] = useState<Village[]>([
    {
      id: "v1",
      name: "गांव 1",
      villageId: "VID001",
      adminName: "राम पंचाल",
      adminId: "village_admin",
      adminPassword: "village123",
      familyCount: 45,
      memberCount: 189,
      status: "Active",
      controller: "मुकेश पंचाल",
    },
    {
      id: "v2",
      name: "गांव 2",
      villageId: "VID002",
      adminName: "श्याम पंचाल",
      adminId: "village2_admin",
      adminPassword: "village456",
      familyCount: 38,
      memberCount: 156,
      status: "Active",
      controller: "मुकेश पंचाल",
    },
    {
      id: "v3",
      name: "गांव 3",
      villageId: "VID003",
      adminName: "गोपाल पंचाल",
      adminId: "village3_admin",
      adminPassword: "village789",
      familyCount: 52,
      memberCount: 218,
      status: "Active",
      controller: "मुकेश पंचाल",
    },
  ])

  const [familyRequests, setFamilyRequests] = useState<FamilyRequest[]>([
    {
      id: "req1",
      familyHead: "गोपाल पंचाल",
      village: "गांव 1",
      memberCount: 5,
      requestDate: "2025-01-05",
      status: "Pending",
      requestedBy: "राम पंचाल",
    },
    {
      id: "req2",
      familyHead: "विकास पंचाल",
      village: "गांव 2",
      memberCount: 4,
      requestDate: "2025-01-04",
      status: "Pending",
      requestedBy: "श्याम पंचाल",
    },
  ])

  const [chandaRecords, setChandaRecords] = useState<ChandaRecord[]>([
    {
      village: "गांव 1",
      totalAmount: 50000,
      receivedAmount: 35000,
      pendingAmount: 15000,
      familyCount: 45,
      contributingFamilies: 32,
    },
    {
      village: "गांव 2",
      totalAmount: 42000,
      receivedAmount: 28000,
      pendingAmount: 14000,
      familyCount: 38,
      contributingFamilies: 26,
    },
    {
      village: "गांव 3",
      totalAmount: 58000,
      receivedAmount: 42000,
      pendingAmount: 16000,
      familyCount: 52,
      contributingFamilies: 38,
    },
  ])

  // Mock family data for demonstration
  const [familiesData, setFamiliesData] = useState<Family[]>([
    {
      id: "f1",
      parivarId: "PID001",
      familyHead: "राम पंचाल",
      mobile: "9876543210",
      email: "ram.panchal@example.com",
      address: "मुख्य सड़क, गांव 1",
      pinCode: "313001",
      familyCardIssued: true,
      verificationStatus: "Verified",
      memberCount: 5,
      villageId: "v1",
      villageName: "गांव 1",
    },
    {
      id: "f2",
      parivarId: "PID002",
      familyHead: "श्याम पंचाल",
      mobile: "9876543211",
      email: "shyam.panchal@example.com",
      address: "स्कूल रोड, गांव 1",
      pinCode: "313001",
      familyCardIssued: false,
      verificationStatus: "Pending",
      memberCount: 4,
      villageId: "v1",
      villageName: "गांव 1",
    },
    {
      id: "f3",
      parivarId: "PID003",
      familyHead: "गोपाल पंचाल",
      mobile: "9876543212",
      email: "gopal.panchal@example.com",
      address: "मंदिर रोड, गांव 2",
      pinCode: "313002",
      familyCardIssued: true,
      verificationStatus: "Verified",
      memberCount: 6,
      villageId: "v2",
      villageName: "गांव 2",
    },
  ])

  const router = useRouter()

  useEffect(() => {
    const userType = sessionStorage.getItem("userType")
    const storedUserData = sessionStorage.getItem("userData")

    if (userType !== "chokhra" || !storedUserData) {
      router.push("/routes/api/signin")
      return
    }

    setUserData(JSON.parse(storedUserData))
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push("/routes/api/signin")
  }

  const handleRequestAction = (requestId: string, action: "Approved" | "Rejected") => {
    setFamilyRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: action } : req)))
  }

  const getVillageFamilies = (villageId: string) => {
    return familiesData.filter((family) => family.villageId === villageId)
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-panchal-orange-50 via-white to-panchal-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-panchal-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 hindi-text">लॉड हो रहा है...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-panchal-orange-50 via-white to-panchal-orange-100">
      {/* Header */}
      <header className="panchal-gradient shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/images/main-logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-white hindi-text">चोखरा एडमिन डैशबोर्ड</h1>
                <p className="text-panchal-orange-100 hindi-text">
                  {userData.name} - {userData.chokhra} चोखरा
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => router.push("/routes/analytics")}
                variant="outline"
                size="sm"
                className="border-panchal-orange-300 text-white hover:bg-panchal-orange-400 bg-panchal-orange-500/20"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                <span className="hindi-text">एनालिटिक्स</span>
              </Button>
              <Badge className="bg-success-500 text-white">ऑनलाइन</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-panchal-orange-300 text-white hover:bg-panchal-orange-400 bg-panchal-orange-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hindi-text">लॉगआउट</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="hindi-text">
              ओवरव्यू
            </TabsTrigger>
            <TabsTrigger value="villages" className="hindi-text">
              गांव प्रबंधन
            </TabsTrigger>
            <TabsTrigger value="families" className="hindi-text">
              परिवार रिकॉर्ड
            </TabsTrigger>
            <TabsTrigger value="requests" className="hindi-text">
              अनुरोध
            </TabsTrigger>
            <TabsTrigger value="chanda" className="hindi-text">
              चंदा प्रबंधन
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-white to-panchal-orange-50 border-panchal-orange-200 card-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 hindi-text">कुल गांव</CardTitle>
                  <Home className="h-4 w-4 text-panchal-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">{villages.length}</div>
                  <p className="text-xs text-success-600 hindi-text">सभी सक्रिय</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-secondary-50 border-secondary-200 card-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 hindi-text">कुल परिवार</CardTitle>
                  <Users className="h-4 w-4 text-secondary-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {villages.reduce((sum, v) => sum + v.familyCount, 0)}
                  </div>
                  <p className="text-xs text-secondary-600 hindi-text">सभी गांवों में</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-success-50 border-success-200 card-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 hindi-text">कुल सदस्य</CardTitle>
                  <Users className="h-4 w-4 text-success-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {villages.reduce((sum, v) => sum + v.memberCount, 0)}
                  </div>
                  <p className="text-xs text-success-600 hindi-text">पंजीकृत सदस्य</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-warning-50 border-warning-200 card-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 hindi-text">लंबित अनुरोध</CardTitle>
                  <FileText className="h-4 w-4 text-warning-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {familyRequests.filter((req) => req.status === "Pending").length}
                  </div>
                  <p className="text-xs text-warning-600 hindi-text">परिवार अनुरोध</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="hindi-text">त्वरित कार्य</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={() => setActiveTab("villages")} className="panchal-gradient text-white mobile-touch">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hindi-text">नया गांव जोड़ें</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("requests")}
                    variant="outline"
                    className="border-secondary-200 text-secondary-600 mobile-touch"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    <span className="hindi-text">अनुरोध देखें</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("chanda")}
                    variant="outline"
                    className="border-success-200 text-success-600 mobile-touch"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span className="hindi-text">चंदा रिपोर्ट</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Villages Management Tab */}
          <TabsContent value="villages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 hindi-text">गांव प्रबंधन</h2>
              <div className="flex space-x-2">
                <Button className="bg-gradient-to-r from-success-500 to-success-600 mobile-touch">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hindi-text">Excel डाउनलोड</span>
                </Button>
                <AddVillageDialog villages={villages} setVillages={setVillages} />
              </div>
            </div>

            <Card className="card-shadow">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hindi-text">गांव का नाम</TableHead>
                      <TableHead className="hindi-text">गांव ID</TableHead>
                      <TableHead className="hindi-text">एडमिन</TableHead>
                      <TableHead className="hindi-text">लॉगिन ID</TableHead>
                      <TableHead className="hindi-text">परिवार</TableHead>
                      <TableHead className="hindi-text">सदस्य</TableHead>
                      <TableHead className="hindi-text">स्थिति</TableHead>
                      <TableHead className="hindi-text">कार्य</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {villages.map((village) => (
                      <TableRow key={village.id}>
                        <TableCell className="font-medium">{village.name}</TableCell>
                        <TableCell>{village.villageId}</TableCell>
                        <TableCell>{village.adminName}</TableCell>
                        <TableCell>{village.adminId}</TableCell>
                        <TableCell>{village.familyCount}</TableCell>
                        <TableCell>{village.memberCount}</TableCell>
                        <TableCell>
                          <Badge className={village.status === "Active" ? "bg-success-500" : "bg-error-500"}>
                            {village.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="mobile-touch bg-transparent">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-error-600 border-error-200 hover:bg-error-50 mobile-touch bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Family Records Tab */}
          <TabsContent value="families" className="space-y-6">
            {!selectedVillageForFamilies ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 hindi-text">परिवार रिकॉर्ड - गांव चुनें</h2>
                  <Button className="bg-gradient-to-r from-secondary-500 to-secondary-600 mobile-touch">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hindi-text">संपूर्ण रिपोर्ट डाउनलोड</span>
                  </Button>
                </div>

                <Alert className="border-secondary-200 bg-secondary-50 mb-6">
                  <Shield className="h-4 w-4 text-secondary-600" />
                  <AlertDescription className="text-secondary-800 hindi-text">
                    चोखरा एडमिन के रूप में आप केवल परिवार की जानकारी देख सकते हैं। परिवार जोड़ना, संपादित करना या हटाना केवल गांव
                    एडमिन कर सकते हैं।
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {villages.map((village) => (
                    <Card
                      key={village.id}
                      className="bg-gradient-to-br from-white to-secondary-50 border-secondary-200 card-shadow cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedVillageForFamilies(village)}
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
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium hindi-text">गांव ID:</span>
                            <span>{village.villageId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium hindi-text">एडमिन:</span>
                            <span>{village.adminName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium hindi-text">परिवार:</span>
                            <span className="font-bold text-secondary-600">{village.familyCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium hindi-text">सदस्य:</span>
                            <span className="font-bold text-success-600">{village.memberCount}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4 bg-gradient-to-r from-secondary-500 to-secondary-600 mobile-touch">
                          <Eye className="w-4 h-4 mr-2" />
                          <span className="hindi-text">परिवार देखें</span>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVillageForFamilies(null)}
                      className="border-gray-200 mobile-touch"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <span className="hindi-text">गांव सूची</span>
                    </Button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 hindi-text">
                        {selectedVillageForFamilies.name} - परिवार रिकॉर्ड
                      </h2>
                      <p className="text-gray-600 hindi-text">
                        गांव ID: {selectedVillageForFamilies.villageId} | एडमिन: {selectedVillageForFamilies.adminName}
                      </p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-secondary-500 to-secondary-600 mobile-touch">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hindi-text">गांव रिपोर्ट डाउनलोड</span>
                  </Button>
                </div>

                <Card className="card-shadow">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hindi-text">परिवार ID</TableHead>
                          <TableHead className="hindi-text">परिवार मुखिया</TableHead>
                          <TableHead className="hindi-text">सदस्य संख्या</TableHead>
                          <TableHead className="hindi-text">पता</TableHead>
                          <TableHead className="hindi-text">संपर्क</TableHead>
                          <TableHead className="hindi-text">पारिवारिक कार्ड</TableHead>
                          <TableHead className="hindi-text">स्थिति</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getVillageFamilies(selectedVillageForFamilies.id).map((family) => (
                          <TableRow key={family.id}>
                            <TableCell className="font-medium">{family.parivarId}</TableCell>
                            <TableCell>{family.familyHead}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="hindi-text">
                                {family.memberCount} सदस्य
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{family.address}</TableCell>
                            <TableCell>{family.mobile}</TableCell>
                            <TableCell>
                              <Badge className={family.familyCardIssued ? "bg-success-500" : "bg-warning-500"}>
                                {family.familyCardIssued ? "जारी" : "लंबित"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  family.verificationStatus === "Verified" ? "bg-success-500" : "bg-warning-500"
                                }
                              >
                                {family.verificationStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {getVillageFamilies(selectedVillageForFamilies.id).length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-gray-100 to-white p-8 rounded-lg border border-gray-200">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-700 mb-2 hindi-text">कोई परिवार नहीं मिला</h3>
                      <p className="text-gray-600 mb-4 hindi-text">इस गांव में अभी तक कोई परिवार पंजीकृत नहीं है</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Family Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 hindi-text">परिवार अनुरोध प्रबंधन</h2>
              <Badge variant="outline" className="text-lg px-3 py-1 hindi-text">
                {familyRequests.filter((req) => req.status === "Pending").length} लंबित
              </Badge>
            </div>

            <div className="grid gap-4">
              {familyRequests.map((request) => (
                <Card
                  key={request.id}
                  className={`card-shadow ${
                    request.status === "Pending"
                      ? "border-warning-200 bg-warning-50"
                      : request.status === "Approved"
                        ? "border-success-200 bg-success-50"
                        : "border-error-200 bg-error-50"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{request.familyHead}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <strong className="hindi-text">गांव:</strong> {request.village}
                          </div>
                          <div>
                            <strong className="hindi-text">सदस्य:</strong> {request.memberCount}
                          </div>
                          <div>
                            <strong className="hindi-text">दिनांक:</strong> {request.requestDate}
                          </div>
                          <div>
                            <strong className="hindi-text">अनुरोधकर्ता:</strong> {request.requestedBy}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            request.status === "Pending"
                              ? "bg-warning-500"
                              : request.status === "Approved"
                                ? "bg-success-500"
                                : "bg-error-500"
                          }
                        >
                          {request.status}
                        </Badge>
                        {request.status === "Pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleRequestAction(request.id, "Approved")}
                              className="bg-success-500 hover:bg-success-600 mobile-touch"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              <span className="hindi-text">स्वीकार</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestAction(request.id, "Rejected")}
                              className="border-error-200 text-error-600 hover:bg-error-50 mobile-touch"
                            >
                              <X className="w-4 h-4 mr-1" />
                              <span className="hindi-text">अस्वीकार</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chanda Management Tab */}
          <TabsContent value="chanda" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 hindi-text">चंदा प्रबंधन</h2>
              <Button className="bg-gradient-to-r from-success-500 to-success-600 mobile-touch">
                <Download className="w-4 h-4 mr-2" />
                <span className="hindi-text">वित्तीय रिपोर्ट</span>
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-white to-success-50 border-success-200 card-shadow">
                <CardHeader>
                  <CardTitle className="text-success-700 hindi-text">कुल संग्रह</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success-800">
                    ₹{chandaRecords.reduce((sum, record) => sum + record.receivedAmount, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-success-600 hindi-text">प्राप्त राशि</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-warning-50 border-warning-200 card-shadow">
                <CardHeader>
                  <CardTitle className="text-warning-700 hindi-text">लंबित राशि</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning-800">
                    ₹{chandaRecords.reduce((sum, record) => sum + record.pendingAmount, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-warning-600 hindi-text">बकाया राशि</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-secondary-50 border-secondary-200 card-shadow">
                <CardHeader>
                  <CardTitle className="text-secondary-700 hindi-text">योगदान दर</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary-800">
                    {Math.round(
                      (chandaRecords.reduce((sum, record) => sum + record.contributingFamilies, 0) /
                        chandaRecords.reduce((sum, record) => sum + record.familyCount, 0)) *
                        100,
                    )}
                    %
                  </div>
                  <p className="text-sm text-secondary-600 hindi-text">परिवारों का योगदान</p>
                </CardContent>
              </Card>
            </div>

            {/* Village-wise Breakdown */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="hindi-text">गांव-वार चंदा विवरण</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hindi-text">गांव</TableHead>
                      <TableHead className="hindi-text">कुल राशि</TableHead>
                      <TableHead className="hindi-text">प्राप्त राशि</TableHead>
                      <TableHead className="hindi-text">लंबित राशि</TableHead>
                      <TableHead className="hindi-text">योगदान परिवार</TableHead>
                      <TableHead className="hindi-text">प्रतिशत</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chandaRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{record.village}</TableCell>
                        <TableCell>₹{record.totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-success-600">₹{record.receivedAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-error-600">₹{record.pendingAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          {record.contributingFamilies}/{record.familyCount}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-secondary-500">
                            {Math.round((record.contributingFamilies / record.familyCount) * 100)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Add Village Dialog Component
function AddVillageDialog({ villages, setVillages }: { villages: Village[]; setVillages: any }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    adminName: "",
    adminId: "",
    adminPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newVillage: Village = {
      id: `v${Date.now()}`,
      name: formData.name,
      villageId: `VID${String(villages.length + 1).padStart(3, "0")}`,
      adminName: formData.adminName,
      adminId: formData.adminId,
      adminPassword: formData.adminPassword,
      familyCount: 0,
      memberCount: 0,
      status: "Active",
      controller: "मुकेश पंचाल",
    }

    setVillages((prev: Village[]) => [...prev, newVillage])
    setFormData({ name: "", adminName: "", adminId: "", adminPassword: "" })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="panchal-gradient text-white mobile-touch">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hindi-text">नया गांव जोड़ें</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="hindi-text">नया गांव जोड़ें</DialogTitle>
          <DialogDescription className="hindi-text">नए गांव की जानकारी और एडमिन क्रेडेंशियल्स दर्ज करें</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="hindi-text">गांव का नाम *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="गांव का नाम दर्ज करें"
              className="mobile-touch"
              required
            />
          </div>
          <div>
            <Label className="hindi-text">एडमिन का नाम *</Label>
            <Input
              value={formData.adminName}
              onChange={(e) => setFormData((prev) => ({ ...prev, adminName: e.target.value }))}
              placeholder="राम पंचाल"
              className="mobile-touch"
              required
            />
          </div>
          <div>
            <Label className="hindi-text">लॉगिन ID *</Label>
            <Input
              value={formData.adminId}
              onChange={(e) => setFormData((prev) => ({ ...prev, adminId: e.target.value }))}
              placeholder="village_admin_unique"
              className="mobile-touch"
              required
            />
          </div>
          <div>
            <Label className="hindi-text">पासवर्ड *</Label>
            <Input
              type="password"
              value={formData.adminPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, adminPassword: e.target.value }))}
              placeholder="सुरक्षित पासवर्ड"
              className="mobile-touch"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="mobile-touch">
              <span className="hindi-text">रद्द करें</span>
            </Button>
            <Button type="submit" className="panchal-gradient text-white mobile-touch">
              <span className="hindi-text">गांव जोड़ें</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

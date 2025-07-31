"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  Users,
  Home,
  Plus,
  Edit,
  Trash2,
  Download,
  LogOut,
  BarChart3,
  FileText,
  Eye,
  Search,
  UserPlus,
  Save,
  Menu,
  Settings,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Badge } from "@/components/ui/badge/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Textarea } from "@/components/ui/textarea/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion/accordion"
import { cn } from "@/lib/utils"

interface UserData {
  name: string
  village: string
  chokhra: string
}

interface Member {
  id: string
  fullName: string
  relation: string
  isMukhiya: boolean
  dateOfBirth: string
  gender: string
  aadhaar: string
  maritalStatus: string
  qualification: string
  currentlyStudying: boolean
  institutionName: string
  educationStream: string
  occupation: string
  employerName: string
  workLocation: string
  monthlyIncome: string
  isMigrant: boolean
  currentState: string
  currentDistrict: string
  healthStatus: string
  hasHealthInsurance: boolean
  hasLifeInsurance: boolean
  hasAccidentInsurance: boolean
  hasGovtSchemes: boolean
  memberMobile: string
  memberEmail: string
  bloodGroup: string
  height: string
  weight: string
  chronicDiseases: string
  disabilities: string
  bankAccount: string
  panCard: string
  voterCard: string
  drivingLicense: string
  passport: string
  rationCard: string
  skills: string
  hobbies: string
  languages: string
  facebook: string
  whatsapp: string
  instagram: string
  emergencyContact: string
  emergencyRelation: string
  birthPlace: string
  motherTongue: string
  religion: string
  caste: string
  subCaste: string
  gotra: string
  marriageDate: string
  spouseName: string
  childrenCount: string
  landOwnership: boolean
  landArea: string
  houseType: string
  vehicleOwnership: string
  annualIncome: string
  savingsAccount: string
  loanDetails: string
  pmKisan: boolean
  ayushmanBharat: boolean
  ujjwalaYojana: boolean
  janDhanAccount: boolean
  computerKnowledge: boolean
  internetUsage: boolean
  smartphoneUser: boolean
  migrationReason: string
  migrationDuration: string
  remittanceAmount: string
  lastHealthCheckup: string
  vaccinationStatus: string
  covidVaccinated: boolean
  communityRole: string
  volunteerWork: string
  donations: string
}

interface Family {
  id: string
  parivarId: string
  familyHead: string
  memberCount: number
  address: string
  mobile: string
  email: string
  pinCode: string
  familyCardIssued: boolean
  verificationStatus: "Verified" | "Pending" | "Draft"
  members: Member[]
  registrationDate: string
  lastUpdated: string
}

export default function VillageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const villageId = decodeURIComponent(params.villageId as string)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddFamily, setShowAddFamily] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [loading, setLoading] = useState(true)

  const [families, setFamilies] = useState<Family[]>([
    {
      id: "f1",
      parivarId: "PID001",
      familyHead: "राम पंचाल",
      memberCount: 5,
      address: "मुख्य सड़क, गांव 1",
      mobile: "9876543210",
      email: "ram.panchal@example.com",
      pinCode: "313001",
      familyCardIssued: true,
      verificationStatus: "Verified",
      registrationDate: "2024-01-15",
      lastUpdated: "2025-01-05",
      members: [
        {
          id: "m1",
          fullName: "राम पंचाल",
          relation: "Self",
          isMukhiya: true,
          dateOfBirth: "1978-01-01",
          gender: "Male",
          aadhaar: "123456789012",
          maritalStatus: "Married",
          qualification: "Graduate",
          currentlyStudying: false,
          institutionName: "",
          educationStream: "Commerce",
          occupation: "Farmer",
          employerName: "",
          workLocation: "गांव 1",
          monthlyIncome: "50000",
          isMigrant: false,
          currentState: "",
          currentDistrict: "",
          healthStatus: "Healthy",
          hasHealthInsurance: true,
          hasLifeInsurance: true,
          hasAccidentInsurance: false,
          hasGovtSchemes: true,
          memberMobile: "9876543210",
          memberEmail: "ram.panchal@example.com",
          bloodGroup: "A+",
          height: "175",
          weight: "70",
          chronicDiseases: "",
          disabilities: "",
          bankAccount: "1234567890",
          panCard: "ABCDE1234F",
          voterCard: "XYZ1234567",
          drivingLicense: "DL1234567890",
          passport: "",
          rationCard: "RC1234567890",
          skills: "Farming, Leadership",
          hobbies: "Reading, Gardening",
          languages: "Hindi, Gujarati, English",
          facebook: "",
          whatsapp: "9876543210",
          instagram: "",
          emergencyContact: "9876543211",
          emergencyRelation: "Brother",
          birthPlace: "गांव 1",
          motherTongue: "Gujarati",
          religion: "Hindu",
          caste: "Panchal",
          subCaste: "Lohar",
          gotra: "Vishwakarma",
          marriageDate: "2005-02-15",
          spouseName: "सीता पंचाल",
          childrenCount: "3",
          landOwnership: true,
          landArea: "5 acres",
          houseType: "Pucca",
          vehicleOwnership: "Motorcycle, Tractor",
          annualIncome: "600000",
          savingsAccount: "Yes",
          loanDetails: "Kisan Credit Card - 200000",
          pmKisan: true,
          ayushmanBharat: true,
          ujjwalaYojana: false,
          janDhanAccount: true,
          computerKnowledge: false,
          internetUsage: true,
          smartphoneUser: true,
          migrationReason: "",
          migrationDuration: "",
          remittanceAmount: "",
          lastHealthCheckup: "2024-12-01",
          vaccinationStatus: "Complete",
          covidVaccinated: true,
          communityRole: "Village Committee Member",
          volunteerWork: "Temple Management",
          donations: "Annual Temple Donation - 10000",
        },
      ],
    },
  ])

  useEffect(() => {
    const userType = sessionStorage.getItem("userType")
    const storedUserData = sessionStorage.getItem("userData")

    if (userType !== "village" || !storedUserData) {
      router.push("/routes/api/signin")
      return
    }

    const user = JSON.parse(storedUserData)
    setUserData(user)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push("/routes/api/signin")
  }

  const filteredFamilies = families.filter((family) => {
    const matchesSearch =
      family.familyHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.parivarId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || family.verificationStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddFamily = () => {
    setSelectedFamily(null)
    setShowAddFamily(true)
  }

  const handleEditFamily = (family: Family) => {
    setSelectedFamily(family)
    setShowAddFamily(true)
  }

  const handleDeleteFamily = (familyId: string) => {
    setFamilies((prev) => prev.filter((f) => f.id !== familyId))
  }

  const handleAddMember = (family: Family) => {
    setSelectedFamily(family)
    setSelectedMember(null)
    setShowAddMember(true)
  }

  const handleEditMember = (family: Family, member: Member) => {
    setSelectedFamily(family)
    setSelectedMember(member)
    setShowAddMember(true)
  }

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

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-panchal-orange-50 via-white to-panchal-orange-100">
      {/* Mobile Header */}
      <header className="lg:hidden panchal-gradient shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Image src="/images/main-logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
            <div>
              <h1 className="text-lg font-bold text-white hindi-text">{villageId}</h1>
              <p className="text-xs text-panchal-orange-100 hindi-text">{userData.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-panchal-orange-400">
              <Bell className="w-4 h-4" />
            </Button>
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button size="sm" variant="ghost" className="text-white hover:bg-panchal-orange-400">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="hindi-text">मेनू</SheetTitle>
                  <SheetDescription className="hindi-text">गांव प्रबंधन विकल्प</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Button
                    onClick={() => {
                      setActiveTab("overview")
                      setShowMobileMenu(false)
                    }}
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className="w-full justify-start mobile-touch"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    <span className="hindi-text">ओवरव्यू</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveTab("families")
                      setShowMobileMenu(false)
                    }}
                    variant={activeTab === "families" ? "default" : "ghost"}
                    className="w-full justify-start mobile-touch"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    <span className="hindi-text">परिवार प्रबंधन</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveTab("analytics")
                      setShowMobileMenu(false)
                    }}
                    variant={activeTab === "analytics" ? "default" : "ghost"}
                    className="w-full justify-start mobile-touch"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span className="hindi-text">एनालिटिक्स</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveTab("reports")
                      setShowMobileMenu(false)
                    }}
                    variant={activeTab === "reports" ? "default" : "ghost"}
                    className="w-full justify-start mobile-touch"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="hindi-text">रिपोर्ट</span>
                  </Button>
                  <div className="border-t pt-4">
                    <Button variant="ghost" className="w-full justify-start text-gray-600 mobile-touch">
                      <Settings className="w-4 h-4 mr-2" />
                      <span className="hindi-text">सेटिंग्स</span>
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-error-600 mobile-touch"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span className="hindi-text">लॉगआउट</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block panchal-gradient shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/images/main-logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-white hindi-text">{villageId} - गांव एडमिन डैशबोर्ड</h1>
                <p className="text-panchal-orange-100 hindi-text">
                  {userData.name} - {userData.chokhra} चोखरा
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
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

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { id: "overview", label: "ओवरव्यू", icon: Home },
            { id: "families", label: "परिवार", icon: Users },
            { id: "analytics", label: "एनालिटिक्स", icon: BarChart3 },
            { id: "reports", label: "रिपोर्ट", icon: FileText },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant="ghost"
              className={cn(
                "flex-shrink-0 px-4 py-3 rounded-none border-b-2 mobile-touch",
                activeTab === tab.id
                  ? "border-panchal-orange-500 text-panchal-orange-600 bg-panchal-orange-50"
                  : "border-transparent text-gray-600",
              )}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              <span className="hindi-text text-sm">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              onClick={() => setActiveTab("overview")}
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="hindi-text">ओवरव्यू</span>
            </Button>
            <Button
              onClick={() => setActiveTab("families")}
              variant={activeTab === "families" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hindi-text">परिवार प्रबंधन</span>
            </Button>
            <Button
              onClick={() => setActiveTab("analytics")}
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hindi-text">एनालिटिक्स</span>
            </Button>
            <Button
              onClick={() => setActiveTab("reports")}
              variant={activeTab === "reports" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hindi-text">रिपोर्ट</span>
            </Button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-white to-panchal-orange-50 border-panchal-orange-200 card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 hindi-text">कुल परिवार</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">{families.length}</div>
                    <p className="text-xs text-success-600 hindi-text">पंजीकृत</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-secondary-50 border-secondary-200 card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 hindi-text">कुल सदस्य</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">
                      {families.reduce((sum, f) => sum + f.memberCount, 0)}
                    </div>
                    <p className="text-xs text-secondary-600 hindi-text">सभी परिवारों में</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-success-50 border-success-200 card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 hindi-text">सत्यापित</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">
                      {families.filter((f) => f.verificationStatus === "Verified").length}
                    </div>
                    <p className="text-xs text-success-600 hindi-text">परिवार</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-warning-50 border-warning-200 card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 hindi-text">लंबित</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">
                      {families.filter((f) => f.verificationStatus === "Pending").length}
                    </div>
                    <p className="text-xs text-warning-600 hindi-text">सत्यापन</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="hindi-text">त्वरित कार्य</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button onClick={handleAddFamily} className="panchal-gradient text-white mobile-touch">
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="hindi-text">नया परिवार जोड़ें</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab("families")}
                      variant="outline"
                      className="border-secondary-200 text-secondary-600 mobile-touch"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="hindi-text">परिवार देखें</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-success-200 text-success-600 mobile-touch bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      <span className="hindi-text">रिपोर्ट डाउनलोड</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Families */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="hindi-text">हाल ही में जोड़े गए परिवार</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {families.slice(0, 3).map((family) => (
                      <div key={family.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{family.familyHead}</h4>
                          <p className="text-sm text-gray-600">
                            {family.parivarId} • {family.memberCount} सदस्य
                          </p>
                        </div>
                        <Badge
                          className={
                            family.verificationStatus === "Verified"
                              ? "bg-success-500"
                              : family.verificationStatus === "Pending"
                                ? "bg-warning-500"
                                : "bg-gray-500"
                          }
                        >
                          {family.verificationStatus}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Families Tab */}
          {activeTab === "families" && (
            <div className="space-y-6">
              {/* Header with Search and Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800 hindi-text">परिवार प्रबंधन</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="परिवार खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 mobile-touch"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40 mobile-touch">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">सभी स्थिति</SelectItem>
                      <SelectItem value="Verified">सत्यापित</SelectItem>
                      <SelectItem value="Pending">लंबित</SelectItem>
                      <SelectItem value="Draft">ड्राफ्ट</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddFamily} className="panchal-gradient text-white mobile-touch">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hindi-text">नया परिवार</span>
                  </Button>
                </div>
              </div>

              {/* Families Grid */}
              <div className="grid gap-4">
                {filteredFamilies.map((family) => (
                  <Card key={family.id} className="card-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{family.familyHead}</h3>
                            <Badge
                              className={
                                family.verificationStatus === "Verified"
                                  ? "bg-success-500"
                                  : family.verificationStatus === "Pending"
                                    ? "bg-warning-500"
                                    : "bg-gray-500"
                              }
                            >
                              {family.verificationStatus}
                            </Badge>
                            {family.familyCardIssued && (
                              <Badge variant="outline" className="border-success-200 text-success-600">
                                पारिवारिक कार्ड जारी
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <strong className="hindi-text">परिवार ID:</strong> {family.parivarId}
                            </div>
                            <div>
                              <strong className="hindi-text">सदस्य:</strong> {family.memberCount}
                            </div>
                            <div>
                              <strong className="hindi-text">मोबाइल:</strong> {family.mobile}
                            </div>
                            <div>
                              <strong className="hindi-text">पिन कोड:</strong> {family.pinCode}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{family.address}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddMember(family)}
                            className="mobile-touch"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            <span className="hindi-text">सदस्य जोड़ें</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditFamily(family)}
                            className="mobile-touch"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            <span className="hindi-text">संपादित करें</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFamily(family.id)}
                            className="text-error-600 border-error-200 hover:bg-error-50 mobile-touch"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            <span className="hindi-text">हटाएं</span>
                          </Button>
                        </div>
                      </div>

                      {/* Members List */}
                      {family.members.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium mb-3 hindi-text">परिवार के सदस्य:</h4>
                          <div className="grid gap-2">
                            {family.members.map((member) => (
                              <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="font-medium">{member.fullName}</p>
                                    <p className="text-sm text-gray-600">
                                      {member.relation} • {member.gender} • {member.occupation}
                                    </p>
                                  </div>
                                  {member.isMukhiya && (
                                    <Badge
                                      variant="outline"
                                      className="border-panchal-orange-200 text-panchal-orange-600"
                                    >
                                      मुखिया
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditMember(family, member)}
                                  className="mobile-touch"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredFamilies.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-gray-100 to-white p-8 rounded-lg border border-gray-200">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2 hindi-text">कोई परिवार नहीं मिला</h3>
                    <p className="text-gray-600 mb-4 hindi-text">
                      {searchTerm || statusFilter !== "all"
                        ? "खोज मापदंड के अनुसार कोई परिवार नहीं मिला"
                        : "अभी तक कोई परिवार पंजीकृत नहीं है"}
                    </p>
                    <Button onClick={handleAddFamily} className="panchal-gradient text-white mobile-touch">
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="hindi-text">पहला परिवार जोड़ें</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 hindi-text">एनालिटिक्स और रिपोर्ट</h2>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2 hindi-text">एनालिटिक्स जल्द आ रहा है</h3>
                <p className="text-gray-600 hindi-text">विस्तृत चार्ट और ग्राफ यहाँ दिखाए जाएंगे</p>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 hindi-text">रिपोर्ट और डाउनलोड</h2>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2 hindi-text">रिपोर्ट जेनरेशन जल्द आ रहा है</h3>
                <p className="text-gray-600 hindi-text">PDF और Excel रिपोर्ट यहाँ से डाउनलोड करें</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Family Dialog */}
      <Dialog open={showAddFamily} onOpenChange={setShowAddFamily}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="hindi-text">{selectedFamily ? "परिवार संपादित करें" : "नया परिवार जोड़ें"}</DialogTitle>
            <DialogDescription className="hindi-text">परिवार की मूलभूत जानकारी दर्ज करें</DialogDescription>
          </DialogHeader>
          <FamilyForm
            family={selectedFamily}
            onSave={(family) => {
              if (selectedFamily) {
                setFamilies((prev) => prev.map((f) => (f.id === family.id ? family : f)))
              } else {
                setFamilies((prev) => [...prev, { ...family, id: `f${Date.now()}` }])
              }
              setShowAddFamily(false)
            }}
            onCancel={() => setShowAddFamily(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add/Edit Member Dialog */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="hindi-text">{selectedMember ? "सदस्य संपादित करें" : "नया सदस्य जोड़ें"}</DialogTitle>
            <DialogDescription className="hindi-text">
              {selectedFamily?.familyHead} के परिवार में सदस्य की विस्तृत जानकारी दर्ज करें
            </DialogDescription>
          </DialogHeader>
          <MemberForm
            member={selectedMember}
            family={selectedFamily}
            onSave={(member) => {
              if (selectedFamily) {
                setFamilies((prev) =>
                  prev.map((f) => {
                    if (f.id === selectedFamily.id) {
                      if (selectedMember) {
                        return {
                          ...f,
                          members: f.members.map((m) => (m.id === member.id ? member : m)),
                        }
                      } else {
                        return {
                          ...f,
                          members: [...f.members, { ...member, id: `m${Date.now()}` }],
                          memberCount: f.memberCount + 1,
                        }
                      }
                    }
                    return f
                  }),
                )
              }
              setShowAddMember(false)
            }}
            onCancel={() => setShowAddMember(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Family Form Component
function FamilyForm({
  family,
  onSave,
  onCancel,
}: {
  family: Family | null
  onSave: (family: Family) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    parivarId: family?.parivarId || "",
    familyHead: family?.familyHead || "",
    address: family?.address || "",
    mobile: family?.mobile || "",
    email: family?.email || "",
    pinCode: family?.pinCode || "",
    familyCardIssued: family?.familyCardIssued || false,
    verificationStatus: family?.verificationStatus || ("Draft" as const),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const familyData: Family = {
      id: family?.id || "",
      ...formData,
      memberCount: family?.memberCount || 0,
      members: family?.members || [],
      registrationDate: family?.registrationDate || new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    }
    onSave(familyData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="hindi-text">परिवार ID *</Label>
          <Input
            value={formData.parivarId}
            onChange={(e) => setFormData((prev) => ({ ...prev, parivarId: e.target.value }))}
            placeholder="PID001"
            className="mobile-touch"
            required
          />
        </div>
        <div>
          <Label className="hindi-text">परिवार मुखिया का नाम *</Label>
          <Input
            value={formData.familyHead}
            onChange={(e) => setFormData((prev) => ({ ...prev, familyHead: e.target.value }))}
            placeholder="राम पंचाल"
            className="mobile-touch"
            required
          />
        </div>
        <div>
          <Label className="hindi-text">मोबाइल नंबर *</Label>
          <Input
            value={formData.mobile}
            onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
            placeholder="9876543210"
            className="mobile-touch"
            required
          />
        </div>
        <div>
          <Label className="hindi-text">ईमेल</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="ram.panchal@example.com"
            className="mobile-touch"
          />
        </div>
        <div>
          <Label className="hindi-text">पिन कोड *</Label>
          <Input
            value={formData.pinCode}
            onChange={(e) => setFormData((prev) => ({ ...prev, pinCode: e.target.value }))}
            placeholder="313001"
            className="mobile-touch"
            required
          />
        </div>
        <div>
          <Label className="hindi-text">सत्यापन स्थिति</Label>
          <Select
            value={formData.verificationStatus}
            onValueChange={(value: "Verified" | "Pending" | "Draft") =>
              setFormData((prev) => ({ ...prev, verificationStatus: value }))
            }
          >
            <SelectTrigger className="mobile-touch">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">ड्राफ्ट</SelectItem>
              <SelectItem value="Pending">लंबित</SelectItem>
              <SelectItem value="Verified">सत्यापित</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="hindi-text">पूरा पता *</Label>
        <Textarea
          value={formData.address}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
          placeholder="मुख्य सड़क, गांव 1"
          className="mobile-touch"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="familyCard"
          checked={formData.familyCardIssued}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, familyCardIssued: checked as boolean }))}
        />
        <Label htmlFor="familyCard" className="hindi-text">
          पारिवारिक कार्ड जारी किया गया है
        </Label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel} className="mobile-touch bg-transparent">
          <span className="hindi-text">रद्द करें</span>
        </Button>
        <Button type="submit" className="panchal-gradient text-white mobile-touch">
          <Save className="w-4 h-4 mr-2" />
          <span className="hindi-text">सेव करें</span>
        </Button>
      </div>
    </form>
  )
}

// Member Form Component
function MemberForm({
  member,
  family,
  onSave,
  onCancel,
}: {
  member: Member | null
  family: Family | null
  onSave: (member: Member) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Member>>(
    member || {
      fullName: "",
      relation: "",
      isMukhiya: false,
      dateOfBirth: "",
      gender: "",
      aadhaar: "",
      maritalStatus: "",
      qualification: "",
      currentlyStudying: false,
      institutionName: "",
      educationStream: "",
      occupation: "",
      employerName: "",
      workLocation: "",
      monthlyIncome: "",
      isMigrant: false,
      currentState: "",
      currentDistrict: "",
      healthStatus: "",
      hasHealthInsurance: false,
      hasLifeInsurance: false,
      hasAccidentInsurance: false,
      hasGovtSchemes: false,
      memberMobile: "",
      memberEmail: "",
      bloodGroup: "",
      height: "",
      weight: "",
      chronicDiseases: "",
      disabilities: "",
      bankAccount: "",
      panCard: "",
      voterCard: "",
      drivingLicense: "",
      passport: "",
      rationCard: "",
      skills: "",
      hobbies: "",
      languages: "",
      facebook: "",
      whatsapp: "",
      instagram: "",
      emergencyContact: "",
      emergencyRelation: "",
      birthPlace: "",
      motherTongue: "",
      religion: "",
      caste: "",
      subCaste: "",
      gotra: "",
      marriageDate: "",
      spouseName: "",
      childrenCount: "",
      landOwnership: false,
      landArea: "",
      houseType: "",
      vehicleOwnership: "",
      annualIncome: "",
      savingsAccount: "",
      loanDetails: "",
      pmKisan: false,
      ayushmanBharat: false,
      ujjwalaYojana: false,
      janDhanAccount: false,
      computerKnowledge: false,
      internetUsage: false,
      smartphoneUser: false,
      migrationReason: "",
      migrationDuration: "",
      remittanceAmount: "",
      lastHealthCheckup: "",
      vaccinationStatus: "",
      covidVaccinated: false,
      communityRole: "",
      volunteerWork: "",
      donations: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Member)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Accordion type="multiple" defaultValue={["basic", "education", "employment"]} className="w-full">
        {/* Basic Information */}
        <AccordionItem value="basic">
          <AccordionTrigger className="hindi-text">मूलभूत जानकारी</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="hindi-text">पूरा नाम *</Label>
                <Input
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="राम पंचाल"
                  className="mobile-touch"
                  required
                />
              </div>
              <div>
                <Label className="hindi-text">रिश्ता *</Label>
                <Select
                  value={formData.relation || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, relation: value }))}
                >
                  <SelectTrigger className="mobile-touch">
                    <SelectValue placeholder="रिश्ता चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self">स्वयं</SelectItem>
                    <SelectItem value="Spouse">पति/पत्नी</SelectItem>
                    <SelectItem value="Son">पुत्र</SelectItem>
                    <SelectItem value="Daughter">पुत्री</SelectItem>
                    <SelectItem value="Father">पिता</SelectItem>
                    <SelectItem value="Mother">माता</SelectItem>
                    <SelectItem value="Brother">भाई</SelectItem>
                    <SelectItem value="Sister">बहन</SelectItem>
                    <SelectItem value="Other">अन्य</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="hindi-text">जन्म तिथि *</Label>
                <Input
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="mobile-touch"
                  required
                />
              </div>
              <div>
                <Label className="hindi-text">लिंग *</Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger className="mobile-touch">
                    <SelectValue placeholder="लिंग चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">पुरुष</SelectItem>
                    <SelectItem value="Female">महिला</SelectItem>
                    <SelectItem value="Other">अन्य</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="hindi-text">आधार नंबर</Label>
                <Input
                  value={formData.aadhaar || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, aadhaar: e.target.value }))}
                  placeholder="123456789012"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">वैवाहिक स्थिति</Label>
                <Select
                  value={formData.maritalStatus || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, maritalStatus: value }))}
                >
                  <SelectTrigger className="mobile-touch">
                    <SelectValue placeholder="स्थिति चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">अविवाहित</SelectItem>
                    <SelectItem value="Married">विवाहित</SelectItem>
                    <SelectItem value="Divorced">तलाकशुदा</SelectItem>
                    <SelectItem value="Widowed">विधवा/विधुर</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="hindi-text">मोबाइल नंबर</Label>
                <Input
                  value={formData.memberMobile || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, memberMobile: e.target.value }))}
                  placeholder="9876543210"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">ईमेल</Label>
                <Input
                  type="email"
                  value={formData.memberEmail || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, memberEmail: e.target.value }))}
                  placeholder="ram@example.com"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">रक्त समूह</Label>
                <Select
                  value={formData.bloodGroup || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, bloodGroup: value }))}
                >
                  <SelectTrigger className="mobile-touch">
                    <SelectValue placeholder="रक्त समूह चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isMukhiya"
                checked={formData.isMukhiya || false}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isMukhiya: checked as boolean }))}
              />
              <Label htmlFor="isMukhiya" className="hindi-text">
                परिवार का मुखिया है
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Education Information */}
        <AccordionItem value="education">
          <AccordionTrigger className="hindi-text">शिक्षा की जानकारी</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="hindi-text">शैक्षणिक योग्यता</Label>
                <Select
                  value={formData.qualification || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, qualification: value }))}
                >
                  <SelectTrigger className="mobile-touch">
                    <SelectValue placeholder="योग्यता चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Illiterate">निरक्षर</SelectItem>
                    <SelectItem value="Primary">प्राथमिक</SelectItem>
                    <SelectItem value="Secondary">माध्यमिक</SelectItem>
                    <SelectItem value="Higher Secondary">उच्च माध्यमिक</SelectItem>
                    <SelectItem value="Graduate">स्नातक</SelectItem>
                    <SelectItem value="Post Graduate">स्नातकोत्तर</SelectItem>
                    <SelectItem value="Professional">व्यावसायिक</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="hindi-text">शिक्षा की धारा</Label>
                <Input
                  value={formData.educationStream || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, educationStream: e.target.value }))}
                  placeholder="कॉमर्स, साइंस, आर्ट्स"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">संस्थान का नाम</Label>
                <Input
                  value={formData.institutionName || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, institutionName: e.target.value }))}
                  placeholder="स्कूल/कॉलेज का नाम"
                  className="mobile-touch"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="currentlyStudying"
                checked={formData.currentlyStudying || false}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, currentlyStudying: checked as boolean }))
                }
              />
              <Label htmlFor="currentlyStudying" className="hindi-text">
                वर्तमान में पढ़ाई कर रहे हैं
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Employment Information */}
        <AccordionItem value="employment">
          <AccordionTrigger className="hindi-text">रोजगार की जानकारी</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="hindi-text">व्यवसाय</Label>
                <Input
                  value={formData.occupation || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, occupation: e.target.value }))}
                  placeholder="किसान, व्यापारी, नौकरी"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">नियोक्ता का नाम</Label>
                <Input
                  value={formData.employerName || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, employerName: e.target.value }))}
                  placeholder="कंपनी/संस्थान का नाम"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">कार्य स्थल</Label>
                <Input
                  value={formData.workLocation || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, workLocation: e.target.value }))}
                  placeholder="कार्य करने का स्थान"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">मासिक आय</Label>
                <Input
                  value={formData.monthlyIncome || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, monthlyIncome: e.target.value }))}
                  placeholder="50000"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">वार्षिक आय</Label>
                <Input
                  value={formData.annualIncome || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, annualIncome: e.target.value }))}
                  placeholder="600000"
                  className="mobile-touch"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isMigrant"
                checked={formData.isMigrant || false}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isMigrant: checked as boolean }))}
              />
              <Label htmlFor="isMigrant" className="hindi-text">
                प्रवासी मजदूर हैं
              </Label>
            </div>
            {formData.isMigrant && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="hindi-text">वर्तमान राज्य</Label>
                  <Input
                    value={formData.currentState || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentState: e.target.value }))}
                    placeholder="महाराष्ट्र"
                    className="mobile-touch"
                  />
                </div>
                <div>
                  <Label className="hindi-text">वर्तमान जिला</Label>
                  <Input
                    value={formData.currentDistrict || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentDistrict: e.target.value }))}
                    placeholder="मुंबई"
                    className="mobile-touch"
                  />
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Health Information */}
        <AccordionItem value="health">
          <AccordionTrigger className="hindi-text">स्वास्थ्य की जानकारी</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="hindi-text">स्वास्थ्य स्थिति</Label>
                <Select
                  value={formData.healthStatus || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, healthStatus: value }))}
                >
                  <SelectTrigger className="mobile-touch">
                    <SelectValue placeholder="स्थिति चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthy">स्वस्थ</SelectItem>
                    <SelectItem value="Chronic Disease">पुरानी बीमारी</SelectItem>
                    <SelectItem value="Disability">विकलांगता</SelectItem>
                    <SelectItem value="Under Treatment">इलाज चल रहा</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="hindi-text">ऊंचाई (सेमी)</Label>
                <Input
                  value={formData.height || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                  placeholder="175"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">वजन (किग्रा)</Label>
                <Input
                  value={formData.weight || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  placeholder="70"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">पुरानी बीमारियां</Label>
                <Input
                  value={formData.chronicDiseases || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, chronicDiseases: e.target.value }))}
                  placeholder="डायबिटीज, हाई BP"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">अंतिम स्वास्थ्य जांच</Label>
                <Input
                  type="date"
                  value={formData.lastHealthCheckup || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastHealthCheckup: e.target.value }))}
                  className="mobile-touch"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasHealthInsurance"
                  checked={formData.hasHealthInsurance || false}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, hasHealthInsurance: checked as boolean }))
                  }
                />
                <Label htmlFor="hasHealthInsurance" className="hindi-text">
                  स्वास्थ्य बीमा
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasLifeInsurance"
                  checked={formData.hasLifeInsurance || false}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, hasLifeInsurance: checked as boolean }))
                  }
                />
                <Label htmlFor="hasLifeInsurance" className="hindi-text">
                  जीवन बीमा
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="covidVaccinated"
                  checked={formData.covidVaccinated || false}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, covidVaccinated: checked as boolean }))
                  }
                />
                <Label htmlFor="covidVaccinated" className="hindi-text">
                  कोविड टीकाकरण
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ayushmanBharat"
                  checked={formData.ayushmanBharat || false}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, ayushmanBharat: checked as boolean }))
                  }
                />
                <Label htmlFor="ayushmanBharat" className="hindi-text">
                  आयुष्मान भारत
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Documents */}
        <AccordionItem value="documents">
          <AccordionTrigger className="hindi-text">दस्तावेज की जानकारी</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="hindi-text">बैंक खाता नंबर</Label>
                <Input
                  value={formData.bankAccount || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bankAccount: e.target.value }))}
                  placeholder="1234567890"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">पैन कार्ड</Label>
                <Input
                  value={formData.panCard || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, panCard: e.target.value }))}
                  placeholder="ABCDE1234F"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">वोटर ID</Label>
                <Input
                  value={formData.voterCard || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, voterCard: e.target.value }))}
                  placeholder="XYZ1234567"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">ड्राइविंग लाइसेंस</Label>
                <Input
                  value={formData.drivingLicense || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, drivingLicense: e.target.value }))}
                  placeholder="DL1234567890"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">पासपोर्ट</Label>
                <Input
                  value={formData.passport || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, passport: e.target.value }))}
                  placeholder="A1234567"
                  className="mobile-touch"
                />
              </div>
              <div>
                <Label className="hindi-text">राशन कार्ड</Label>
                <Input
                  value={formData.rationCard || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rationCard: e.target.value }))}
                  placeholder="RC1234567890"
                  className="mobile-touch"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="mobile-touch bg-transparent">
          <span className="hindi-text">रद्द करें</span>
        </Button>
        <Button type="submit" className="panchal-gradient text-white mobile-touch">
          <Save className="w-4 h-4 mr-2" />
          <span className="hindi-text">सदस्य सेव करें</span>
        </Button>
      </div>
    </form>
  )
}

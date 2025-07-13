"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  ArrowLeft,
  Search,
  Filter,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  Save,
  Menu,
  ChevronRight,
  Settings,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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

export default function VillageAdminDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddFamily, setShowAddFamily] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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
          drivingLicense: "",
          passport: "",
          rationCard: "RAT123456",
          skills: "Farming, Leadership",
          hobbies: "Reading, Cricket",
          languages: "Hindi, Gujarati",
          facebook: "",
          whatsapp: "9876543210",
          instagram: "",
          emergencyContact: "9876543211",
          emergencyRelation: "Brother",
          birthPlace: "गांव 1",
          motherTongue: "Hindi",
          religion: "Hindu",
          caste: "Panchal",
          subCaste: "",
          gotra: "Vishwakarma",
          marriageDate: "2005-05-15",
          spouseName: "सीता पंचाल",
          childrenCount: "3",
          landOwnership: true,
          landArea: "5",
          houseType: "Pucca",
          vehicleOwnership: "Tractor, Motorcycle",
          annualIncome: "600000",
          savingsAccount: "SAV123456",
          loanDetails: "Kisan Credit Card - 2 Lakh",
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
          donations: "Annual - 10000",
        },
        {
          id: "m2",
          fullName: "सीता पंचाल",
          relation: "Wife",
          isMukhiya: false,
          dateOfBirth: "1983-05-10",
          gender: "Female",
          aadhaar: "987654321098",
          maritalStatus: "Married",
          qualification: "Secondary",
          currentlyStudying: false,
          institutionName: "",
          educationStream: "",
          occupation: "Homemaker",
          employerName: "",
          workLocation: "",
          monthlyIncome: "0",
          isMigrant: false,
          currentState: "",
          currentDistrict: "",
          healthStatus: "Healthy",
          hasHealthInsurance: true,
          hasLifeInsurance: true,
          hasAccidentInsurance: false,
          hasGovtSchemes: true,
          memberMobile: "9876543211",
          memberEmail: "sita.panchal@example.com",
          bloodGroup: "B+",
          height: "160",
          weight: "60",
          chronicDiseases: "",
          disabilities: "",
          bankAccount: "9876543210",
          panCard: "FGHIJ5678K",
          voterCard: "UVW9876543",
          drivingLicense: "",
          passport: "",
          rationCard: "RAT123456",
          skills: "Cooking, Tailoring",
          hobbies: "Gardening, Music",
          languages: "Hindi, Gujarati",
          facebook: "",
          whatsapp: "9876543211",
          instagram: "",
          emergencyContact: "9876543210",
          emergencyRelation: "Husband",
          birthPlace: "गांव 2",
          motherTongue: "Hindi",
          religion: "Hindu",
          caste: "Panchal",
          subCaste: "",
          gotra: "Vishwakarma",
          marriageDate: "2005-05-15",
          spouseName: "राम पंचाल",
          childrenCount: "3",
          landOwnership: false,
          landArea: "",
          houseType: "Pucca",
          vehicleOwnership: "",
          annualIncome: "0",
          savingsAccount: "SAV789012",
          loanDetails: "",
          pmKisan: false,
          ayushmanBharat: true,
          ujjwalaYojana: true,
          janDhanAccount: true,
          computerKnowledge: false,
          internetUsage: true,
          smartphoneUser: true,
          migrationReason: "",
          migrationDuration: "",
          remittanceAmount: "",
          lastHealthCheckup: "2024-11-15",
          vaccinationStatus: "Complete",
          covidVaccinated: true,
          communityRole: "Women's Group Leader",
          volunteerWork: "Anganwadi Helper",
          donations: "Festival - 5000",
        },
      ],
    },
    {
      id: "f2",
      parivarId: "PID002",
      familyHead: "श्याम पंचाल",
      memberCount: 4,
      address: "स्कूल रोड, गांव 1",
      mobile: "9876543211",
      email: "shyam.panchal@example.com",
      pinCode: "313001",
      familyCardIssued: false,
      verificationStatus: "Pending",
      registrationDate: "2024-02-20",
      lastUpdated: "2025-01-03",
      members: [
        {
          id: "m3",
          fullName: "श्याम पंचाल",
          relation: "Self",
          isMukhiya: true,
          dateOfBirth: "1985-02-15",
          gender: "Male",
          aadhaar: "567890123456",
          maritalStatus: "Married",
          qualification: "Graduate",
          currentlyStudying: false,
          institutionName: "",
          educationStream: "Science",
          occupation: "Business",
          employerName: "Self",
          workLocation: "गांव 1",
          monthlyIncome: "60000",
          isMigrant: false,
          currentState: "",
          currentDistrict: "",
          healthStatus: "Healthy",
          hasHealthInsurance: true,
          hasLifeInsurance: true,
          hasAccidentInsurance: true,
          hasGovtSchemes: false,
          memberMobile: "9876543211",
          memberEmail: "shyam.panchal@example.com",
          bloodGroup: "O+",
          height: "180",
          weight: "75",
          chronicDiseases: "",
          disabilities: "",
          bankAccount: "6789012345",
          panCard: "KLMNO9012P",
          voterCard: "RST7890123",
          drivingLicense: "DL123456789",
          passport: "",
          rationCard: "",
          skills: "Business Management, Marketing",
          hobbies: "Travel, Photography",
          languages: "Hindi, English, Gujarati",
          facebook: "shyam.panchal",
          whatsapp: "9876543211",
          instagram: "shyam_panchal",
          emergencyContact: "9876543212",
          emergencyRelation: "Brother",
          birthPlace: "गांव 1",
          motherTongue: "Hindi",
          religion: "Hindu",
          caste: "Panchal",
          subCaste: "",
          gotra: "Vishwakarma",
          marriageDate: "2010-12-01",
          spouseName: "गीता पंचाल",
          childrenCount: "2",
          landOwnership: false,
          landArea: "",
          houseType: "Pucca",
          vehicleOwnership: "Car, Motorcycle",
          annualIncome: "720000",
          savingsAccount: "SAV345678",
          loanDetails: "Business Loan - 5 Lakh",
          pmKisan: false,
          ayushmanBharat: false,
          ujjwalaYojana: false,
          janDhanAccount: false,
          computerKnowledge: true,
          internetUsage: true,
          smartphoneUser: true,
          migrationReason: "",
          migrationDuration: "",
          remittanceAmount: "",
          lastHealthCheckup: "2024-10-20",
          vaccinationStatus: "Complete",
          covidVaccinated: true,
          communityRole: "Youth Committee President",
          volunteerWork: "Education Support",
          donations: "Annual - 15000",
        },
      ],
    },
  ])

  const router = useRouter()

  useEffect(() => {
    const userType = sessionStorage.getItem("userType")
    const storedUserData = sessionStorage.getItem("userData")

    if (userType !== "village" || !storedUserData) {
      router.push("/login")
      return
    }

    setUserData(JSON.parse(storedUserData))
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push("/login")
  }

  const handleDeleteFamily = (familyId: string) => {
    setFamilies((prev) => prev.filter((f) => f.id !== familyId))
    if (selectedFamily?.id === familyId) {
      setSelectedFamily(null)
    }
  }

  const handleDeleteMember = (familyId: string, memberId: string) => {
    setFamilies((prev) =>
      prev.map((family) => {
        if (family.id === familyId) {
          const updatedMembers = family.members.filter((m) => m.id !== memberId)
          return {
            ...family,
            members: updatedMembers,
            memberCount: updatedMembers.length,
          }
        }
        return family
      }),
    )

    if (selectedMember?.id === memberId) {
      setSelectedMember(null)
    }
  }

  const filteredFamilies = families.filter((family) => {
    const matchesSearch =
      family.familyHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.parivarId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.mobile.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || family.verificationStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">लॉड हो रहा है...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/images/main-logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
              <div>
                <h1 className="text-lg font-bold text-white">गांव एडमिन</h1>
                <p className="text-xs text-blue-100 truncate max-w-[200px]">
                  {userData.name} - {userData.village}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="text-white p-2">
                <Bell className="w-5 h-5" />
              </Button>
              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-white p-2">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="text-left">मेन्यू</SheetTitle>
                    <SheetDescription className="text-left">
                      {userData.name} - {userData.village}, {userData.chokhra}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-12"
                      onClick={() => {
                        setActiveTab("overview")
                        setShowMobileMenu(false)
                      }}
                    >
                      <Home className="w-5 h-5 mr-3" />
                      ओवरव्यू
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-12"
                      onClick={() => {
                        setActiveTab("families")
                        setShowMobileMenu(false)
                      }}
                    >
                      <Users className="w-5 h-5 mr-3" />
                      परिवार प्रबंधन
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-12"
                      onClick={() => {
                        setActiveTab("analytics")
                        setShowMobileMenu(false)
                      }}
                    >
                      <BarChart3 className="w-5 h-5 mr-3" />
                      एनालिटिक्स
                    </Button>
                    <div className="border-t pt-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-12"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        सेटिंग्स
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-12 text-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        लॉगआउट
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="bg-white border-b sticky top-[73px] z-40">
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { id: "overview", label: "ओवरव्यू", icon: Home },
            { id: "families", label: "परिवार", icon: Users },
            { id: "analytics", label: "रिपोर्ट", icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-shrink-0 flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors min-w-[120px]",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">कुल परिवार</p>
                      <p className="text-2xl font-bold text-gray-800">{families.length}</p>
                    </div>
                    <Home className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">कुल सदस्य</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {families.reduce((sum, f) => sum + f.memberCount, 0)}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">सत्यापित</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {families.filter((f) => f.verificationStatus === "Verified").length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">लंबित</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {families.filter((f) => f.verificationStatus === "Pending").length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">त्वरित कार्य</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={() => {
                      setActiveTab("families")
                      setShowAddFamily(true)
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-12 text-left justify-start"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    नया परिवार जोड़ें
                  </Button>
                  <Button
                    onClick={() => setActiveTab("families")}
                    variant="outline"
                    className="border-blue-200 text-blue-600 h-12 text-left justify-start"
                  >
                    <Eye className="w-5 h-5 mr-3" />
                    परिवार देखें
                  </Button>
                  <Button
                    onClick={() => setActiveTab("analytics")}
                    variant="outline"
                    className="border-green-200 text-green-600 h-12 text-left justify-start"
                  >
                    <BarChart3 className="w-5 h-5 mr-3" />
                    रिपोर्ट देखें
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">हाल की गतिविधि</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">राम पंचाल परिवार सत्यापित</p>
                      <p className="text-xs text-gray-500">2 घंटे पहले</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">नया सदस्य जोड़ा गया</p>
                      <p className="text-xs text-gray-500">5 घंटे पहले</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">श्याम पंचाल परिवार लंबित</p>
                      <p className="text-xs text-gray-500">1 दिन पहले</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Family Management Tab */}
        {activeTab === "families" && (
          <div className="space-y-4">
            {!selectedFamily ? (
              <>
                {/* Search and Filter */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="परिवार खोजें..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 h-12"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-12">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="स्थिति फिल्टर" />
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

                {/* Add Family Button */}
                <Button
                  onClick={() => setShowAddFamily(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 h-12"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  नया परिवार जोड़ें
                </Button>

                {/* Family Cards */}
                <div className="space-y-4">
                  {filteredFamilies.map((family) => (
                    <Card
                      key={family.id}
                      className="bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedFamily(family)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-blue-700">{family.familyHead}</h3>
                            <p className="text-sm text-gray-600">ID: {family.parivarId}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge
                              className={
                                family.verificationStatus === "Verified"
                                  ? "bg-green-500"
                                  : family.verificationStatus === "Pending"
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                              }
                            >
                              {family.verificationStatus}
                            </Badge>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{family.memberCount} सदस्य</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{family.mobile}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{family.address}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="w-4 h-4 mr-2" />
                            <span>{family.familyCardIssued ? "पारिवारिक कार्ड जारी" : "कार्ड लंबित"}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFamily(family)
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            विवरण
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFamily(family.id)
                            }}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredFamilies.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-gray-100 to-white p-8 rounded-lg border border-gray-200">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-700 mb-2">कोई परिवार नहीं मिला</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm || statusFilter !== "all"
                          ? "खोज के अनुसार कोई परिवार नहीं मिला"
                          : "अभी तक कोई परिवार पंजीकृत नहीं है"}
                      </p>
                      <Button
                        onClick={() => setShowAddFamily(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600"
                      >
                        पहला परिवार जोड़ें
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Family Detail View */}
                <MobileFamilyDetailView
                  family={selectedFamily}
                  onBack={() => setSelectedFamily(null)}
                  onUpdateFamily={(updatedFamily) => {
                    setFamilies((prev) => prev.map((f) => (f.id === updatedFamily.id ? updatedFamily : f)))
                    setSelectedFamily(updatedFamily)
                  }}
                  onDeleteMember={(memberId) => handleDeleteMember(selectedFamily.id, memberId)}
                  onSelectMember={setSelectedMember}
                  selectedMember={selectedMember}
                  onAddMember={() => setShowAddMember(true)}
                />
              </>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">गांव एनालिटिक्स</h2>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700 text-lg">लिंग वितरण</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>पुरुष</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-3/5 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="font-bold text-sm">60%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>महिला</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-2/5 h-2 bg-pink-500 rounded-full"></div>
                        </div>
                        <span className="font-bold text-sm">40%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700 text-lg">आयु समूह</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>0-18 वर्ष</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/4 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="font-bold text-sm">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>19-60 वर्ष</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-4/5 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="font-bold text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>60+ वर्ष</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/10 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="font-bold text-sm">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-700 text-lg">शिक्षा स्तर</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>स्नातक+</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/3 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="font-bold text-sm">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>माध्यमिक</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/2 h-2 bg-purple-600 rounded-full"></div>
                        </div>
                        <span className="font-bold text-sm">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>प्राथमिक</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/4 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                        <span className="font-bold text-sm">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chanda Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">चंदा संग्रह स्थिति</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">₹35,000</div>
                    <p className="text-sm text-gray-600">संग्रहित राशि</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">₹15,000</div>
                    <p className="text-sm text-gray-600">लंबित राशि</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">70%</div>
                    <p className="text-sm text-gray-600">संग्रह दर</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {activeTab === "families" && !selectedFamily && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowAddFamily(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Add Family Dialog */}
      {showAddFamily && (
        <MobileAddFamilyDialog
          open={showAddFamily}
          onClose={() => setShowAddFamily(false)}
          onAddFamily={(newFamily) => {
            setFamilies((prev) => [...prev, newFamily])
            setShowAddFamily(false)
          }}
        />
      )}

      {/* Add Member Dialog */}
      {showAddMember && selectedFamily && (
        <MobileAddMemberDialog
          open={showAddMember}
          onClose={() => setShowAddMember(false)}
          family={selectedFamily}
          onAddMember={(newMember) => {
            const updatedFamily = {
              ...selectedFamily,
              members: [...selectedFamily.members, newMember],
              memberCount: selectedFamily.members.length + 1,
            }
            setFamilies((prev) => prev.map((f) => (f.id === updatedFamily.id ? updatedFamily : f)))
            setSelectedFamily(updatedFamily)
            setShowAddMember(false)
          }}
        />
      )}
    </div>
  )
}

// Mobile Family Detail View Component
function MobileFamilyDetailView({
  family,
  onBack,
  onUpdateFamily,
  onDeleteMember,
  onSelectMember,
  selectedMember,
  onAddMember,
}: {
  family: Family
  onBack: () => void
  onUpdateFamily: (family: Family) => void
  onDeleteMember: (memberId: string) => void
  onSelectMember: (member: Member | null) => void
  selectedMember: Member | null
  onAddMember: () => void
}) {
  const [editingFamily, setEditingFamily] = useState(false)
  const [familyData, setFamilyData] = useState(family)

  const handleSaveFamily = () => {
    onUpdateFamily(familyData)
    setEditingFamily(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          वापस
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setEditingFamily(!editingFamily)} size="sm">
            <Edit className="w-4 h-4 mr-1" />
            {editingFamily ? "रद्द" : "संपादित"}
          </Button>
          <Button onClick={onAddMember} size="sm" className="bg-gradient-to-r from-green-500 to-green-600">
            <UserPlus className="w-4 h-4 mr-1" />
            सदस्य
          </Button>
        </div>
      </div>

      {/* Family Info Card */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-700">{family.familyHead}</CardTitle>
              <p className="text-sm text-gray-600">ID: {family.parivarId}</p>
            </div>
            <Badge
              className={
                family.verificationStatus === "Verified"
                  ? "bg-green-500"
                  : family.verificationStatus === "Pending"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
              }
            >
              {family.verificationStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editingFamily ? (
            <>
              <div>
                <Label>परिवार मुखिया</Label>
                <Input
                  value={familyData.familyHead}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, familyHead: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>मोबाइल नंबर</Label>
                <Input
                  value={familyData.mobile}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, mobile: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>ईमेल</Label>
                <Input
                  value={familyData.email}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, email: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>पता</Label>
                <Textarea
                  value={familyData.address}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>पिन कोड</Label>
                <Input
                  value={familyData.pinCode}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, pinCode: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={familyData.familyCardIssued}
                  onCheckedChange={(checked) => setFamilyData((prev) => ({ ...prev, familyCardIssued: !!checked }))}
                />
                <Label>पारिवारिक कार्ड जारी</Label>
              </div>
              <div>
                <Label>सत्यापन स्थिति</Label>
                <Select
                  value={familyData.verificationStatus}
                  onValueChange={(value: "Verified" | "Pending" | "Draft") =>
                    setFamilyData((prev) => ({ ...prev, verificationStatus: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verified">सत्यापित</SelectItem>
                    <SelectItem value="Pending">लंबित</SelectItem>
                    <SelectItem value="Draft">ड्राफ्ट</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveFamily} className="w-full bg-gradient-to-r from-blue-500 to-blue-600">
                <Save className="w-4 h-4 mr-2" />
                सेव करें
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{family.mobile}</span>
                </div>
                {family.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{family.email}</span>
                  </div>
                )}
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                  <span>{family.address}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>पिन कोड:</strong> {family.pinCode}
                  </div>
                  <div>
                    <strong>सदस्य:</strong> {family.memberCount}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    <strong>पारिवारिक कार्ड:</strong>
                  </span>
                  <Badge className={family.familyCardIssued ? "bg-green-500" : "bg-yellow-500"}>
                    {family.familyCardIssued ? "जारी" : "लंबित"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>पंजीकरण:</strong> {family.registrationDate}
                  </div>
                  <div>
                    <strong>अपडेट:</strong> {family.lastUpdated}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Members List */}
      <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-700">परिवार के सदस्य ({family.members.length})</CardTitle>
            <Button onClick={onAddMember} size="sm" className="bg-gradient-to-r from-green-500 to-green-600">
              <Plus className="w-4 h-4 mr-1" />
              जोड़ें
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {family.members.map((member, index) => (
              <Card
                key={member.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedMember?.id === member.id ? "ring-2 ring-blue-500 bg-blue-50" : "bg-white hover:bg-gray-50",
                )}
                onClick={() => onSelectMember(selectedMember?.id === member.id ? null : member)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          {member.fullName}
                          {member.isMukhiya && <Badge className="ml-2 bg-orange-500 text-xs">मुखिया</Badge>}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {member.relation} • {member.gender}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {member.occupation}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteMember(member.id)
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedMember?.id === member.id && (
                    <div className="mt-4 pt-4 border-t">
                      <MobileMemberDetailView member={member} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mobile Member Detail View Component
function MobileMemberDetailView({ member }: { member: Member }) {
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="basic">
          <AccordionTrigger className="text-sm font-medium py-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              बुनियादी जानकारी
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">जन्म तिथि:</span>
                <span className="font-medium">{member.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">आधार:</span>
                <span className="font-medium">{member.aadhaar || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">वैवाहिक स्थिति:</span>
                <span className="font-medium">{member.maritalStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">रक्त समूह:</span>
                <span className="font-medium">{member.bloodGroup || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">मोबाइल:</span>
                <span className="font-medium">{member.memberMobile || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ईमेल:</span>
                <span className="font-medium">{member.memberEmail || "N/A"}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger className="text-sm font-medium py-2">
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              शिक्षा विवरण
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">योग्यता:</span>
                <span className="font-medium">{member.qualification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">स्ट्रीम:</span>
                <span className="font-medium">{member.educationStream || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">वर्तमान में पढ़ाई:</span>
                <span className="font-medium">{member.currentlyStudying ? "हाँ" : "नहीं"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">भाषाएं:</span>
                <span className="font-medium">{member.languages || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">कौशल:</span>
                <span className="font-medium">{member.skills || "N/A"}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="employment">
          <AccordionTrigger className="text-sm font-medium py-2">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              रोजगार विवरण
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">व्यवसाय:</span>
                <span className="font-medium">{member.occupation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">नियोक्ता:</span>
                <span className="font-medium">{member.employerName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">कार्य स्थान:</span>
                <span className="font-medium">{member.workLocation || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">मासिक आय:</span>
                <span className="font-medium">{member.monthlyIncome ? `₹${member.monthlyIncome}` : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">प्रवासी:</span>
                <span className="font-medium">{member.isMigrant ? "हाँ" : "नहीं"}</span>
              </div>
              {member.isMigrant && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">वर्तमान राज्य:</span>
                    <span className="font-medium">{member.currentState}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">वर्तमान जिला:</span>
                    <span className="font-medium">{member.currentDistrict}</span>
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="health">
          <AccordionTrigger className="text-sm font-medium py-2">
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              स्वास्थ्य विवरण
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">स्वास्थ्य स्थिति:</span>
                  <span className="font-medium">{member.healthStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">पुरानी बीमारियां:</span>
                  <span className="font-medium">{member.chronicDiseases || "कोई नहीं"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">विकलांगता:</span>
                  <span className="font-medium">{member.disabilities || "कोई नहीं"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">अंतिम जांच:</span>
                  <span className="font-medium">{member.lastHealthCheckup || "N/A"}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-600 text-sm">बीमा योजनाएं:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.hasHealthInsurance && <Badge className="bg-green-500 text-xs">स्वास्थ्य बीमा</Badge>}
                  {member.hasLifeInsurance && <Badge className="bg-blue-500 text-xs">जीवन बीमा</Badge>}
                  {member.hasAccidentInsurance && <Badge className="bg-purple-500 text-xs">दुर्घटना बीमा</Badge>}
                  {member.ayushmanBharat && <Badge className="bg-orange-500 text-xs">आयुष्मान भारत</Badge>}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="documents">
          <AccordionTrigger className="text-sm font-medium py-2">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              दस्तावेज विवरण
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">पैन कार्ड:</span>
                  <span className="font-medium">{member.panCard || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">वोटर ID:</span>
                  <span className="font-medium">{member.voterCard || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ड्राइविंग लाइसेंस:</span>
                  <span className="font-medium">{member.drivingLicense || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">पासपोर्ट:</span>
                  <span className="font-medium">{member.passport || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">बैंक खाता:</span>
                  <span className="font-medium">{member.bankAccount || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">राशन कार्ड:</span>
                  <span className="font-medium">{member.rationCard || "N/A"}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-600 text-sm">सरकारी योजनाएं:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.pmKisan && <Badge className="bg-green-500 text-xs">PM किसान</Badge>}
                  {member.janDhanAccount && <Badge className="bg-blue-500 text-xs">जन धन खाता</Badge>}
                  {member.ujjwalaYojana && <Badge className="bg-purple-500 text-xs">उज्ज्वला योजना</Badge>}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

// Mobile Add Family Dialog Component
function MobileAddFamilyDialog({
  open,
  onClose,
  onAddFamily,
}: {
  open: boolean
  onClose: () => void
  onAddFamily: (family: Family) => void
}) {
  const [formData, setFormData] = useState({
    familyHead: "",
    mobile: "",
    email: "",
    address: "",
    pinCode: "",
    familyCardIssued: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newFamily: Family = {
      id: `f${Date.now()}`,
      parivarId: `PID${String(Date.now()).slice(-3)}`,
      familyHead: formData.familyHead,
      memberCount: 0,
      address: formData.address,
      mobile: formData.mobile,
      email: formData.email,
      pinCode: formData.pinCode,
      familyCardIssued: formData.familyCardIssued,
      verificationStatus: "Draft",
      members: [],
      registrationDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    }
    onAddFamily(newFamily)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>नया परिवार जोड़ें</DialogTitle>
          <DialogDescription>परिवार की बुनियादी जानकारी दर्ज करें</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>परिवार मुखिया का नाम *</Label>
            <Input
              value={formData.familyHead}
              onChange={(e) => setFormData((prev) => ({ ...prev, familyHead: e.target.value }))}
              placeholder="राम पंचाल"
              className="mt-1 h-12"
              required
            />
          </div>
          <div>
            <Label>मोबाइल नंबर *</Label>
            <Input
              value={formData.mobile}
              onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
              placeholder="10 अंकों का नंबर"
              maxLength={10}
              className="mt-1 h-12"
              required
            />
          </div>
          <div>
            <Label>ईमेल (वैकल्पिक)</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="ram.panchal@example.com"
              className="mt-1 h-12"
            />
          </div>
          <div>
            <Label>पिन कोड *</Label>
            <Input
              value={formData.pinCode}
              onChange={(e) => setFormData((prev) => ({ ...prev, pinCode: e.target.value }))}
              placeholder="6 अंकों का पिन कोड"
              maxLength={6}
              className="mt-1 h-12"
              required
            />
          </div>
          <div>
            <Label>पूरा पता *</Label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="पूरा पता दर्ज करें"
              rows={3}
              className="mt-1"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.familyCardIssued}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, familyCardIssued: !!checked }))}
            />
            <Label>पारिवारिक कार्ड जारी है</Label>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 bg-transparent">
              रद्द करें
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 h-12">
              परिवार जोड़ें
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Mobile Add Member Dialog Component
function MobileAddMemberDialog({
  open,
  onClose,
  family,
  onAddMember,
}: {
  open: boolean
  onClose: () => void
  family: Family
  onAddMember: (member: Member) => void
}) {
  const [formData, setFormData] = useState<Partial<Member>>({
    fullName: "",
    relation: "",
    isMukhiya: family.members.length === 0,
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
    healthStatus: "Healthy",
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
    religion: "Hindu",
    caste: "Panchal",
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
  })

  const [activeSection, setActiveSection] = useState("basic")

  const relations = ["Self", "Wife", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"]
  const qualifications = [
    "Illiterate",
    "Primary",
    "Secondary",
    "Higher Secondary",
    "Diploma",
    "Graduate",
    "Post Graduate",
    "PhD",
    "Other",
  ]
  const occupations = [
    "Student",
    "Farmer",
    "Govt Employee",
    "Private Job",
    "Business",
    "Self-employed",
    "Homemaker",
    "Retired",
    "Unemployed",
    "Other",
  ]
  const states = ["राजस्थान", "गुजरात", "महाराष्ट्र", "मध्य प्रदेश", "उत्तर प्रदेश", "दिल्ली", "मुंबई", "Other"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newMember: Member = {
      id: `member_${Date.now()}`,
      fullName: formData.fullName || "",
      relation: formData.relation || "",
      isMukhiya: formData.isMukhiya || false,
      dateOfBirth: formData.dateOfBirth || "",
      gender: formData.gender || "",
      aadhaar: formData.aadhaar || "",
      maritalStatus: formData.maritalStatus || "",
      qualification: formData.qualification || "",
      currentlyStudying: formData.currentlyStudying || false,
      institutionName: formData.institutionName || "",
      educationStream: formData.educationStream || "",
      occupation: formData.occupation || "",
      employerName: formData.employerName || "",
      workLocation: formData.workLocation || "",
      monthlyIncome: formData.monthlyIncome || "",
      isMigrant: formData.isMigrant || false,
      currentState: formData.currentState || "",
      currentDistrict: formData.currentDistrict || "",
      healthStatus: formData.healthStatus || "Healthy",
      hasHealthInsurance: formData.hasHealthInsurance || false,
      hasLifeInsurance: formData.hasLifeInsurance || false,
      hasAccidentInsurance: formData.hasAccidentInsurance || false,
      hasGovtSchemes: formData.hasGovtSchemes || false,
      memberMobile: formData.memberMobile || "",
      memberEmail: formData.memberEmail || "",
      bloodGroup: formData.bloodGroup || "",
      height: formData.height || "",
      weight: formData.weight || "",
      chronicDiseases: formData.chronicDiseases || "",
      disabilities: formData.disabilities || "",
      bankAccount: formData.bankAccount || "",
      panCard: formData.panCard || "",
      voterCard: formData.voterCard || "",
      drivingLicense: formData.drivingLicense || "",
      passport: formData.passport || "",
      rationCard: formData.rationCard || "",
      skills: formData.skills || "",
      hobbies: formData.hobbies || "",
      languages: formData.languages || "",
      facebook: formData.facebook || "",
      whatsapp: formData.whatsapp || "",
      instagram: formData.instagram || "",
      emergencyContact: formData.emergencyContact || "",
      emergencyRelation: formData.emergencyRelation || "",
      birthPlace: formData.birthPlace || "",
      motherTongue: formData.motherTongue || "",
      religion: formData.religion || "Hindu",
      caste: formData.caste || "Panchal",
      subCaste: formData.subCaste || "",
      gotra: formData.gotra || "",
      marriageDate: formData.marriageDate || "",
      spouseName: formData.spouseName || "",
      childrenCount: formData.childrenCount || "",
      landOwnership: formData.landOwnership || false,
      landArea: formData.landArea || "",
      houseType: formData.houseType || "",
      vehicleOwnership: formData.vehicleOwnership || "",
      annualIncome: formData.annualIncome || "",
      savingsAccount: formData.savingsAccount || "",
      loanDetails: formData.loanDetails || "",
      pmKisan: formData.pmKisan || false,
      ayushmanBharat: formData.ayushmanBharat || false,
      ujjwalaYojana: formData.ujjwalaYojana || false,
      janDhanAccount: formData.janDhanAccount || false,
      computerKnowledge: formData.computerKnowledge || false,
      internetUsage: formData.internetUsage || false,
      smartphoneUser: formData.smartphoneUser || false,
      migrationReason: formData.migrationReason || "",
      migrationDuration: formData.migrationDuration || "",
      remittanceAmount: formData.remittanceAmount || "",
      lastHealthCheckup: formData.lastHealthCheckup || "",
      vaccinationStatus: formData.vaccinationStatus || "",
      covidVaccinated: formData.covidVaccinated || false,
      communityRole: formData.communityRole || "",
      volunteerWork: formData.volunteerWork || "",
      donations: formData.donations || "",
    }
    onAddMember(newMember)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>नया सदस्य जोड़ें</DialogTitle>
          <DialogDescription>{family.familyHead} परिवार में सदस्य जोड़ें</DialogDescription>
        </DialogHeader>

        {/* Section Navigation */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
          {[
            { id: "basic", label: "बुनियादी", icon: Users },
            { id: "education", label: "शिक्षा", icon: GraduationCap },
            { id: "employment", label: "रोजगार", icon: Briefcase },
            { id: "health", label: "स्वास्थ्य", icon: Heart },
            { id: "documents", label: "दस्तावेज", icon: Shield },
          ].map((section) => (
            <Button
              key={section.id}
              type="button"
              variant={activeSection === section.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className={cn("flex-shrink-0 text-xs px-3 py-2", activeSection === section.id ? "bg-blue-500" : "")}
            >
              <section.icon className="w-3 h-3 mr-1" />
              {section.label}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          {activeSection === "basic" && (
            <div className="space-y-4">
              <div>
                <Label>पूरा नाम *</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="राम पंचाल"
                  className="mt-1 h-12"
                  required
                />
              </div>
              <div>
                <Label>मुखिया से रिश्ता *</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, relation: value }))}>
                  <SelectTrigger className="mt-1 h-12">
                    <SelectValue placeholder="रिश्ता चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {relations.map((relation) => (
                      <SelectItem key={relation} value={relation}>
                        {relation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>जन्म तिथि *</Label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="mt-1 h-12"
                  required
                />
              </div>
              <div>
                <Label>लिंग *</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
                  <SelectTrigger className="mt-1 h-12">
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
                <Label>मोबाइल नंबर</Label>
                <Input
                  value={formData.memberMobile}
                  onChange={(e) => setFormData((prev) => ({ ...prev, memberMobile: e.target.value }))}
                  placeholder="10 अंकों का नंबर"
                  maxLength={10}
                  className="mt-1 h-12"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.isMukhiya}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isMukhiya: !!checked }))}
                />
                <Label>क्या यह सदस्य मुखिया है?</Label>
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeSection === "education" && (
            <div className="space-y-4">
              <div>
                <Label>उच्चतम योग्यता</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, qualification: value }))}>
                  <SelectTrigger className="mt-1 h-12">
                    <SelectValue placeholder="योग्यता चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualifications.map((qual) => (
                      <SelectItem key={qual} value={qual}>
                        {qual}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>शिक्षा स्ट्रीम</Label>
                <Input
                  value={formData.educationStream}
                  onChange={(e) => setFormData((prev) => ({ ...prev, educationStream: e.target.value }))}
                  placeholder="Science, Commerce, Arts"
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label>भाषाएं</Label>
                <Input
                  value={formData.languages}
                  onChange={(e) => setFormData((prev) => ({ ...prev, languages: e.target.value }))}
                  placeholder="हिंदी, अंग्रेजी, गुजराती"
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label>कौशल</Label>
                <Input
                  value={formData.skills}
                  onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))}
                  placeholder="कंप्यूटर, ड्राइविंग, खाना बनाना"
                  className="mt-1 h-12"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.currentlyStudying}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, currentlyStudying: !!checked }))}
                />
                <Label>क्या वर्तमान में पढ़ाई कर रहे हैं?</Label>
              </div>
            </div>
          )}

          {/* Employment Section */}
          {activeSection === "employment" && (
            <div className="space-y-4">
              <div>
                <Label>व्यवसाय</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, occupation: value }))}>
                  <SelectTrigger className="mt-1 h-12">
                    <SelectValue placeholder="व्यवसाय चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {occupations.map((occ) => (
                      <SelectItem key={occ} value={occ}>
                        {occ}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>नियोक्ता/कंपनी का नाम</Label>
                <Input
                  value={formData.employerName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, employerName: e.target.value }))}
                  placeholder="कंपनी का नाम"
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label>मासिक आय</Label>
                <Input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData((prev) => ({ ...prev, monthlyIncome: e.target.value }))}
                  placeholder="₹ में आय"
                  className="mt-1 h-12"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.isMigrant}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isMigrant: !!checked }))}
                />
                <Label>क्या प्रवासी सदस्य है?</Label>
              </div>
              {formData.isMigrant && (
                <div>
                  <Label>वर्तमान राज्य</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, currentState: value }))}>
                    <SelectTrigger className="mt-1 h-12">
                      <SelectValue placeholder="राज्य चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Health Section */}
          {activeSection === "health" && (
            <div className="space-y-4">
              <div>
                <Label>स्वास्थ्य स्थिति</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, healthStatus: value }))}>
                  <SelectTrigger className="mt-1 h-12">
                    <SelectValue placeholder="स्वास्थ्य स्थिति चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthy">स्वस्थ</SelectItem>
                    <SelectItem value="Chronically Ill">दीर्घकालिक बीमार</SelectItem>
                    <SelectItem value="Differently-abled">दिव्यांग</SelectItem>
                    <SelectItem value="Under Treatment">इलाज के तहत</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>रक्त समूह</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, bloodGroup: value }))}>
                  <SelectTrigger className="mt-1 h-12">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ऊंचाई (सेमी)</Label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                    placeholder="170"
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label>वजन (किग्रा)</Label>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                    placeholder="70"
                    className="mt-1 h-12"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>बीमा विकल्प</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.hasHealthInsurance}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hasHealthInsurance: !!checked }))}
                    />
                    <Label className="text-sm">स्वास्थ्य बीमा</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.hasLifeInsurance}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hasLifeInsurance: !!checked }))}
                    />
                    <Label className="text-sm">जीवन बीमा</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.ayushmanBharat}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, ayushmanBharat: !!checked }))}
                    />
                    <Label className="text-sm">आयुष्मान भारत</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.hasGovtSchemes}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hasGovtSchemes: !!checked }))}
                    />
                    <Label className="text-sm">सरकारी योजनाएं</Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Section */}
          {activeSection === "documents" && (
            <div className="space-y-4">
              <div>
                <Label>आधार नंबर</Label>
                <Input
                  value={formData.aadhaar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, aadhaar: e.target.value }))}
                  placeholder="12 अंकों का आधार नंबर"
                  maxLength={12}
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label>पैन कार्ड</Label>
                <Input
                  value={formData.panCard}
                  onChange={(e) => setFormData((prev) => ({ ...prev, panCard: e.target.value }))}
                  placeholder="PAN नंबर"
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label>वोटर ID</Label>
                <Input
                  value={formData.voterCard}
                  onChange={(e) => setFormData((prev) => ({ ...prev, voterCard: e.target.value }))}
                  placeholder="वोटर ID नंबर"
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label>बैंक खाता</Label>
                <Input
                  value={formData.bankAccount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bankAccount: e.target.value }))}
                  placeholder="बैंक खाता नंबर"
                  className="mt-1 h-12"
                />
              </div>
              <div className="space-y-3">
                <Label>सरकारी योजनाएं</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.pmKisan}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, pmKisan: !!checked }))}
                    />
                    <Label className="text-sm">PM किसान</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.ujjwalaYojana}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, ujjwalaYojana: !!checked }))}
                    />
                    <Label className="text-sm">उज्ज्वला योजना</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.janDhanAccount}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, janDhanAccount: !!checked }))}
                    />
                    <Label className="text-sm">जन धन खाता</Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 bg-transparent">
              रद्द करें
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 h-12"
              disabled={!formData.fullName || !formData.relation || !formData.dateOfBirth || !formData.gender}
            >
              सदस्य जोड़ें
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

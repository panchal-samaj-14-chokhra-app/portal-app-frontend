"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  User,
  Home,
  GraduationCap,
  Briefcase,
  Heart,
  Smartphone,
  Users,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Badge } from "@/components/ui/badge/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Textarea } from "@/components/ui/textarea/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"

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
  permanentAddress: string
  economicStatus: string
  houseOwnership: string
  totalIncome: string
  rationCardType: string
  electricityConnection: boolean
  waterConnection: boolean
  gasConnection: boolean
  internetConnection: boolean
  vehicleDetails: string
  bankDetails: string
  insuranceDetails: string
  govtSchemesBenefits: string[]
  specialNotes: string
}

export default function EditFamilyPage() {
  const params = useParams()
  const router = useRouter()
  const villageId = params.villageId as string
  const familyId = params.familyId as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [activeAccordion, setActiveAccordion] = useState<string[]>(["basic"])

  // Mock family data - in real app, this would come from API
  const [familyData, setFamilyData] = useState<Family>({
    id: familyId,
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
    permanentAddress: "मुख्य सड़क, गांव 1, राजस्थान",
    economicStatus: "APL",
    houseOwnership: "Own",
    totalIncome: "600000",
    rationCardType: "APL",
    electricityConnection: true,
    waterConnection: true,
    gasConnection: true,
    internetConnection: true,
    vehicleDetails: "Motorcycle, Tractor",
    bankDetails: "SBI - 1234567890",
    insuranceDetails: "LIC Policy - 12345",
    govtSchemesBenefits: ["PM Kisan", "Ayushman Bharat"],
    specialNotes: "Active community member",
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
      {
        id: "m2",
        fullName: "सीता पंचाल",
        relation: "Wife",
        isMukhiya: false,
        dateOfBirth: "1982-05-15",
        gender: "Female",
        aadhaar: "123456789013",
        maritalStatus: "Married",
        qualification: "Higher Secondary",
        currentlyStudying: false,
        institutionName: "",
        educationStream: "Arts",
        occupation: "Homemaker",
        employerName: "",
        workLocation: "गांव 1",
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
        memberEmail: "",
        bloodGroup: "B+",
        height: "160",
        weight: "55",
        chronicDiseases: "",
        disabilities: "",
        bankAccount: "1234567891",
        panCard: "",
        voterCard: "XYZ1234568",
        drivingLicense: "",
        passport: "",
        rationCard: "RC1234567890",
        skills: "Cooking, Tailoring",
        hobbies: "Singing, Gardening",
        languages: "Hindi, Gujarati",
        facebook: "",
        whatsapp: "9876543211",
        instagram: "",
        emergencyContact: "9876543210",
        emergencyRelation: "Husband",
        birthPlace: "गांव 2",
        motherTongue: "Gujarati",
        religion: "Hindu",
        caste: "Panchal",
        subCaste: "Lohar",
        gotra: "Vishwakarma",
        marriageDate: "2005-02-15",
        spouseName: "राम पंचाल",
        childrenCount: "3",
        landOwnership: false,
        landArea: "",
        houseType: "Pucca",
        vehicleOwnership: "",
        annualIncome: "0",
        savingsAccount: "Yes",
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
        communityRole: "Women's Group Member",
        volunteerWork: "School Committee",
        donations: "Festival Donations - 5000",
      },
    ],
  })

  useEffect(() => {
    // Simulate loading family data
    const loadFamilyData = async () => {
      try {
        // In real app, fetch family data from API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setLoading(false)
      } catch (error) {
        console.error("Error loading family data:", error)
        setLoading(false)
      }
    }

    loadFamilyData()
  }, [familyId])

  const updateFamilyField = (field: keyof Family, value: any) => {
    setFamilyData((prev) => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString().split("T")[0],
    }))
  }

  const updateMember = (memberId: string, field: keyof Member, value: any) => {
    setFamilyData((prev) => ({
      ...prev,
      members: prev.members.map((member) => {
        if (member.id === memberId) {
          // If setting someone as Mukhiya, remove Mukhiya status from others
          if (field === "isMukhiya" && value === true) {
            const updatedMembers = prev.members.map((m) => ({ ...m, isMukhiya: false }))
            const targetMember = updatedMembers.find((m) => m.id === memberId)!
            return { ...targetMember, [field]: value }
          }
          return { ...member, [field]: value }
        }
        return member
      }),
      lastUpdated: new Date().toISOString().split("T")[0],
    }))
  }

  const addMember = () => {
    const newMember: Member = {
      id: `m${Date.now()}`,
      fullName: "",
      relation: "",
      isMukhiya: false,
      dateOfBirth: "",
      gender: "Male",
      aadhaar: "",
      maritalStatus: "Single",
      qualification: "",
      currentlyStudying: false,
      institutionName: "",
      educationStream: "",
      occupation: "",
      employerName: "",
      workLocation: "",
      monthlyIncome: "0",
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
      childrenCount: "0",
      landOwnership: false,
      landArea: "",
      houseType: "Pucca",
      vehicleOwnership: "",
      annualIncome: "0",
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
    }

    setFamilyData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
      memberCount: prev.memberCount + 1,
      lastUpdated: new Date().toISOString().split("T")[0],
    }))
  }

  const deleteMember = (memberId: string) => {
    const memberToDelete = familyData.members.find((m) => m.id === memberId)
    if (memberToDelete?.isMukhiya && familyData.members.length > 1) {
      alert("मुखिया को हटाने से पहले किसी और को मुखिया बनाएं")
      return
    }

    setFamilyData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
      memberCount: prev.memberCount - 1,
      lastUpdated: new Date().toISOString().split("T")[0],
    }))
    setShowDeleteConfirm(null)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Check if there's exactly one Mukhiya
    const mukhiyaCount = familyData.members.filter((m) => m.isMukhiya).length
    if (mukhiyaCount === 0) {
      newErrors.mukhiya = "कम से कम एक मुखिया होना आवश्यक है"
    } else if (mukhiyaCount > 1) {
      newErrors.mukhiya = "केवल एक मुखिया हो सकता है"
    }

    // Check for unique Aadhaar numbers
    const aadhaarNumbers = familyData.members.map((m) => m.aadhaar).filter(Boolean)
    const duplicateAadhaar = aadhaarNumbers.find((num, index) => aadhaarNumbers.indexOf(num) !== index)
    if (duplicateAadhaar) {
      newErrors.aadhaar = `आधार नंबर ${duplicateAadhaar} डुप्लिकेट है`
    }

    // Check required fields
    if (!familyData.parivarId.trim()) {
      newErrors.parivarId = "परिवार ID आवश्यक है"
    }
    if (!familyData.familyHead.trim()) {
      newErrors.familyHead = "परिवार मुखिया का नाम आवश्यक है"
    }
    if (!familyData.mobile.trim()) {
      newErrors.mobile = "मोबाइल नंबर आवश्यक है"
    }

    // Check required fields for each member
    familyData.members.forEach((member, index) => {
      if (!member.fullName.trim()) {
        newErrors[`member-${index}-name`] = "नाम आवश्यक है"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      alert("कृपया सभी त्रुटियों को ठीक करें")
      return
    }

    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("परिवार की जानकारी सफलतापूर्वक अपडेट हो गई!")
      router.push(`/village/${villageId}`)
    } catch (error) {
      alert("अपडेट में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-panchal-orange-50 via-white to-panchal-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-panchal-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 hindi-text">परिवार की जानकारी लोड हो रही है...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-panchal-orange-50 via-white to-panchal-orange-100">
      {/* Header */}
      <header className="panchal-gradient shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push(`/village/${villageId}`)}
                variant="outline"
                className="border-panchal-orange-300 text-white hover:bg-panchal-orange-400 bg-panchal-orange-500/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hindi-text">वापस</span>
              </Button>
              <Image src="/images/main-logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white hindi-text">परिवार संपादित करें</h1>
                <p className="text-panchal-orange-100 text-sm">
                  परिवार ID: {familyData.parivarId} • {familyData.memberCount} सदस्य
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                className={
                  familyData.verificationStatus === "Verified"
                    ? "bg-success-500"
                    : familyData.verificationStatus === "Pending"
                      ? "bg-warning-500"
                      : "bg-gray-500"
                }
              >
                {familyData.verificationStatus}
              </Badge>
              <Button onClick={handleSave} disabled={saving} className="bg-success-500 hover:bg-success-600 text-white">
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="hindi-text">सेव हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    <span className="hindi-text">सेव करें</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Error Alerts */}
        {Object.keys(errors).length > 0 && (
          <Alert className="mb-6 border-error-200 bg-error-50">
            <AlertCircle className="h-4 w-4 text-error-600" />
            <AlertDescription className="text-error-800">
              <div className="font-semibold mb-2 hindi-text">कृपया निम्नलिखित त्रुटियों को ठीक करें:</div>
              <ul className="list-disc list-inside space-y-1">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Family Basic Information */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center hindi-text">
                <Home className="w-5 h-5 mr-2" />
                परिवार की मूलभूत जानकारी
              </CardTitle>
              <CardDescription className="hindi-text">परिवार स्तर की बुनियादी जानकारी संपादित करें</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="hindi-text">परिवार ID *</Label>
                  <Input
                    value={familyData.parivarId}
                    onChange={(e) => updateFamilyField("parivarId", e.target.value)}
                    placeholder="PID001"
                    className={errors.parivarId ? "border-error-300" : ""}
                  />
                </div>
                <div>
                  <Label className="hindi-text">परिवार मुखिया का नाम *</Label>
                  <Input
                    value={familyData.familyHead}
                    onChange={(e) => updateFamilyField("familyHead", e.target.value)}
                    placeholder="राम पंचाल"
                    className={errors.familyHead ? "border-error-300" : ""}
                  />
                </div>
                <div>
                  <Label className="hindi-text">मोबाइल नंबर *</Label>
                  <Input
                    value={familyData.mobile}
                    onChange={(e) => updateFamilyField("mobile", e.target.value)}
                    placeholder="9876543210"
                    className={errors.mobile ? "border-error-300" : ""}
                  />
                </div>
                <div>
                  <Label className="hindi-text">ईमेल</Label>
                  <Input
                    type="email"
                    value={familyData.email}
                    onChange={(e) => updateFamilyField("email", e.target.value)}
                    placeholder="ram.panchal@example.com"
                  />
                </div>
                <div>
                  <Label className="hindi-text">पिन कोड</Label>
                  <Input
                    value={familyData.pinCode}
                    onChange={(e) => updateFamilyField("pinCode", e.target.value)}
                    placeholder="313001"
                  />
                </div>
                <div>
                  <Label className="hindi-text">सत्यापन स्थिति</Label>
                  <Select
                    value={familyData.verificationStatus}
                    onValueChange={(value: "Verified" | "Pending" | "Draft") =>
                      updateFamilyField("verificationStatus", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">ड्राफ्ट</SelectItem>
                      <SelectItem value="Pending">लंबित</SelectItem>
                      <SelectItem value="Verified">सत्यापित</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="hindi-text">आर्थिक स्थिति</Label>
                  <Select
                    value={familyData.economicStatus}
                    onValueChange={(value) => updateFamilyField("economicStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BPL">गरीबी रेखा से नीचे (BPL)</SelectItem>
                      <SelectItem value="APL">गरीबी रेखा से ऊपर (APL)</SelectItem>
                      <SelectItem value="Middle">मध्यम वर्गीय</SelectItem>
                      <SelectItem value="Upper">उच्च वर्गीय</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="hindi-text">घर का स्वामित्व</Label>
                  <Select
                    value={familyData.houseOwnership}
                    onValueChange={(value) => updateFamilyField("houseOwnership", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Own">स्वयं का</SelectItem>
                      <SelectItem value="Rented">किराए का</SelectItem>
                      <SelectItem value="Family">पारिवारिक</SelectItem>
                      <SelectItem value="Other">अन्य</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="hindi-text">कुल वार्षिक आय</Label>
                  <Input
                    value={familyData.totalIncome}
                    onChange={(e) => updateFamilyField("totalIncome", e.target.value)}
                    placeholder="600000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="hindi-text">वर्तमान पता</Label>
                  <Textarea
                    value={familyData.address}
                    onChange={(e) => updateFamilyField("address", e.target.value)}
                    placeholder="वर्तमान पूरा पता"
                    className="min-h-20"
                  />
                </div>
                <div>
                  <Label className="hindi-text">स्थायी पता</Label>
                  <Textarea
                    value={familyData.permanentAddress}
                    onChange={(e) => updateFamilyField("permanentAddress", e.target.value)}
                    placeholder="स्थायी पूरा पता"
                    className="min-h-20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="familyCard"
                    checked={familyData.familyCardIssued}
                    onCheckedChange={(checked) => updateFamilyField("familyCardIssued", checked)}
                  />
                  <Label htmlFor="familyCard" className="hindi-text">
                    पारिवारिक कार्ड जारी
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="electricity"
                    checked={familyData.electricityConnection}
                    onCheckedChange={(checked) => updateFamilyField("electricityConnection", checked)}
                  />
                  <Label htmlFor="electricity" className="hindi-text">
                    बिजली कनेक्शन
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="water"
                    checked={familyData.waterConnection}
                    onCheckedChange={(checked) => updateFamilyField("waterConnection", checked)}
                  />
                  <Label htmlFor="water" className="hindi-text">
                    पानी कनेक्शन
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gas"
                    checked={familyData.gasConnection}
                    onCheckedChange={(checked) => updateFamilyField("gasConnection", checked)}
                  />
                  <Label htmlFor="gas" className="hindi-text">
                    गैस कनेक्शन
                  </Label>
                </div>
              </div>

              <div>
                <Label className="hindi-text">विशेष टिप्पणी</Label>
                <Textarea
                  value={familyData.specialNotes}
                  onChange={(e) => updateFamilyField("specialNotes", e.target.value)}
                  placeholder="परिवार के बारे में कोई विशेष जानकारी"
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Family Members */}
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center hindi-text">
                    <Users className="w-5 h-5 mr-2" />
                    परिवार के सदस्य ({familyData.members.length})
                  </CardTitle>
                  <CardDescription className="hindi-text">प्रत्येक सदस्य की विस्तृत जानकारी संपादित करें</CardDescription>
                </div>
                <Button onClick={addMember} className="panchal-gradient text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hindi-text">सदस्य जोड़ें</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion
                type="multiple"
                value={activeAccordion}
                onValueChange={setActiveAccordion}
                className="space-y-4"
              >
                {familyData.members.map((member, memberIndex) => (
                  <AccordionItem key={member.id} value={member.id} className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{member.fullName || `सदस्य ${memberIndex + 1}`}</span>
                            {member.isMukhiya && (
                              <Badge className="bg-panchal-orange-100 text-panchal-orange-700">मुखिया</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.relation && <Badge variant="outline">{member.relation}</Badge>}
                          {member.gender && (
                            <Badge variant="outline">
                              {member.gender === "Male" ? "पुरुष" : member.gender === "Female" ? "महिला" : "अन्य"}
                            </Badge>
                          )}
                          {familyData.members.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowDeleteConfirm(member.id)
                              }}
                              className="text-error-600 hover:text-error-700 hover:bg-error-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <MemberForm
                        member={member}
                        memberIndex={memberIndex}
                        updateMember={updateMember}
                        errors={errors}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="hindi-text">सदस्य हटाएं</DialogTitle>
            <DialogDescription className="hindi-text">
              क्या आप वाकई इस सदस्य को हटाना चाहते हैं? यह कार्य वापस नहीं किया जा सकता।
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="bg-transparent">
              <span className="hindi-text">रद्द करें</span>
            </Button>
            <Button
              onClick={() => showDeleteConfirm && deleteMember(showDeleteConfirm)}
              className="bg-error-500 hover:bg-error-600 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="hindi-text">हटाएं</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Member Form Component
function MemberForm({
  member,
  memberIndex,
  updateMember,
  errors,
}: {
  member: Member
  memberIndex: number
  updateMember: (memberId: string, field: keyof Member, value: any) => void
  errors: Record<string, string>
}) {
  return (
    <Accordion type="multiple" defaultValue={["basic"]} className="w-full">
      {/* Basic Information */}
      <AccordionItem value="basic">
        <AccordionTrigger className="hindi-text">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            मूलभूत जानकारी
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="hindi-text">पूरा नाम *</Label>
              <Input
                value={member.fullName}
                onChange={(e) => updateMember(member.id, "fullName", e.target.value)}
                placeholder="पूरा नाम दर्ज करें"
                className={errors[`member-${memberIndex}-name`] ? "border-error-300" : ""}
              />
            </div>
            <div>
              <Label className="hindi-text">रिश्ता</Label>
              <Select value={member.relation} onValueChange={(value) => updateMember(member.id, "relation", value)}>
                <SelectTrigger>
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
              <Label className="hindi-text">जन्म तिथि</Label>
              <Input
                type="date"
                value={member.dateOfBirth}
                onChange={(e) => updateMember(member.id, "dateOfBirth", e.target.value)}
              />
            </div>
            <div>
              <Label className="hindi-text">लिंग</Label>
              <Select value={member.gender} onValueChange={(value) => updateMember(member.id, "gender", value)}>
                <SelectTrigger>
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
                value={member.aadhaar}
                onChange={(e) => updateMember(member.id, "aadhaar", e.target.value)}
                placeholder="123456789012"
                maxLength={12}
              />
            </div>
            <div>
              <Label className="hindi-text">वैवाहिक स्थिति</Label>
              <Select
                value={member.maritalStatus}
                onValueChange={(value) => updateMember(member.id, "maritalStatus", value)}
              >
                <SelectTrigger>
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
                value={member.memberMobile}
                onChange={(e) => updateMember(member.id, "memberMobile", e.target.value)}
                placeholder="9876543210"
              />
            </div>
            <div>
              <Label className="hindi-text">ईमेल</Label>
              <Input
                type="email"
                value={member.memberEmail}
                onChange={(e) => updateMember(member.id, "memberEmail", e.target.value)}
                placeholder="ram@example.com"
              />
            </div>
            <div>
              <Label className="hindi-text">रक्त समूह</Label>
              <Select value={member.bloodGroup} onValueChange={(value) => updateMember(member.id, "bloodGroup", value)}>
                <SelectTrigger>
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
              id={`isMukhiya-${member.id}`}
              checked={member.isMukhiya}
              onCheckedChange={(checked) => updateMember(member.id, "isMukhiya", checked)}
            />
            <Label htmlFor={`isMukhiya-${member.id}`} className="hindi-text font-medium text-panchal-orange-700">
              परिवार का मुखिया है
            </Label>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Education Information */}
      <AccordionItem value="education">
        <AccordionTrigger className="hindi-text">
          <div className="flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" />
            शिक्षा की जानकारी
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="hindi-text">शैक्षणिक योग्यता</Label>
              <Select
                value={member.qualification}
                onValueChange={(value) => updateMember(member.id, "qualification", value)}
              >
                <SelectTrigger>
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
                value={member.educationStream}
                onChange={(e) => updateMember(member.id, "educationStream", e.target.value)}
                placeholder="कॉमर्स, साइंस, आर्ट्स"
              />
            </div>
            <div>
              <Label className="hindi-text">संस्थान का नाम</Label>
              <Input
                value={member.institutionName}
                onChange={(e) => updateMember(member.id, "institutionName", e.target.value)}
                placeholder="स्कूल/कॉलेज का नाम"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`currentlyStudying-${member.id}`}
              checked={member.currentlyStudying}
              onCheckedChange={(checked) => updateMember(member.id, "currentlyStudying", checked)}
            />
            <Label htmlFor={`currentlyStudying-${member.id}`} className="hindi-text">
              वर्तमान में पढ़ाई कर रहे हैं
            </Label>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Employment Information */}
      <AccordionItem value="employment">
        <AccordionTrigger className="hindi-text">
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2" />
            रोजगार की जानकारी
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="hindi-text">व्यवसाय</Label>
              <Input
                value={member.occupation}
                onChange={(e) => updateMember(member.id, "occupation", e.target.value)}
                placeholder="किसान, व्यापारी, नौकरी"
              />
            </div>
            <div>
              <Label className="hindi-text">नियोक्ता का नाम</Label>
              <Input
                value={member.employerName}
                onChange={(e) => updateMember(member.id, "employerName", e.target.value)}
                placeholder="कंपनी/संस्थान का नाम"
              />
            </div>
            <div>
              <Label className="hindi-text">कार्य स्थल</Label>
              <Input
                value={member.workLocation}
                onChange={(e) => updateMember(member.id, "workLocation", e.target.value)}
                placeholder="कार्य करने का स्थान"
              />
            </div>
            <div>
              <Label className="hindi-text">मासिक आय</Label>
              <Input
                value={member.monthlyIncome}
                onChange={(e) => updateMember(member.id, "monthlyIncome", e.target.value)}
                placeholder="50000"
              />
            </div>
            <div>
              <Label className="hindi-text">वार्षिक आय</Label>
              <Input
                value={member.annualIncome}
                onChange={(e) => updateMember(member.id, "annualIncome", e.target.value)}
                placeholder="600000"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`isMigrant-${member.id}`}
              checked={member.isMigrant}
              onCheckedChange={(checked) => updateMember(member.id, "isMigrant", checked)}
            />
            <Label htmlFor={`isMigrant-${member.id}`} className="hindi-text">
              प्रवासी मजदूर हैं
            </Label>
          </div>
          {member.isMigrant && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="hindi-text">वर्तमान राज्य</Label>
                <Input
                  value={member.currentState}
                  onChange={(e) => updateMember(member.id, "currentState", e.target.value)}
                  placeholder="महाराष्ट्र"
                />
              </div>
              <div>
                <Label className="hindi-text">वर्तमान जिला</Label>
                <Input
                  value={member.currentDistrict}
                  onChange={(e) => updateMember(member.id, "currentDistrict", e.target.value)}
                  placeholder="मुंबई"
                />
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Health Information */}
      <AccordionItem value="health">
        <AccordionTrigger className="hindi-text">
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-2" />
            स्वास्थ्य की जानकारी
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="hindi-text">स्वास्थ्य स्थिति</Label>
              <Select
                value={member.healthStatus}
                onValueChange={(value) => updateMember(member.id, "healthStatus", value)}
              >
                <SelectTrigger>
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
                value={member.height}
                onChange={(e) => updateMember(member.id, "height", e.target.value)}
                placeholder="175"
              />
            </div>
            <div>
              <Label className="hindi-text">वजन (किग्रा)</Label>
              <Input
                value={member.weight}
                onChange={(e) => updateMember(member.id, "weight", e.target.value)}
                placeholder="70"
              />
            </div>
            <div>
              <Label className="hindi-text">पुरानी बीमारियां</Label>
              <Input
                value={member.chronicDiseases}
                onChange={(e) => updateMember(member.id, "chronicDiseases", e.target.value)}
                placeholder="डायबिटीज, हाई BP"
              />
            </div>
            <div>
              <Label className="hindi-text">अंतिम स्वास्थ्य जांच</Label>
              <Input
                type="date"
                value={member.lastHealthCheckup}
                onChange={(e) => updateMember(member.id, "lastHealthCheckup", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`hasHealthInsurance-${member.id}`}
                checked={member.hasHealthInsurance}
                onCheckedChange={(checked) => updateMember(member.id, "hasHealthInsurance", checked)}
              />
              <Label htmlFor={`hasHealthInsurance-${member.id}`} className="hindi-text">
                स्वास्थ्य बीमा
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`hasLifeInsurance-${member.id}`}
                checked={member.hasLifeInsurance}
                onCheckedChange={(checked) => updateMember(member.id, "hasLifeInsurance", checked)}
              />
              <Label htmlFor={`hasLifeInsurance-${member.id}`} className="hindi-text">
                जीवन बीमा
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`covidVaccinated-${member.id}`}
                checked={member.covidVaccinated}
                onCheckedChange={(checked) => updateMember(member.id, "covidVaccinated", checked)}
              />
              <Label htmlFor={`covidVaccinated-${member.id}`} className="hindi-text">
                कोविड टीकाकरण
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`ayushmanBharat-${member.id}`}
                checked={member.ayushmanBharat}
                onCheckedChange={(checked) => updateMember(member.id, "ayushmanBharat", checked)}
              />
              <Label htmlFor={`ayushmanBharat-${member.id}`} className="hindi-text">
                आयुष्मान भारत
              </Label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Documents */}
      <AccordionItem value="documents">
        <AccordionTrigger className="hindi-text">
          <div className="flex items-center">
            <Smartphone className="w-4 h-4 mr-2" />
            दस्तावेज और डिजिटल पहुंच
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="hindi-text">बैंक खाता नंबर</Label>
              <Input
                value={member.bankAccount}
                onChange={(e) => updateMember(member.id, "bankAccount", e.target.value)}
                placeholder="1234567890"
              />
            </div>
            <div>
              <Label className="hindi-text">पैन कार्ड</Label>
              <Input
                value={member.panCard}
                onChange={(e) => updateMember(member.id, "panCard", e.target.value)}
                placeholder="ABCDE1234F"
              />
            </div>
            <div>
              <Label className="hindi-text">वोटर ID</Label>
              <Input
                value={member.voterCard}
                onChange={(e) => updateMember(member.id, "voterCard", e.target.value)}
                placeholder="XYZ1234567"
              />
            </div>
            <div>
              <Label className="hindi-text">ड्राइविंग लाइसेंस</Label>
              <Input
                value={member.drivingLicense}
                onChange={(e) => updateMember(member.id, "drivingLicense", e.target.value)}
                placeholder="DL1234567890"
              />
            </div>
            <div>
              <Label className="hindi-text">पासपोर्ट</Label>
              <Input
                value={member.passport}
                onChange={(e) => updateMember(member.id, "passport", e.target.value)}
                placeholder="A1234567"
              />
            </div>
            <div>
              <Label className="hindi-text">राशन कार्ड</Label>
              <Input
                value={member.rationCard}
                onChange={(e) => updateMember(member.id, "rationCard", e.target.value)}
                placeholder="RC1234567890"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`smartphoneUser-${member.id}`}
                checked={member.smartphoneUser}
                onCheckedChange={(checked) => updateMember(member.id, "smartphoneUser", checked)}
              />
              <Label htmlFor={`smartphoneUser-${member.id}`} className="hindi-text">
                स्मार्टफोन उपयोगकर्ता
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`internetUsage-${member.id}`}
                checked={member.internetUsage}
                onCheckedChange={(checked) => updateMember(member.id, "internetUsage", checked)}
              />
              <Label htmlFor={`internetUsage-${member.id}`} className="hindi-text">
                इंटरनेट का उपयोग
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`computerKnowledge-${member.id}`}
                checked={member.computerKnowledge}
                onCheckedChange={(checked) => updateMember(member.id, "computerKnowledge", checked)}
              />
              <Label htmlFor={`computerKnowledge-${member.id}`} className="hindi-text">
                कंप्यूटर ज्ञान
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`janDhanAccount-${member.id}`}
                checked={member.janDhanAccount}
                onCheckedChange={(checked) => updateMember(member.id, "janDhanAccount", checked)}
              />
              <Label htmlFor={`janDhanAccount-${member.id}`} className="hindi-text">
                जन धन खाता
              </Label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

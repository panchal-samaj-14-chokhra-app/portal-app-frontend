"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Users, Edit, Download, Phone, Mail, MapPin, Calendar, User, FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Badge } from "@/components/ui/badge/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs"
import { Separator } from "@/components/ui/separator/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog"

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
  villageId: string
  villageName: string
}

// Mock data - in real app this would come from API
const mockFamilyData: Record<string, Family> = {
  PID001: {
    id: "f1",
    parivarId: "PID001",
    familyHead: "राम पंचाल",
    memberCount: 5,
    address: "मुख्य सड़क, गांव 1, उदयपुर, राजस्थान",
    mobile: "9876543210",
    email: "ram.panchal@example.com",
    pinCode: "313001",
    familyCardIssued: true,
    verificationStatus: "Verified",
    registrationDate: "2024-01-15",
    lastUpdated: "2025-01-05",
    villageId: "v1",
    villageName: "गांव 1",
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
        institutionName: "राजस्थान विश्वविद्यालय",
        educationStream: "Commerce",
        occupation: "Farmer",
        employerName: "स्वरोजगार",
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
        skills: "Farming, Leadership, Traditional Crafts",
        hobbies: "Reading, Gardening, Community Service",
        languages: "Hindi, Gujarati, English",
        facebook: "",
        whatsapp: "9876543210",
        instagram: "",
        emergencyContact: "9876543211",
        emergencyRelation: "Brother",
        birthPlace: "गांव 1, उदयपुर",
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
        relation: "Spouse",
        isMukhiya: false,
        dateOfBirth: "1982-05-15",
        gender: "Female",
        aadhaar: "123456789013",
        maritalStatus: "Married",
        qualification: "Higher Secondary",
        currentlyStudying: false,
        institutionName: "गवर्नमेंट हाई स्कूल",
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
        memberMobile: "9876543220",
        memberEmail: "sita.panchal@example.com",
        bloodGroup: "B+",
        height: "160",
        weight: "55",
        chronicDiseases: "",
        disabilities: "",
        bankAccount: "1234567891",
        panCard: "ABCDE1234G",
        voterCard: "XYZ1234568",
        drivingLicense: "",
        passport: "",
        rationCard: "RC1234567890",
        skills: "Cooking, Tailoring, Handicrafts",
        hobbies: "Singing, Cooking, Gardening",
        languages: "Hindi, Gujarati",
        facebook: "",
        whatsapp: "9876543220",
        instagram: "",
        emergencyContact: "9876543210",
        emergencyRelation: "Husband",
        birthPlace: "गांव 2, उदयपुर",
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
        communityRole: "Women's Group Leader",
        volunteerWork: "Anganwadi Support",
        donations: "Festival Donations - 5000",
      },
      {
        id: "m3",
        fullName: "अमित पंचाल",
        relation: "Son",
        isMukhiya: false,
        dateOfBirth: "2006-08-20",
        gender: "Male",
        aadhaar: "123456789014",
        maritalStatus: "Single",
        qualification: "Higher Secondary",
        currentlyStudying: true,
        institutionName: "गवर्नमेंट कॉलेज उदयपुर",
        educationStream: "Science",
        occupation: "Student",
        employerName: "",
        workLocation: "",
        monthlyIncome: "0",
        isMigrant: false,
        currentState: "",
        currentDistrict: "",
        healthStatus: "Healthy",
        hasHealthInsurance: true,
        hasLifeInsurance: false,
        hasAccidentInsurance: false,
        hasGovtSchemes: false,
        memberMobile: "9876543230",
        memberEmail: "amit.panchal@example.com",
        bloodGroup: "A+",
        height: "170",
        weight: "60",
        chronicDiseases: "",
        disabilities: "",
        bankAccount: "1234567892",
        panCard: "",
        voterCard: "",
        drivingLicense: "",
        passport: "",
        rationCard: "RC1234567890",
        skills: "Computer, English, Sports",
        hobbies: "Cricket, Reading, Gaming",
        languages: "Hindi, English, Gujarati",
        facebook: "amit.panchal",
        whatsapp: "9876543230",
        instagram: "amit_panchal",
        emergencyContact: "9876543210",
        emergencyRelation: "Father",
        birthPlace: "गांव 1, उदयपुर",
        motherTongue: "Gujarati",
        religion: "Hindu",
        caste: "Panchal",
        subCaste: "Lohar",
        gotra: "Vishwakarma",
        marriageDate: "",
        spouseName: "",
        childrenCount: "0",
        landOwnership: false,
        landArea: "",
        houseType: "Pucca",
        vehicleOwnership: "Bicycle",
        annualIncome: "0",
        savingsAccount: "Yes",
        loanDetails: "",
        pmKisan: false,
        ayushmanBharat: true,
        ujjwalaYojana: false,
        janDhanAccount: false,
        computerKnowledge: true,
        internetUsage: true,
        smartphoneUser: true,
        migrationReason: "",
        migrationDuration: "",
        remittanceAmount: "",
        lastHealthCheckup: "2024-10-01",
        vaccinationStatus: "Complete",
        covidVaccinated: true,
        communityRole: "Youth Group Member",
        volunteerWork: "Digital Literacy Support",
        donations: "",
      },
    ],
  },
}

export default function FamilyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const villageId = decodeURIComponent(params.villageId as string)
  const familyId = decodeURIComponent(params.familyId as string)
  const [familyData, setFamilyData] = useState<Family | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showMemberDetail, setShowMemberDetail] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = mockFamilyData[familyId]
      setFamilyData(data || null)
      setLoading(false)
    }, 1000)
  }, [familyId])

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member)
    setShowMemberDetail(true)
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
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

  if (!familyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-error-50 via-white to-error-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-error-700 hindi-text">परिवार नहीं मिला</CardTitle>
            <CardDescription className="hindi-text">आपके द्वारा खोजा गया परिवार मौजूद नहीं है।</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push(`/routes/village/${encodeURIComponent(villageId)}`)}
              className="w-full panchal-gradient text-white mobile-touch"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hindi-text">गांव डैशबोर्ड पर वापस जाएं</span>
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
              <Image src="/images/main-logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-white hindi-text">परिवार विवरण - {familyData.familyHead}</h1>
                <p className="text-panchal-orange-100 hindi-text">
                  {familyData.parivarId} • {villageId} • {familyData.memberCount} सदस्य
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push(`/routes/village/${encodeURIComponent(villageId)}`)}
                className="border-panchal-orange-300 text-white hover:bg-panchal-orange-400 bg-panchal-orange-500/20 mobile-touch"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hindi-text">गांव डैशबोर्ड</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Family Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-white to-panchal-orange-50 border-panchal-orange-200 card-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-panchal-orange-700 hindi-text">परिवार की जानकारी</CardTitle>
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
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-panchal-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">परिवार मुखिया</p>
                      <p className="font-semibold">{familyData.familyHead}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-panchal-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">परिवार ID</p>
                      <p className="font-semibold">{familyData.parivarId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-panchal-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">मोबाइल</p>
                      <p className="font-semibold">{familyData.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-panchal-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">ईमेल</p>
                      <p className="font-semibold">{familyData.email || "नहीं दिया गया"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-panchal-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">पता</p>
                      <p className="font-semibold">{familyData.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-panchal-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">पंजीकरण दिनांक</p>
                      <p className="font-semibold">{familyData.registrationDate}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 hindi-text">स्थिति</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm hindi-text">पारिवारिक कार्ड:</span>
                    <Badge className={familyData.familyCardIssued ? "bg-success-500" : "bg-warning-500"}>
                      {familyData.familyCardIssued ? "जारी" : "लंबित"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm hindi-text">सत्यापन:</span>
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
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col space-y-2">
                  <Button className="w-full panchal-gradient text-white mobile-touch">
                    <Edit className="w-4 h-4 mr-2" />
                    <span className="hindi-text">परिवार संपादित करें</span>
                  </Button>
                  <Button variant="outline" className="w-full mobile-touch bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hindi-text">परिवार रिपोर्ट डाउनलोड</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Family Members */}
          <div className="lg:col-span-2">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="hindi-text">परिवार के सदस्य ({familyData.memberCount})</CardTitle>
                <CardDescription className="hindi-text">
                  सभी सदस्यों की विस्तृत जानकारी देखने के लिए नाम पर क्लिक करें
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {familyData.members.map((member) => (
                    <Card
                      key={member.id}
                      className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-panchal-orange-300"
                      onClick={() => handleMemberClick(member)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold">{member.fullName}</h3>
                              {member.isMukhiya && (
                                <Badge variant="outline" className="border-panchal-orange-200 text-panchal-orange-600">
                                  मुखिया
                                </Badge>
                              )}
                              <Badge variant="outline" className="border-secondary-200 text-secondary-600">
                                {member.relation}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <strong className="hindi-text">उम्र:</strong> {calculateAge(member.dateOfBirth)} वर्ष
                              </div>
                              <div>
                                <strong className="hindi-text">लिंग:</strong> {member.gender}
                              </div>
                              <div>
                                <strong className="hindi-text">व्यवसाय:</strong> {member.occupation}
                              </div>
                              <div>
                                <strong className="hindi-text">शिक्षा:</strong> {member.qualification}
                              </div>
                            </div>
                            {member.memberMobile && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="w-3 h-3 text-gray-500" />
                                <span>{member.memberMobile}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={member.healthStatus === "Healthy" ? "bg-success-500" : "bg-warning-500"}>
                              {member.healthStatus}
                            </Badge>
                            <Button size="sm" variant="ghost" className="mobile-touch">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {familyData.members.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 hindi-text">कोई सदस्य नहीं मिला</h3>
                    <p className="text-gray-600 hindi-text">इस परिवार में अभी तक कोई सदस्य जोड़ा नहीं गया है</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Member Detail Dialog */}
      <Dialog open={showMemberDetail} onOpenChange={setShowMemberDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="hindi-text">{selectedMember?.fullName} - विस्तृत जानकारी</DialogTitle>
            <DialogDescription className="hindi-text">सदस्य की संपूर्ण जानकारी</DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic" className="hindi-text">
                  मूलभूत
                </TabsTrigger>
                <TabsTrigger value="education" className="hindi-text">
                  शिक्षा
                </TabsTrigger>
                <TabsTrigger value="employment" className="hindi-text">
                  रोजगार
                </TabsTrigger>
                <TabsTrigger value="health" className="hindi-text">
                  स्वास्थ्य
                </TabsTrigger>
                <TabsTrigger value="documents" className="hindi-text">
                  दस्तावेज
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard label="पूरा नाम" value={selectedMember.fullName} />
                  <InfoCard label="रिश्ता" value={selectedMember.relation} />
                  <InfoCard label="जन्म तिथि" value={selectedMember.dateOfBirth} />
                  <InfoCard label="उम्र" value={`${calculateAge(selectedMember.dateOfBirth)} वर्ष`} />
                  <InfoCard label="लिंग" value={selectedMember.gender} />
                  <InfoCard label="वैवाहिक स्थिति" value={selectedMember.maritalStatus} />
                  <InfoCard label="आधार नंबर" value={selectedMember.aadhaar} />
                  <InfoCard label="मोबाइल" value={selectedMember.memberMobile} />
                  <InfoCard label="ईमेल" value={selectedMember.memberEmail} />
                  <InfoCard label="रक्त समूह" value={selectedMember.bloodGroup} />
                  <InfoCard label="ऊंचाई" value={`${selectedMember.height} सेमी`} />
                  <InfoCard label="वजन" value={`${selectedMember.weight} किग्रा`} />
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard label="शैक्षणिक योग्यता" value={selectedMember.qualification} />
                  <InfoCard label="शिक्षा की धारा" value={selectedMember.educationStream} />
                  <InfoCard label="संस्थान का नाम" value={selectedMember.institutionName} />
                  <InfoCard label="वर्तमान में पढ़ाई" value={selectedMember.currentlyStudying ? "हां" : "नहीं"} />
                  <InfoCard label="कंप्यूटर ज्ञान" value={selectedMember.computerKnowledge ? "हां" : "नहीं"} />
                  <InfoCard label="इंटरनेट उपयोग" value={selectedMember.internetUsage ? "हां" : "नहीं"} />
                  <InfoCard label="स्मार्टफोन उपयोगकर्ता" value={selectedMember.smartphoneUser ? "हां" : "नहीं"} />
                  <InfoCard label="भाषाएं" value={selectedMember.languages} />
                  <InfoCard label="कौशल" value={selectedMember.skills} />
                  <InfoCard label="शौक" value={selectedMember.hobbies} />
                </div>
              </TabsContent>

              <TabsContent value="employment" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard label="व्यवसाय" value={selectedMember.occupation} />
                  <InfoCard label="नियोक्ता का नाम" value={selectedMember.employerName} />
                  <InfoCard label="कार्य स्थल" value={selectedMember.workLocation} />
                  <InfoCard label="मासिक आय" value={`₹${selectedMember.monthlyIncome}`} />
                  <InfoCard label="वार्षिक आय" value={`₹${selectedMember.annualIncome}`} />
                  <InfoCard label="प्रवासी मजदूर" value={selectedMember.isMigrant ? "हां" : "नहीं"} />
                  {selectedMember.isMigrant && (
                    <>
                      <InfoCard label="वर्तमान राज्य" value={selectedMember.currentState} />
                      <InfoCard label="वर्तमान जिला" value={selectedMember.currentDistrict} />
                      <InfoCard label="प्रवास का कारण" value={selectedMember.migrationReason} />
                      <InfoCard label="प्रवास की अवधि" value={selectedMember.migrationDuration} />
                      <InfoCard label="भेजी जाने वाली राशि" value={`₹${selectedMember.remittanceAmount}`} />
                    </>
                  )}
                  <InfoCard label="भूमि स्वामित्व" value={selectedMember.landOwnership ? "हां" : "नहीं"} />
                  {selectedMember.landOwnership && <InfoCard label="भूमि का क्षेत्रफल" value={selectedMember.landArea} />}
                  <InfoCard label="घर का प्रकार" value={selectedMember.houseType} />
                  <InfoCard label="वाहन स्वामित्व" value={selectedMember.vehicleOwnership} />
                </div>
              </TabsContent>

              <TabsContent value="health" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard label="स्वास्थ्य स्थिति" value={selectedMember.healthStatus} />
                  <InfoCard label="पुरानी बीमारियां" value={selectedMember.chronicDiseases || "कोई नहीं"} />
                  <InfoCard label="विकलांगता" value={selectedMember.disabilities || "कोई नहीं"} />
                  <InfoCard label="अंतिम स्वास्थ्य जांच" value={selectedMember.lastHealthCheckup} />
                  <InfoCard label="टीकाकरण स्थिति" value={selectedMember.vaccinationStatus} />
                  <InfoCard label="कोविड टीकाकरण" value={selectedMember.covidVaccinated ? "हां" : "नहीं"} />
                  <InfoCard label="स्वास्थ्य बीमा" value={selectedMember.hasHealthInsurance ? "हां" : "नहीं"} />
                  <InfoCard label="जीवन बीमा" value={selectedMember.hasLifeInsurance ? "हां" : "नहीं"} />
                  <InfoCard label="दुर्घटना बीमा" value={selectedMember.hasAccidentInsurance ? "हां" : "नहीं"} />
                  <InfoCard label="सरकारी योजनाएं" value={selectedMember.hasGovtSchemes ? "हां" : "नहीं"} />
                  <InfoCard label="आयुष्मान भारत" value={selectedMember.ayushmanBharat ? "हां" : "नहीं"} />
                  <InfoCard label="PM किसान" value={selectedMember.pmKisan ? "हां" : "नहीं"} />
                  <InfoCard label="उज्ज्वला योजना" value={selectedMember.ujjwalaYojana ? "हां" : "नहीं"} />
                  <InfoCard label="जन धन खाता" value={selectedMember.janDhanAccount ? "हां" : "नहीं"} />
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard label="बैंक खाता" value={selectedMember.bankAccount} />
                  <InfoCard label="पैन कार्ड" value={selectedMember.panCard} />
                  <InfoCard label="वोटर ID" value={selectedMember.voterCard} />
                  <InfoCard label="ड्राइविंग लाइसेंस" value={selectedMember.drivingLicense} />
                  <InfoCard label="पासपोर्ट" value={selectedMember.passport} />
                  <InfoCard label="राशन कार्ड" value={selectedMember.rationCard} />
                  <InfoCard label="आपातकालीन संपर्क" value={selectedMember.emergencyContact} />
                  <InfoCard label="आपातकालीन रिश्ता" value={selectedMember.emergencyRelation} />
                  <InfoCard label="जन्म स्थान" value={selectedMember.birthPlace} />
                  <InfoCard label="मातृभाषा" value={selectedMember.motherTongue} />
                  <InfoCard label="धर्म" value={selectedMember.religion} />
                  <InfoCard label="जाति" value={selectedMember.caste} />
                  <InfoCard label="उप-जाति" value={selectedMember.subCaste} />
                  <InfoCard label="गोत्र" value={selectedMember.gotra} />
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={() => setShowMemberDetail(false)} className="mobile-touch">
              <span className="hindi-text">बंद करें</span>
            </Button>
            <Button className="panchal-gradient text-white mobile-touch">
              <Edit className="w-4 h-4 mr-2" />
              <span className="hindi-text">संपादित करें</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

// Info Card Component
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-sm font-medium text-gray-600 hindi-text">{label}</p>
      <p className="text-sm text-gray-800 mt-1">{value || "नहीं दिया गया"}</p>
    </div>
  )
}

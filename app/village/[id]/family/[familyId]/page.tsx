"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowLeft, Edit, Download, MapPin, Calendar, User, FileText, Users, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs"
import { Separator } from "@/components/ui/separator/separator"

interface FamilyMember {
  id: string
  fullName: string
  aadhaarNumber: string
  maritalStatus: string
  religion: string
  caste: string
  hasDisability: boolean
  disabilityType: string
  bloodGroup: string
  isMukhiya: boolean
  permanentAddress: string
  currentAddress: string
  villageName: string
  pincode: string
  district: string
  state: string
  isStudent: boolean
  educationLevel: string
  enrollmentStatus: string
  dropoutReason: string
  schoolName: string
  isEmployed: boolean
  occupationType: string
  monthlyIncome: string
  incomeSource: string
  landOwned: string
  livestock: string
  houseType: string
  hasElectricity: boolean
  waterSource: string
  hasToilet: boolean
  cookingFuel: string
  hasMajorHealthIssues: boolean
  chronicDisease: string
  isVaccinated: boolean
  welfareSchemes: string[]
  hasHealthInsurance: boolean
  hasSmartphone: boolean
  hasInternet: boolean
  hasBankAccount: boolean
  hasJanDhanAccount: boolean
}

interface FamilyDetail {
  id: string
  familyId: string
  familyAddress: string
  permanentAddress: string
  economicStatus: string
  mukhiyaName: string
  totalMembers: number
  registrationDate: string
  verificationStatus: "Verified" | "Pending" | "Draft"
  members: FamilyMember[]
}

// Mock data - in real app this would come from API
const mockFamilyDetail: FamilyDetail = {
  id: "family-1",
  familyId: "PID001",
  familyAddress: "मुख्य सड़क, गांव 1, उदयपुर, राजस्थान",
  permanentAddress: "मुख्य सड़क, गांव 1, उदयपुर, राजस्थान",
  economicStatus: "APL",
  mukhiyaName: "राम पंचाल",
  totalMembers: 5,
  registrationDate: "2024-01-15",
  verificationStatus: "Verified",
  members: [
    {
      id: "member-1",
      fullName: "राम पंचाल",
      aadhaarNumber: "123456789012",
      maritalStatus: "Married",
      religion: "Hindu",
      caste: "General",
      hasDisability: false,
      disabilityType: "",
      bloodGroup: "A+",
      isMukhiya: true,
      permanentAddress: "मुख्य सड़क, गांव 1, उदयपुर, राजस्थान",
      currentAddress: "मुख्य सड़क, गांव 1, उदयपुर, राजस्थान",
      villageName: "गांव 1",
      pincode: "313001",
      district: "उदयपुर",
      state: "राजस्थान",
      isStudent: false,
      educationLevel: "Graduate",
      enrollmentStatus: "Completed",
      dropoutReason: "",
      schoolName: "राजस्थान विश्वविद्यालय",
      isEmployed: true,
      occupationType: "Farmer",
      monthlyIncome: "25000",
      incomeSource: "Farming",
      landOwned: "5",
      livestock: "2 गाय, 5 बकरी",
      houseType: "Pucca",
      hasElectricity: true,
      waterSource: "Borewell",
      hasToilet: true,
      cookingFuel: "LPG",
      hasMajorHealthIssues: false,
      chronicDisease: "",
      isVaccinated: true,
      welfareSchemes: ["PMAY", "Ration"],
      hasHealthInsurance: true,
      hasSmartphone: true,
      hasInternet: true,
      hasBankAccount: true,
      hasJanDhanAccount: false,
    },
    {
      id: "member-2",
      fullName: "सीता पंचाल",
      aadhaarNumber: "123456789013",
      maritalStatus: "Married",
      religion: "Hindu",
      caste: "General",
      hasDisability: false,
      disabilityType: "",
      bloodGroup: "B+",
      isMukhiya: false,
      permanentAddress: "मुख्य सड़क, गांव 1, उदयपुर, राजस्थान",
      currentAddress: "मुख्य सड़क, गांव 1, उदयपुर, राजस्थान",
      villageName: "गांव 1",
      pincode: "313001",
      district: "उदयपुर",
      state: "राजस्थान",
      isStudent: false,
      educationLevel: "Higher Secondary",
      enrollmentStatus: "Completed",
      dropoutReason: "",
      schoolName: "गवर्नमेंट हाई स्कूल",
      isEmployed: false,
      occupationType: "Homemaker",
      monthlyIncome: "0",
      incomeSource: "",
      landOwned: "",
      livestock: "",
      houseType: "Pucca",
      hasElectricity: true,
      waterSource: "Borewell",
      hasToilet: true,
      cookingFuel: "LPG",
      hasMajorHealthIssues: false,
      chronicDisease: "",
      isVaccinated: true,
      welfareSchemes: ["Ujjwala", "Ration"],
      hasHealthInsurance: true,
      hasSmartphone: true,
      hasInternet: false,
      hasBankAccount: true,
      hasJanDhanAccount: true,
    },
  ],
}

export default function FamilyDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.id as string
  const familyId = params.familyId as string

  const [familyDetail, setFamilyDetail] = useState<FamilyDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")

    // Simulate API call
    setTimeout(() => {
      setFamilyDetail(mockFamilyDetail)
      setLoading(false)
    }, 1000)
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

  if (!session || !familyDetail) return null

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
                  परिवार विवरण - {familyDetail.mukhiyaName}
                </h1>
                <p className="text-orange-100 text-sm">
                  {familyDetail.familyId} • {familyDetail.totalMembers} सदस्य
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => router.push(`/village/${villageId}/family/${familyId}/edit`)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Edit className="w-4 h-4 mr-2" />
                <span className="hindi-text">संपादित करें</span>
              </Button>
              <Button
                onClick={() => router.push(`/village/${villageId}`)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hindi-text">वापस</span>
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
            <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-orange-700 hindi-text">परिवार की जानकारी</CardTitle>
                  <Badge
                    className={
                      familyDetail.verificationStatus === "Verified"
                        ? "bg-green-500"
                        : familyDetail.verificationStatus === "Pending"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }
                  >
                    {familyDetail.verificationStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">परिवार मुखिया</p>
                      <p className="font-semibold">{familyDetail.mukhiyaName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">परिवार ID</p>
                      <p className="font-semibold">{familyDetail.familyId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">कुल सदस्य</p>
                      <p className="font-semibold">{familyDetail.totalMembers}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">पता</p>
                      <p className="font-semibold">{familyDetail.familyAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">पंजीकरण दिनांक</p>
                      <p className="font-semibold">{familyDetail.registrationDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">आर्थिक स्थिति</p>
                      <p className="font-semibold">{familyDetail.economicStatus}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col space-y-2">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hindi-text">परिवार रिपोर्ट डाउनलोड</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Family Members Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="hindi-text">परिवार के सदस्य ({familyDetail.totalMembers})</CardTitle>
                <CardDescription className="hindi-text">सभी सदस्यों की विस्तृत जानकारी</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {familyDetail.members.map((member) => (
                    <Card key={member.id} className="border-gray-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{member.fullName}</h3>
                            {member.isMukhiya && <Badge className="bg-orange-100 text-orange-700">मुखिया</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="personal" className="w-full">
                          <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="personal" className="hindi-text text-xs">
                              व्यक्तिगत
                            </TabsTrigger>
                            <TabsTrigger value="address" className="hindi-text text-xs">
                              पता
                            </TabsTrigger>
                            <TabsTrigger value="education" className="hindi-text text-xs">
                              शिक्षा
                            </TabsTrigger>
                            <TabsTrigger value="employment" className="hindi-text text-xs">
                              रोजगार
                            </TabsTrigger>
                            <TabsTrigger value="health" className="hindi-text text-xs">
                              स्वास्थ्य
                            </TabsTrigger>
                            <TabsTrigger value="digital" className="hindi-text text-xs">
                              डिजिटल
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="personal" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <InfoCard label="आधार नंबर" value={member.aadhaarNumber} />
                              <InfoCard label="वैवाहिक स्थिति" value={member.maritalStatus} />
                              <InfoCard label="धर्म" value={member.religion} />
                              <InfoCard label="जाति" value={member.caste} />
                              <InfoCard label="रक्त समूह" value={member.bloodGroup} />
                              <InfoCard
                                label="विकलांगता"
                                value={member.hasDisability ? `हां - ${member.disabilityType}` : "नहीं"}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="address" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <InfoCard label="स्थायी पता" value={member.permanentAddress} />
                              <InfoCard label="वर्तमान पता" value={member.currentAddress} />
                              <InfoCard label="गांव" value={member.villageName} />
                              <InfoCard label="पिन कोड" value={member.pincode} />
                              <InfoCard label="जिला" value={member.district} />
                              <InfoCard label="राज्य" value={member.state} />
                            </div>
                          </TabsContent>

                          <TabsContent value="education" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <InfoCard label="छात्र है" value={member.isStudent ? "हां" : "नहीं"} />
                              <InfoCard label="शिक्षा स्तर" value={member.educationLevel} />
                              <InfoCard label="नामांकन स्थिति" value={member.enrollmentStatus} />
                              <InfoCard label="स्कूल/कॉलेज" value={member.schoolName} />
                              {member.dropoutReason && <InfoCard label="छोड़ने का कारण" value={member.dropoutReason} />}
                            </div>
                          </TabsContent>

                          <TabsContent value="employment" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <InfoCard label="रोजगार में है" value={member.isEmployed ? "हां" : "नहीं"} />
                              <InfoCard label="व्यवसाय" value={member.occupationType} />
                              <InfoCard
                                label="मासिक आय"
                                value={member.monthlyIncome ? `₹${member.monthlyIncome}` : "नहीं दिया गया"}
                              />
                              <InfoCard label="आय का स्रोत" value={member.incomeSource} />
                              <InfoCard label="भूमि (एकड़)" value={member.landOwned || "नहीं"} />
                              <InfoCard label="पशुधन" value={member.livestock || "नहीं"} />
                            </div>
                          </TabsContent>

                          <TabsContent value="health" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <InfoCard label="स्वास्थ्य समस्या" value={member.hasMajorHealthIssues ? "हां" : "नहीं"} />
                              {member.chronicDisease && <InfoCard label="पुरानी बीमारी" value={member.chronicDisease} />}
                              <InfoCard label="टीकाकरण" value={member.isVaccinated ? "पूरा" : "अधूरा"} />
                              <InfoCard label="स्वास्थ्य बीमा" value={member.hasHealthInsurance ? "हां" : "नहीं"} />
                              <InfoCard
                                label="कल्याण योजनाएं"
                                value={member.welfareSchemes.length > 0 ? member.welfareSchemes.join(", ") : "कोई नहीं"}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="digital" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <InfoCard label="स्मार्टफोन" value={member.hasSmartphone ? "हां" : "नहीं"} />
                              <InfoCard label="इंटरनेट" value={member.hasInternet ? "हां" : "नहीं"} />
                              <InfoCard label="बैंक खाता" value={member.hasBankAccount ? "हां" : "नहीं"} />
                              <InfoCard label="जन धन खाता" value={member.hasJanDhanAccount ? "हां" : "नहीं"} />
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
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

"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
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
  UserCheck,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select"
import { Textarea } from "@/components/ui/textarea/textarea"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"
import { Badge } from "@/components/ui/badge/badge"

interface FamilyMember {
  id: string
  name: string
  aadhaarNumber: string
  age: number
  gender: "male" | "female" | "other"
  relation: string
  maritalStatus: string
  religion: string
  caste: string
  disability: boolean
  bloodGroup: string
  permanentAddress: string
  currentAddress: string
  village: string
  pincode: string
  district: string
  state: string
  isStudent: boolean
  educationLevel: string
  enrollmentStatus: string
  dropoutReason?: string
  schoolName?: string
  isEmployed: boolean
  occupation: string
  monthlyIncome: number
  incomeSource: string
  landOwned: number
  livestock: string
  houseType: string
  hasElectricity: boolean
  waterSource: string
  hasToilet: boolean
  cookingFuel: string
  hasHealthIssues: boolean
  chronicDisease?: string
  isVaccinated: boolean
  welfareSchemes: string[]
  hasHealthInsurance: boolean
  hasSmartphone: boolean
  hasInternet: boolean
  hasBankAccount: boolean
  hasJanDhan: boolean
  isMukhiya: boolean
}

interface FamilyData {
  currentAddress: string
  permanentAddress: string
  economicStatus: string
  members: FamilyMember[]
}

const initialMember: Omit<FamilyMember, "id"> = {
  name: "",
  aadhaarNumber: "",
  age: 0,
  gender: "male",
  relation: "",
  maritalStatus: "single",
  religion: "hindu",
  caste: "general",
  disability: false,
  bloodGroup: "",
  permanentAddress: "",
  currentAddress: "",
  village: "",
  pincode: "",
  district: "",
  state: "",
  isStudent: false,
  educationLevel: "",
  enrollmentStatus: "",
  schoolName: "",
  isEmployed: false,
  occupation: "",
  monthlyIncome: 0,
  incomeSource: "",
  landOwned: 0,
  livestock: "",
  houseType: "kutcha",
  hasElectricity: false,
  waterSource: "tap",
  hasToilet: false,
  cookingFuel: "firewood",
  hasHealthIssues: false,
  isVaccinated: false,
  welfareSchemes: [],
  hasHealthInsurance: false,
  hasSmartphone: false,
  hasInternet: false,
  hasBankAccount: false,
  hasJanDhan: false,
  isMukhiya: false,
}

export default function AddFamilyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.id as string

  const [familyData, setFamilyData] = useState<FamilyData>({
    currentAddress: "",
    permanentAddress: "",
    economicStatus: "bpl",
    members: [{ ...initialMember, id: "member-1", isMukhiya: true }],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

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

  const addMember = () => {
    const newMember: FamilyMember = {
      ...initialMember,
      id: `member-${Date.now()}`,
      isMukhiya: false,
    }
    setFamilyData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }))
  }

  const removeMember = (memberId: string) => {
    if (familyData.members.length <= 1) {
      alert("कम से कम एक सदस्य होना आवश्यक है")
      return
    }

    const memberToRemove = familyData.members.find((m) => m.id === memberId)
    if (memberToRemove?.isMukhiya) {
      alert("मुखिया को हटाया नहीं जा सकता। पहले किसी और को मुखिया बनाएं।")
      return
    }

    setFamilyData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }))
  }

  const updateMember = (memberId: string, field: keyof FamilyMember, value: any) => {
    setFamilyData((prev) => ({
      ...prev,
      members: prev.members.map((member) => {
        if (member.id === memberId) {
          // If setting someone as Mukhiya, remove Mukhiya status from others
          if (field === "isMukhiya" && value === true) {
            const updatedMembers = prev.members.map((m) => ({ ...m, isMukhiya: false }))
            return { ...updatedMembers.find((m) => m.id === memberId)!, [field]: value }
          }
          return { ...member, [field]: value }
        }
        return member
      }),
    }))
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
    const aadhaarNumbers = familyData.members.map((m) => m.aadhaarNumber).filter(Boolean)
    const duplicateAadhaar = aadhaarNumbers.find((num, index) => aadhaarNumbers.indexOf(num) !== index)
    if (duplicateAadhaar) {
      newErrors.aadhaar = `आधार नंबर ${duplicateAadhaar} डुप्लिकेट है`
    }

    // Check required fields for each member
    familyData.members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`member-${index}-name`] = "नाम आवश्यक है"
      }
      if (!member.aadhaarNumber.trim()) {
        newErrors[`member-${index}-aadhaar`] = "आधार नंबर आवश्यक है"
      }
      if (member.age <= 0) {
        newErrors[`member-${index}-age`] = "वैध उम्र दर्ज करें"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("कृपया सभी त्रुटियों को ठीक करें")
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("परिवार सफलतापूर्वक पंजीकृत हो गया!")
      router.push(`/village/${villageId}`)
    } catch (error) {
      alert("पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setLoading(false)
    }
  }

  const mukhiyaCount = familyData.members.filter((m) => m.isMukhiya).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push(`/village/${villageId}`)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस
              </Button>
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={50}
                height={50}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">नया परिवार जोड़ें</h1>
                <p className="text-orange-100 text-sm">परिवार पंजीकरण फॉर्म</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Error Alerts */}
        {(errors.mukhiya || errors.aadhaar) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errors.mukhiya && <div>{errors.mukhiya}</div>}
              {errors.aadhaar && <div>{errors.aadhaar}</div>}
            </AlertDescription>
          </Alert>
        )}

        {/* Family Level Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="w-5 h-5 mr-2" />
              परिवार की जानकारी
            </CardTitle>
            <CardDescription>परिवार स्तर की बुनियादी जानकारी</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAddress">वर्तमान पता *</Label>
                <Textarea
                  id="currentAddress"
                  value={familyData.currentAddress}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, currentAddress: e.target.value }))}
                  placeholder="वर्तमान पता दर्ज करें"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="permanentAddress">स्थायी पता *</Label>
                <Textarea
                  id="permanentAddress"
                  value={familyData.permanentAddress}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, permanentAddress: e.target.value }))}
                  placeholder="स्थायी पता दर्ज करें"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="economicStatus">आर्थिक स्थिति</Label>
              <Select
                value={familyData.economicStatus}
                onValueChange={(value) => setFamilyData((prev) => ({ ...prev, economicStatus: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="आर्थिक स्थिति चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bpl">गरीबी रेखा से नीचे (BPL)</SelectItem>
                  <SelectItem value="apl">गरीबी रेखा से ऊपर (APL)</SelectItem>
                  <SelectItem value="middle">मध्यम वर्गीय</SelectItem>
                  <SelectItem value="upper">उच्च वर्गीय</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Members Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  परिवार के सदस्य ({familyData.members.length})
                </CardTitle>
                <CardDescription>
                  सभी परिवारिक सदस्यों की विस्तृत जानकारी
                  {mukhiyaCount === 1 && (
                    <Badge className="ml-2 bg-green-100 text-green-700">
                      <UserCheck className="w-3 h-3 mr-1" />
                      मुखिया चुना गया
                    </Badge>
                  )}
                </CardDescription>
              </div>
              <Button onClick={addMember} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                सदस्य जोड़ें
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-4">
              {familyData.members.map((member, index) => (
                <AccordionItem key={member.id} value={member.id} className="border rounded-lg">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{member.name || `सदस्य ${index + 1}`}</span>
                          {member.isMukhiya && (
                            <Badge className="bg-orange-100 text-orange-700">
                              <UserCheck className="w-3 h-3 mr-1" />
                              मुखिया
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.age > 0 && <Badge variant="outline">{member.age} वर्ष</Badge>}
                        {member.gender && (
                          <Badge variant="outline">
                            {member.gender === "male" ? "पुरुष" : member.gender === "female" ? "महिला" : "अन्य"}
                          </Badge>
                        )}
                        {familyData.members.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeMember(member.id)
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          व्यक्तिगत जानकारी
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>पूरा नाम *</Label>
                            <Input
                              value={member.name}
                              onChange={(e) => updateMember(member.id, "name", e.target.value)}
                              placeholder="पूरा नाम दर्ज करें"
                              className={errors[`member-${index}-name`] ? "border-red-500" : ""}
                            />
                            {errors[`member-${index}-name`] && (
                              <p className="text-red-500 text-sm mt-1">{errors[`member-${index}-name`]}</p>
                            )}
                          </div>
                          <div>
                            <Label>आधार नंबर *</Label>
                            <Input
                              value={member.aadhaarNumber}
                              onChange={(e) => updateMember(member.id, "aadhaarNumber", e.target.value)}
                              placeholder="12 अंकों का आधार नंबर"
                              maxLength={12}
                              className={errors[`member-${index}-aadhaar`] ? "border-red-500" : ""}
                            />
                            {errors[`member-${index}-aadhaar`] && (
                              <p className="text-red-500 text-sm mt-1">{errors[`member-${index}-aadhaar`]}</p>
                            )}
                          </div>
                          <div>
                            <Label>उम्र *</Label>
                            <Input
                              type="number"
                              value={member.age || ""}
                              onChange={(e) => updateMember(member.id, "age", Number.parseInt(e.target.value) || 0)}
                              placeholder="उम्र दर्ज करें"
                              min="0"
                              max="120"
                              className={errors[`member-${index}-age`] ? "border-red-500" : ""}
                            />
                            {errors[`member-${index}-age`] && (
                              <p className="text-red-500 text-sm mt-1">{errors[`member-${index}-age`]}</p>
                            )}
                          </div>
                          <div>
                            <Label>लिंग</Label>
                            <Select
                              value={member.gender}
                              onValueChange={(value) => updateMember(member.id, "gender", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">पुरुष</SelectItem>
                                <SelectItem value="female">महिला</SelectItem>
                                <SelectItem value="other">अन्य</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>रिश्ता</Label>
                            <Input
                              value={member.relation}
                              onChange={(e) => updateMember(member.id, "relation", e.target.value)}
                              placeholder="मुखिया से रिश्ता"
                            />
                          </div>
                          <div>
                            <Label>वैवाहिक स्थिति</Label>
                            <Select
                              value={member.maritalStatus}
                              onValueChange={(value) => updateMember(member.id, "maritalStatus", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">अविवाहित</SelectItem>
                                <SelectItem value="married">विवाहित</SelectItem>
                                <SelectItem value="widowed">विधवा/विधुर</SelectItem>
                                <SelectItem value="divorced">तलाकशुदा</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>धर्म</Label>
                            <Select
                              value={member.religion}
                              onValueChange={(value) => updateMember(member.id, "religion", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hindu">हिंदू</SelectItem>
                                <SelectItem value="muslim">मुस्लिम</SelectItem>
                                <SelectItem value="christian">ईसाई</SelectItem>
                                <SelectItem value="sikh">सिख</SelectItem>
                                <SelectItem value="buddhist">बौद्ध</SelectItem>
                                <SelectItem value="jain">जैन</SelectItem>
                                <SelectItem value="other">अन्य</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>जाति</Label>
                            <Select
                              value={member.caste}
                              onValueChange={(value) => updateMember(member.id, "caste", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">सामान्य</SelectItem>
                                <SelectItem value="sc">अनुसूचित जाति (SC)</SelectItem>
                                <SelectItem value="st">अनुसूचित जनजाति (ST)</SelectItem>
                                <SelectItem value="obc">अन्य पिछड़ा वर्ग (OBC)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>ब्लड ग्रुप</Label>
                            <Select
                              value={member.bloodGroup}
                              onValueChange={(value) => updateMember(member.id, "bloodGroup", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="ब्लड ग्रुप चुनें" />
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
                        <div className="mt-4 flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`disability-${member.id}`}
                              checked={member.disability}
                              onCheckedChange={(checked) => updateMember(member.id, "disability", checked)}
                            />
                            <Label htmlFor={`disability-${member.id}`}>विकलांगता है</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`mukhiya-${member.id}`}
                              checked={member.isMukhiya}
                              onCheckedChange={(checked) => updateMember(member.id, "isMukhiya", checked)}
                            />
                            <Label htmlFor={`mukhiya-${member.id}`} className="font-medium text-orange-700">
                              मुखिया है
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <Home className="w-4 h-4 mr-2" />
                          पता की जानकारी
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>स्थायी पता</Label>
                            <Textarea
                              value={member.permanentAddress}
                              onChange={(e) => updateMember(member.id, "permanentAddress", e.target.value)}
                              placeholder="स्थायी पता दर्ज करें"
                            />
                          </div>
                          <div>
                            <Label>वर्तमान पता</Label>
                            <Textarea
                              value={member.currentAddress}
                              onChange={(e) => updateMember(member.id, "currentAddress", e.target.value)}
                              placeholder="वर्तमान पता दर्ज करें"
                            />
                          </div>
                          <div>
                            <Label>गांव का नाम</Label>
                            <Input
                              value={member.village}
                              onChange={(e) => updateMember(member.id, "village", e.target.value)}
                              placeholder="गांव का नाम"
                            />
                          </div>
                          <div>
                            <Label>पिनकोड</Label>
                            <Input
                              value={member.pincode}
                              onChange={(e) => updateMember(member.id, "pincode", e.target.value)}
                              placeholder="पिनकोड"
                              maxLength={6}
                            />
                          </div>
                          <div>
                            <Label>जिला</Label>
                            <Input
                              value={member.district}
                              onChange={(e) => updateMember(member.id, "district", e.target.value)}
                              placeholder="जिला"
                            />
                          </div>
                          <div>
                            <Label>राज्य</Label>
                            <Input
                              value={member.state}
                              onChange={(e) => updateMember(member.id, "state", e.target.value)}
                              placeholder="राज्य"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Education Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          शिक्षा की जानकारी
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`student-${member.id}`}
                              checked={member.isStudent}
                              onCheckedChange={(checked) => updateMember(member.id, "isStudent", checked)}
                            />
                            <Label htmlFor={`student-${member.id}`}>छात्र/छात्रा है</Label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>शिक्षा का स्तर</Label>
                              <Select
                                value={member.educationLevel}
                                onValueChange={(value) => updateMember(member.id, "educationLevel", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="शिक्षा का स्तर चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="illiterate">निरक्षर</SelectItem>
                                  <SelectItem value="primary">प्राथमिक</SelectItem>
                                  <SelectItem value="secondary">माध्यमिक</SelectItem>
                                  <SelectItem value="higher_secondary">उच्च माध्यमिक</SelectItem>
                                  <SelectItem value="graduate">स्नातक</SelectItem>
                                  <SelectItem value="postgraduate">स्नातकोत्तर</SelectItem>
                                  <SelectItem value="professional">व्यावसायिक</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>नामांकन स्थिति</Label>
                              <Select
                                value={member.enrollmentStatus}
                                onValueChange={(value) => updateMember(member.id, "enrollmentStatus", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="नामांकन स्थिति चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="enrolled">नामांकित</SelectItem>
                                  <SelectItem value="dropped">छोड़ दिया</SelectItem>
                                  <SelectItem value="completed">पूर्ण</SelectItem>
                                  <SelectItem value="never_enrolled">कभी नामांकित नहीं</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {member.enrollmentStatus === "dropped" && (
                              <div>
                                <Label>छोड़ने का कारण</Label>
                                <Input
                                  value={member.dropoutReason || ""}
                                  onChange={(e) => updateMember(member.id, "dropoutReason", e.target.value)}
                                  placeholder="छोड़ने का कारण बताएं"
                                />
                              </div>
                            )}
                            {(member.isStudent || member.enrollmentStatus === "enrolled") && (
                              <div>
                                <Label>स्कूल/कॉलेज का नाम</Label>
                                <Input
                                  value={member.schoolName || ""}
                                  onChange={(e) => updateMember(member.id, "schoolName", e.target.value)}
                                  placeholder="संस्थान का नाम"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Employment Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          रोजगार की जानकारी
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`employed-${member.id}`}
                              checked={member.isEmployed}
                              onCheckedChange={(checked) => updateMember(member.id, "isEmployed", checked)}
                            />
                            <Label htmlFor={`employed-${member.id}`}>रोजगार में है</Label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>व्यवसाय का प्रकार</Label>
                              <Select
                                value={member.occupation}
                                onValueChange={(value) => updateMember(member.id, "occupation", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="व्यवसाय चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="farmer">किसान</SelectItem>
                                  <SelectItem value="laborer">मजदूर</SelectItem>
                                  <SelectItem value="private_job">निजी नौकरी</SelectItem>
                                  <SelectItem value="government_job">सरकारी नौकरी</SelectItem>
                                  <SelectItem value="self_employed">स्व-रोजगार</SelectItem>
                                  <SelectItem value="business">व्यापार</SelectItem>
                                  <SelectItem value="unemployed">बेरोजगार</SelectItem>
                                  <SelectItem value="student">छात्र</SelectItem>
                                  <SelectItem value="housewife">गृहिणी</SelectItem>
                                  <SelectItem value="retired">सेवानिवृत्त</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>मासिक आय (₹)</Label>
                              <Input
                                type="number"
                                value={member.monthlyIncome || ""}
                                onChange={(e) =>
                                  updateMember(member.id, "monthlyIncome", Number.parseInt(e.target.value) || 0)
                                }
                                placeholder="मासिक आय"
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>आय का मुख्य स्रोत</Label>
                              <Select
                                value={member.incomeSource}
                                onValueChange={(value) => updateMember(member.id, "incomeSource", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="आय का स्रोत चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="farming">खेती</SelectItem>
                                  <SelectItem value="business">व्यापार</SelectItem>
                                  <SelectItem value="wage_labor">मजदूरी</SelectItem>
                                  <SelectItem value="salary">वेतन</SelectItem>
                                  <SelectItem value="pension">पेंशन</SelectItem>
                                  <SelectItem value="remittance">प्रेषण</SelectItem>
                                  <SelectItem value="other">अन्य</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>भूमि स्वामित्व (एकड़)</Label>
                              <Input
                                type="number"
                                value={member.landOwned || ""}
                                onChange={(e) =>
                                  updateMember(member.id, "landOwned", Number.parseFloat(e.target.value) || 0)
                                }
                                placeholder="भूमि का क्षेत्रफल"
                                min="0"
                                step="0.1"
                              />
                            </div>
                            <div>
                              <Label>पशुधन</Label>
                              <Input
                                value={member.livestock}
                                onChange={(e) => updateMember(member.id, "livestock", e.target.value)}
                                placeholder="गाय, भैंस, बकरी आदि"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Housing Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <Home className="w-4 h-4 mr-2" />
                          आवास की जानकारी
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>घर का प्रकार</Label>
                            <Select
                              value={member.houseType}
                              onValueChange={(value) => updateMember(member.id, "houseType", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kutcha">कच्चा</SelectItem>
                                <SelectItem value="pucca">पक्का</SelectItem>
                                <SelectItem value="semi_pucca">अर्ध-पक्का</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>पानी का स्रोत</Label>
                            <Select
                              value={member.waterSource}
                              onValueChange={(value) => updateMember(member.id, "waterSource", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tap">नल</SelectItem>
                                <SelectItem value="well">कुआं</SelectItem>
                                <SelectItem value="hand_pump">हैंड पंप</SelectItem>
                                <SelectItem value="borewell">बोरवेल</SelectItem>
                                <SelectItem value="river">नदी/तालाब</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>खाना पकाने का ईंधन</Label>
                            <Select
                              value={member.cookingFuel}
                              onValueChange={(value) => updateMember(member.id, "cookingFuel", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lpg">एलपीजी</SelectItem>
                                <SelectItem value="firewood">लकड़ी</SelectItem>
                                <SelectItem value="kerosene">मिट्टी का तेल</SelectItem>
                                <SelectItem value="cow_dung">गोबर</SelectItem>
                                <SelectItem value="coal">कोयला</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`electricity-${member.id}`}
                              checked={member.hasElectricity}
                              onCheckedChange={(checked) => updateMember(member.id, "hasElectricity", checked)}
                            />
                            <Label htmlFor={`electricity-${member.id}`}>बिजली की सुविधा</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`toilet-${member.id}`}
                              checked={member.hasToilet}
                              onCheckedChange={(checked) => updateMember(member.id, "hasToilet", checked)}
                            />
                            <Label htmlFor={`toilet-${member.id}`}>शौचालय की सुविधा</Label>
                          </div>
                        </div>
                      </div>

                      {/* Health Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <Heart className="w-4 h-4 mr-2" />
                          स्वास्थ्य की जानकारी
                        </h4>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`health-issues-${member.id}`}
                                checked={member.hasHealthIssues}
                                onCheckedChange={(checked) => updateMember(member.id, "hasHealthIssues", checked)}
                              />
                              <Label htmlFor={`health-issues-${member.id}`}>स्वास्थ्य समस्या है</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`vaccinated-${member.id}`}
                                checked={member.isVaccinated}
                                onCheckedChange={(checked) => updateMember(member.id, "isVaccinated", checked)}
                              />
                              <Label htmlFor={`vaccinated-${member.id}`}>टीकाकरण हुआ है</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`health-insurance-${member.id}`}
                                checked={member.hasHealthInsurance}
                                onCheckedChange={(checked) => updateMember(member.id, "hasHealthInsurance", checked)}
                              />
                              <Label htmlFor={`health-insurance-${member.id}`}>स्वास्थ्य बीमा है</Label>
                            </div>
                          </div>
                          {member.hasHealthIssues && (
                            <div>
                              <Label>पुरानी बीमारी (यदि कोई हो)</Label>
                              <Input
                                value={member.chronicDisease || ""}
                                onChange={(e) => updateMember(member.id, "chronicDisease", e.target.value)}
                                placeholder="बीमारी का नाम"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Digital Access */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <Smartphone className="w-4 h-4 mr-2" />
                          डिजिटल पहुंच और बैंकिंग
                        </h4>
                        <div className="flex flex-wrap gap-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`smartphone-${member.id}`}
                              checked={member.hasSmartphone}
                              onCheckedChange={(checked) => updateMember(member.id, "hasSmartphone", checked)}
                            />
                            <Label htmlFor={`smartphone-${member.id}`}>स्मार्टफोन है</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`internet-${member.id}`}
                              checked={member.hasInternet}
                              onCheckedChange={(checked) => updateMember(member.id, "hasInternet", checked)}
                            />
                            <Label htmlFor={`internet-${member.id}`}>इंटरनेट की सुविधा</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`bank-account-${member.id}`}
                              checked={member.hasBankAccount}
                              onCheckedChange={(checked) => updateMember(member.id, "hasBankAccount", checked)}
                            />
                            <Label htmlFor={`bank-account-${member.id}`}>बैंक खाता है</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`jan-dhan-${member.id}`}
                              checked={member.hasJanDhan}
                              onCheckedChange={(checked) => updateMember(member.id, "hasJanDhan", checked)}
                            />
                            <Label htmlFor={`jan-dhan-${member.id}`}>जन धन योजना में नामांकित</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push(`/village/${villageId}`)} variant="outline" className="bg-transparent">
            रद्द करें
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-orange-500 hover:bg-orange-600 min-w-[200px]">
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                सहेजा जा रहा है...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                परिवार पंजीकृत करें
              </div>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}

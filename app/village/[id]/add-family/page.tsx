"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

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
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Textarea } from "@/components/ui/textarea/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion/accordion"

interface FamilyMember {
  id: string
  // Personal Information
  fullName: string
  aadhaarNumber: string
  maritalStatus: string
  religion: string
  caste: string
  hasDisability: boolean
  disabilityType: string
  bloodGroup: string
  isMukhiya: boolean

  // Address Details
  permanentAddress: string
  currentAddress: string
  villageName: string
  pincode: string
  district: string
  state: string

  // Educational Information
  isStudent: boolean
  educationLevel: string
  enrollmentStatus: string
  dropoutReason: string
  schoolName: string

  // Employment and Income
  isEmployed: boolean
  occupationType: string
  monthlyIncome: string
  incomeSource: string
  landOwned: string
  livestock: string

  // Household and Living Conditions
  houseType: string
  hasElectricity: boolean
  waterSource: string
  hasToilet: boolean
  cookingFuel: string

  // Health and Social Welfare
  hasMajorHealthIssues: boolean
  chronicDisease: string
  isVaccinated: boolean
  welfareSchemes: string[]
  hasHealthInsurance: boolean

  // Digital and Banking Access
  hasSmartphone: boolean
  hasInternet: boolean
  hasBankAccount: boolean
  hasJanDhanAccount: boolean
}

interface FamilyData {
  // Family Level Information
  familyAddress: string
  permanentAddress: string
  economicStatus: string
  members: FamilyMember[]
}

const initialMember: FamilyMember = {
  id: "",
  fullName: "",
  aadhaarNumber: "",
  maritalStatus: "",
  religion: "",
  caste: "",
  hasDisability: false,
  disabilityType: "",
  bloodGroup: "",
  isMukhiya: false,
  permanentAddress: "",
  currentAddress: "",
  villageName: "",
  pincode: "",
  district: "",
  state: "",
  isStudent: false,
  educationLevel: "",
  enrollmentStatus: "",
  dropoutReason: "",
  schoolName: "",
  isEmployed: false,
  occupationType: "",
  monthlyIncome: "",
  incomeSource: "",
  landOwned: "",
  livestock: "",
  houseType: "",
  hasElectricity: false,
  waterSource: "",
  hasToilet: false,
  cookingFuel: "",
  hasMajorHealthIssues: false,
  chronicDisease: "",
  isVaccinated: false,
  welfareSchemes: [],
  hasHealthInsurance: false,
  hasSmartphone: false,
  hasInternet: false,
  hasBankAccount: false,
  hasJanDhanAccount: false,
}

export default function AddFamilyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.id as string

  const [familyData, setFamilyData] = useState<FamilyData>({
    familyAddress: "",
    permanentAddress: "",
    economicStatus: "",
    members: [{ ...initialMember, id: "member-1" }],
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const addMember = () => {
    const newMember = { ...initialMember, id: `member-${Date.now()}` }
    setFamilyData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }))
  }

  const removeMember = (memberId: string) => {
    if (familyData.members.length > 1) {
      setFamilyData((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.id !== memberId),
      }))
    }
  }

  const updateMember = (memberId: string, field: keyof FamilyMember, value: any) => {
    setFamilyData((prev) => ({
      ...prev,
      members: prev.members.map((member) => (member.id === memberId ? { ...member, [field]: value } : member)),
    }))
  }

  const setMukhiya = (memberId: string) => {
    setFamilyData((prev) => ({
      ...prev,
      members: prev.members.map((member) => ({
        ...member,
        isMukhiya: member.id === memberId,
      })),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Check if at least one Mukhiya is selected
    const mukhiyaCount = familyData.members.filter((m) => m.isMukhiya).length
    if (mukhiyaCount === 0) {
      newErrors.mukhiya = "कम से कम एक मुखिया चुनना आवश्यक है"
    } else if (mukhiyaCount > 1) {
      newErrors.mukhiya = "केवल एक मुखिया चुना जा सकता है"
    }

    // Check for duplicate Aadhaar numbers
    const aadhaarNumbers = familyData.members.map((m) => m.aadhaarNumber).filter((a) => a.length > 0)

    const duplicateAadhaar = aadhaarNumbers.filter((item, index) => aadhaarNumbers.indexOf(item) !== index)

    if (duplicateAadhaar.length > 0) {
      newErrors.aadhaar = "आधार नंबर दोहराया नहीं जा सकता"
    }

    // Check required fields for each member
    familyData.members.forEach((member, index) => {
      if (!member.fullName) {
        newErrors[`member-${index}-name`] = "नाम आवश्यक है"
      }
      if (!member.maritalStatus) {
        newErrors[`member-${index}-marital`] = "वैवाहिक स्थिति आवश्यक है"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real app, this would be an API call
      console.log("Family data to save:", familyData)

      router.push(`/village/${villageId}`)
    } catch (error) {
      console.error("Error saving family:", error)
    } finally {
      setLoading(false)
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
                <h1 className="text-xl md:text-2xl font-bold text-white hindi-text">नया परिवार जोड़ें</h1>
                <p className="text-orange-100 text-sm">गांव: {villageId}</p>
              </div>
            </div>
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Family Level Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center hindi-text">
                <Home className="w-5 h-5 mr-2" />
                पारिवारिक जानकारी
              </CardTitle>
              <CardDescription className="hindi-text">परिवार की मूलभूत जानकारी दर्ज करें</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="hindi-text">वर्तमान पता</Label>
                  <Textarea
                    value={familyData.familyAddress}
                    onChange={(e) => setFamilyData((prev) => ({ ...prev, familyAddress: e.target.value }))}
                    placeholder="वर्तमान पूरा पता दर्ज करें"
                    className="min-h-20"
                  />
                </div>
                <div>
                  <Label className="hindi-text">स्थायी पता</Label>
                  <Textarea
                    value={familyData.permanentAddress}
                    onChange={(e) => setFamilyData((prev) => ({ ...prev, permanentAddress: e.target.value }))}
                    placeholder="स्थायी पूरा पता दर्ज करें"
                    className="min-h-20"
                  />
                </div>
              </div>
              <div>
                <Label className="hindi-text">आर्थिक स्थिति</Label>
                <Select
                  value={familyData.economicStatus}
                  onValueChange={(value) => setFamilyData((prev) => ({ ...prev, economicStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="आर्थिक स्थिति चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BPL">गरीबी रेखा से नीचे (BPL)</SelectItem>
                    <SelectItem value="APL">गरीबी रेखा से ऊपर (APL)</SelectItem>
                    <SelectItem value="Middle">मध्यम वर्गीय</SelectItem>
                    <SelectItem value="Upper">उच्च वर्गीय</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Error Messages */}
          {Object.keys(errors).length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-red-700 mb-2 hindi-text">कृपया निम्नलिखित त्रुटियों को ठीक करें:</h4>
                <ul className="list-disc list-inside space-y-1 text-red-600 text-sm">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Family Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center hindi-text">
                    <Users className="w-5 h-5 mr-2" />
                    परिवार के सदस्य ({familyData.members.length})
                  </CardTitle>
                  <CardDescription className="hindi-text">प्रत्येक सदस्य की विस्तृत जानकारी दर्ज करें</CardDescription>
                </div>
                <Button type="button" onClick={addMember} variant="outline" className="bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hindi-text">सदस्य जोड़ें</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {familyData.members.map((member, memberIndex) => (
                  <Card key={member.id} className="border-gray-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg hindi-text">
                          सदस्य {memberIndex + 1}
                          {member.isMukhiya && <Badge className="ml-2 bg-orange-100 text-orange-700">मुखिया</Badge>}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={member.isMukhiya ? "default" : "outline"}
                            onClick={() => setMukhiya(member.id)}
                            className={member.isMukhiya ? "bg-orange-500 hover:bg-orange-600" : "bg-transparent"}
                          >
                            <span className="hindi-text">मुखिया बनाएं</span>
                          </Button>
                          {familyData.members.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removeMember(member.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="multiple" defaultValue={["personal"]} className="w-full">
                        {/* Personal Information */}
                        <AccordionItem value="personal">
                          <AccordionTrigger className="hindi-text">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              व्यक्तिगत जानकारी
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
                                  className={errors[`member-${memberIndex}-name`] ? "border-red-300" : ""}
                                />
                              </div>
                              <div>
                                <Label className="hindi-text">आधार नंबर</Label>
                                <Input
                                  value={member.aadhaarNumber}
                                  onChange={(e) => updateMember(member.id, "aadhaarNumber", e.target.value)}
                                  placeholder="1234 5678 9012"
                                  maxLength={12}
                                />
                              </div>
                              <div>
                                <Label className="hindi-text">वैवाहिक स्थिति *</Label>
                                <Select
                                  value={member.maritalStatus}
                                  onValueChange={(value) => updateMember(member.id, "maritalStatus", value)}
                                >
                                  <SelectTrigger
                                    className={errors[`member-${memberIndex}-marital`] ? "border-red-300" : ""}
                                  >
                                    <SelectValue placeholder="स्थिति चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Single">अविवाहित</SelectItem>
                                    <SelectItem value="Married">विवाहित</SelectItem>
                                    <SelectItem value="Widowed">विधवा/विधुर</SelectItem>
                                    <SelectItem value="Divorced">तलाकशुदा</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="hindi-text">धर्म</Label>
                                <Select
                                  value={member.religion}
                                  onValueChange={(value) => updateMember(member.id, "religion", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="धर्म चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Hindu">हिंदू</SelectItem>
                                    <SelectItem value="Muslim">मुस्लिम</SelectItem>
                                    <SelectItem value="Christian">ईसाई</SelectItem>
                                    <SelectItem value="Sikh">सिख</SelectItem>
                                    <SelectItem value="Buddhist">बौद्ध</SelectItem>
                                    <SelectItem value="Jain">जैन</SelectItem>
                                    <SelectItem value="Other">अन्य</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="hindi-text">जाति</Label>
                                <Select
                                  value={member.caste}
                                  onValueChange={(value) => updateMember(member.id, "caste", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="जाति चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="General">सामान्य</SelectItem>
                                    <SelectItem value="SC">अनुसूचित जाति (SC)</SelectItem>
                                    <SelectItem value="ST">अनुसूचित जनजाति (ST)</SelectItem>
                                    <SelectItem value="OBC">अन्य पिछड़ा वर्ग (OBC)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="hindi-text">रक्त समूह</Label>
                                <Select
                                  value={member.bloodGroup}
                                  onValueChange={(value) => updateMember(member.id, "bloodGroup", value)}
                                >
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
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`disability-${member.id}`}
                                  checked={member.hasDisability}
                                  onCheckedChange={(checked) => updateMember(member.id, "hasDisability", checked)}
                                />
                                <Label htmlFor={`disability-${member.id}`} className="hindi-text">
                                  विकलांगता है
                                </Label>
                              </div>
                              {member.hasDisability && (
                                <div>
                                  <Label className="hindi-text">विकलांगता का प्रकार</Label>
                                  <Input
                                    value={member.disabilityType}
                                    onChange={(e) => updateMember(member.id, "disabilityType", e.target.value)}
                                    placeholder="विकलांगता का प्रकार बताएं"
                                  />
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Address Details */}
                        <AccordionItem value="address">
                          <AccordionTrigger className="hindi-text">
                            <div className="flex items-center">
                              <Home className="w-4 h-4 mr-2" />
                              पता विवरण
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="hindi-text">स्थायी पता</Label>
                                <Textarea
                                  value={member.permanentAddress}
                                  onChange={(e) => updateMember(member.id, "permanentAddress", e.target.value)}
                                  placeholder="स्थायी पूरा पता"
                                  className="min-h-20"
                                />
                              </div>
                              <div>
                                <Label className="hindi-text">वर्तमान पता</Label>
                                <Textarea
                                  value={member.currentAddress}
                                  onChange={(e) => updateMember(member.id, "currentAddress", e.target.value)}
                                  placeholder="वर्तमान पूरा पता"
                                  className="min-h-20"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <Label className="hindi-text">गांव का नाम</Label>
                                <Input
                                  value={member.villageName}
                                  onChange={(e) => updateMember(member.id, "villageName", e.target.value)}
                                  placeholder="गांव का नाम"
                                />
                              </div>
                              <div>
                                <Label className="hindi-text">पिन कोड</Label>
                                <Input
                                  value={member.pincode}
                                  onChange={(e) => updateMember(member.id, "pincode", e.target.value)}
                                  placeholder="313001"
                                  maxLength={6}
                                />
                              </div>
                              <div>
                                <Label className="hindi-text">जिला</Label>
                                <Input
                                  value={member.district}
                                  onChange={(e) => updateMember(member.id, "district", e.target.value)}
                                  placeholder="जिला का नाम"
                                />
                              </div>
                              <div>
                                <Label className="hindi-text">राज्य</Label>
                                <Input
                                  value={member.state}
                                  onChange={(e) => updateMember(member.id, "state", e.target.value)}
                                  placeholder="राज्य का नाम"
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Educational Information */}
                        <AccordionItem value="education">
                          <AccordionTrigger className="hindi-text">
                            <div className="flex items-center">
                              <GraduationCap className="w-4 h-4 mr-2" />
                              शैक्षणिक जानकारी
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`student-${member.id}`}
                                checked={member.isStudent}
                                onCheckedChange={(checked) => updateMember(member.id, "isStudent", checked)}
                              />
                              <Label htmlFor={`student-${member.id}`} className="hindi-text">
                                वर्तमान में छात्र/छात्रा है
                              </Label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <Label className="hindi-text">शिक्षा का स्तर</Label>
                                <Select
                                  value={member.educationLevel}
                                  onValueChange={(value) => updateMember(member.id, "educationLevel", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="शिक्षा स्तर चुनें" />
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
                                <Label className="hindi-text">नामांकन स्थिति</Label>
                                <Select
                                  value={member.enrollmentStatus}
                                  onValueChange={(value) => updateMember(member.id, "enrollmentStatus", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="स्थिति चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Enrolled">नामांकित</SelectItem>
                                    <SelectItem value="Dropped">छोड़ दिया</SelectItem>
                                    <SelectItem value="Completed">पूर्ण</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="hindi-text">स्कूल/कॉलेज का नाम</Label>
                                <Input
                                  value={member.schoolName}
                                  onChange={(e) => updateMember(member.id, "schoolName", e.target.value)}
                                  placeholder="संस्थान का नाम"
                                />
                              </div>
                            </div>
                            {member.enrollmentStatus === "Dropped" && (
                              <div>
                                <Label className="hindi-text">छोड़ने का कारण</Label>
                                <Input
                                  value={member.dropoutReason}
                                  onChange={(e) => updateMember(member.id, "dropoutReason", e.target.value)}
                                  placeholder="पढ़ाई छोड़ने का कारण"
                                />
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>

                        {/* Employment and Income */}
                        <AccordionItem value="employment">
                          <AccordionTrigger className="hindi-text">
                            <div className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-2" />
                              रोजगार और आय
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`employed-${member.id}`}
                                checked={member.isEmployed}
                                onCheckedChange={(checked) => updateMember(member.id, "isEmployed", checked)}
                              />
                              <Label htmlFor={`employed-${member.id}`} className="hindi-text">
                                रोजगार में है
                              </Label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <Label className="hindi-text">व्यवसाय का प्रकार</Label>
                                <Select
                                  value={member.occupationType}
                                  onValueChange={(value) => updateMember(member.id, "occupationType", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="व्यवसाय चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Farmer">किसान</SelectItem>
                                    <SelectItem value="Laborer">मजदूर</SelectItem>
                                    <SelectItem value="Private Job">निजी नौकरी</SelectItem>
                                    <SelectItem value="Government Job">सरकारी नौकरी</SelectItem>
                                    <SelectItem value="Self Employed">स्वरोजगार</SelectItem>
                                    <SelectItem value="Business">व्यापार</SelectItem>
                                    <SelectItem value="Student">छात्र</SelectItem>
                                    <SelectItem value="Homemaker">गृहिणी</SelectItem>
                                    <SelectItem value="Retired">सेवानिवृत्त</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="hindi-text">मासिक आय (रुपए)</Label>
                                <Input
                                  value={member.monthlyIncome}
                                  onChange={(e) => updateMember(member.id, "monthlyIncome", e.target.value)}
                                  placeholder="15000"
                                  type="number"
                                />
                              </div>
                              <div>
                                <Label className="hindi-text">आय का मुख्य स्रोत</Label>
                                <Select
                                  value={member.incomeSource}
                                  onValueChange={(value) => updateMember(member.id, "incomeSource", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="आय स्रोत चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Farming">खेती</SelectItem>
                                    <SelectItem value="Business">व्यापार</SelectItem>
                                    <SelectItem value="Wage Labor">मजदूरी</SelectItem>
                                    <SelectItem value="Salary">वेतन</SelectItem>
                                    <SelectItem value="Pension">पेंशन</SelectItem>
                                    <SelectItem value="Remittance">प्रेषण</SelectItem>
                                    <SelectItem value="Other">अन्य</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="hindi-text">भूमि स्वामित्व (एकड़)</Label>
                                <Input
                                  value={member.landOwned}
                                  onChange={(e) => updateMember(member.id, "landOwned", e.target.value)}
                                  placeholder="5"
                                  type="number"
                                />
                              </div>
                              <div>
                                <Label className="hindi-text">पशुधन</Label>
                                <Input
                                  value={member.livestock}
                                  onChange={(e) => updateMember(member.id, "livestock", e.target.value)}
                                  placeholder="गाय, भैंस, बकरी आदि"
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Household and Living Conditions */}
                        <AccordionItem value="household">
                          <AccordionTrigger className="hindi-text">
                            <div className="flex items-center">
                              <Home className="w-4 h-4 mr-2" />
                              घरेलू और रहने की स्थिति
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <Label className="hindi-text">घर का प्रकार</Label>
                                <Select
                                  value={member.houseType}
                                  onValueChange={(value) => updateMember(member.id, "houseType", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="घर का प्रकार चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Kutcha">कच्चा</SelectItem>
                                    <SelectItem value="Pucca">पक्का</SelectItem>
                                    <SelectItem value="Semi-Pucca">अर्ध-पक्का</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="hindi-text">पानी का स्रोत</Label>
                                <Select
                                  value={member.waterSource}
                                  onValueChange={(value) => updateMember(member.id, "waterSource", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="पानी का स्रोत चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Tap">नल</SelectItem>
                                    <SelectItem value="Well">कुआं</SelectItem>
                                    <SelectItem value="Hand Pump">हैंड पंप</SelectItem>
                                    <SelectItem value="Borewell">बोरवेल</SelectItem>
                                    <SelectItem value="River">नदी</SelectItem>
                                    <SelectItem value="Other">अन्य</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="hindi-text">खाना पकाने का ईंधन</Label>
                                <Select
                                  value={member.cookingFuel}
                                  onValueChange={(value) => updateMember(member.id, "cookingFuel", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="ईंधन चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="LPG">एलपीजी</SelectItem>
                                    <SelectItem value="Firewood">लकड़ी</SelectItem>
                                    <SelectItem value="Kerosene">मिट्टी का तेल</SelectItem>
                                    <SelectItem value="Coal">कोयला</SelectItem>
                                    <SelectItem value="Biogas">बायो गैस</SelectItem>
                                    <SelectItem value="Other">अन्य</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`electricity-${member.id}`}
                                  checked={member.hasElectricity}
                                  onCheckedChange={(checked) => updateMember(member.id, "hasElectricity", checked)}
                                />
                                <Label htmlFor={`electricity-${member.id}`} className="hindi-text">
                                  बिजली की सुविधा है
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`toilet-${member.id}`}
                                  checked={member.hasToilet}
                                  onCheckedChange={(checked) => updateMember(member.id, "hasToilet", checked)}
                                />
                                <Label htmlFor={`toilet-${member.id}`} className="hindi-text">
                                  शौचालय की सुविधा है
                                </Label>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Health and Social Welfare */}
                        <AccordionItem value="health">
                          <AccordionTrigger className="hindi-text">
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-2" />
                              स्वास्थ्य और सामाजिक कल्याण
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`health-issues-${member.id}`}
                                  checked={member.hasMajorHealthIssues}
                                  onCheckedChange={(checked) =>
                                    updateMember(member.id, "hasMajorHealthIssues", checked)
                                  }
                                />
                                <Label htmlFor={`health-issues-${member.id}`} className="hindi-text">
                                  गंभीर स्वास्थ्य समस्याएं हैं
                                </Label>
                              </div>
                              {member.hasMajorHealthIssues && (
                                <div>
                                  <Label className="hindi-text">पुरानी बीमारी का प्रकार</Label>
                                  <Input
                                    value={member.chronicDisease}
                                    onChange={(e) => updateMember(member.id, "chronicDisease", e.target.value)}
                                    placeholder="डायबिटीज, हाई BP, हृदय रोग आदि"
                                  />
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`vaccinated-${member.id}`}
                                  checked={member.isVaccinated}
                                  onCheckedChange={(checked) => updateMember(member.id, "isVaccinated", checked)}
                                />
                                <Label htmlFor={`vaccinated-${member.id}`} className="hindi-text">
                                  टीकाकरण पूरा है
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`health-insurance-${member.id}`}
                                  checked={member.hasHealthInsurance}
                                  onCheckedChange={(checked) => updateMember(member.id, "hasHealthInsurance", checked)}
                                />
                                <Label htmlFor={`health-insurance-${member.id}`} className="hindi-text">
                                  स्वास्थ्य बीमा है
                                </Label>
                              </div>
                            </div>
                            <div>
                              <Label className="hindi-text">सरकारी कल्याण योजनाएं</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                {[
                                  { id: "PMAY", label: "प्रधानमंत्री आवास योजना" },
                                  { id: "Ujjwala", label: "उज्ज्वला योजना" },
                                  { id: "Ration", label: "राशन कार्ड" },
                                  { id: "Ayushman", label: "आयुष्मान भारत" },
                                  { id: "Pension", label: "पेंशन योजना" },
                                  { id: "MGNREGA", label: "मनरेगा" },
                                ].map((scheme) => (
                                  <div key={scheme.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${scheme.id}-${member.id}`}
                                      checked={member.welfareSchemes.includes(scheme.id)}
                                      onCheckedChange={(checked) => {
                                        const schemes = checked
                                          ? [...member.welfareSchemes, scheme.id]
                                          : member.welfareSchemes.filter((s) => s !== scheme.id)
                                        updateMember(member.id, "welfareSchemes", schemes)
                                      }}
                                    />
                                    <Label htmlFor={`${scheme.id}-${member.id}`} className="text-sm hindi-text">
                                      {scheme.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Digital and Banking Access */}
                        <AccordionItem value="digital">
                          <AccordionTrigger className="hindi-text">
                            <div className="flex items-center">
                              <Smartphone className="w-4 h-4 mr-2" />
                              डिजिटल और बैंकिंग पहुंच
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`smartphone-${member.id}`}
                                  checked={member.hasSmartphone}
                                  onCheckedChange={(checked) => updateMember(member.id, "hasSmartphone", checked)}
                                />
                                <Label htmlFor={`smartphone-${member.id}`} className="hindi-text">
                                  स्मार्टफोन है
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`internet-${member.id}`}
                                  checked={member.hasInternet}
                                  onCheckedChange={(checked) => updateMember(member.id, "hasInternet", checked)}
                                />
                                <Label htmlFor={`internet-${member.id}`} className="hindi-text">
                                  इंटरनेट की पहुंच है
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`bank-account-${member.id}`}
                                  checked={member.hasBankAccount}
                                  onCheckedChange={(checked) => updateMember(member.id, "hasBankAccount", checked)}
                                />
                                <Label htmlFor={`bank-account-${member.id}`} className="hindi-text">
                                  बैंक खाता है
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`jan-dhan-${member.id}`}
                                  checked={member.hasJanDhanAccount}
                                  onCheckedChange={(checked) => updateMember(member.id, "hasJanDhanAccount", checked)}
                                />
                                <Label htmlFor={`jan-dhan-${member.id}`} className="hindi-text">
                                  जन धन खाता है
                                </Label>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/village/${villageId}`)}
              className="bg-transparent"
            >
              <span className="hindi-text">रद्द करें</span>
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="hindi-text">सेव हो रहा है...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  <span className="hindi-text">परिवार सेव करें</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

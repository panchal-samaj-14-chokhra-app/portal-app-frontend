"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useCreateFamily, useGetFamilyDetails, useUpdateFamily } from '@/data-hooks/mutation-query/useQueryAndMutation';
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
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
  Calendar,
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
  dateOfBirth: string
  age: number
  gender: "MALE" | "FEMALE" | "other"
  relation: string
  maritalStatus: string
  religion: string
  caste: string
  disability: boolean
  bloodGroup: string
  mobileNumber: string
  email: string
  permanentAddress: string
  currentAddress: string
  isCurrentAddressInIndia: boolean
  currentCountry: string
  village: string
  pincode: string
  district: string
  state: string
  isStudent: boolean
  educationLevel: string
  classCompleted: string
  currentClass: string
  collegeCourse: string
  institutionName: string
  enrollmentStatus: string
  dropoutReason?: string
  schoolName?: string
  higherEducationType: string
  isEmployed: boolean
  occupation: string
  monthlyIncome: number
  incomeSource: string
  isIncomeSourceInIndia: boolean
  incomeSourceCountry: string
  serviceType: string
  landOwned: number
  livestock: string
  houseType: string
  houseOwnership: string
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
  status: "draft" | "submitted"
  members: FamilyMember[]
}

const initialMember: Omit<FamilyMember, "id"> = {
  name: "",
  aadhaarNumber: "",
  dateOfBirth: "",
  age: 0,
  gender: "MALE",
  relation: "",
  maritalStatus: "unmarried",
  religion: "hindu",
  caste: "general",
  disability: false,
  bloodGroup: "",
  mobileNumber: "",
  email: "",
  permanentAddress: "",
  currentAddress: "",
  isCurrentAddressInIndia: true,
  currentCountry: "",
  village: "",
  pincode: "",
  district: "",
  state: "",
  isStudent: false,
  educationLevel: "",
  classCompleted: "",
  currentClass: "",
  collegeCourse: "",
  institutionName: "",
  enrollmentStatus: "",
  schoolName: "",
  higherEducationType: "",
  isEmployed: false,
  occupation: "",
  monthlyIncome: 0,
  incomeSource: "",
  isIncomeSourceInIndia: true,
  incomeSourceCountry: "",
  serviceType: "",
  landOwned: 0,
  livestock: "",
  houseType: "kutcha",
  houseOwnership: "owned",
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

interface FamilyFormProps {
  mode: 'add' | 'edit';
  familyId?: string;
  onSuccess?: () => void;
}

export default function FamilyForm({ mode, familyId }: FamilyFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const villageId = params.villageId as string;
  const searchParams = useSearchParams();
  const chakolaId = searchParams.get('chakolaId');
  console.log(chakolaId)
  const { data: familyDetails, isLoading: isFetching } = useGetFamilyDetails(familyId || '');

  const { mutation } = useCreateFamily();
  const { mutation: updateMutation } = useUpdateFamily();

  // If edit mode and data is loaded, use it as initial state
  const [familyData, setFamilyData] = useState<FamilyData>(() => {
    if (mode === 'edit' && familyDetails) {
      return {
        currentAddress: familyDetails.currentAddress || '',
        permanentAddress: familyDetails.permanentAddress || '',
        economicStatus: familyDetails.economicStatus || 'bpl',
        status: familyDetails.status || 'draft',
        members: familyDetails.Person || [],
      };
    }
    return {
      currentAddress: '',
      permanentAddress: '',
      economicStatus: 'bpl',
      status: 'draft',
      members: [{ ...initialMember, isMukhiya: true, id: `member-${Date.now()}` }],
    };
  });

  useEffect(() => {
    if (mode === 'edit' && familyDetails) {
      setFamilyData({
        currentAddress: familyDetails.currentAddress || '',
        permanentAddress: familyDetails.permanentAddress || '',
        economicStatus: familyDetails.economicStatus || 'bpl',
        status: familyDetails.status || 'draft',
        members: familyDetails.Person || [],
      });
    }
  }, [mode, familyDetails]);

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")
  }, [session, status, router])

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0

    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return Math.max(0, age)
  }

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

          // If updating date of birth, also update age
          if (field === "dateOfBirth") {
            if (!value) return { ...member }; // skip if empty or undefined

            const isoDate = new Date(value).toISOString();
            const age = calculateAge(value); // make sure calculateAge can handle raw date string or Date

            return {
              ...member,
              [field]: isoDate,
              age
            };
          }

          return { ...member, [field]: value }
        }
        return member
      }),
    }))
  }

  const validateForm = (isDraft = false): boolean => {
    const newErrors: Record<string, string> = {}

    // For draft, we can be more lenient with validation
    if (!isDraft) {
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

      // Check for unique mobile numbers
      const mobileNumbers = familyData.members.map((m) => m.mobileNumber).filter(Boolean)
      const duplicateMobile = mobileNumbers.find((num, index) => mobileNumbers.indexOf(num) !== index)
      if (duplicateMobile) {
        newErrors.mobile = `मोबाइल नंबर ${duplicateMobile} डुप्लिकेट है`
      }

      // Check required fields for each member
      familyData.members.forEach((member, index) => {
        if (!member.name.trim()) {
          newErrors[`member-${index}-name`] = "नाम आवश्यक है"
        }
        if (!member.aadhaarNumber.trim()) {
          newErrors[`member-${index}-aadhaar`] = "आधार नंबर आवश्यक है"
        }
        if (!member.dateOfBirth) {
          newErrors[`member-${index}-dob`] = "जन्म तिथि आवश्यक है"
        }
      })
    }

    // Validate format for filled fields (both draft and final)
    familyData.members.forEach((member, index) => {
      if (member.mobileNumber && !/^[6-9]\d{9}$/.test(member.mobileNumber)) {
        newErrors[`member-${index}-mobile`] = "वैध मोबाइल नंबर दर्ज करें"
      }
      if (member.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        newErrors[`member-${index}-email`] = "वैध ईमेल पता दर्ज करें"
      }
      if (member.dateOfBirth) {
        const birthDate = new Date(member.dateOfBirth)
        const today = new Date()
        if (birthDate > today) {
          newErrors[`member-${index}-dob`] = "जन्म तिथि भविष्य में नहीं हो सकती"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveAsDraft = async () => {
    if (!validateForm(true)) {
      alert("कृपया फॉर्मेट त्रुटियों को ठीक करें")
      return
    }

    setSavingDraft(true)
    try {
      // Simulate API call to save as draft
      await new Promise((resolve) => setTimeout(resolve, 1500))

      alert("परिवार का डेटा ड्राफ्ट के रूप में सहेजा गया!")
      router.push(`/village/${villageId}`)
    } catch (error) {
      alert("ड्राफ्ट सहेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।")
    } finally {
      setSavingDraft(false)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm(false)) {
      alert("कृपया सभी त्रुटियों को ठीक करें")
      return
    }

    setLoading(true)
    try {
      // Simulate API
      //  call
      const mukhiya = familyData.members.find((m) => m.isMukhiya);
      const mukhiyaName = mukhiya ? mukhiya.name : "";
      if (mode === 'edit') updateMutation.mutate({ ...familyData, mukhiyaName, villageId, chakolaId });
      else mutation.mutate({ ...familyData, mukhiyaName, villageId, chakolaId });
      // await new Promise((resolve) => setTimeout(resolve, 2000))

      // alert("परिवार सफलतापूर्वक पंजीकृत हो गया!")
      // router.push(`/village/${villageId}`)a
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
                <span className="hindi-text">वापस</span>
              </Button>
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={50}
                height={50}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white hindi-text">नया परिवार जोड़ें</h1>
                <p className="text-orange-100 text-sm hindi-text">परिवार पंजीकरण फॉर्म</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Error Alerts */}
        {(errors.mukhiya || errors.aadhaar || errors.mobile) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errors.mukhiya && <div className="hindi-text">{errors.mukhiya}</div>}
              {errors.aadhaar && <div className="hindi-text">{errors.aadhaar}</div>}
              {errors.mobile && <div className="hindi-text">{errors.mobile}</div>}
            </AlertDescription>
          </Alert>
        )}

        {/* Family Level Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center hindi-text">
              <Home className="w-5 h-5 mr-2" />
              परिवार की जानकारी
            </CardTitle>
            <CardDescription className="hindi-text">परिवार स्तर की बुनियादी जानकारी</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAddress" className="hindi-text">
                  वर्तमान पता *
                </Label>
                <Textarea
                  id="currentAddress"
                  value={familyData.currentAddress}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, currentAddress: e.target.value }))}
                  placeholder="वर्तमान पता दर्ज करें"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="permanentAddress" className="hindi-text">
                  स्थायी पता *
                </Label>
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
              <Label htmlFor="economicStatus" className="hindi-text">
                आर्थिक स्थिति
              </Label>
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
                <CardTitle className="flex items-center hindi-text">
                  <User className="w-5 h-5 mr-2" />
                  परिवार के सदस्य ({familyData.members.length})
                </CardTitle>
                <div className="flex items-center">
                  <CardDescription className="hindi-text">
                    सभी परिवारिक सदस्यों की विस्तृत जानकारी
                  </CardDescription>
                  {mukhiyaCount === 1 && (
                    <Badge className="ml-2 bg-green-100 text-green-700">
                      <UserCheck className="w-3 h-3 mr-1" />
                      <span className="hindi-text">मुखिया चुना गया</span>
                    </Badge>
                  )}
                </div>
              </div>
              <Button onClick={addMember} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hindi-text">सदस्य जोड़ें</span>
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
                              <span className="hindi-text">मुखिया</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.age > 0 && <Badge variant="outline">{member.age} वर्ष</Badge>}
                        {member.gender && (
                          <Badge variant="outline">
                            {member.gender === "MALE" ? "पुरुष" : member.gender === "FEMALE" ? "महिला" : "अन्य"}
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
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text">
                          <User className="w-4 h-4 mr-2" />
                          व्यक्तिगत जानकारी
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="hindi-text">पूरा नाम *</Label>
                            <Input
                              value={member.name}
                              onChange={(e) => updateMember(member.id, "name", e.target.value)}
                              placeholder="पूरा नाम दर्ज करें"
                              className={errors[`member-${index}-name`] ? "border-red-500" : ""}
                            />
                            {errors[`member-${index}-name`] && (
                              <p className="text-red-500 text-sm mt-1 hindi-text">{errors[`member-${index}-name`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="hindi-text">आधार नंबर *</Label>
                            <Input
                              value={member.aadhaarNumber}
                              onChange={(e) => updateMember(member.id, "aadhaarNumber", e.target.value)}
                              placeholder="12 अंकों का आधार नंबर"
                              maxLength={12}
                              className={errors[`member-${index}-aadhaar`] ? "border-red-500" : ""}
                            />
                            {errors[`member-${index}-aadhaar`] && (
                              <p className="text-red-500 text-sm mt-1 hindi-text">
                                {errors[`member-${index}-aadhaar`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="hindi-text flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              जन्म तिथि *
                            </Label>
                            <Input
                              type="date"
                              value={member.dateOfBirth}
                              onChange={(e) => updateMember(member.id, "dateOfBirth", e.target.value)}
                              className={errors[`member-${index}-dob`] ? "border-red-500" : ""}
                              max={new Date().toISOString().split("T")[0]}
                            />
                            {errors[`member-${index}-dob`] && (
                              <p className="text-red-500 text-sm mt-1 hindi-text">{errors[`member-${index}-dob`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="hindi-text">उम्र</Label>
                            <Input
                              type="number"
                              value={member.age || ""}
                              readOnly
                              placeholder="जन्म तिथि से गणना होगी"
                              className="bg-gray-50 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1 hindi-text">जन्म तिथि के आधार पर स्वचालित गणना</p>
                          </div>
                          <div>
                            <Label className="hindi-text flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              मोबाइल नंबर
                            </Label>
                            <Input
                              value={member.mobileNumber}
                              onChange={(e) => updateMember(member.id, "mobileNumber", e.target.value)}
                              placeholder="10 अंकों का मोबाइल नंबर"
                              maxLength={10}
                              className={errors[`member-${index}-mobile`] ? "border-red-500" : ""}
                            />
                            {errors[`member-${index}-mobile`] && (
                              <p className="text-red-500 text-sm mt-1 hindi-text">{errors[`member-${index}-mobile`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="hindi-text flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              ईमेल पता
                            </Label>
                            <Input
                              type="email"
                              value={member.email}
                              onChange={(e) => updateMember(member.id, "email", e.target.value)}
                              placeholder="example@email.com"
                              className={errors[`member-${index}-email`] ? "border-red-500" : ""}
                            />
                            {errors[`member-${index}-email`] && (
                              <p className="text-red-500 text-sm mt-1 hindi-text">{errors[`member-${index}-email`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="hindi-text">लिंग</Label>
                            <Select
                              value={member.gender}
                              onValueChange={(value) => updateMember(member.id, "gender", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MALE">पुरुष</SelectItem>
                                <SelectItem value="FEMALE">महिला</SelectItem>
                                <SelectItem value="other">अन्य</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="hindi-text">रिश्ता</Label>
                            <Select
                              value={member.relation}
                              onValueChange={(value) => updateMember(member.id, "relation", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="रिश्ता चुनें" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="self">स्वयं</SelectItem>
                                <SelectItem value="spouse">पति/पत्नी</SelectItem>
                                <SelectItem value="son">पुत्र</SelectItem>
                                <SelectItem value="daughter">पुत्री</SelectItem>
                                <SelectItem value="father">पिता</SelectItem>
                                <SelectItem value="mother">माता</SelectItem>
                                <SelectItem value="brother">भाई</SelectItem>
                                <SelectItem value="sister">बहन</SelectItem>
                                <SelectItem value="grandfather">दादा/नाना</SelectItem>
                                <SelectItem value="grandmother">दादी/नानी</SelectItem>
                                <SelectItem value="uncle">चाचा/मामा</SelectItem>
                                <SelectItem value="aunt">चाची/मामी</SelectItem>
                                <SelectItem value="nephew">भतीजा/भांजा</SelectItem>
                                <SelectItem value="niece">भतीजी/भांजी</SelectItem>
                                <SelectItem value="son_in_law">दामाद</SelectItem>
                                <SelectItem value="daughter_in_law">बहू</SelectItem>
                                <SelectItem value="other">अन्य</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="hindi-text">वैवाहिक स्थिति</Label>
                            <Select
                              value={member.maritalStatus}
                              onValueChange={(value) => updateMember(member.id, "maritalStatus", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unmarried">अविवाहित</SelectItem>
                                <SelectItem value="married">विवाहित</SelectItem>
                                <SelectItem value="widowed">विधवा/विधुर</SelectItem>
                                <SelectItem value="divorced">तलाकशुदा</SelectItem>
                                <SelectItem value="separated">अलग रह रहे</SelectItem>
                                <SelectItem value="engaged">सगाई हो गई</SelectItem>
                                <SelectItem value="remarried">पुनर्विवाह</SelectItem>
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
                            <Label className="hindi-text">जाति</Label>
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
                            <Label className="hindi-text">ब्लड ग्रुप</Label>
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
                            <Label htmlFor={`disability-${member.id}`} className="hindi-text">
                              विकलांगता है
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`mukhiya-${member.id}`}
                              checked={member.isMukhiya}
                              onCheckedChange={(checked) => updateMember(member.id, "isMukhiya", checked)}
                            />
                            <Label htmlFor={`mukhiya-${member.id}`} className="font-medium text-orange-700 hindi-text">
                              मुखिया है
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text">
                          <MapPin className="w-4 h-4 mr-2" />
                          पता की जानकारी
                        </h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="hindi-text">स्थायी पता</Label>
                              <Textarea
                                value={member.permanentAddress}
                                onChange={(e) => updateMember(member.id, "permanentAddress", e.target.value)}
                                placeholder="स्थायी पता दर्ज करें"
                              />
                            </div>
                            <div>
                              <Label className="hindi-text">वर्तमान पता</Label>
                              <Textarea
                                value={member.currentAddress}
                                onChange={(e) => updateMember(member.id, "currentAddress", e.target.value)}
                                placeholder="वर्तमान पता दर्ज करें"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`currentAddressIndia-${member.id}`}
                              checked={member.isCurrentAddressInIndia}
                              onCheckedChange={(checked) => updateMember(member.id, "isCurrentAddressInIndia", checked)}
                            />
                            <Label htmlFor={`currentAddressIndia-${member.id}`} className="hindi-text">
                              वर्तमान पता भारत में है
                            </Label>
                          </div>

                          {!member.isCurrentAddressInIndia && (
                            <div>
                              <Label className="hindi-text flex items-center">
                                <Globe className="w-4 h-4 mr-1" />
                                देश का नाम
                              </Label>
                              <Input
                                value={member.currentCountry}
                                onChange={(e) => updateMember(member.id, "currentCountry", e.target.value)}
                                placeholder="देश का नाम दर्ज करें"
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="hindi-text">गांव का नाम</Label>
                              <Input
                                value={member.village}
                                onChange={(e) => updateMember(member.id, "village", e.target.value)}
                                placeholder="गांव का नाम"
                              />
                            </div>
                            <div>
                              <Label className="hindi-text">पिनकोड</Label>
                              <Input
                                value={member.pincode}
                                onChange={(e) => updateMember(member.id, "pincode", e.target.value)}
                                placeholder="पिनकोड"
                                maxLength={6}
                              />
                            </div>
                            <div>
                              <Label className="hindi-text">जिला</Label>
                              <Input
                                value={member.district}
                                onChange={(e) => updateMember(member.id, "district", e.target.value)}
                                placeholder="जिला"
                              />
                            </div>
                            <div>
                              <Label className="hindi-text">राज्य</Label>
                              <Input
                                value={member.state}
                                onChange={(e) => updateMember(member.id, "state", e.target.value)}
                                placeholder="राज्य"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Education Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text">
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
                                  <SelectValue placeholder="शिक्षा का स्तर चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="illiterate">निरक्षर</SelectItem>
                                  <SelectItem value="primary">प्राथमिक (कक्षा 1-5)</SelectItem>
                                  <SelectItem value="middle">मध्य (कक्षा 6-8)</SelectItem>
                                  <SelectItem value="secondary">माध्यमिक (कक्षा 9-10)</SelectItem>
                                  <SelectItem value="higher_secondary">उच्च माध्यमिक (कक्षा 11-12)</SelectItem>
                                  <SelectItem value="undergraduate">स्नातक</SelectItem>
                                  <SelectItem value="postgraduate">स्नातकोत्तर</SelectItem>
                                  <SelectItem value="doctorate">डॉक्टरेट</SelectItem>
                                  <SelectItem value="diploma">डिप्लोमा</SelectItem>
                                  <SelectItem value="certificate">प्रमाणपत्र कोर्स</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="hindi-text">पूर्ण की गई कक्षा</Label>
                              <Select
                                value={member.classCompleted}
                                onValueChange={(value) => updateMember(member.id, "classCompleted", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="पूर्ण की गई कक्षा चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">कोई नहीं</SelectItem>
                                  <SelectItem value="1">कक्षा 1</SelectItem>
                                  <SelectItem value="2">कक्षा 2</SelectItem>
                                  <SelectItem value="3">कक्षा 3</SelectItem>
                                  <SelectItem value="4">कक्षा 4</SelectItem>
                                  <SelectItem value="5">कक्षा 5</SelectItem>
                                  <SelectItem value="6">कक्षा 6</SelectItem>
                                  <SelectItem value="7">कक्षा 7</SelectItem>
                                  <SelectItem value="8">कक्षा 8</SelectItem>
                                  <SelectItem value="9">कक्षा 9</SelectItem>
                                  <SelectItem value="10">कक्षा 10</SelectItem>
                                  <SelectItem value="11">कक्षा 11</SelectItem>
                                  <SelectItem value="12">कक्षा 12</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {member.isStudent && (
                              <div>
                                <Label className="hindi-text">वर्तमान कक्षा</Label>
                                <Select
                                  value={member.currentClass}
                                  onValueChange={(value) => updateMember(member.id, "currentClass", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="वर्तमान कक्षा चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">कक्षा 1</SelectItem>
                                    <SelectItem value="2">कक्षा 2</SelectItem>
                                    <SelectItem value="3">कक्षा 3</SelectItem>
                                    <SelectItem value="4">कक्षा 4</SelectItem>
                                    <SelectItem value="5">कक्षा 5</SelectItem>
                                    <SelectItem value="6">कक्षा 6</SelectItem>
                                    <SelectItem value="7">कक्षा 7</SelectItem>
                                    <SelectItem value="8">कक्षा 8</SelectItem>
                                    <SelectItem value="9">कक्षा 9</SelectItem>
                                    <SelectItem value="10">कक्षा 10</SelectItem>
                                    <SelectItem value="11">कक्षा 11</SelectItem>
                                    <SelectItem value="12">कक्षा 12</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            <div>
                              <Label className="hindi-text">कॉलेज कोर्स (यदि कोई हो)</Label>
                              <Select
                                value={member.collegeCourse}
                                onValueChange={(value) => updateMember(member.id, "collegeCourse", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="कॉलेज कोर्स चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">कोई नहीं</SelectItem>

                                  {/* Engineering Courses */}
                                  <SelectItem value="btech_computer">B.Tech Computer Science</SelectItem>
                                  <SelectItem value="btech_mechanical">B.Tech Mechanical</SelectItem>
                                  <SelectItem value="btech_electrical">B.Tech Electrical</SelectItem>
                                  <SelectItem value="btech_civil">B.Tech Civil</SelectItem>
                                  <SelectItem value="btech_electronics">B.Tech Electronics</SelectItem>
                                  <SelectItem value="be_computer">BE Computer Science</SelectItem>
                                  <SelectItem value="be_mechanical">BE Mechanical</SelectItem>
                                  <SelectItem value="be_electrical">BE Electrical</SelectItem>
                                  <SelectItem value="be_civil">BE Civil</SelectItem>

                                  {/* Medical Courses */}
                                  <SelectItem value="mbbs">MBBS</SelectItem>
                                  <SelectItem value="bds">BDS (Dental)</SelectItem>
                                  <SelectItem value="bams">BAMS (Ayurveda)</SelectItem>
                                  <SelectItem value="bhms">BHMS (Homeopathy)</SelectItem>
                                  <SelectItem value="bums">BUMS (Unani)</SelectItem>
                                  <SelectItem value="bpt">BPT (Physiotherapy)</SelectItem>
                                  <SelectItem value="nursing_bsc">B.Sc Nursing</SelectItem>
                                  <SelectItem value="nursing_gnm">GNM Nursing</SelectItem>
                                  <SelectItem value="nursing_anm">ANM Nursing</SelectItem>
                                  <SelectItem value="pharmacy">B.Pharmacy</SelectItem>
                                  <SelectItem value="md">MD (Doctor of Medicine)</SelectItem>
                                  <SelectItem value="ms">MS (Master of Surgery)</SelectItem>

                                  {/* Arts & Humanities */}
                                  <SelectItem value="ba">BA (Bachelor of Arts)</SelectItem>
                                  <SelectItem value="ma">MA (Master of Arts)</SelectItem>
                                  <SelectItem value="ba_english">BA English</SelectItem>
                                  <SelectItem value="ba_hindi">BA Hindi</SelectItem>
                                  <SelectItem value="ba_history">BA History</SelectItem>
                                  <SelectItem value="ba_political_science">BA Political Science</SelectItem>
                                  <SelectItem value="ba_sociology">BA Sociology</SelectItem>
                                  <SelectItem value="ba_psychology">BA Psychology</SelectItem>

                                  {/* Commerce */}
                                  <SelectItem value="bcom">B.Com</SelectItem>
                                  <SelectItem value="mcom">M.Com</SelectItem>
                                  <SelectItem value="bba">BBA</SelectItem>
                                  <SelectItem value="mba">MBA</SelectItem>
                                  <SelectItem value="ca">CA (Chartered Accountant)</SelectItem>
                                  <SelectItem value="cs">CS (Company Secretary)</SelectItem>
                                  <SelectItem value="cma">CMA (Cost Management Accountant)</SelectItem>

                                  {/* Science */}
                                  <SelectItem value="bsc">B.Sc</SelectItem>
                                  <SelectItem value="msc">M.Sc</SelectItem>
                                  <SelectItem value="bsc_physics">B.Sc Physics</SelectItem>
                                  <SelectItem value="bsc_chemistry">B.Sc Chemistry</SelectItem>
                                  <SelectItem value="bsc_mathematics">B.Sc Mathematics</SelectItem>
                                  <SelectItem value="bsc_biology">B.Sc Biology</SelectItem>
                                  <SelectItem value="bsc_it">B.Sc IT</SelectItem>
                                  <SelectItem value="bca">BCA (Computer Applications)</SelectItem>
                                  <SelectItem value="mca">MCA (Computer Applications)</SelectItem>

                                  {/* Law */}
                                  <SelectItem value="llb">LLB</SelectItem>
                                  <SelectItem value="llm">LLM</SelectItem>
                                  <SelectItem value="ba_llb">BA LLB</SelectItem>
                                  <SelectItem value="bcom_llb">B.Com LLB</SelectItem>

                                  {/* Education */}
                                  <SelectItem value="bed">B.Ed</SelectItem>
                                  <SelectItem value="med">M.Ed</SelectItem>
                                  <SelectItem value="deled">D.El.Ed</SelectItem>
                                  <SelectItem value="btc">BTC</SelectItem>

                                  {/* Diploma Courses */}
                                  <SelectItem value="diploma_mechanical">Diploma Mechanical</SelectItem>
                                  <SelectItem value="diploma_electrical">Diploma Electrical</SelectItem>
                                  <SelectItem value="diploma_civil">Diploma Civil</SelectItem>
                                  <SelectItem value="diploma_computer">Diploma Computer</SelectItem>
                                  <SelectItem value="diploma_electronics">Diploma Electronics</SelectItem>

                                  {/* Vocational Courses */}
                                  <SelectItem value="iti_fitter">ITI Fitter</SelectItem>
                                  <SelectItem value="iti_electrician">ITI Electrician</SelectItem>
                                  <SelectItem value="iti_welder">ITI Welder</SelectItem>
                                  <SelectItem value="iti_mechanic">ITI Mechanic</SelectItem>
                                  <SelectItem value="iti_computer">ITI Computer</SelectItem>

                                  {/* Agriculture */}
                                  <SelectItem value="bsc_agriculture">B.Sc Agriculture</SelectItem>
                                  <SelectItem value="msc_agriculture">M.Sc Agriculture</SelectItem>
                                  <SelectItem value="diploma_agriculture">Diploma Agriculture</SelectItem>

                                  {/* Other Professional Courses */}
                                  <SelectItem value="hotel_management">Hotel Management</SelectItem>
                                  <SelectItem value="fashion_design">Fashion Design</SelectItem>
                                  <SelectItem value="interior_design">Interior Design</SelectItem>
                                  <SelectItem value="journalism">Journalism</SelectItem>
                                  <SelectItem value="mass_communication">Mass Communication</SelectItem>
                                  <SelectItem value="social_work">Social Work</SelectItem>
                                  <SelectItem value="library_science">Library Science</SelectItem>
                                  <SelectItem value="other">अन्य</SelectItem>
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
                                  <SelectValue placeholder="नामांकन स्थिति चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="enrolled">नामांकित</SelectItem>
                                  <SelectItem value="dropped">छोड़ दिया</SelectItem>
                                  <SelectItem value="completed">पूर्ण</SelectItem>
                                  <SelectItem value="never_enrolled">कभी नामांकित नहीं</SelectItem>
                                  <SelectItem value="pursuing">अध्ययनरत</SelectItem>
                                  <SelectItem value="passed">उत्तीर्ण</SelectItem>
                                  <SelectItem value="failed">अनुत्तीर्ण</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="hindi-text">संस्थान का नाम</Label>
                              <Input
                                value={member.institutionName}
                                onChange={(e) => updateMember(member.id, "institutionName", e.target.value)}
                                placeholder="स्कूल/कॉलेज/विश्वविद्यालय का नाम"
                              />
                            </div>

                            {member.enrollmentStatus === "dropped" && (
                              <div>
                                <Label className="hindi-text">छोड़ने का कारण</Label>
                                <Input
                                  value={member.dropoutReason || ""}
                                  onChange={(e) => updateMember(member.id, "dropoutReason", e.target.value)}
                                  placeholder="छोड़ने का कारण बताएं"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Employment Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text">
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
                            <Label htmlFor={`employed-${member.id}`} className="hindi-text">
                              रोजगार में है
                            </Label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <Label className="hindi-text">व्यवसाय का प्रकार</Label>
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
                              <Label className="hindi-text">सेवा का प्रकार</Label>
                              <Select
                                value={member.serviceType}
                                onValueChange={(value) => updateMember(member.id, "serviceType", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="सेवा का प्रकार चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">कोई नहीं</SelectItem>
                                  <SelectItem value="healthcare">स्वास्थ्य सेवा</SelectItem>
                                  <SelectItem value="education">शिक्षा</SelectItem>
                                  <SelectItem value="transport">परिवहन</SelectItem>
                                  <SelectItem value="construction">निर्माण</SelectItem>
                                  <SelectItem value="retail">खुदरा व्यापार</SelectItem>
                                  <SelectItem value="hospitality">आतिथ्य</SelectItem>
                                  <SelectItem value="finance">वित्त</SelectItem>
                                  <SelectItem value="technology">प्रौद्योगिकी</SelectItem>
                                  <SelectItem value="manufacturing">विनिर्माण</SelectItem>
                                  <SelectItem value="agriculture">कृषि</SelectItem>
                                  <SelectItem value="other">अन्य</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="hindi-text">मासिक आय (₹)</Label>
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
                              <Label className="hindi-text">आय का मुख्य स्रोत</Label>
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

                            <div className="flex items-center space-x-2 col-span-full">
                              <Checkbox
                                id={`incomeSourceIndia-${member.id}`}
                                checked={member.isIncomeSourceInIndia}
                                onCheckedChange={(checked) => updateMember(member.id, "isIncomeSourceInIndia", checked)}
                              />
                              <Label htmlFor={`incomeSourceIndia-${member.id}`} className="hindi-text">
                                आय का स्रोत भारत में है
                              </Label>
                            </div>

                            {!member.isIncomeSourceInIndia && (
                              <div>
                                <Label className="hindi-text flex items-center">
                                  <Globe className="w-4 h-4 mr-1" />
                                  आय स्रोत देश का नाम
                                </Label>
                                <Input
                                  value={member.incomeSourceCountry}
                                  onChange={(e) => updateMember(member.id, "incomeSourceCountry", e.target.value)}
                                  placeholder="देश का नाम दर्ज करें"
                                />
                              </div>
                            )}

                            <div>
                              <Label className="hindi-text">भूमि स्वामित्व (एकड़)</Label>
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
                              <Label className="hindi-text">पशुधन</Label>
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
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text">
                          <Home className="w-4 h-4 mr-2" />
                          आवास की जानकारी
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <Label className="hindi-text">घर का प्रकार</Label>
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
                            <Label className="hindi-text">घर का स्वामित्व</Label>
                            <Select
                              value={member.houseOwnership}
                              onValueChange={(value) => updateMember(member.id, "houseOwnership", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="owned">स्वयं का</SelectItem>
                                <SelectItem value="rented">किराए का</SelectItem>
                                <SelectItem value="family">पारिवारिक</SelectItem>
                                <SelectItem value="government">सरकारी</SelectItem>
                                <SelectItem value="other">अन्य</SelectItem>
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
                            <Label className="hindi-text">खाना पकाने का ईंधन</Label>
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
                            <Label htmlFor={`electricity-${member.id}`} className="hindi-text">
                              बिजली की सुविधा
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`toilet-${member.id}`}
                              checked={member.hasToilet}
                              onCheckedChange={(checked) => updateMember(member.id, "hasToilet", checked)}
                            />
                            <Label htmlFor={`toilet-${member.id}`} className="hindi-text">
                              शौचालय की सुविधा
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Health Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text">
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
                              <Label htmlFor={`health-issues-${member.id}`} className="hindi-text">
                                स्वास्थ्य समस्या है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`vaccinated-${member.id}`}
                                checked={member.isVaccinated}
                                onCheckedChange={(checked) => updateMember(member.id, "isVaccinated", checked)}
                              />
                              <Label htmlFor={`vaccinated-${member.id}`} className="hindi-text">
                                टीकाकरण हुआ है
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
                          {member.hasHealthIssues && (
                            <div>
                              <Label className="hindi-text">पुरानी बीमारी (यदि कोई हो)</Label>
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
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text">
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
                              इंटरनेट की सुविधा
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
                              checked={member.hasJanDhan}
                              onCheckedChange={(checked) => updateMember(member.id, "hasJanDhan", checked)}
                            />
                            <Label htmlFor={`jan-dhan-${member.id}`} className="hindi-text">
                              जन धन योजना में नामांकित
                            </Label>
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

        {/* Submit Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button onClick={() => router.push(`/village/${villageId}`)} variant="outline" className="bg-transparent">
            <span className="hindi-text">रद्द करें</span>
          </Button>
          <Button
            onClick={handleSaveAsDraft}
            disabled={savingDraft}
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50 min-w-[180px] bg-transparent"
          >
            {savingDraft ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                <span className="hindi-text">ड्राफ्ट सहेजा जा रहा है...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hindi-text">ड्राफ्ट के रूप में सहेजें</span>
              </div>
            )}
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-orange-500 hover:bg-orange-600 min-w-[200px]">
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="hindi-text">सहेजा जा रहा है...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                <span className="hindi-text">परिवार पंजीकृत करें</span>
              </div>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}

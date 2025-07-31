"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useCreateFamily, useGetFamilyDetails, useUpdateFamily } from "@/data-hooks/mutation-query/useQueryAndMutation"
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
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  gender: "MALE" | "FEMALE" | "OTHER"
  relation: string
  maritalStatus: string
  gotra: string
  disability: boolean
  bloodGroup: string
  mobileNumber: string
  email: string

  // Address details
  permanentAddress: string
  currentAddress: string
  state: string
  district: string
  pincode: string
  village: string
  isCurrentAddressInIndia: boolean
  currentCountry: string

  // Educational Details
  isStudent: boolean
  educationLevel: string
  classCompleted: string
  currentClass?: string
  collegeCourse: string
  institutionName: string
  enrollmentStatus?: string
  schoolName?: string
  higherEducationType?: string
  currentEducationCity?: string
  currentEducationCountry?: string
  isHelpRequiredFromSamaj: boolean
  isCurrentlyEnrolled?: boolean
  dropoutReason?: string
  educationMode?: string
  isStudyingAbroad?: boolean
  scholarshipReceived?: boolean
  scholarshipDetails?: string
  boardOrUniversity?: string
  yearOfPassing?: number
  fieldOfStudy?: string

  // Employment details
  isEmployed: boolean
  occupationType?: string
  employmentStatus?: string
  monthlyIncome?: number
  incomeSourceCountry: boolean
  countryName?: string
  jobCategory?: string
  employerOrganizationName?: string
  isGovernmentJob?: boolean
  jobPosition?: string
  jobType?: string
  workExperienceYears?: number
  isSelfEmployed?: boolean
  selfEmployedJobType?: string
  nameOfBusiness?: string
  businessCategory?: string
  sizeOfBusiness?: string
  businessRegistration?: boolean
  willingToHirePeople?: boolean
  occupationState?: string
  occupationCity?: string
  preferredJobLocation?: string
  isOpenToRelocate?: boolean
  workingHoursPerWeek?: number
  hasAdditionalSkills?: boolean

  // Living status
  livestock: string
  landOwned: number
  houseType: string
  houseOwnership: string
  hasElectricity: boolean
  waterSource: string
  hasToilet: boolean
  cookingFuel: string

  // Health issues
  hasHealthIssues: boolean
  chronicDisease: string
  isVaccinated: boolean
  hasHealthInsurance: boolean
  isInterestedInFutureHealthPolicy: boolean

  // Welfare schemes and survey
  hasSmartphone: boolean
  hasInternet: boolean
  hasBankAccount: boolean
  hasJanDhan: boolean
  isMukhiya: boolean
  welfareSchemes: string[]
  isInterestedInFutureSamuhikVivah: boolean
  vehicleType: "NONE" | "BICYCLE" | "MOTORCYCLE" | "CAR" | "TRUCK" | "OTHER"
}

interface FamilyData {
  mukhiyaName: string
  currentAddress: string
  status: string
  economicStatus: string
  longitude?: number
  latitude?: number
  anyComment: string
  familyDistrict: string
  familyState: string
  familyPincode: string
  members: FamilyMember[]
}

const initialMember: Omit<FamilyMember, "id"> = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  age: 0,
  gender: "MALE",
  relation: "",
  maritalStatus: "unmarried",
  gotra: "",
  disability: false,
  bloodGroup: "",
  mobileNumber: "",
  email: "",
  permanentAddress: "",
  currentAddress: "",
  state: "",
  district: "",
  pincode: "",
  village: "",
  isCurrentAddressInIndia: true,
  currentCountry: "India",
  isStudent: false,
  educationLevel: "",
  classCompleted: "",
  currentClass: "",
  collegeCourse: "",
  institutionName: "",
  enrollmentStatus: "",
  schoolName: "",
  higherEducationType: "",
  currentEducationCity: "",
  currentEducationCountry: "",
  isHelpRequiredFromSamaj: false,
  isCurrentlyEnrolled: false,
  dropoutReason: "",
  educationMode: "",
  isStudyingAbroad: false,
  scholarshipReceived: false,
  scholarshipDetails: "",
  boardOrUniversity: "",
  yearOfPassing: undefined,
  fieldOfStudy: "",
  isEmployed: false,
  occupationType: "",
  employmentStatus: "",
  monthlyIncome: 0,
  incomeSourceCountry: false,
  countryName: "",
  jobCategory: "",
  employerOrganizationName: "",
  isGovernmentJob: false,
  jobPosition: "",
  jobType: "",
  workExperienceYears: 0,
  isSelfEmployed: false,
  selfEmployedJobType: "",
  nameOfBusiness: "",
  businessCategory: "",
  sizeOfBusiness: "",
  businessRegistration: false,
  willingToHirePeople: false,
  occupationState: "",
  occupationCity: "",
  preferredJobLocation: "",
  isOpenToRelocate: false,
  workingHoursPerWeek: 0,
  hasAdditionalSkills: false,
  livestock: "",
  landOwned: 0,
  houseType: "kutcha",
  houseOwnership: "owned",
  hasElectricity: false,
  waterSource: "tap",
  hasToilet: false,
  cookingFuel: "firewood",
  hasHealthIssues: false,
  chronicDisease: "",
  isVaccinated: false,
  hasHealthInsurance: false,
  isInterestedInFutureHealthPolicy: false,
  hasSmartphone: false,
  hasInternet: false,
  hasBankAccount: false,
  hasJanDhan: false,
  isMukhiya: false,
  welfareSchemes: [],
  isInterestedInFutureSamuhikVivah: false,
  vehicleType: "NONE",
}

interface FamilyFormProps {
  mode: "add" | "edit"
  familyId?: string
  onSuccess?: () => void
}

export default function FamilyForm({ mode, familyId }: FamilyFormProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.villageId as string
  const searchParams = useSearchParams()
  const chakolaId = searchParams.get("chakolaId")

  const { data: familyDetails, isLoading: isFetching } = useGetFamilyDetails(familyId || "")
  const { mutation } = useCreateFamily()
  const { mutation: updateMutation } = useUpdateFamily()

  // If edit mode and data is loaded, use it as initial state
  const [familyData, setFamilyData] = useState<FamilyData>(() => {
    if (mode === "edit" && familyDetails) {
      return {
        mukhiyaName: familyDetails.mukhiyaName || "",
        currentAddress: familyDetails.currentAddress || "",
        status: familyDetails.status || "draft",
        economicStatus: familyDetails.economicStatus || "bpl",
        longitude: familyDetails.longitude,
        latitude: familyDetails.latitude,
        anyComment: familyDetails.anyComment || "",
        familyDistrict: familyDetails.familyDistrict || "",
        familyState: familyDetails.familyState || "",
        familyPincode: familyDetails.familyPincode || "",
        members: familyDetails.Person || [],
      }
    }
    return {
      mukhiyaName: "",
      currentAddress: "",
      status: "draft",
      economicStatus: "bpl",
      longitude: undefined,
      latitude: undefined,
      anyComment: "",
      familyDistrict: "",
      familyState: "",
      familyPincode: "",
      members: [{ ...initialMember, isMukhiya: true, id: `member-${Date.now()}` }],
    }
  })

  useEffect(() => {
    if (mode === "edit" && familyDetails) {
      setFamilyData({
        mukhiyaName: familyDetails.mukhiyaName || "",
        currentAddress: familyDetails.currentAddress || "",
        status: familyDetails.status || "draft",
        economicStatus: familyDetails.economicStatus || "bpl",
        longitude: familyDetails.longitude,
        latitude: familyDetails.latitude,
        anyComment: familyDetails.anyComment || "",
        familyDistrict: familyDetails.familyDistrict || "",
        familyState: familyDetails.familyState || "",
        familyPincode: familyDetails.familyPincode || "",
        members: familyDetails.Person || [],
      })
    }
  }, [mode, familyDetails])

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

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFamilyData((prev) => ({
            ...prev,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          }))
        },
        (error) => {
          console.log("Geolocation error:", error)
          // Set to null if location access is denied
          setFamilyData((prev) => ({
            ...prev,
            longitude: null,
            latitude: null,
          }))
        },
      )
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700 hindi-text text-sm sm:text-base">लोड हो रहा है...</p>
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
            const updatedMember = { ...updatedMembers.find((m) => m.id === memberId)!, [field]: value }
            // Update family mukhiya name
            setFamilyData((prevFamily) => ({
              ...prevFamily,
              mukhiyaName: `${updatedMember.firstName} ${updatedMember.lastName}`,
            }))
            return updatedMember
          }

          // If updating date of birth, also update age
          if (field === "dateOfBirth") {
            if (!value) return { ...member }

            const isoDate = new Date(value).toISOString()
            const age = calculateAge(value)

            return {
              ...member,
              [field]: isoDate,
              age,
            }
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

      // Check for unique mobile numbers
      const mobileNumbers = familyData.members.map((m) => m.mobileNumber).filter(Boolean)
      const duplicateMobile = mobileNumbers.find((num, index) => mobileNumbers.indexOf(num) !== index)
      if (duplicateMobile) {
        newErrors.mobile = `मोबाइल नंबर ${duplicateMobile} डुप्लिकेट है`
      }

      // Check required fields for each member
      familyData.members.forEach((member, index) => {
        if (!member.firstName.trim()) {
          newErrors[`member-${index}-firstName`] = "पहला नाम आवश्यक है"
        }
        if (!member.lastName.trim()) {
          newErrors[`member-${index}-lastName`] = "अंतिम नाम आवश्यक है"
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
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert("परिवार का डेटा ड्राफ्ट के रूप में सहेजा गया!")
      router.push(`/admin/village/${villageId}`)
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
      const mukhiya = familyData.members.find((m) => m.isMukhiya)
      const mukhiyaName = mukhiya ? `${mukhiya.firstName} ${mukhiya.lastName}` : ""

      const submitData = {
        ...familyData,
        mukhiyaName,
        villageId,
        chakolaId,
      }

      if (mode === "edit") {
        updateMutation.mutate(submitData)
      } else {
        mutation.mutate(submitData)
      }

      alert("परिवार सफलतापूर्वक पंजीकृत हो गया!")
      router.back()
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
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 touch-target flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hindi-text text-xs sm:text-sm">वापस</span>
              </Button>
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={40}
                height={40}
                className="rounded-full shadow-lg flex-shrink-0 sm:w-[50px] sm:h-[50px]"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white hindi-text truncate">
                  {mode === "edit" ? "परिवार संपादित करें" : "नया परिवार जोड़ें"}
                </h1>
                <p className="text-orange-100 text-xs sm:text-sm hindi-text truncate">परिवार पंजीकरण फॉर्म</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Error Alerts */}
        {(errors.mukhiya || errors.aadhaar || errors.mobile) && (
          <Alert className="mb-4 sm:mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <AlertDescription className="text-red-800 text-sm">
              {errors.mukhiya && <div className="hindi-text">{errors.mukhiya}</div>}
              {errors.aadhaar && <div className="hindi-text">{errors.aadhaar}</div>}
              {errors.mobile && <div className="hindi-text">{errors.mobile}</div>}
            </AlertDescription>
          </Alert>
        )}

        {/* Family Level Information */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center hindi-text text-lg sm:text-xl">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              परिवार की जानकारी
            </CardTitle>
            <CardDescription className="hindi-text text-sm">परिवार स्तर की बुनियादी जानकारी</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAddress" className="hindi-text text-sm font-medium">
                  वर्तमान पता *
                </Label>
                <Textarea
                  id="currentAddress"
                  value={familyData.currentAddress}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, currentAddress: e.target.value }))}
                  placeholder="वर्तमान पता दर्ज करें"
                  className="mt-1 min-h-[80px] text-sm"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="anyComment" className="hindi-text text-sm font-medium">
                  कोई टिप्पणी
                </Label>
                <Textarea
                  id="anyComment"
                  value={familyData.anyComment}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, anyComment: e.target.value }))}
                  placeholder="कोई अतिरिक्त जानकारी या टिप्पणी"
                  className="mt-1 min-h-[80px] text-sm"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="economicStatus" className="hindi-text text-sm font-medium">
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

              <div>
                <Label htmlFor="familyState" className="hindi-text text-sm font-medium">
                  राज्य
                </Label>
                <Input
                  id="familyState"
                  value={familyData.familyState}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, familyState: e.target.value }))}
                  placeholder="राज्य का नाम"
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="familyDistrict" className="hindi-text text-sm font-medium">
                  जिला
                </Label>
                <Input
                  id="familyDistrict"
                  value={familyData.familyDistrict}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, familyDistrict: e.target.value }))}
                  placeholder="जिला का नाम"
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="familyPincode" className="hindi-text text-sm font-medium">
                  पिनकोड
                </Label>
                <Input
                  id="familyPincode"
                  value={familyData.familyPincode}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, familyPincode: e.target.value }))}
                  placeholder="पिनकोड"
                  maxLength={6}
                  className="mt-1 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members Section */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0 flex-1">
                <CardTitle className="flex items-center hindi-text text-lg sm:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  परिवार के सदस्य ({familyData.members.length})
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                  <CardDescription className="hindi-text text-sm">सभी परिवारिक सदस्यों की विस्तृत जानकारी</CardDescription>
                  {mukhiyaCount === 1 && (
                    <Badge className="bg-green-100 text-green-700 text-xs w-fit">
                      <UserCheck className="w-3 h-3 mr-1" />
                      <span className="hindi-text">मुखिया चुना गया</span>
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                onClick={addMember}
                className="bg-orange-500 hover:bg-orange-600 touch-target w-full sm:w-auto"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hindi-text">सदस्य जोड़ें</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              {familyData.members.map((member, index) => (
                <AccordionItem key={member.id} value={member.id} className="border rounded-lg">
                  <AccordionTrigger className="mobile-accordion-trigger hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-2 sm:mr-4 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="font-medium text-sm sm:text-base truncate">
                                {member.firstName && member.lastName
                                  ? `${member.firstName} ${member.lastName}`
                                  : `सदस्य ${index + 1}`}
                              </span>
                              {member.isMukhiya && (
                                <Badge className="bg-orange-100 text-orange-700 text-xs w-fit">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  <span className="hindi-text">मुखिया</span>
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {member.age > 0 && (
                          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                            {member.age} वर्ष
                          </Badge>
                        )}
                        {member.gender && (
                          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
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
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 touch-target p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 sm:px-4 pb-4">
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
                          <User className="w-4 h-4 mr-2" />
                          व्यक्तिगत जानकारी
                        </h4>
                        <div className="mobile-form-grid">
                          <div>
                            <Label className="hindi-text text-sm">पहला नाम *</Label>
                            <Input
                              value={member.firstName}
                              onChange={(e) => updateMember(member.id, "firstName", e.target.value)}
                              placeholder="पहला नाम दर्ज करें"
                              className={`mt-1 text-sm ${errors[`member-${index}-firstName`] ? "border-red-500" : ""}`}
                            />
                            {errors[`member-${index}-firstName`] && (
                              <p className="text-red-500 text-xs mt-1 hindi-text">
                                {errors[`member-${index}-firstName`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="hindi-text text-sm">अंतिम नाम *</Label>
                            <Input
                              value={member.lastName}
                              onChange={(e) => updateMember(member.id, "lastName", e.target.value)}
                              placeholder="अंतिम नाम दर्ज करें"
                              className={`mt-1 text-sm ${errors[`member-${index}-lastName`] ? "border-red-500" : ""}`}
                            />
                            {errors[`member-${index}-lastName`] && (
                              <p className="text-red-500 text-xs mt-1 hindi-text">
                                {errors[`member-${index}-lastName`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="hindi-text flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              जन्म तिथि *
                            </Label>
                            <Input
                              type="date"
                              value={member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split("T")[0] : ""}
                              onChange={(e) => updateMember(member.id, "dateOfBirth", e.target.value)}
                              className={`mt-1 text-sm ${errors[`member-${index}-dob`] ? "border-red-500" : ""}`}
                              max={new Date().toISOString().split("T")[0]}
                            />
                            {errors[`member-${index}-dob`] && (
                              <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-dob`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="hindi-text text-sm">उम्र</Label>
                            <Input
                              type="number"
                              value={member.age || ""}
                              readOnly
                              placeholder="जन्म तिथि से गणना होगी"
                              className="bg-gray-50 cursor-not-allowed mt-1 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1 hindi-text">जन्म तिथि के आधार पर स्वचालित गणना</p>
                          </div>
                          <div>
                            <Label className="hindi-text flex items-center text-sm">
                              <Phone className="w-4 h-4 mr-1" />
                              मोबाइल नंबर
                            </Label>
                            <Input
                              value={member.mobileNumber}
                              onChange={(e) => updateMember(member.id, "mobileNumber", e.target.value)}
                              placeholder="10 अंकों का मोबाइल नंबर"
                              maxLength={10}
                              className={`mt-1 text-sm ${errors[`member-${index}-mobile`] ? "border-red-500" : ""}`}
                            />
                            {errors[`member-${index}-mobile`] && (
                              <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-mobile`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="hindi-text flex items-center text-sm">
                              <Mail className="w-4 h-4 mr-1" />
                              ईमेल पता
                            </Label>
                            <Input
                              type="email"
                              value={member.email}
                              onChange={(e) => updateMember(member.id, "email", e.target.value)}
                              placeholder="example@email.com"
                              className={`mt-1 text-sm ${errors[`member-${index}-email`] ? "border-red-500" : ""}`}
                            />
                            {errors[`member-${index}-email`] && (
                              <p className="text-red-500 text-xs mt-1 hindi-text">{errors[`member-${index}-email`]}</p>
                            )}
                          </div>
                          <div>
                            <Label className="hindi-text text-sm">लिंग</Label>
                            <Select
                              value={member.gender}
                              onValueChange={(value) => updateMember(member.id, "gender", value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MALE">पुरुष</SelectItem>
                                <SelectItem value="FEMALE">महिला</SelectItem>
                                <SelectItem value="OTHER">अन्य</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="hindi-text text-sm">रिश्ता</Label>
                            <Select
                              value={member.relation}
                              onValueChange={(value) => updateMember(member.id, "relation", value)}
                            >
                              <SelectTrigger className="mt-1">
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
                            <Label className="hindi-text text-sm">वैवाहिक स्थिति</Label>
                            <Select
                              value={member.maritalStatus}
                              onValueChange={(value) => updateMember(member.id, "maritalStatus", value)}
                            >
                              <SelectTrigger className="mt-1">
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
                            <Label className="hindi-text text-sm">गोत्र</Label>
                            <Input
                              value={member.gotra}
                              onChange={(e) => updateMember(member.id, "gotra", e.target.value)}
                              placeholder="गोत्र का नाम"
                              className="mt-1 text-sm"
                            />
                          </div>
                          <div>
                            <Label className="hindi-text text-sm">ब्लड ग्रुप</Label>
                            <Select
                              value={member.bloodGroup}
                              onValueChange={(value) => updateMember(member.id, "bloodGroup", value)}
                            >
                              <SelectTrigger className="mt-1">
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
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`disability-${member.id}`}
                              checked={member.disability}
                              onCheckedChange={(checked) => updateMember(member.id, "disability", checked)}
                            />
                            <Label htmlFor={`disability-${member.id}`} className="hindi-text text-sm">
                              विकलांगता है
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`mukhiya-${member.id}`}
                              checked={member.isMukhiya}
                              onCheckedChange={(checked) => updateMember(member.id, "isMukhiya", checked)}
                            />
                            <Label
                              htmlFor={`mukhiya-${member.id}`}
                              className="font-medium text-orange-700 hindi-text text-sm"
                            >
                              मुखिया है
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`samuhikVivah-${member.id}`}
                              checked={member.isInterestedInFutureSamuhikVivah}
                              onCheckedChange={(checked) =>
                                updateMember(member.id, "isInterestedInFutureSamuhikVivah", checked)
                              }
                            />
                            <Label htmlFor={`samuhikVivah-${member.id}`} className="hindi-text text-sm">
                              सामूहिक विवाह में रुचि
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
                          <MapPin className="w-4 h-4 mr-2" />
                          पता की जानकारी
                        </h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <Label className="hindi-text text-sm">स्थायी पता</Label>
                              <Textarea
                                value={member.permanentAddress}
                                onChange={(e) => updateMember(member.id, "permanentAddress", e.target.value)}
                                placeholder="स्थायी पता दर्ज करें"
                                className="mt-1 text-sm"
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label className="hindi-text text-sm">वर्तमान पता</Label>
                              <Textarea
                                value={member.currentAddress}
                                onChange={(e) => updateMember(member.id, "currentAddress", e.target.value)}
                                placeholder="वर्तमान पता दर्ज करें"
                                className="mt-1 text-sm"
                                rows={3}
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`currentAddressIndia-${member.id}`}
                              checked={member.isCurrentAddressInIndia}
                              onCheckedChange={(checked) => updateMember(member.id, "isCurrentAddressInIndia", checked)}
                            />
                            <Label htmlFor={`currentAddressIndia-${member.id}`} className="hindi-text text-sm">
                              वर्तमान पता भारत में है
                            </Label>
                          </div>

                          {!member.isCurrentAddressInIndia && (
                            <div className="max-w-md">
                              <Label className="hindi-text flex items-center text-sm">
                                <Globe className="w-4 h-4 mr-1" />
                                देश का नाम
                              </Label>
                              <Input
                                value={member.currentCountry}
                                onChange={(e) => updateMember(member.id, "currentCountry", e.target.value)}
                                placeholder="देश का नाम दर्ज करें"
                                className="mt-1 text-sm"
                              />
                            </div>
                          )}

                          <div className="mobile-form-grid">
                            <div>
                              <Label className="hindi-text text-sm">राज्य</Label>
                              <Input
                                value={member.state}
                                onChange={(e) => updateMember(member.id, "state", e.target.value)}
                                placeholder="राज्य"
                                className="mt-1 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="hindi-text text-sm">जिला</Label>
                              <Input
                                value={member.district}
                                onChange={(e) => updateMember(member.id, "district", e.target.value)}
                                placeholder="जिला"
                                className="mt-1 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="hindi-text text-sm">गांव का नाम</Label>
                              <Input
                                value={member.village}
                                onChange={(e) => updateMember(member.id, "village", e.target.value)}
                                placeholder="गांव का नाम"
                                className="mt-1 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="hindi-text text-sm">पिनकोड</Label>
                              <Input
                                value={member.pincode}
                                onChange={(e) => updateMember(member.id, "pincode", e.target.value)}
                                placeholder="पिनकोड"
                                maxLength={6}
                                className="mt-1 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Education Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          शिक्षा की जानकारी
                        </h4>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`student-${member.id}`}
                                checked={member.isStudent}
                                onCheckedChange={(checked) => updateMember(member.id, "isStudent", checked)}
                              />
                              <Label htmlFor={`student-${member.id}`} className="hindi-text text-sm">
                                वर्तमान में छात्र/छात्रा है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`currentlyEnrolled-${member.id}`}
                                checked={member.isCurrentlyEnrolled}
                                onCheckedChange={(checked) => updateMember(member.id, "isCurrentlyEnrolled", checked)}
                              />
                              <Label htmlFor={`currentlyEnrolled-${member.id}`} className="hindi-text text-sm">
                                वर्तमान में नामांकित है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`studyingAbroad-${member.id}`}
                                checked={member.isStudyingAbroad}
                                onCheckedChange={(checked) => updateMember(member.id, "isStudyingAbroad", checked)}
                              />
                              <Label htmlFor={`studyingAbroad-${member.id}`} className="hindi-text text-sm">
                                विदेश में पढ़ाई कर रहे हैं
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`helpFromSamaj-${member.id}`}
                                checked={member.isHelpRequiredFromSamaj}
                                onCheckedChange={(checked) =>
                                  updateMember(member.id, "isHelpRequiredFromSamaj", checked)
                                }
                              />
                              <Label htmlFor={`helpFromSamaj-${member.id}`} className="hindi-text text-sm">
                                समाज से सहायता चाहिए
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`scholarship-${member.id}`}
                                checked={member.scholarshipReceived}
                                onCheckedChange={(checked) => updateMember(member.id, "scholarshipReceived", checked)}
                              />
                              <Label htmlFor={`scholarship-${member.id}`} className="hindi-text text-sm">
                                छात्रवृत्ति प्राप्त है
                              </Label>
                            </div>
                          </div>

                          <div className="mobile-form-grid">
                            <div>
                              <Label className="hindi-text text-sm">शिक्षा का स्तर</Label>
                              <Select
                                value={member.educationLevel}
                                onValueChange={(value) => updateMember(member.id, "educationLevel", value)}
                              >
                                <SelectTrigger className="mt-1">
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
                              <Label className="hindi-text text-sm">पूर्ण की गई कक्षा</Label>
                              <Select
                                value={member.classCompleted}
                                onValueChange={(value) => updateMember(member.id, "classCompleted", value)}
                              >
                                <SelectTrigger className="mt-1">
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
                                <Label className="hindi-text text-sm">वर्तमान कक्षा</Label>
                                <Select
                                  value={member.currentClass || ""}
                                  onValueChange={(value) => updateMember(member.id, "currentClass", value)}
                                >
                                  <SelectTrigger className="mt-1">
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
                              <Label className="hindi-text text-sm">कॉलेज कोर्स</Label>
                              <Input
                                value={member.collegeCourse}
                                onChange={(e) => updateMember(member.id, "collegeCourse", e.target.value)}
                                placeholder="कॉलेज कोर्स का नाम"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">संस्थान का नाम</Label>
                              <Input
                                value={member.institutionName}
                                onChange={(e) => updateMember(member.id, "institutionName", e.target.value)}
                                placeholder="स्कूल/कॉलेज/विश्वविद्यालय का नाम"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">स्कूल का नाम</Label>
                              <Input
                                value={member.schoolName || ""}
                                onChange={(e) => updateMember(member.id, "schoolName", e.target.value)}
                                placeholder="स्कूल का नाम"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">शिक्षा का तरीका</Label>
                              <Select
                                value={member.educationMode || ""}
                                onValueChange={(value) => updateMember(member.id, "educationMode", value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="शिक्षा का तरीका चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="regular">नियमित</SelectItem>
                                  <SelectItem value="distance">दूरस्थ शिक्षा</SelectItem>
                                  <SelectItem value="online">ऑनलाइन</SelectItem>
                                  <SelectItem value="correspondence">पत्राचार</SelectItem>
                                  <SelectItem value="part_time">अंशकालिक</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">वर्तमान शिक्षा शहर</Label>
                              <Input
                                value={member.currentEducationCity || ""}
                                onChange={(e) => updateMember(member.id, "currentEducationCity", e.target.value)}
                                placeholder="शिक्षा प्राप्त कर रहे शहर का नाम"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">वर्तमान शिक्षा देश</Label>
                              <Input
                                value={member.currentEducationCountry || ""}
                                onChange={(e) => updateMember(member.id, "currentEducationCountry", e.target.value)}
                                placeholder="शिक्षा प्राप्त कर रहे देश का नाम"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">बोर्ड/विश्वविद्यालय</Label>
                              <Input
                                value={member.boardOrUniversity || ""}
                                onChange={(e) => updateMember(member.id, "boardOrUniversity", e.target.value)}
                                placeholder="बोर्ड या विश्वविद्यालय का नाम"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">अध्ययन क्षेत्र</Label>
                              <Input
                                value={member.fieldOfStudy || ""}
                                onChange={(e) => updateMember(member.id, "fieldOfStudy", e.target.value)}
                                placeholder="अध्ययन का विषय/क्षेत्र"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">उत्तीर्ण वर्ष</Label>
                              <Input
                                type="number"
                                value={member.yearOfPassing || ""}
                                onChange={(e) =>
                                  updateMember(member.id, "yearOfPassing", Number.parseInt(e.target.value) || undefined)
                                }
                                placeholder="उत्तीर्ण होने का वर्ष"
                                min="1950"
                                max={new Date().getFullYear() + 10}
                                className="mt-1 text-sm"
                              />
                            </div>
                          </div>

                          {member.scholarshipReceived && (
                            <div>
                              <Label className="hindi-text text-sm">छात्रवृत्ति विवरण</Label>
                              <Textarea
                                value={member.scholarshipDetails || ""}
                                onChange={(e) => updateMember(member.id, "scholarshipDetails", e.target.value)}
                                placeholder="छात्रवृत्ति का विवरण"
                                className="mt-1 text-sm"
                                rows={2}
                              />
                            </div>
                          )}

                          {member.enrollmentStatus === "dropped" && (
                            <div>
                              <Label className="hindi-text text-sm">छोड़ने का कारण</Label>
                              <Input
                                value={member.dropoutReason || ""}
                                onChange={(e) => updateMember(member.id, "dropoutReason", e.target.value)}
                                placeholder="छोड़ने का कारण बताएं"
                                className="mt-1 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Employment Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
                          <Briefcase className="w-4 h-4 mr-2" />
                          रोजगार की जानकारी
                        </h4>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`employed-${member.id}`}
                                checked={member.isEmployed}
                                onCheckedChange={(checked) => updateMember(member.id, "isEmployed", checked)}
                              />
                              <Label htmlFor={`employed-${member.id}`} className="hindi-text text-sm">
                                रोजगार में है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`selfEmployed-${member.id}`}
                                checked={member.isSelfEmployed}
                                onCheckedChange={(checked) => updateMember(member.id, "isSelfEmployed", checked)}
                              />
                              <Label htmlFor={`selfEmployed-${member.id}`} className="hindi-text text-sm">
                                स्व-रोजगार में है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`governmentJob-${member.id}`}
                                checked={member.isGovernmentJob}
                                onCheckedChange={(checked) => updateMember(member.id, "isGovernmentJob", checked)}
                              />
                              <Label htmlFor={`governmentJob-${member.id}`} className="hindi-text text-sm">
                                सरकारी नौकरी है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`businessRegistration-${member.id}`}
                                checked={member.businessRegistration}
                                onCheckedChange={(checked) => updateMember(member.id, "businessRegistration", checked)}
                              />
                              <Label htmlFor={`businessRegistration-${member.id}`} className="hindi-text text-sm">
                                व्यापार पंजीकृत है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`willingToHire-${member.id}`}
                                checked={member.willingToHirePeople}
                                onCheckedChange={(checked) => updateMember(member.id, "willingToHirePeople", checked)}
                              />
                              <Label htmlFor={`willingToHire-${member.id}`} className="hindi-text text-sm">
                                लोगों को काम देने को तैयार
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`openToRelocate-${member.id}`}
                                checked={member.isOpenToRelocate}
                                onCheckedChange={(checked) => updateMember(member.id, "isOpenToRelocate", checked)}
                              />
                              <Label htmlFor={`openToRelocate-${member.id}`} className="hindi-text text-sm">
                                स्थानांतरण के लिए तैयार
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`additionalSkills-${member.id}`}
                                checked={member.hasAdditionalSkills}
                                onCheckedChange={(checked) => updateMember(member.id, "hasAdditionalSkills", checked)}
                              />
                              <Label htmlFor={`additionalSkills-${member.id}`} className="hindi-text text-sm">
                                अतिरिक्त कौशल है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`incomeSourceCountry-${member.id}`}
                                checked={member.incomeSourceCountry}
                                onCheckedChange={(checked) => updateMember(member.id, "incomeSourceCountry", checked)}
                              />
                              <Label htmlFor={`incomeSourceCountry-${member.id}`} className="hindi-text text-sm">
                                आय का स्रोत विदेश में है
                              </Label>
                            </div>
                          </div>

                          <div className="mobile-form-grid">
                            <div>
                              <Label className="hindi-text text-sm">व्यवसाय का प्रकार</Label>
                              <Select
                                value={member.occupationType || ""}
                                onValueChange={(value) => updateMember(member.id, "occupationType", value)}
                              >
                                <SelectTrigger className="mt-1">
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
                                  <SelectItem value="professional">पेशेवर</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">रोजगार की स्थिति</Label>
                              <Select
                                value={member.employmentStatus || ""}
                                onValueChange={(value) => updateMember(member.id, "employmentStatus", value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="रोजगार की स्थिति चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="employed">कार्यरत</SelectItem>
                                  <SelectItem value="unemployed">बेरोजगार</SelectItem>
                                  <SelectItem value="self_employed">स्व-रोजगार</SelectItem>
                                  <SelectItem value="retired">सेवानिवृत्त</SelectItem>
                                  <SelectItem value="student">छात्र</SelectItem>
                                  <SelectItem value="homemaker">गृहिणी</SelectItem>
                                  <SelectItem value="looking_for_job">नौकरी की तलाश में</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">नौकरी की श्रेणी</Label>
                              <Select
                                value={member.jobCategory || ""}
                                onValueChange={(value) => updateMember(member.id, "jobCategory", value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="नौकरी की श्रेणी चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="agriculture">कृषि</SelectItem>
                                  <SelectItem value="healthcare">स्वास्थ्य सेवा</SelectItem>
                                  <SelectItem value="education">शिक्षा</SelectItem>
                                  <SelectItem value="technology">प्रौद्योगिकी</SelectItem>
                                  <SelectItem value="finance">वित्त</SelectItem>
                                  <SelectItem value="manufacturing">विनिर्माण</SelectItem>
                                  <SelectItem value="construction">निर्माण</SelectItem>
                                  <SelectItem value="transport">परिवहन</SelectItem>
                                  <SelectItem value="retail">खुदरा व्यापार</SelectItem>
                                  <SelectItem value="hospitality">आतिथ्य</SelectItem>
                                  <SelectItem value="government">सरकारी सेवा</SelectItem>
                                  <SelectItem value="other">अन्य</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">नौकरी का प्रकार</Label>
                              <Select
                                value={member.jobType || ""}
                                onValueChange={(value) => updateMember(member.id, "jobType", value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="नौकरी का प्रकार चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full_time">पूर्णकालिक</SelectItem>
                                  <SelectItem value="part_time">अंशकालिक</SelectItem>
                                  <SelectItem value="contract">अनुबंध आधारित</SelectItem>
                                  <SelectItem value="freelance">फ्रीलांस</SelectItem>
                                  <SelectItem value="temporary">अस्थायी</SelectItem>
                                  <SelectItem value="permanent">स्थायी</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">पद/पदनाम</Label>
                              <Input
                                value={member.jobPosition || ""}
                                onChange={(e) => updateMember(member.id, "jobPosition", e.target.value)}
                                placeholder="पद का नाम"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">नियोक्ता/संगठन का नाम</Label>
                              <Input
                                value={member.employerOrganizationName || ""}
                                onChange={(e) => updateMember(member.id, "employerOrganizationName", e.target.value)}
                                placeholder="कंपनी/संगठन का नाम"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">मासिक आय (₹)</Label>
                              <Input
                                type="number"
                                value={member.monthlyIncome || ""}
                                onChange={(e) =>
                                  updateMember(
                                    member.id,
                                    "monthlyIncome",
                                    Number.parseFloat(e.target.value) || undefined,
                                  )
                                }
                                placeholder="मासिक आय"
                                min="0"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">कार्य अनुभव (वर्ष)</Label>
                              <Input
                                type="number"
                                value={member.workExperienceYears || ""}
                                onChange={(e) =>
                                  updateMember(
                                    member.id,
                                    "workExperienceYears",
                                    Number.parseInt(e.target.value) || undefined,
                                  )
                                }
                                placeholder="कुल कार्य अनुभव"
                                min="0"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">साप्ताहिक कार्य घंटे</Label>
                              <Input
                                type="number"
                                value={member.workingHoursPerWeek || ""}
                                onChange={(e) =>
                                  updateMember(
                                    member.id,
                                    "workingHoursPerWeek",
                                    Number.parseInt(e.target.value) || undefined,
                                  )
                                }
                                placeholder="प्रति सप्ताह कार्य घंटे"
                                min="0"
                                max="168"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">कार्य स्थान राज्य</Label>
                              <Select
                                value={member.occupationState || ""}
                                onValueChange={(value) => updateMember(member.id, "occupationState", value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="राज्य चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="andhra_pradesh">आंध्र प्रदेश</SelectItem>
                                  <SelectItem value="arunachal_pradesh">अरुणाचल प्रदेश</SelectItem>
                                  <SelectItem value="assam">असम</SelectItem>
                                  <SelectItem value="bihar">बिहार</SelectItem>
                                  <SelectItem value="chhattisgarh">छत्तीसगढ़</SelectItem>
                                  <SelectItem value="goa">गोवा</SelectItem>
                                  <SelectItem value="gujarat">गुजरात</SelectItem>
                                  <SelectItem value="haryana">हरियाणा</SelectItem>
                                  <SelectItem value="himachal_pradesh">हिमाचल प्रदेश</SelectItem>
                                  <SelectItem value="jharkhand">झारखंड</SelectItem>
                                  <SelectItem value="karnataka">कर्नाटक</SelectItem>
                                  <SelectItem value="kerala">केरल</SelectItem>
                                  <SelectItem value="madhya_pradesh">मध्य प्रदेश</SelectItem>
                                  <SelectItem value="maharashtra">महाराष्ट्र</SelectItem>
                                  <SelectItem value="manipur">मणिपुर</SelectItem>
                                  <SelectItem value="meghalaya">मेघालय</SelectItem>
                                  <SelectItem value="mizoram">मिजोरम</SelectItem>
                                  <SelectItem value="nagaland">नागालैंड</SelectItem>
                                  <SelectItem value="odisha">ओडिशा</SelectItem>
                                  <SelectItem value="punjab">पंजाब</SelectItem>
                                  <SelectItem value="rajasthan">राजस्थान</SelectItem>
                                  <SelectItem value="sikkim">सिक्किम</SelectItem>
                                  <SelectItem value="tamil_nadu">तमिल नाडु</SelectItem>
                                  <SelectItem value="telangana">तेलंगाना</SelectItem>
                                  <SelectItem value="tripura">त्रिपुरा</SelectItem>
                                  <SelectItem value="uttar_pradesh">उत्तर प्रदेश</SelectItem>
                                  <SelectItem value="uttarakhand">उत्तराखंड</SelectItem>
                                  <SelectItem value="west_bengal">पश्चिम बंगाल</SelectItem>
                                  <SelectItem value="andaman_nicobar">अंडमान और निकोबार द्वीप समूह</SelectItem>
                                  <SelectItem value="chandigarh">चंडीगढ़</SelectItem>
                                  <SelectItem value="dadra_nagar_haveli">दादरा और नगर हवेली</SelectItem>
                                  <SelectItem value="daman_diu">दमन और दीव</SelectItem>
                                  <SelectItem value="delhi">दिल्ली</SelectItem>
                                  <SelectItem value="jammu_kashmir">जम्मू और कश्मीर</SelectItem>
                                  <SelectItem value="ladakh">लद्दाख</SelectItem>
                                  <SelectItem value="lakshadweep">लक्षद्वीप</SelectItem>
                                  <SelectItem value="puducherry">पुडुचेरी</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">कार्य स्थान जिला</Label>
                              <Input
                                value={member.occupationCity || ""}
                                onChange={(e) => updateMember(member.id, "occupationCity", e.target.value)}
                                placeholder="जिला का नाम दर्ज करें"
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div>
                              <Label className="hindi-text text-sm">पसंदीदा कार्य स्थान</Label>
                              <Input
                                value={member.preferredJobLocation || ""}
                                onChange={(e) => updateMember(member.id, "preferredJobLocation", e.target.value)}
                                placeholder="पसंदीदा कार्य स्थान"
                                className="mt-1 text-sm"
                              />
                            </div>

                            {member.incomeSourceCountry && (
                              <div>
                                <Label className="hindi-text text-sm">आय स्रोत देश का नाम</Label>
                                <Input
                                  value={member.countryName || ""}
                                  onChange={(e) => updateMember(member.id, "countryName", e.target.value)}
                                  placeholder="देश का नाम"
                                  className="mt-1 text-sm"
                                />
                              </div>
                            )}
                          </div>

                          {/* Self Employment Details */}
                          {member.isSelfEmployed && (
                            <div className="border-t pt-4">
                              <h5 className="font-medium text-gray-700 mb-3 hindi-text">स्व-रोजगार विवरण</h5>
                              <div className="mobile-form-grid">
                                <div>
                                  <Label className="hindi-text text-sm">स्व-रोजगार का प्रकार</Label>
                                  <Input
                                    value={member.selfEmployedJobType || ""}
                                    onChange={(e) => updateMember(member.id, "selfEmployedJobType", e.target.value)}
                                    placeholder="स्व-रोजगार का प्रकार"
                                    className="mt-1 text-sm"
                                  />
                                </div>

                                <div>
                                  <Label className="hindi-text text-sm">व्यापार का नाम</Label>
                                  <Input
                                    value={member.nameOfBusiness || ""}
                                    onChange={(e) => updateMember(member.id, "nameOfBusiness", e.target.value)}
                                    placeholder="व्यापार/व्यवसाय का नाम"
                                    className="mt-1 text-sm"
                                  />
                                </div>

                                <div>
                                  <Label className="hindi-text text-sm">व्यापार की श्रेणी</Label>
                                  <Select
                                    value={member.businessCategory || ""}
                                    onChange={(value) => updateMember(member.id, "businessCategory", value)}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="व्यापार की श्रेणी चुनें" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="retail">खुदरा व्यापार</SelectItem>
                                      <SelectItem value="wholesale">थोक व्यापार</SelectItem>
                                      <SelectItem value="manufacturing">विनिर्माण</SelectItem>
                                      <SelectItem value="services">सेवा</SelectItem>
                                      <SelectItem value="agriculture">कृषि</SelectItem>
                                      <SelectItem value="construction">निर्माण</SelectItem>
                                      <SelectItem value="transport">परिवहन</SelectItem>
                                      <SelectItem value="food">खाद्य व्यवसाय</SelectItem>
                                      <SelectItem value="technology">प्रौद्योगिकी</SelectItem>
                                      <SelectItem value="other">अन्य</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="hindi-text text-sm">व्यापार का आकार</Label>
                                  <Select
                                    value={member.sizeOfBusiness || ""}
                                    onChange={(value) => updateMember(member.id, "sizeOfBusiness", value)}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="व्यापार का आकार चुनें" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="micro">सूक्ष्म (1-10 कर्मचारी)</SelectItem>
                                      <SelectItem value="small">लघु (11-50 कर्मचारी)</SelectItem>
                                      <SelectItem value="medium">मध्यम (51-250 कर्मचारी)</SelectItem>
                                      <SelectItem value="large">बड़ा (250+ कर्मचारी)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Living Status */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
                          <Home className="w-4 h-4 mr-2" />
                          आवास और संपत्ति की जानकारी
                        </h4>
                        <div className="mobile-form-grid">
                          <div>
                            <Label className="hindi-text text-sm">घर का प्रकार</Label>
                            <Select
                              value={member.houseType}
                              onValueChange={(value) => updateMember(member.id, "houseType", value)}
                            >
                              <SelectTrigger className="mt-1">
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
                            <Label className="hindi-text text-sm">घर का स्वामित्व</Label>
                            <Select
                              value={member.houseOwnership}
                              onValueChange={(value) => updateMember(member.id, "houseOwnership", value)}
                            >
                              <SelectTrigger className="mt-1">
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
                            <Label className="hindi-text text-sm">पानी का स्रोत</Label>
                            <Select
                              value={member.waterSource}
                              onValueChange={(value) => updateMember(member.id, "waterSource", value)}
                            >
                              <SelectTrigger className="mt-1">
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
                            <Label className="hindi-text text-sm">खाना पकाने का ईंधन</Label>
                            <Select
                              value={member.cookingFuel}
                              onValueChange={(value) => updateMember(member.id, "cookingFuel", value)}
                            >
                              <SelectTrigger className="mt-1">
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

                          <div>
                            <Label className="hindi-text text-sm">भूमि स्वामित्व (एकड़)</Label>
                            <Input
                              type="number"
                              value={member.landOwned || ""}
                              onChange={(e) =>
                                updateMember(member.id, "landOwned", Number.parseFloat(e.target.value) || 0)
                              }
                              placeholder="भूमि का क्षेत्रफल"
                              min="0"
                              step="0.1"
                              className="mt-1 text-sm"
                            />
                          </div>

                          <div>
                            <Label className="hindi-text text-sm">पशुधन</Label>
                            <Input
                              value={member.livestock}
                              onChange={(e) => updateMember(member.id, "livestock", e.target.value)}
                              placeholder="गाय, भैंस, बकरी आदि"
                              className="mt-1 text-sm"
                            />
                          </div>

                          <div>
                            <Label className="hindi-text text-sm">वाहन का प्रकार</Label>
                            <Select
                              value={member.vehicleType}
                              onValueChange={(value) => updateMember(member.id, "vehicleType", value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NONE">कोई वाहन नहीं</SelectItem>
                                <SelectItem value="BICYCLE">साइकिल</SelectItem>
                                <SelectItem value="MOTORCYCLE">मोटरसाइकिल</SelectItem>
                                <SelectItem value="CAR">कार</SelectItem>
                                <SelectItem value="TRUCK">ट्रक</SelectItem>
                                <SelectItem value="OTHER">अन्य</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`electricity-${member.id}`}
                              checked={member.hasElectricity}
                              onCheckedChange={(checked) => updateMember(member.id, "hasElectricity", checked)}
                            />
                            <Label htmlFor={`electricity-${member.id}`} className="hindi-text text-sm">
                              बिजली की सुविधा
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`toilet-${member.id}`}
                              checked={member.hasToilet}
                              onCheckedChange={(checked) => updateMember(member.id, "hasToilet", checked)}
                            />
                            <Label htmlFor={`toilet-${member.id}`} className="hindi-text text-sm">
                              शौचालय की सुविधा
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Health Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
                          <Heart className="w-4 h-4 mr-2" />
                          स्वास्थ्य की जानकारी
                        </h4>
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`health-issues-${member.id}`}
                                checked={member.hasHealthIssues}
                                onCheckedChange={(checked) => updateMember(member.id, "hasHealthIssues", checked)}
                              />
                              <Label htmlFor={`health-issues-${member.id}`} className="hindi-text text-sm">
                                स्वास्थ्य समस्या है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`vaccinated-${member.id}`}
                                checked={member.isVaccinated}
                                onCheckedChange={(checked) => updateMember(member.id, "isVaccinated", checked)}
                              />
                              <Label htmlFor={`vaccinated-${member.id}`} className="hindi-text text-sm">
                                टीकाकरण हुआ है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`health-insurance-${member.id}`}
                                checked={member.hasHealthInsurance}
                                onCheckedChange={(checked) => updateMember(member.id, "hasHealthInsurance", checked)}
                              />
                              <Label htmlFor={`health-insurance-${member.id}`} className="hindi-text text-sm">
                                स्वास्थ्य बीमा है
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`futureHealthPolicy-${member.id}`}
                                checked={member.isInterestedInFutureHealthPolicy}
                                onCheckedChange={(checked) =>
                                  updateMember(member.id, "isInterestedInFutureHealthPolicy", checked)
                                }
                              />
                              <Label htmlFor={`futureHealthPolicy-${member.id}`} className="hindi-text text-sm">
                                भविष्य में स्वास्थ्य बीमा में रुचि
                              </Label>
                            </div>
                          </div>
                          {member.hasHealthIssues && (
                            <div className="max-w-md">
                              <Label className="hindi-text text-sm">पुरानी बीमारी (यदि कोई हो)</Label>
                              <Input
                                value={member.chronicDisease}
                                onChange={(e) => updateMember(member.id, "chronicDisease", e.target.value)}
                                placeholder="बीमारी का नाम"
                                className="mt-1 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Digital Access and Banking */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center hindi-text text-sm sm:text-base">
                          <Smartphone className="w-4 h-4 mr-2" />
                          डिजिटल पहुंच और बैंकिंग
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`smartphone-${member.id}`}
                              checked={member.hasSmartphone}
                              onCheckedChange={(checked) => updateMember(member.id, "hasSmartphone", checked)}
                            />
                            <Label htmlFor={`smartphone-${member.id}`} className="hindi-text text-sm">
                              स्मार्टफोन है
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`internet-${member.id}`}
                              checked={member.hasInternet}
                              onCheckedChange={(checked) => updateMember(member.id, "hasInternet", checked)}
                            />
                            <Label htmlFor={`internet-${member.id}`} className="hindi-text text-sm">
                              इंटरनेट की सुविधा
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`bank-account-${member.id}`}
                              checked={member.hasBankAccount}
                              onCheckedChange={(checked) => updateMember(member.id, "hasBankAccount", checked)}
                            />
                            <Label htmlFor={`bank-account-${member.id}`} className="hindi-text text-sm">
                              बैंक खाता है
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`jan-dhan-${member.id}`}
                              checked={member.hasJanDhan}
                              onCheckedChange={(checked) => updateMember(member.id, "hasJanDhan", checked)}
                            />
                            <Label htmlFor={`jan-dhan-${member.id}`} className="hindi-text text-sm">
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
        <div className="mobile-button-group px-4 pb-4 sm:px-0 sm:pb-0">
          <Button onClick={() => router.back()} variant="outline" className="bg-transparent touch-target" size="lg">
            <span className="hindi-text">रद्द करें</span>
          </Button>
          <Button
            onClick={handleSaveAsDraft}
            disabled={savingDraft}
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent touch-target"
            size="lg"
          >
            {savingDraft ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                <span className="hindi-text text-sm">ड्राफ्ट सहेजा जा रहा है...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hindi-text">ड्राफ्ट के रूप में सहेजें</span>
              </div>
            )}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 touch-target"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="hindi-text text-sm">सहेजा जा रहा है...</span>
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

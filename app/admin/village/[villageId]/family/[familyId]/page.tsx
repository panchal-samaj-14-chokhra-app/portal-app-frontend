"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useMemo, useState, useCallback } from "react"
import Image from "next/image"
import {
  ArrowLeft,
  Edit,
  Download,
  MapPin,
  Calendar,
  User,
  FileText,
  Users,
  CreditCard,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Home,
  MapPinned,
  Phone,
  Mail,
  Landmark,
  Heart,
  Smartphone,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs"
import { Separator } from "@/components/ui/separator/separator"
import { useGetFamilyDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import * as XLSX from "xlsx"
import { calculateAge } from "@/components/group-component/family-form/utils"

// TypeScript interfaces for type safety
interface FamilyMember {
  id: string
  firstName: string
  lastName: string
  fullName?: string
  dateOfBirth?: string
  age?: number
  gender?: string
  relation?: string
  maritalStatus?: string
  gotra?: string
  disability?: boolean
  bloodGroup?: string
  mobileNumber?: string
  email?: string

  // Address fields
  personPermanentAddress?: string
  personPermanentState?: string
  personPermanentDistrict?: string
  personPermanentPincode?: string
  personPermanentVillage?: string
  personCurrentAddress?: string
  personCurrentState?: string
  personCurrentDistrict?: string
  personCurrentPincode?: string
  personCurrentVillage?: string
  isCurrentAddressInIndia?: boolean
  currentCountry?: string

  // Education fields
  isStudent?: boolean
  educationLevel?: string
  classCompleted?: string
  currentClass?: string
  collegeCourse?: string
  institutionName?: string
  enrollmentStatus?: string
  schoolName?: string
  higherEducationType?: string
  currentEducationCity?: string
  currentEducationCountry?: string
  isHelpRequiredFromSamaj?: boolean
  isCurrentlyEnrolled?: boolean
  dropoutReason?: string
  educationMode?: string
  isStudyingAbroad?: boolean
  scholarshipReceived?: boolean
  scholarshipDetails?: string
  boardOrUniversity?: string
  yearOfPassing?: number | null
  fieldOfStudy?: string

  // Employment fields
  isEmployed?: boolean
  occupationType?: string
  employmentStatus?: string
  monthlyIncome?: number
  incomeSourceCountry?: boolean
  countryName?: string
  preferredSector?: string
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
  isSeekingJob?: boolean
  incomeSourceCountryName?: string
  jobSearchSector?: string
  wantsToGoAbroad?: boolean
  hasPassport?: boolean
  businessType?: string
  customBusinessType?: string
  numberOfEmployees?: number
  needsEmployees?: boolean
  isBusinessRegistered?: boolean
  occupationState?: string
  occupationCity?: string
  preferredJobLocation?: string
  isOpenToRelocate?: boolean
  workingHoursPerWeek?: number
  hasAdditionalSkills?: boolean

  // Living status fields
  livestock?: string
  landOwned?: number
  houseType?: string
  houseOwnership?: string
  hasElectricity?: boolean
  waterSource?: string
  hasToilet?: boolean
  cookingFuel?: string

  // Health fields
  hasHealthIssues?: boolean
  chronicDisease?: string
  isVaccinated?: boolean
  hasHealthInsurance?: boolean
  isInterestedInFutureHealthPolicy?: boolean

  // Digital access fields
  hasSmartphone?: boolean
  hasInternet?: boolean
  hasBankAccount?: boolean
  hasJanDhan?: boolean

  // Other fields
  isMukhiya?: boolean
  welfareSchemes?: string[]
  isInterestedInFutureSamuhikVivah?: boolean
  vehicleType?: string

  // Legacy fields for backward compatibility
  permanentAddress?: string
  currentAddress?: string
  villageName?: string
  pincode?: string
  district?: string
  state?: string
  caste?: string
  religion?: string
  aadhaarNumber?: string
  hasMajorHealthIssues?: boolean
}

interface FamilyDetail {
  id: string
  mukhiyaName: string
  status: string
  economicStatus: string
  villageId: string
  chakolaId: string
  createdDate: string
  updatedDate: string
  longitude?: number
  latitude?: number
  anyComment?: string

  // Address fields
  permanentFamilyDistrict?: string
  permanentFamilyState?: string
  permanentFamilyPincode?: string
  permanentAddress?: string
  permanentFamilyVillage?: string
  currentFamilyDistrict?: string
  currentFamilyState?: string
  currentFamilyPincode?: string
  currentAddress?: string
  currentFamilyVillage?: string

  // Legacy fields
  familyId?: string
  verificationStatus?: string
  createdAt?: string
  Person: FamilyMember[]
}

// Helper function to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "नहीं दिया गया"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (e) {
    return dateString
  }
}

// Helper function to translate house type
const translateHouseType = (type?: string) => {
  const types: Record<string, string> = {
    kutcha: "कच्चा",
    semi_pucca: "अर्ध पक्का",
    pucca: "पक्का",
  }
  return type ? types[type] || type : "नहीं दिया गया"
}

// Helper function to translate house ownership
const translateHouseOwnership = (type?: string) => {
  const types: Record<string, string> = {
    owned: "स्वयं का",
    rented: "किराए का",
    government: "सरकारी",
    relative: "रिश्तेदार का",
  }
  return type ? types[type] || type : "नहीं दिया गया"
}

// Helper function to translate water source
const translateWaterSource = (source?: string) => {
  const sources: Record<string, string> = {
    tap: "नल",
    well: "कुआँ",
    handpump: "हैंडपंप",
    river: "नदी",
    other: "अन्य",
  }
  return source ? sources[source] || source : "नहीं दिया गया"
}

// Helper function to translate cooking fuel
const translateCookingFuel = (fuel?: string) => {
  const fuels: Record<string, string> = {
    lpg: "एलपीजी",
    wood: "लकड़ी",
    coal: "कोयला",
    cow_dung: "गोबर",
    other: "अन्य",
  }
  return fuel ? fuels[fuel] || fuel : "नहीं दिया गया"
}

// Helper function to translate vehicle type
const translateVehicleType = (type?: string) => {
  const types: Record<string, string> = {
    NONE: "कोई नहीं",
    BICYCLE: "साइकिल",
    MOTORCYCLE: "मोटरसाइकिल",
    CAR: "कार",
    OTHER: "अन्य",
  }
  return type ? types[type] || type : "नहीं दिया गया"
}

// Helper function to translate occupation type
const translateOccupationType = (type?: string) => {
  const types: Record<string, string> = {
    government_job: "सरकारी नौकरी",
    private_job: "प्राइवेट नौकरी",
    self_employed: "स्वरोजगार",
    business: "व्यापार",
    agriculture: "कृषि",
    daily_wage: "दैनिक मजदूरी",
    unemployed: "बेरोजगार",
    retired: "सेवानिवृत्त",
    other: "अन्य",
  }
  return type ? types[type] || type : "नहीं दिया गया"
}

// Helper function to translate education level
const translateEducationLevel = (level?: string) => {
  const levels: Record<string, string> = {
    illiterate: "अशिक्षित",
    primary: "प्राथमिक",
    middle: "मध्य",
    secondary: "माध्यमिक",
    higher_secondary: "उच्च माध्यमिक",
    graduate: "स्नातक",
    post_graduate: "स्नातकोत्तर",
    doctorate: "डॉक्टरेट",
    diploma: "डिप्लोमा",
    intermediate: "इंटरमीडिएट",
    other: "अन्य",
  }
  return level ? levels[level] || level : "नहीं दिया गया"
}

// Helper function to translate welfare schemes
const translateWelfareScheme = (scheme: string) => {
  const schemes: Record<string, string> = {
    mgnrega: "मनरेगा",
    ayushman_bharat: "आयुष्मान भारत",
    beti_bachao: "बेटी बचाओ बेटी पढ़ाओ",
    pm_awas: "प्रधानमंत्री आवास योजना",
    ration_card: "राशन कार्ड",
    kisan_samman: "किसान सम्मान निधि",
    other: "अन्य",
  }
  return schemes[scheme] || scheme
}

export default function FamilyDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.villageId as string
  const familyId = params.familyId as string
  const { data: familyDetail, isLoading, error } = useGetFamilyDetails(familyId)

  // Delete flow UI state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")
  }, [session, status, router])

  const userType = useMemo(() => session?.user?.role, [session?.user?.role])

  const baseUrl =
    (process.env.NEXT_PUBLIC_API_URL as string | undefined) ||
    (process.env.NEXT_PUBLIC_REQUEST_URL as string | undefined) ||
    ""

  const deleteUrl = baseUrl ? `${baseUrl.replace(/\/+$/, "")}/families/${familyId}` : `/api/families/${familyId}`

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(deleteUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) {
        let message = "Failed to delete the family."
        try {
          const body = await res.json()
          message = body?.message || message
        } catch {
          const text = await res.text()
          if (text) message = text
        }
        throw new Error(message)
      }
      setConfirmOpen(false)
      setSuccessOpen(true)
    } catch (e: any) {
      setConfirmOpen(false)
      setErrorMessage(e?.message || "Something went wrong while deleting.")
      setErrorOpen(true)
    } finally {
      setIsDeleting(false)
    }
  }, [deleteUrl])

  const handleSuccessClose = () => {
    setSuccessOpen(false)
    router.push(`/admin/village/${villageId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700 hindi-text">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-600 font-bold text-lg mb-2">त्रुटि</p>
          <p className="text-gray-700">परिवार विवरण लोड करने में समस्या: {error.message || String(error)}</p>
          <Button className="mt-4" onClick={() => router.back()}>
            वापस जाएं
          </Button>
        </div>
      </div>
    )
  }

  if (!session || !familyDetail) return null

  // Process family members to ensure they have fullName
  const processedMembers = familyDetail.Person.map((member) => ({
    ...member,
    fullName: member.fullName || `${member.firstName || ""} ${member.lastName || ""}`.trim(),
  }))

  const handleDownloadReport = () => {
    if (!familyDetail) return
    // Prepare data for Excel
    const familySheet = [
      {
        "परिवार ID": familyDetail.id,
        मुखिया: familyDetail.mukhiyaName,
        "स्थायी पता": familyDetail.permanentAddress,
        "वर्तमान पता": familyDetail.currentAddress,
        "स्थायी राज्य": familyDetail.permanentFamilyState,
        "स्थायी जिला": familyDetail.permanentFamilyDistrict,
        "स्थायी गांव": familyDetail.permanentFamilyVillage,
        "स्थायी पिनकोड": familyDetail.permanentFamilyPincode,
        "वर्तमान राज्य": familyDetail.currentFamilyState,
        "वर्तमान जिला": familyDetail.currentFamilyDistrict,
        "वर्तमान गांव": familyDetail.currentFamilyVillage,
        "वर्तमान पिनकोड": familyDetail.currentFamilyPincode,
        "आर्थिक स्थिति": familyDetail.economicStatus,
        "पंजीकरण दिनांक": formatDate(familyDetail.createdDate),
        "अद्यतन तिथि": formatDate(familyDetail.updatedDate),
        "कुल सदस्य": familyDetail.Person.length,
        टिप्पणी: familyDetail.anyComment || "",
      },
    ]

    const membersSheet = processedMembers.map((member, idx) => ({
      क्रम: idx + 1,
      नाम: member.fullName,
      उम्र: member.age || "",
      लिंग: member.gender || "",
      रिश्ता: member.relation || "",
      "वैवाहिक स्थिति": member.maritalStatus || "",
      गोत्र: member.gotra || "",
      "रक्त समूह": member.bloodGroup || "",
      मोबाइल: member.mobileNumber || "",
      ईमेल: member.email || "",
      "स्थायी पता": member.personPermanentAddress || "",
      "वर्तमान पता": member.personCurrentAddress || "",
      "शिक्षा स्तर": translateEducationLevel(member.educationLevel),
      व्यवसाय: translateOccupationType(member.occupationType),
      "मासिक आय": member.monthlyIncome ? `₹${member.monthlyIncome}` : "",
      "कृषि भूमि (एकड़)": member.landOwned || "",
      पशुधन: member.livestock || "",
      "घर का प्रकार": translateHouseType(member.houseType),
      "घर का स्वामित्व": translateHouseOwnership(member.houseOwnership),
      बिजली: member.hasElectricity ? "हां" : "नहीं",
      "पानी का स्रोत": translateWaterSource(member.waterSource),
      शौचालय: member.hasToilet ? "हां" : "नहीं",
      "खाना पकाने का ईंधन": translateCookingFuel(member.cookingFuel),
      "स्वास्थ्य समस्या": member.hasHealthIssues ? "हां" : "नहीं",
      "पुरानी बीमारी": member.chronicDisease || "",
      टीकाकरण: member.isVaccinated ? "हां" : "नहीं",
      "स्वास्थ्य बीमा": member.hasHealthInsurance ? "हां" : "नहीं",
      स्मार्टफोन: member.hasSmartphone ? "हां" : "नहीं",
      इंटरनेट: member.hasInternet ? "हां" : "नहीं",
      "बैंक खाता": member.hasBankAccount ? "हां" : "नहीं",
      "जन धन खाता": member.hasJanDhan ? "हां" : "नहीं",
      वाहन: translateVehicleType(member.vehicleType),
      "कल्याण योजनाएं": Array.isArray(member.welfareSchemes)
        ? member.welfareSchemes.map(translateWelfareScheme).join(", ")
        : "",
    }))

    // Create workbook and add sheets
    const wb = XLSX.utils.book_new()
    const wsFamily = XLSX.utils.json_to_sheet(familySheet)
    const wsMembers = XLSX.utils.json_to_sheet(membersSheet)
    XLSX.utils.book_append_sheet(wb, wsFamily, "परिवार")
    XLSX.utils.book_append_sheet(wb, wsMembers, "सदस्य")

    // Export to Excel file
    XLSX.writeFile(wb, `family-report-${familyDetail.id}.xlsx`)
  }

  // Get the mukhiya member
  const mukhiyaMember = processedMembers.find((member) => member.isMukhiya)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={50}
                height={50}
                className="rounded-full shadow-lg flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-white hindi-text truncate">
                  परिवार विवरण - {familyDetail.mukhiyaName}
                </h1>
                <p className="text-orange-100 text-sm">
                  {familyDetail.id} • {familyDetail.Person.length} सदस्य
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {userType === "VILLAGE_MEMBER" && (
                <>
                  <Button
                    onClick={() =>
                      router.push(
                        `/admin/village/${villageId}/family/${familyId}/edit?choklaId=${session.user?.choklaId}`,
                      )
                    }
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    <span className="hindi-text">संपादित करें</span>
                  </Button>
                </>
              )}
              <Button
                onClick={() => router.back()}
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
            <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-orange-700 hindi-text">परिवार की जानकारी</CardTitle>
                  <Badge className={familyDetail.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                    {familyDetail.status === "active" ? "सक्रिय" : "निष्क्रिय"}
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
                      <p className="font-semibold">{familyDetail.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">कुल सदस्य</p>
                      <p className="font-semibold">{familyDetail.Person.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">आर्थिक स्थिति</p>
                      <p className="font-semibold">
                        {familyDetail.economicStatus === "apl" ? "APL (गरीबी रेखा से ऊपर)" : "BPL (गरीबी रेखा से नीचे)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">पंजीकरण दिनांक</p>
                      <p className="font-semibold">{formatDate(familyDetail.createdDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">अद्यतन तिथि</p>
                      <p className="font-semibold">{formatDate(familyDetail.updatedDate)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col space-y-2">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleDownloadReport}>
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hindi-text">परिवार रिपोर्ट डाउनलोड</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Family Address */}
            <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 mb-6">
              <CardHeader>
                <CardTitle className="text-orange-700 hindi-text">परिवार का पता</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-md font-semibold mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="hindi-text">स्थायी पता</span>
                  </h3>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm mb-1">{familyDetail.permanentAddress}</p>
                    <p className="text-sm mb-1">
                      {familyDetail.permanentFamilyVillage && `${familyDetail.permanentFamilyVillage}, `}
                      {familyDetail.permanentFamilyDistrict && `${familyDetail.permanentFamilyDistrict}, `}
                      {familyDetail.permanentFamilyState}
                    </p>
                    {familyDetail.permanentFamilyPincode && (
                      <p className="text-sm">पिनकोड: {familyDetail.permanentFamilyPincode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2 flex items-center">
                    <MapPinned className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="hindi-text">वर्तमान पता</span>
                  </h3>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm mb-1">{familyDetail.currentAddress}</p>
                    <p className="text-sm mb-1">
                      {familyDetail.currentFamilyVillage && `${familyDetail.currentFamilyVillage}, `}
                      {familyDetail.currentFamilyDistrict && `${familyDetail.currentFamilyDistrict}, `}
                      {familyDetail.currentFamilyState}
                    </p>
                    {familyDetail.currentFamilyPincode && (
                      <p className="text-sm">पिनकोड: {familyDetail.currentFamilyPincode}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            {familyDetail.latitude && familyDetail.longitude && (
              <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-700 hindi-text">परिवार का स्थान</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      className="w-full h-full"
                      src={`https://maps.google.com/maps?q=${familyDetail.latitude},${familyDetail.longitude}&z=15&output=embed`}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="bg-white px-3 py-1 rounded-full text-xs border border-gray-200 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-orange-500" />
                      {familyDetail.latitude.toFixed(6)}, {familyDetail.longitude.toFixed(6)}
                    </div>
                    <a
                      href={`https://maps.google.com/maps?q=${familyDetail.latitude},${familyDetail.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-600 hover:text-orange-700 flex items-center"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      गूगल मैप्स पर देखें
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            {familyDetail.anyComment && (
              <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 mt-6">
                <CardHeader>
                  <CardTitle className="text-orange-700 hindi-text">टिप्पणी</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm">{familyDetail.anyComment}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Family Members Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="hindi-text">परिवार के सदस्य ({familyDetail.Person?.length})</CardTitle>
                <CardDescription className="hindi-text">सभी सदस्यों की विस्तृत जानकारी</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {processedMembers.map((member, idx) => (
                    <Card
                      key={member.id}
                      className={`border-gray-200 ${member.isMukhiya ? "border-orange-300 bg-orange-50/30" : ""}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{member.fullName}</h3>
                            {member.isMukhiya && <Badge className="bg-orange-100 text-orange-700">मुखिया</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                            {member.mobileNumber && (
                              <a href={`tel:${member.mobileNumber}`} className="text-gray-500 hover:text-orange-600">
                                <Phone className="w-4 h-4" />
                              </a>
                            )}
                            {member.email && (
                              <a href={`mailto:${member.email}`} className="text-gray-500 hover:text-orange-600">
                                <Mail className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {member.dateOfBirth && (
                            <Badge variant="outline" className="bg-gray-50">
                              {calculateAge(member.dateOfBirth)}   वर्ष

                            </Badge>
                          )}
                          {member.gender && (
                            <Badge variant="outline" className="bg-gray-50">
                              {member.gender === "MALE" ? "पुरुष" : member.gender === "FEMALE" ? "महिला" : "अन्य"}
                            </Badge>
                          )}
                          {member.relation && (
                            <Badge variant="outline" className="bg-gray-50">
                              {member.relation}
                            </Badge>
                          )}
                          {member.bloodGroup && (
                            <Badge variant="outline" className="bg-gray-50">
                              {member.bloodGroup}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="personal" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
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
                            <TabsTrigger value="living" className="hindi-text text-xs">
                              निवास
                            </TabsTrigger>
                            <TabsTrigger value="other" className="hindi-text text-xs">
                              अन्य
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="personal" className="space-y-4">
                            <InfoCardGrid
                              items={[
                                { label: "पूरा नाम", value: member.fullName },
                                { label: "जन्म तिथि", value: formatDate(member.dateOfBirth) },
                                { label: "उम्र", value: calculateAge(member.dateOfBirth) },
                                {
                                  label: "लिंग",
                                  value:
                                    member.gender === "MALE" ? "पुरुष" : member.gender === "FEMALE" ? "महिला" : "अन्य",
                                },
                                { label: "रिश्ता", value: member.relation },
                                { label: "वैवाहिक स्थिति", value: member.maritalStatus },
                                { label: "गोत्र", value: member.gotra },
                                { label: "रक्त समूह", value: member.bloodGroup },
                                { label: "मोबाइल नंबर", value: member.mobileNumber },
                                { label: "ईमेल", value: member.email },
                                { label: "विकलांगता", value: member.disability ? "हां" : "नहीं" },
                              ]}
                            />
                          </TabsContent>

                          <TabsContent value="address" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h4 className="text-sm font-medium text-gray-700 mb-2 hindi-text flex items-center">
                                  <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                                  स्थायी पता
                                </h4>
                                <div className="space-y-2">
                                  <p className="text-sm">{member.personPermanentAddress || "नहीं दिया गया"}</p>
                                  <p className="text-sm">
                                    {member.personPermanentVillage && `${member.personPermanentVillage}, `}
                                    {member.personPermanentDistrict && `${member.personPermanentDistrict}, `}
                                    {member.personPermanentState || ""}
                                  </p>
                                  {member.personPermanentPincode && (
                                    <p className="text-sm">पिनकोड: {member.personPermanentPincode}</p>
                                  )}
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h4 className="text-sm font-medium text-gray-700 mb-2 hindi-text flex items-center">
                                  <MapPinned className="w-4 h-4 mr-1 text-orange-500" />
                                  वर्तमान पता
                                </h4>
                                <div className="space-y-2">
                                  <p className="text-sm">{member.personCurrentAddress || "नहीं दिया गया"}</p>
                                  <p className="text-sm">
                                    {member.personCurrentVillage && `${member.personCurrentVillage}, `}
                                    {member.personCurrentDistrict && `${member.personCurrentDistrict}, `}
                                    {member.personCurrentState || ""}
                                  </p>
                                  {member.personCurrentPincode && (
                                    <p className="text-sm">पिनकोड: {member.personCurrentPincode}</p>
                                  )}
                                </div>
                                {member.isCurrentAddressInIndia === false && member.currentCountry && (
                                  <p className="text-sm mt-2">देश: {member.currentCountry}</p>
                                )}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="education" className="space-y-4">
                            <InfoCardGrid
                              items={[
                                { label: "छात्र है", value: member.isStudent ? "हां" : "नहीं" },
                                { label: "शिक्षा स्तर", value: translateEducationLevel(member.educationLevel) },
                                { label: "पूरी की गई कक्षा", value: member.classCompleted },
                                { label: "वर्तमान कक्षा", value: member.currentClass },
                                { label: "कॉलेज कोर्स", value: member.collegeCourse },
                                { label: "संस्थान का नाम", value: member.institutionName },
                                { label: "नामांकन स्थिति", value: member.enrollmentStatus },
                                { label: "स्कूल/कॉलेज", value: member.schoolName },
                                { label: "उच्च शिक्षा प्रकार", value: member.higherEducationType },
                                { label: "वर्तमान शिक्षा शहर", value: member.currentEducationCity },
                                { label: "वर्तमान शिक्षा देश", value: member.currentEducationCountry },
                                { label: "समाज से सहायता चाहिए", value: member.isHelpRequiredFromSamaj ? "हां" : "नहीं" },
                                { label: "वर्तमान में नामांकित", value: member.isCurrentlyEnrolled ? "हां" : "नहीं" },
                                { label: "छोड़ने का कारण", value: member.dropoutReason },
                                { label: "शिक्षा का माध्यम", value: member.educationMode },
                                { label: "विदेश में पढ़ाई", value: member.isStudyingAbroad ? "हां" : "नहीं" },
                                { label: "छात्रवृत्ति प्राप्त", value: member.scholarshipReceived ? "हां" : "नहीं" },
                                { label: "छात्रवृत्ति विवरण", value: member.scholarshipDetails },
                                { label: "बोर्ड/विश्वविद्यालय", value: member.boardOrUniversity },
                                { label: "उत्तीर्ण वर्ष", value: member.yearOfPassing?.toString() },
                                { label: "अध्ययन का क्षेत्र", value: member.fieldOfStudy },
                              ]}
                            />
                          </TabsContent>

                          <TabsContent value="employment" className="space-y-4">
                            <InfoCardGrid
                              items={[
                                { label: "रोजगार में है", value: member.isEmployed ? "हां" : "नहीं" },
                                { label: "व्यवसाय प्रकार", value: translateOccupationType(member.occupationType) },
                                { label: "रोजगार स्थिति", value: member.employmentStatus },
                                {
                                  label: "मासिक आय",
                                  value: member.monthlyIncome ? `₹${member.monthlyIncome}` : "नहीं दिया गया",
                                },
                                { label: "आय का स्रोत विदेश से", value: member.incomeSourceCountry ? "हां" : "नहीं" },
                                { label: "देश का नाम", value: member.countryName },
                                { label: "पसंदीदा क्षेत्र", value: member.preferredSector },
                                { label: "नौकरी श्रेणी", value: member.jobCategory },
                                { label: "नियोक्ता/संगठन", value: member.employerOrganizationName },
                                { label: "सरकारी नौकरी", value: member.isGovernmentJob ? "हां" : "नहीं" },
                                { label: "पद", value: member.jobPosition },
                                { label: "नौकरी प्रकार", value: member.jobType },
                                { label: "कार्य अनुभव (वर्ष)", value: member.workExperienceYears?.toString() },
                                { label: "स्वरोजगार", value: member.isSelfEmployed ? "हां" : "नहीं" },
                                { label: "स्वरोजगार प्रकार", value: member.selfEmployedJobType },
                                { label: "व्यापार का नाम", value: member.nameOfBusiness },
                                { label: "व्यापार श्रेणी", value: member.businessCategory },
                                { label: "व्यापार का आकार", value: member.sizeOfBusiness },
                                { label: "व्यापार पंजीकरण", value: member.businessRegistration ? "हां" : "नहीं" },
                                { label: "लोगों को नियुक्त करने के इच्छुक", value: member.willingToHirePeople ? "हां" : "नहीं" },
                                { label: "नौकरी की तलाश में", value: member.isSeekingJob ? "हां" : "नहीं" },
                                { label: "आय स्रोत देश का नाम", value: member.incomeSourceCountryName },
                                { label: "नौकरी खोज क्षेत्र", value: member.jobSearchSector },
                                { label: "विदेश जाने के इच्छुक", value: member.wantsToGoAbroad ? "हां" : "नहीं" },
                                { label: "पासपोर्ट है", value: member.hasPassport ? "हां" : "नहीं" },
                                { label: "व्यापार प्रकार", value: member.businessType },
                                { label: "कस्टम व्यापार प्रकार", value: member.customBusinessType },
                                { label: "कर्मचारियों की संख्या", value: member.numberOfEmployees?.toString() },
                                { label: "कर्मचारियों की आवश्यकता", value: member.needsEmployees ? "हां" : "नहीं" },
                                { label: "व्यापार पंजीकृत है", value: member.isBusinessRegistered ? "हां" : "नहीं" },
                                { label: "व्यवसाय राज्य", value: member.occupationState },
                                { label: "व्यवसाय शहर", value: member.occupationCity },
                                { label: "पसंदीदा नौकरी स्थान", value: member.preferredJobLocation },
                                { label: "स्थानांतरित होने के लिए तैयार", value: member.isOpenToRelocate ? "हां" : "नहीं" },
                                { label: "प्रति सप्ताह काम के घंटे", value: member.workingHoursPerWeek?.toString() },
                                { label: "अतिरिक्त कौशल", value: member.hasAdditionalSkills ? "हां" : "नहीं" },
                                { label: "कृषि भूमि (एकड़)", value: member.landOwned?.toString() },
                                { label: "पशुधन", value: member.livestock },
                              ]}
                            />
                          </TabsContent>

                          <TabsContent value="living" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="border-gray-200">
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm flex items-center">
                                    <Home className="w-4 h-4 mr-2 text-orange-500" />
                                    आवास विवरण
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="py-2">
                                  <InfoCardGrid
                                    items={[
                                      { label: "घर का प्रकार", value: translateHouseType(member.houseType) },
                                      { label: "घर का स्वामित्व", value: translateHouseOwnership(member.houseOwnership) },
                                      { label: "बिजली", value: member.hasElectricity ? "हां" : "नहीं" },
                                      { label: "पानी का स्रोत", value: translateWaterSource(member.waterSource) },
                                      { label: "शौचालय", value: member.hasToilet ? "हां" : "नहीं" },
                                      { label: "खाना पकाने का ईंधन", value: translateCookingFuel(member.cookingFuel) },
                                    ]}
                                  />
                                </CardContent>
                              </Card>

                              <Card className="border-gray-200">
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm flex items-center">
                                    <Heart className="w-4 h-4 mr-2 text-orange-500" />
                                    स्वास्थ्य विवरण
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="py-2">
                                  <InfoCardGrid
                                    items={[
                                      { label: "स्वास्थ्य समस्या", value: member.hasHealthIssues ? "हां" : "नहीं" },
                                      { label: "पुरानी बीमारी", value: member.chronicDisease },
                                      { label: "टीकाकरण", value: member.isVaccinated ? "हां" : "नहीं" },
                                      { label: "स्वास्थ्य बीमा", value: member.hasHealthInsurance ? "हां" : "नहीं" },
                                      {
                                        label: "भविष्य में स्वास्थ्य नीति में रुचि",
                                        value: member.isInterestedInFutureHealthPolicy ? "हां" : "नहीं",
                                      },
                                    ]}
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          <TabsContent value="other" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="border-gray-200">
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm flex items-center">
                                    <Smartphone className="w-4 h-4 mr-2 text-orange-500" />
                                    डिजिटल पहुंच
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="py-2">
                                  <InfoCardGrid
                                    items={[
                                      { label: "स्मार्टफोन", value: member.hasSmartphone ? "हां" : "नहीं" },
                                      { label: "इंटरनेट", value: member.hasInternet ? "हां" : "नहीं" },
                                      { label: "बैंक खाता", value: member.hasBankAccount ? "हां" : "नहीं" },
                                      { label: "जन धन खाता", value: member.hasJanDhan ? "हां" : "नहीं" },
                                    ]}
                                  />
                                </CardContent>
                              </Card>

                              <Card className="border-gray-200">
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm flex items-center">
                                    <Landmark className="w-4 h-4 mr-2 text-orange-500" />
                                    कल्याण योजनाएं और अन्य
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="py-2">
                                  {member.welfareSchemes && member.welfareSchemes.length > 0 ? (
                                    <div className="mb-3">
                                      <p className="text-sm font-medium text-gray-600 mb-2 hindi-text">कल्याण योजनाएं</p>
                                      <div className="flex flex-wrap gap-2">
                                        {member.welfareSchemes.map((scheme, i) => (
                                          <Badge key={i} variant="secondary" className="bg-orange-50">
                                            {translateWelfareScheme(scheme)}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 mb-3">कोई कल्याण योजना नहीं</p>
                                  )}

                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-600">सामूहिक विवाह में रुचि</span>
                                      <span className="text-sm">
                                        {member.isInterestedInFutureSamuhikVivah ? "हां" : "नहीं"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-600">वाहन प्रकार</span>
                                      <span className="text-sm">{translateVehicleType(member.vehicleType)}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
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

      {/* Confirm Delete Modal */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              परिवार हटाएं?
            </AlertDialogTitle>
            <AlertDialogDescription>
              क्या आप वाकई इस परिवार को हटाना चाहते हैं? यह क्रिया वापस नहीं की जा सकती।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>रद्द करें</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  हटाया जा रहा है...
                </>
              ) : (
                "पुष्टि करें"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              परिवार सफलतापूर्वक हटाया गया
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleSuccessClose} className="bg-green-600 hover:bg-green-700">
              ठीक है
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              त्रुटि
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-red-700">{errorMessage || "हटाने के दौरान कोई समस्या हुई।"}</div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setErrorOpen(false)}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              बंद करें
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Reusable InfoCardGrid for tab content
function InfoCardGrid({ items }: { items: { label: string; value: string | boolean | undefined }[] }) {
  const filteredItems = items.filter(
    (item): item is { label: string; value: string | boolean | undefined } =>
      Boolean(item) && item.value !== undefined && item.value !== null && item.value !== "",
  )

  if (filteredItems.length === 0) {
    return <div className="text-center text-gray-500 py-4">कोई जानकारी उपलब्ध नहीं है</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {filteredItems.map(({ label, value }, idx) => (
        <InfoCard
          key={label + idx}
          label={label}
          value={typeof value === "boolean" ? (value ? "हां" : "नहीं") : (value as string) || "नहीं दिया गया"}
        />
      ))}
    </div>
  )
}

// Info Card Component
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-sm font-medium text-gray-600 hindi-text">{label}</p>
      <p className="text-sm text-gray-800 mt-1 break-words">{value || "नहीं दिया गया"}</p>
    </div>
  )
}

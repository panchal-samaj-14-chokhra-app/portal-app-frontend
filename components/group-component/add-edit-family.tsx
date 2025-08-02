"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useCreateFamily, useGetFamilyDetails, useUpdateFamily } from "@/data-hooks/mutation-query/useQueryAndMutation"
import Image from "next/image"
import { ArrowLeft, Plus, Save, User, Home, AlertCircle, FileText, Copy, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select"
import { Textarea } from "@/components/ui/textarea/textarea"
import { Accordion } from "@/components/ui/accordion/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"
import { Badge } from "@/components/ui/badge/badge"
import type { FamilyData, FamilyMember, FamilyFormProps } from "./family-form/types"
import { initialMember } from "./family-form/constants"
import { calculateAge, validateForm, transformMembersForAPI } from "./family-form/utils"
import { MemberForm } from "./family-form/member-form"

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

  // Initialize family data
  const [familyData, setFamilyData] = useState<FamilyData>(() => {
    if (mode === "edit" && familyDetails) {
      return {
        mukhiyaName: familyDetails.mukhiyaName || "",
        currentAddress: familyDetails.currentAddress || "",
        permanentAddress: familyDetails.permanentAddress || "",
        status: familyDetails.status || "draft",
        economicStatus: familyDetails.economicStatus || "",
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
      permanentAddress: "",
      status: "draft",
      economicStatus: "",
      longitude: null,
      latitude: null,
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
        permanentAddress: familyDetails.permanentAddress || "",
        status: familyDetails.status || "draft",
        economicStatus: familyDetails.economicStatus || "",
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
            const age = calculateAge(value)
            return {
              ...member,
              [field]: value,
              age,
            }
          }

          return { ...member, [field]: value }
        }
        return member
      }),
    }))
  }

  const copyFamilyAddressToMember = (memberId: string) => {
    updateMember(memberId, "permanentAddress", familyData.permanentAddress)
    updateMember(memberId, "currentAddress", familyData.currentAddress)
    updateMember(memberId, "state", familyData.familyState)
    updateMember(memberId, "district", familyData.familyDistrict)
    updateMember(memberId, "pincode", familyData.familyPincode)
  }

  const copyPermanentToCurrent = () => {
    setFamilyData((prev) => ({
      ...prev,
      currentAddress: prev.permanentAddress,
    }))
  }

  const handleSaveAsDraft = async () => {
    const validationErrors = validateForm(familyData, true)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
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
    const validationErrors = validateForm(familyData, false)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      alert("कृपया सभी त्रुटियों को ठीक करें")
      return
    }

    setLoading(true)
    try {
      const mukhiya = familyData.members.find((m) => m.isMukhiya)
      const mukhiyaName = mukhiya ? `${mukhiya.firstName} ${mukhiya.lastName}` : ""

      const transformedMembers = transformMembersForAPI(familyData.members)

      const submitData = {
        currentAddress: familyData.currentAddress,
        permanentAddress: familyData.permanentAddress,
        economicStatus: familyData.economicStatus,
        status: familyData.status,
        villageId,
        chakolaId,
        mukhiyaName,
        anyComment: familyData.anyComment,
        familyDistrict: familyData.familyDistrict,
        familyState: familyData.familyState,
        familyPincode: familyData.familyPincode,
        longitude: familyData.longitude,
        latitude: familyData.latitude,
        members: transformedMembers,
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
        {(errors.mukhiya || errors.mobile || errors.economicStatus || errors.familyPincode) && (
          <Alert className="mb-4 sm:mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <AlertDescription className="text-red-800 text-sm">
              {errors.mukhiya && <div className="hindi-text">{errors.mukhiya}</div>}
              {errors.mobile && <div className="hindi-text">{errors.mobile}</div>}
              {errors.economicStatus && <div className="hindi-text">{errors.economicStatus}</div>}
              {errors.familyPincode && <div className="hindi-text">{errors.familyPincode}</div>}
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
                <Label htmlFor="permanentAddress" className="hindi-text text-sm font-medium">
                  स्थायी पता *
                </Label>
                <Textarea
                  id="permanentAddress"
                  value={familyData.permanentAddress}
                  onChange={(e) => setFamilyData((prev) => ({ ...prev, permanentAddress: e.target.value }))}
                  placeholder="स्थायी पता दर्ज करें"
                  className="mt-1 min-h-[80px] text-sm"
                  rows={3}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="currentAddress" className="hindi-text text-sm font-medium">
                    वर्तमान पता *
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyPermanentToCurrent}
                    className="text-xs bg-transparent"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    <span className="hindi-text">स्थायी पता कॉपी करें</span>
                  </Button>
                </div>
                <Textarea
                  id="currentAddress"
                  value={familyData.currentAddress}
                  onChange={(e) => {
                    setFamilyData((prev) => ({ ...prev, currentAddress: e.target.value }))
                  }}
                  placeholder="वर्तमान पता दर्ज करें"
                  className="mt-1 min-h-[80px] text-sm"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="economicStatus" className="hindi-text text-sm font-medium">
                  आर्थिक स्थिति *
                </Label>
                <Select
                  value={familyData.economicStatus}
                  onValueChange={(value) => setFamilyData((prev) => ({ ...prev, economicStatus: value }))}
                >
                  <SelectTrigger className={`mt-1 ${errors.economicStatus ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="आर्थिक स्थिति चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bpl">गरीबी रेखा से नीचे (BPL)</SelectItem>
                    <SelectItem value="apl">गरीबी रेखा से ऊपर (APL)</SelectItem>
                    <SelectItem value="middle">मध्यम वर्गीय</SelectItem>
                    <SelectItem value="upper">उच्च वर्गीय</SelectItem>
                  </SelectContent>
                </Select>
                {errors.economicStatus && (
                  <p className="text-red-500 text-xs mt-1 hindi-text">{errors.economicStatus}</p>
                )}
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
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setFamilyData((prev) => ({ ...prev, familyPincode: value }))
                  }}
                  placeholder="पिनकोड"
                  maxLength={6}
                  className={`mt-1 text-sm ${errors.familyPincode ? "border-red-500" : ""}`}
                />
                {errors.familyPincode && <p className="text-red-500 text-xs mt-1 hindi-text">{errors.familyPincode}</p>}
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
                <MemberForm
                  key={member.id}
                  member={member}
                  index={index}
                  errors={errors}
                  onUpdateMember={updateMember}
                  onCopyFamilyAddress={copyFamilyAddressToMember}
                  familyData={familyData}
                  onRemoveMember={removeMember}
                  membersCount={familyData.members.length}
                />
              ))}
            </Accordion>

            <div className="py-4">
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

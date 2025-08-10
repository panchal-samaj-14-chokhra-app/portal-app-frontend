"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useCreateFamily, useGetFamilyDetails, useUpdateFamily } from "@/data-hooks/mutation-query/useQueryAndMutation"
import Image from "next/image"
import { ArrowLeft, Plus, Save, User, Home, AlertCircle, FileText, Copy, UserCheck, MapPin } from "lucide-react"
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
import { initialMember, statesAndDistricts } from "./family-form/constants"
import { calculateAge, validateForm, transformMembersForAPI, transformAPIDataToMembers } from "./family-form/utils"
import { MemberForm } from "./family-form/member-form"
import { SelectInput } from "./family-form/employment-info-section"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function sanitizeMembers(members: any[]) {
  return members.map(({ permanentAddress, currentAddress, state, district, pincode, ...rest }: any) => rest)
}

type SaveMode = "draft" | "submit"

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

  // District options
  const [permanentDistrictOptions, setPermanentDistrictOptions] = useState<string[]>([])
  const [currentDistrictOptions, setCurrentDistrictOptions] = useState<string[]>([])
  const [dataVersion, setDataVersion] = useState(0)

  // Dialogs
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: "",
    message: "",
  })
  const [successDialog, setSuccessDialog] = useState<{
    open: boolean
    title: string
    message: string
    redirectTo?: string
  }>({ open: false, title: "", message: "", redirectTo: undefined })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState<SaveMode | null>(null)

  // Saving state modal
  const [isSaving, setIsSaving] = useState(false)

  // Initialize family data
  const [familyData, setFamilyData] = useState<FamilyData>(() => ({
    mukhiyaName: "",
    currentAddress: "",
    permanentAddress: "",
    status: "draft",
    economicStatus: "",
    longitude: null,
    latitude: null,
    anyComment: "",
    // legacy fields for compatibility
    familyDistrict: "",
    familyState: "",
    familyPincode: "",
    // new prisma fields
    permanentFamilyDistrict: "",
    permanentFamilyState: "",
    permanentFamilyPincode: "",
    permanentFamilyVillage: "",
    currentFamilyDistrict: "",
    currentFamilyState: "",
    currentFamilyPincode: "",
    currentFamilyVillage: "",
    // Members
    members: [{ ...initialMember, isMukhiya: true, id: `member-${Date.now()}` }],
  }))

  // Populate when familyDetails are loaded or change
  useEffect(() => {
    if (mode !== "edit") return
    if (!familyDetails || isFetching) return

    const transformedMembers = Array.isArray(familyDetails.Person)
      ? transformAPIDataToMembers(familyDetails.Person)
      : []

    const nextState: FamilyData = {
      mukhiyaName: familyDetails.mukhiyaName || "",
      currentAddress: familyDetails.currentAddress || "",
      permanentAddress: familyDetails.permanentAddress || "",
      status: familyDetails.status || "draft",
      economicStatus: familyDetails.economicStatus || "",
      longitude: familyDetails.longitude ?? null,
      latitude: familyDetails.latitude ?? null,
      anyComment: familyDetails.anyComment || "",
      // legacy compatibility fallbacks
      familyDistrict: familyDetails.familyDistrict || "",
      familyState: familyDetails.familyState || "",
      familyPincode: familyDetails.familyPincode || "",
      // new fields with fallbacks to legacy if needed
      permanentFamilyDistrict: familyDetails.permanentFamilyDistrict || familyDetails.familyDistrict || "",
      permanentFamilyState: familyDetails.permanentFamilyState || familyDetails.familyState || "",
      permanentFamilyPincode: familyDetails.permanentFamilyPincode || familyDetails.familyPincode || "",
      permanentFamilyVillage: familyDetails.permanentFamilyVillage || "",
      currentFamilyDistrict: familyDetails.currentFamilyDistrict || familyDetails.familyDistrict || "",
      currentFamilyState: familyDetails.currentFamilyState || familyDetails.familyState || "",
      currentFamilyPincode: familyDetails.currentFamilyPincode || familyDetails.familyPincode || "",
      currentFamilyVillage: familyDetails.currentFamilyVillage || "",
      members:
        transformedMembers.length > 0
          ? transformedMembers
          : [{ ...initialMember, isMukhiya: true, id: `member-${Date.now()}` }],
    }

    // Set district options based on selected states
    if (nextState.permanentFamilyState && statesAndDistricts[nextState.permanentFamilyState]) {
      setPermanentDistrictOptions(statesAndDistricts[nextState.permanentFamilyState])
    } else {
      setPermanentDistrictOptions([])
    }

    if (nextState.currentFamilyState && statesAndDistricts[nextState.currentFamilyState]) {
      setCurrentDistrictOptions(statesAndDistricts[nextState.currentFamilyState])
    } else {
      setCurrentDistrictOptions([])
    }

    setFamilyData(nextState)
    // Force MemberForm refresh to update internal controlled inputs
    setDataVersion((v) => v + 1)
  }, [mode, familyDetails, isFetching])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")
  }, [session, status, router])

  useEffect(() => {
    // Get current location
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFamilyData((prev) => ({
            ...prev,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          }))
        },
        () => {
          setFamilyData((prev) => ({
            ...prev,
            longitude: null,
            latitude: null,
          }))
        },
      )
    }
  }, [])

  const mukhiyaName = useMemo(() => {
    const m = familyData.members.find((mm) => mm.isMukhiya)
    return m ? `${m.firstName} ${m.lastName}`.trim() : familyData.mukhiyaName || ""
  }, [familyData.members, familyData.mukhiyaName])

  const mukhiyaCount = familyData.members.filter((m) => m.isMukhiya).length

  const buildSubmitData = useMemo(() => {
    return (statusToUse: "draft" | "active") => {
      const transformedMembers = sanitizeMembers(transformMembersForAPI(familyData.members))

      return {
        currentAddress: familyData.currentAddress,
        permanentAddress: familyData.permanentAddress,

        permanentFamilyState: familyData.permanentFamilyState,
        permanentFamilyDistrict: familyData.permanentFamilyDistrict,
        permanentFamilyPincode: familyData.permanentFamilyPincode,
        permanentFamilyVillage: familyData.permanentFamilyVillage,

        currentFamilyState: familyData.currentFamilyState,
        currentFamilyDistrict: familyData.currentFamilyDistrict,
        currentFamilyPincode: familyData.currentFamilyPincode,
        currentFamilyVillage: familyData.currentFamilyVillage,

        economicStatus: familyData.economicStatus,
        status: statusToUse,
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
    }
  }, [
    familyData.anyComment,
    familyData.currentAddress,
    familyData.currentFamilyDistrict,
    familyData.currentFamilyPincode,
    familyData.currentFamilyState,
    familyData.currentFamilyVillage,
    familyData.economicStatus,
    familyData.familyDistrict,
    familyData.familyPincode,
    familyData.familyState,
    familyData.latitude,
    familyData.longitude,
    familyData.members,
    familyData.permanentAddress,
    familyData.permanentFamilyDistrict,
    familyData.permanentFamilyPincode,
    familyData.permanentFamilyState,
    familyData.permanentFamilyVillage,
    villageId,
    chakolaId,
    mukhiyaName,
  ])

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
    // legacy copies
    updateMember(memberId, "permanentAddress" as any, familyData.permanentAddress as any)
    updateMember(memberId, "currentAddress" as any, familyData.currentAddress as any)
    updateMember(
      memberId,
      "state" as any,
      (familyData.currentFamilyState || familyData.permanentFamilyState || "") as any,
    )
    updateMember(
      memberId,
      "district" as any,
      (familyData.currentFamilyDistrict || familyData.permanentFamilyDistrict || "") as any,
    )
    updateMember(
      memberId,
      "pincode" as any,
      (familyData.currentFamilyPincode || familyData.permanentFamilyPincode || "") as any,
    )

    // person-level copies if present in member type
    updateMember(memberId, "personPermanentAddress" as any, familyData.permanentAddress as any)
    updateMember(memberId, "personPermanentState" as any, familyData.permanentFamilyState as any)
    updateMember(memberId, "personPermanentDistrict" as any, familyData.permanentFamilyDistrict as any)
    updateMember(memberId, "personPermanentPincode" as any, familyData.permanentFamilyPincode as any)
    updateMember(memberId, "personPermanentVillage" as any, familyData.permanentFamilyVillage as any)
  }

  const copyPermanentToCurrent = () => {
    setFamilyData((prev) => ({
      ...prev,
      currentAddress: prev.permanentAddress,
      currentFamilyState: prev.permanentFamilyState,
      currentFamilyDistrict: prev.permanentFamilyDistrict,
      currentFamilyPincode: prev.permanentFamilyPincode,
      currentFamilyVillage: prev.permanentFamilyVillage,
    }))

    // Also sync the district options for current based on permanent state
    if (familyData.permanentFamilyState && statesAndDistricts[familyData.permanentFamilyState]) {
      setCurrentDistrictOptions(statesAndDistricts[familyData.permanentFamilyState])
    }
  }

  // Preview
  const openPreview = (mode: SaveMode) => {
    // Validate minimally before preview (same rules as save)
    const validationErrors = validateForm(familyData, mode === "draft")
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setErrorDialog({
        open: true,
        title: "फॉर्म में त्रुटियां",
        message: mode === "draft" ? "कृपया बुनियादी जानकारी भरें।" : "कृपया सभी आवश्यक फील्ड भरें और त्रुटियों को ठीक करें।",
      })
      return
    }
    setPreviewMode(mode)
    setPreviewOpen(true)
  }

  const confirmAndSave = async () => {
    if (!previewMode) return
    setPreviewOpen(false)
    setIsSaving(true)

    if (previewMode === "draft") {
      await internalSaveAsDraft()
    } else {
      await internalSubmit()
    }
    setIsSaving(false)
  }

  // Internal save handlers (do not redirect immediately; show success dialog first)
  const internalSaveAsDraft = async () => {
    setSavingDraft(true)
    try {
      const submitData = buildSubmitData("draft")
      if (mode === "edit") {
        await updateMutation.mutateAsync({ familyId, submitData })
      } else {
        await mutation.mutateAsync(submitData)
      }

      toast({
        title: "ड्राफ्ट सहेजा गया",
        description: "परिवार का डेटा ड्राफ्ट के रूप में सहेजा गया।",
        variant: "default",
      })

      setSuccessDialog({
        open: true,
        title: "सफलता!",
        message: "ड्राफ्ट सफलतापूर्वक सहेजा गया।",
        redirectTo: `/admin/village/${villageId}`,
      })
    } catch (error: any) {
      setErrorDialog({
        open: true,
        title: "ड्राफ्ट सहेजने में त्रुटि",
        message: error?.response?.data?.message || error?.message || "ड्राफ्ट सहेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
      })
    } finally {
      setSavingDraft(false)
    }
  }

  const internalSubmit = async () => {
    setLoading(true)
    try {
      const submitData = buildSubmitData("active")
      if (mode === "edit") {
        await updateMutation.mutateAsync({ familyId, submitData })
        toast({
          title: "सफलता!",
          description: "परिवार की जानकारी सफलतापूर्वक अपडेट हो गई।",
          variant: "default",
        })
      } else {
        await mutation.mutateAsync(submitData)
        toast({
          title: "सफलता!",
          description: "परिवार सफलतापूर्वक पंजीकृत हो गया।",
          variant: "default",
        })
      }

      setSuccessDialog({
        open: true,
        title: "सफलता!",
        message: mode === "edit" ? "परिवार की जानकारी अपडेट हो गई।" : "परिवार पंजीकृत हो गया।",
        redirectTo: `/admin/village/${villageId}`,
      })
    } catch (error: any) {
      setErrorDialog({
        open: true,
        title: "त्रुटि हुई",
        message: error?.response?.data?.message || error?.message || "कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
      })
    } finally {
      setLoading(false)
    }
  }

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
        {(errors.mukhiya ||
          errors.mobile ||
          errors.economicStatus ||
          errors.permanentFamilyPincode ||
          errors.currentFamilyPincode) && (
          <Alert className="mb-4 sm:mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <AlertDescription className="text-red-800 text-sm">
              {errors.mukhiya && <div className="hindi-text">{errors.mukhiya}</div>}
              {errors.mobile && <div className="hindi-text">{errors.mobile}</div>}
              {errors.economicStatus && <div className="hindi-text">{errors.economicStatus}</div>}
              {errors.permanentFamilyPincode && <div className="hindi-text">{errors.permanentFamilyPincode}</div>}
              {errors.currentFamilyPincode && <div className="hindi-text">{errors.currentFamilyPincode}</div>}
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
            <CardDescription className="hindi-text text-sm">कृपया स्थायी और वर्तमान पता विवरण भरें</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
            {/* Permanent Address */}
            <div className="rounded-lg border bg-white">
              <div className="flex items-center gap-2 p-3 sm:p-4 border-b bg-orange-50/60">
                <MapPin className="w-4 h-4 text-orange-600" />
                <h3 className="hindi-text font-semibold text-sm sm:text-base text-orange-700">
                  स्थायी पता (Permanent Address)
                </h3>
              </div>
              <div className="p-3 sm:p-4 space-y-4">
                <div>
                  <Label htmlFor="permanentAddress" className="hindi-text text-sm font-medium">
                    स्थायी पता *
                  </Label>
                  <Textarea
                    id="permanentAddress"
                    value={familyData.permanentAddress}
                    onChange={(e) => setFamilyData((prev) => ({ ...prev, permanentAddress: e.target.value }))}
                    placeholder="स्थायी पता दर्ज करें"
                    className="mt-1 min-h-[72px] text-sm"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <SelectInput
                      id="permanentFamilyState"
                      value={familyData.permanentFamilyState}
                      onChange={(value) => {
                        setFamilyData((prev) => ({
                          ...prev,
                          permanentFamilyState: value,
                          permanentFamilyDistrict: "",
                        }))
                        const opts = statesAndDistricts[value] || []
                        setPermanentDistrictOptions(opts)
                      }}
                      placeholder="राज्य का नाम"
                      options={Object.keys(statesAndDistricts).map((s) => ({ label: s, value: s }))}
                      label="राज्य का नाम"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <SelectInput
                      id="permanentFamilyDistrict"
                      value={familyData.permanentFamilyDistrict}
                      onChange={(value) => setFamilyData((prev) => ({ ...prev, permanentFamilyDistrict: value }))}
                      placeholder="जिला का नाम"
                      label="जिला का नाम"
                      options={permanentDistrictOptions.map((d) => ({ label: d, value: d }))}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="permanentFamilyVillage" className="hindi-text text-sm font-medium">
                      ग्राम का नाम
                    </Label>
                    <Input
                      id="permanentFamilyVillage"
                      value={familyData.permanentFamilyVillage}
                      onChange={(e) => setFamilyData((prev) => ({ ...prev, permanentFamilyVillage: e.target.value }))}
                      placeholder="ग्राम का नाम"
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="permanentFamilyPincode" className="hindi-text text-sm font-medium">
                      पिनकोड
                    </Label>
                    <Input
                      id="permanentFamilyPincode"
                      value={familyData.permanentFamilyPincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                        setFamilyData((prev) => ({ ...prev, permanentFamilyPincode: value }))
                      }}
                      placeholder="पिनकोड"
                      inputMode="numeric"
                      maxLength={6}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Current Address */}
            <div className="rounded-lg border bg-white">
              <div className="flex items-center justify-between gap-2 p-3 sm:p-4 border-b bg-orange-50/60">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <h3 className="hindi-text font-semibold text-sm sm:text-base text-orange-700">
                    वर्तमान पता (Current Address)
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyPermanentToCurrent}
                  className="text-xs bg-transparent"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="hindi-text">स्थायी से कॉपी करें</span>
                </Button>
              </div>
              <div className="p-3 sm:p-4 space-y-4">
                <div>
                  <Label htmlFor="currentAddress" className="hindi-text text-sm font-medium">
                    वर्तमान पता *
                  </Label>
                  <Textarea
                    id="currentAddress"
                    value={familyData.currentAddress}
                    onChange={(e) => setFamilyData((prev) => ({ ...prev, currentAddress: e.target.value }))}
                    placeholder="वर्तमान पता दर्ज करें"
                    className="mt-1 min-h-[72px] text-sm"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <SelectInput
                      id="currentFamilyState"
                      value={familyData.currentFamilyState}
                      onChange={(value) => {
                        setFamilyData((prev) => ({
                          ...prev,
                          currentFamilyState: value,
                          currentFamilyDistrict: "",
                        }))
                        const opts = statesAndDistricts[value] || []
                        setCurrentDistrictOptions(opts)
                      }}
                      placeholder="राज्य का नाम"
                      options={Object.keys(statesAndDistricts).map((s) => ({ label: s, value: s }))}
                      label="राज्य का नाम"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <SelectInput
                      id="currentFamilyDistrict"
                      value={familyData.currentFamilyDistrict}
                      onChange={(value) => setFamilyData((prev) => ({ ...prev, currentFamilyDistrict: value }))}
                      placeholder="जिला का नाम"
                      label="जिला का नाम"
                      options={currentDistrictOptions.map((d) => ({ label: d, value: d }))}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="currentFamilyVillage" className="hindi-text text-sm font-medium">
                      ग्राम का नाम
                    </Label>
                    <Input
                      id="currentFamilyVillage"
                      value={familyData.currentFamilyVillage}
                      onChange={(e) => setFamilyData((prev) => ({ ...prev, currentFamilyVillage: e.target.value }))}
                      placeholder="ग्राम का नाम"
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="currentFamilyPincode" className="hindi-text text-sm font-medium">
                      पिनकोड
                    </Label>
                    <Input
                      id="currentFamilyPincode"
                      value={familyData.currentFamilyPincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                        setFamilyData((prev) => ({ ...prev, currentFamilyPincode: value }))
                      }}
                      placeholder="पिनकोड"
                      inputMode="numeric"
                      maxLength={6}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Economic Status */}
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
                  key={`${member.id}-${dataVersion}`}
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

        {/* Submit Buttons (now open Preview) */}
        <div className="mobile-button-group px-4 pb-4 sm:px-0 sm:pb-0">
          <Button onClick={() => router.back()} variant="outline" className="bg-transparent touch-target" size="lg">
            <span className="hindi-text">रद्द करें</span>
          </Button>
          <Button
            onClick={() => openPreview("draft")}
            disabled={savingDraft || loading || isSaving}
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent touch-target"
            size="lg"
          >
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              <span className="hindi-text">ड्राफ्ट के रूप में सहेजें</span>
            </div>
          </Button>
          <Button
            onClick={() => openPreview("submit")}
            disabled={loading || savingDraft || isSaving}
            className="bg-orange-500 hover:bg-orange-600 touch-target"
            size="lg"
          >
            <div className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              <span className="hindi-text">{mode === "edit" ? "संशोधित करें" : "परिवार पंजीकृत करें"}</span>
            </div>
          </Button>
        </div>

        {/* Error Dialog */}
        <Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog((prev) => ({ ...prev, open }))}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="hindi-text text-red-600">{errorDialog.title}</DialogTitle>
              <DialogDescription className="hindi-text text-gray-600">{errorDialog.message}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={() => setErrorDialog((prev) => ({ ...prev, open: false }))} className="hindi-text">
                समझ गया
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog
          open={successDialog.open}
          onOpenChange={(open) => {
            if (!open && successDialog.redirectTo) {
              router.push(successDialog.redirectTo)
            }
            setSuccessDialog((prev) => ({ ...prev, open }))
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="hindi-text text-green-700">{successDialog.title}</DialogTitle>
              <DialogDescription className="hindi-text text-gray-700">{successDialog.message}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  if (successDialog.redirectTo) router.push(successDialog.redirectTo)
                  setSuccessDialog((prev) => ({ ...prev, open: false }))
                }}
                className="hindi-text"
              >
                ठीक है
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Saving Dialog */}
        <Dialog open={isSaving || savingDraft || loading} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="hindi-text">सहेजा जा रहा है...</DialogTitle>
              <DialogDescription className="hindi-text text-gray-600">
                कृपया प्रतीक्षा करें, आपकी जानकारी सहेजी जा रही है।
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="hindi-text">पूर्वावलोकन</DialogTitle>
              <DialogDescription className="hindi-text text-gray-600">
                सहेजने से पहले कृपया नीचे दी गई जानकारी की जाँच करें।
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-y-auto pr-1 space-y-4 max-h-[60vh]">
              {/* Summary */}
              <Card className="border-orange-100">
                <CardHeader className="p-4">
                  <CardTitle className="text-base hindi-text">परिवार का सारांश</CardTitle>
                  <CardDescription className="text-xs hindi-text">मुखिया: {mukhiyaName || "—"}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="hindi-text font-medium text-sm mb-2">स्थायी पता</h4>
                    <p className="text-sm hindi-text break-words">{familyData.permanentAddress || "—"}</p>
                    <p className="text-sm hindi-text">
                      {familyData.permanentFamilyVillage || "—"}, {familyData.permanentFamilyDistrict || "—"},{" "}
                      {familyData.permanentFamilyState || "—"} - {familyData.permanentFamilyPincode || "—"}
                    </p>
                  </div>
                  <div>
                    <h4 className="hindi-text font-medium text-sm mb-2">वर्तमान पता</h4>
                    <p className="text-sm hindi-text break-words">{familyData.currentAddress || "—"}</p>
                    <p className="text-sm hindi-text">
                      {familyData.currentFamilyVillage || "—"}, {familyData.currentFamilyDistrict || "—"},{" "}
                      {familyData.currentFamilyState || "—"} - {familyData.currentFamilyPincode || "—"}
                    </p>
                  </div>
                  <div>
                    <h4 className="hindi-text font-medium text-sm mb-2">आर्थिक स्थिति</h4>
                    <p className="text-sm hindi-text">{familyData.economicStatus || "—"}</p>
                  </div>
                  <div>
                    <h4 className="hindi-text font-medium text-sm mb-2">टिप्पणी</h4>
                    <p className="text-sm hindi-text break-words">{familyData.anyComment || "—"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Members */}
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base hindi-text">सदस्य विवरण</CardTitle>
                  <CardDescription className="text-xs hindi-text">कुल सदस्य: {familyData.members.length}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {familyData.members.map((m, idx) => (
                    <div key={m.id || idx} className="rounded-md border p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-sm hindi-text truncate">
                            {m.firstName} {m.lastName} {m.isMukhiya ? "(मुखिया)" : ""}
                          </p>
                          <p className="text-xs text-gray-600 hindi-text">
                            {m.relation || "—"} • {m.gender || "—"} • {m.age || "—"} वर्ष
                          </p>
                        </div>
                        <div className="text-xs text-gray-600 hindi-text">
                          {m.mobileNumber || "—"} {m.email ? `• ${m.email}` : ""}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <p className="text-xs font-medium text-gray-700 hindi-text">स्थायी पता</p>
                          <p className="text-xs text-gray-700 hindi-text break-words">
                            {m.personPermanentAddress || m.permanentAddress || "—"}
                          </p>
                          <p className="text-xs text-gray-600 hindi-text">
                            {m.personPermanentVillage || m.village || "—"},{" "}
                            {m.personPermanentDistrict || m.district || "—"}, {m.personPermanentState || "—"} -{" "}
                            {m.personPermanentPincode || m.pincode || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 hindi-text">वर्तमान पता</p>
                          <p className="text-xs text-gray-700 hindi-text break-words">
                            {m.personCurrentAddress || m.currentAddress || "—"}
                          </p>
                          <p className="text-xs text-gray-600 hindi-text">
                            {m.personCurrentVillage || m.village || "—"}, {m.personCurrentDistrict || m.district || "—"}
                            , {m.personCurrentState || "—"} - {m.personCurrentPincode || m.pincode || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setPreviewOpen(false)} className="hindi-text">
                वापस जाएं
              </Button>
              <Button onClick={confirmAndSave} className="bg-orange-500 hover:bg-orange-600 hindi-text">
                पुष्टि करें और सहेजें
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

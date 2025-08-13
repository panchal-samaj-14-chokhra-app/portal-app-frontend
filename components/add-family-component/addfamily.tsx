"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCreateFamily } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SelectInput } from "@/components/group-component/family-form/employment-info-section"
import { Textarea } from "@/components/ui/textarea"
import { statesAndDistricts } from "@/components/group-component/family-form/constants"
import { Loader2, MapPin, User, Home, FileText, AlertCircle, CheckCircle2, Copy, Wallet } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type AddFamilyDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: any) => Promise<void>
  chakolaId: string | number
  villageId: string | number
}

const economicStatusOptions = [
  { value: "bpl", label: "गरीबी रेखा से नीचे (BPL)" },
  { value: "apl", label: "गरीबी रेखा से ऊपर (APL)" },
  { value: "middle", label: "मध्यम वर्गीय (Middle Class)" },
  { value: "upper", label: "उच्च वर्गीय (Upper Middle Class)" },
]

export default function AddFamilyDialog({ isOpen, onClose, chakolaId, villageId }: AddFamilyDialogProps) {
  const [formData, setFormData] = useState({
    chakolaId: chakolaId,
    villageId: villageId,
    mukhiyaName: "",
    economicStatus: "",
    anyComment: "",
    currentFamilyState: "",
    currentFamilyDistrict: "",
    currentFamilyVillage: "",
    currentFamilyPincode: "",
    currentAddress: "",
    permanentFamilyState: "",
    permanentFamilyDistrict: "",
    permanentFamilyVillage: "",
    permanentFamilyPincode: "",
    permanentAddress: "",
    latitude: null as number | null,
    longitude: null as number | null,
    status: "active",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null)
  const [submitMessage, setSubmitMessage] = useState("")
  const [gpsStatus, setGpsStatus] = useState<"loading" | "success" | "error" | null>(null)

  // React Query mutation
  const { mutation } = useCreateFamily((result?: any) => {
    if (result instanceof Error) {
      setSubmitStatus("error")
      setSubmitMessage(result.message || "परिवार जोड़ने में त्रुटि! (Error adding family!)")
      return
    }

    const data = result
    const familyId = data?.id || data?.familyId || data?.data?.id || data?.data?.familyId
    setSubmitStatus("success")
    setSubmitMessage(
      `परिवार सफलतापूर्वक जोड़ा गया! (Family created successfully!)${familyId ? `\nFamily ID: ${familyId}` : ""}`,
    )

    setTimeout(() => {
      setSubmitStatus(null)
      setSubmitMessage("")
      onClose()
      window.location.reload()
    }, 2000)

    // Reset form
    resetForm()
  })

  const { mutate, isLoading } = mutation

  const resetForm = () => {
    setFormData({
      chakolaId,
      villageId,
      mukhiyaName: "",
      economicStatus: "",
      anyComment: "",
      currentFamilyState: "",
      currentFamilyDistrict: "",
      currentFamilyVillage: "",
      currentFamilyPincode: "",
      currentAddress: "",
      permanentFamilyState: "",
      permanentFamilyDistrict: "",
      permanentFamilyVillage: "",
      permanentFamilyPincode: "",
      permanentAddress: "",
      latitude: null,
      longitude: null,
      status: "active",
    })
    setErrors({})
    setSubmitStatus(null)
    setSubmitMessage("")
    setGpsStatus(null)
  }

  // Generate state options from statesAndDistricts keys
  const stateOptions = Object.keys(statesAndDistricts).map((state) => ({
    label: state,
    value: state,
  }))

  // District options depend on selected states
  const currentDistrictOptions = formData.currentFamilyState
    ? statesAndDistricts[formData.currentFamilyState].map((district) => ({
        label: district,
        value: district,
      }))
    : []

  const permanentDistrictOptions = formData.permanentFamilyState
    ? statesAndDistricts[formData.permanentFamilyState].map((district) => ({
        label: district,
        value: district,
      }))
    : []

  // Handle input change for text inputs and textareas
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handle SelectInput changes
  const handleSelectChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset district when state changes
      ...(field === "currentFamilyState" && { currentFamilyDistrict: "" }),
      ...(field === "permanentFamilyState" && { permanentFamilyDistrict: "" }),
    }))

    // Clear error when user makes selection
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Copy current address to permanent address
  const copyCurrentToPermanent = () => {
    setFormData((prev) => ({
      ...prev,
      permanentFamilyState: prev.currentFamilyState,
      permanentFamilyDistrict: prev.currentFamilyDistrict,
      permanentFamilyVillage: prev.currentFamilyVillage,
      permanentFamilyPincode: prev.currentFamilyPincode,
      permanentAddress: prev.currentAddress,
    }))
  }

  // Enhanced validation with better error messages
  const validate = () => {
    const newErrors: Record<string, string> = {}

    // Basic info validation
    if (!formData.mukhiyaName.trim()) {
      newErrors.mukhiyaName = "मुखिया का नाम आवश्यक है"
    } else if (formData.mukhiyaName.trim().length < 2) {
      newErrors.mukhiyaName = "मुखिया का नाम कम से कम 2 अक्षर का होना चाहिए"
    }

    if (!formData.economicStatus) {
      newErrors.economicStatus = "आर्थिक स्थिति चुनना आवश्यक है"
    }

    // Current address validation
    if (!formData.currentFamilyState) {
      newErrors.currentFamilyState = "वर्तमान राज्य चुनना आवश्यक है"
    }
    if (!formData.currentFamilyDistrict) {
      newErrors.currentFamilyDistrict = "वर्तमान जिला चुनना आवश्यक है"
    }
    if (!formData.currentFamilyVillage.trim()) {
      newErrors.currentFamilyVillage = "वर्तमान गांव का नाम आवश्यक है"
    }
    if (!formData.currentFamilyPincode.trim()) {
      newErrors.currentFamilyPincode = "वर्तमान पिनकोड आवश्यक है"
    } else if (!/^\d{6}$/.test(formData.currentFamilyPincode)) {
      newErrors.currentFamilyPincode = "पिनकोड 6 अंकों का होना चाहिए"
    }
    if (!formData.currentAddress.trim()) {
      newErrors.currentAddress = "वर्तमान पूरा पता आवश्यक है"
    }

    // Permanent address validation
    if (!formData.permanentFamilyState) {
      newErrors.permanentFamilyState = "स्थायी राज्य चुनना आवश्यक है"
    }
    if (!formData.permanentFamilyDistrict) {
      newErrors.permanentFamilyDistrict = "स्थायी जिला चुनना आवश्यक है"
    }
    if (!formData.permanentFamilyVillage.trim()) {
      newErrors.permanentFamilyVillage = "स्थायी गांव का नाम आवश्यक है"
    }
    if (!formData.permanentFamilyPincode.trim()) {
      newErrors.permanentFamilyPincode = "स्थायी पिनकोड आवश्यक है"
    } else if (!/^\d{6}$/.test(formData.permanentFamilyPincode)) {
      newErrors.permanentFamilyPincode = "पिनकोड 6 अंकों का होना चाहिए"
    }
    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = "स्थायी पूरा पता आवश्यक है"
    }

    return newErrors
  }

  // Get GPS coordinates on dialog open
  useEffect(() => {
    if (!isOpen) return

    setGpsStatus("loading")
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }))
          setGpsStatus("success")
        },
        (error) => {
          console.warn("GPS error:", error)
          setFormData((prev) => ({
            ...prev,
            latitude: null,
            longitude: null,
          }))
          setGpsStatus("error")
        },
        { timeout: 10000, enableHighAccuracy: true },
      )
    } else {
      setGpsStatus("error")
    }
  }, [isOpen])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)
    setSubmitMessage("")

    mutate(
      {
        ...formData,
        chakolaId,
        villageId,
      },
      {
        onSettled: () => setIsSubmitting(false),
      },
    )
  }

  // Handle dialog close
  const handleClose = () => {
    if (!isSubmitting && !isLoading) {
      resetForm()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[95vh] overflow-hidden p-0 bg-gradient-to-br from-orange-50/30 via-white to-blue-50/30">
        {/* Enhanced Header */}
        <DialogHeader className="px-8 py-6 border-b bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent"></div>
          <DialogTitle className="text-3xl font-bold flex items-center gap-3 relative z-10">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <User className="h-8 w-8" />
            </div>
            <div>
              <div className="text-3xl">नया परिवार जोड़ें</div>
              <div className="text-lg font-normal opacity-90 mt-1">Add New Family</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto px-8 py-6 space-y-8">
          {/* Status Alerts */}
          <div className="space-y-4">
            {/* GPS Status Alert */}
            {gpsStatus && (
              <Alert
                className={`border-2 shadow-lg ${
                  gpsStatus === "success"
                    ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50"
                    : gpsStatus === "error"
                      ? "border-red-200 bg-gradient-to-r from-red-50 to-red-100/50"
                      : "border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50"
                }`}
              >
                <MapPin
                  className={`h-5 w-5 ${
                    gpsStatus === "success"
                      ? "text-emerald-600"
                      : gpsStatus === "error"
                        ? "text-red-600"
                        : "text-blue-600"
                  }`}
                />
                <AlertDescription
                  className={`font-medium ${
                    gpsStatus === "success"
                      ? "text-emerald-800"
                      : gpsStatus === "error"
                        ? "text-red-800"
                        : "text-blue-800"
                  }`}
                >
                  {gpsStatus === "loading" && (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      GPS स्थान प्राप्त कर रहे हैं...
                    </div>
                  )}
                  {gpsStatus === "success" && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      GPS स्थान सफलतापूर्वक प्राप्त हुआ
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                        Location Captured
                      </Badge>
                    </div>
                  )}
                  {gpsStatus === "error" && "GPS स्थान प्राप्त नहीं हो सका - कोई समस्या नहीं, आप मैन्युअल रूप से जारी रख सकते हैं"}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Status Alert */}
            {submitStatus && (
              <Alert
                className={`border-2 shadow-lg ${
                  submitStatus === "success"
                    ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50"
                    : "border-red-200 bg-gradient-to-r from-red-50 to-red-100/50"
                }`}
              >
                {submitStatus === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <AlertDescription
                  className={`font-medium ${submitStatus === "success" ? "text-emerald-800" : "text-red-800"}`}
                >
                  {submitMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Card */}
            <Card className="border-2 border-orange-200 shadow-xl bg-gradient-to-br from-orange-50/50 to-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent"></div>
                <CardTitle className="text-xl font-bold flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <div>बुनियादी जानकारी</div>
                    <div className="text-sm font-normal opacity-90">Basic Information</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label
                      htmlFor="mukhiyaName"
                      className="text-base font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-orange-600" />
                      मुखिया का नाम (Head of Family) *
                    </Label>
                    <Input
                      id="mukhiyaName"
                      name="mukhiyaName"
                      value={formData.mukhiyaName}
                      onChange={handleChange}
                      className={`h-12 text-base border-2 transition-all duration-200 ${
                        errors.mukhiyaName
                          ? "border-red-300 focus:border-red-500 bg-red-50/50"
                          : "border-gray-200 focus:border-orange-500 hover:border-orange-300"
                      }`}
                      placeholder="मुखिया का पूरा नाम दर्ज करें"
                    />
                    {errors.mukhiyaName && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.mukhiyaName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-orange-600" />
                      आर्थिक स्थिति (Economic Status) *
                    </Label>
                    <div className="h-12">
                      <SelectInput
                        name="economicStatus"
                        value={formData.economicStatus}
                        options={economicStatusOptions}
                        onChange={(val: any) => handleSelectChange("economicStatus", val)}
                        placeholder="आर्थिक स्थिति चुनें"
                      />
                    </div>
                    {errors.economicStatus && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.economicStatus}
                      </p>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-3">
                    <Label
                      htmlFor="anyComment"
                      className="text-base font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 text-orange-600" />
                      टिप्पणी (Comment)
                    </Label>
                    <Textarea
                      id="anyComment"
                      name="anyComment"
                      value={formData.anyComment}
                      onChange={handleChange}
                      className="border-2 border-gray-200 focus:border-orange-500 hover:border-orange-300 transition-all duration-200"
                      placeholder="कोई अतिरिक्त जानकारी या टिप्पणी..."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Address Card */}
            <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-blue-50/50 to-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
                <CardTitle className="text-xl font-bold flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Home className="h-6 w-6" />
                  </div>
                  <div>
                    <div>वर्तमान पता</div>
                    <div className="text-sm font-normal opacity-90">Current Address</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-800">राज्य (State) *</Label>
                    <div className="h-12">
                      <SelectInput
                        name="currentFamilyState"
                        options={stateOptions}
                        value={formData.currentFamilyState}
                        onChange={(val?: string) => handleSelectChange("currentFamilyState", val)}
                        placeholder="राज्य चुनें"
                      />
                    </div>
                    {errors.currentFamilyState && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currentFamilyState}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-800">जिला (District) *</Label>
                    <div className="h-12">
                      <SelectInput
                        name="currentFamilyDistrict"
                        options={currentDistrictOptions}
                        value={formData.currentFamilyDistrict}
                        onChange={(val?: string) => handleSelectChange("currentFamilyDistrict", val)}
                        placeholder="जिला चुनें"
                        disabled={!formData.currentFamilyState}
                      />
                    </div>
                    {errors.currentFamilyDistrict && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currentFamilyDistrict}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="currentFamilyVillage" className="text-base font-semibold text-gray-800">
                      गांव (Village) *
                    </Label>
                    <Input
                      id="currentFamilyVillage"
                      name="currentFamilyVillage"
                      value={formData.currentFamilyVillage}
                      onChange={handleChange}
                      className={`h-12 text-base border-2 transition-all duration-200 ${
                        errors.currentFamilyVillage
                          ? "border-red-300 bg-red-50/50"
                          : "border-gray-200 focus:border-blue-500 hover:border-blue-300"
                      }`}
                      placeholder="गांव का नाम"
                    />
                    {errors.currentFamilyVillage && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currentFamilyVillage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="currentFamilyPincode" className="text-base font-semibold text-gray-800">
                      पिनकोड (Pincode) *
                    </Label>
                    <Input
                      id="currentFamilyPincode"
                      name="currentFamilyPincode"
                      value={formData.currentFamilyPincode}
                      onChange={handleChange}
                      className={`h-12 text-base border-2 transition-all duration-200 ${
                        errors.currentFamilyPincode
                          ? "border-red-300 bg-red-50/50"
                          : "border-gray-200 focus:border-blue-500 hover:border-blue-300"
                      }`}
                      placeholder="6 अंकों का पिनकोड"
                      maxLength={6}
                    />
                    {errors.currentFamilyPincode && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currentFamilyPincode}
                      </p>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-3">
                    <Label htmlFor="currentAddress" className="text-base font-semibold text-gray-800">
                      पूरा पता (Full Address) *
                    </Label>
                    <Textarea
                      id="currentAddress"
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleChange}
                      className={`border-2 transition-all duration-200 ${
                        errors.currentAddress
                          ? "border-red-300 bg-red-50/50"
                          : "border-gray-200 focus:border-blue-500 hover:border-blue-300"
                      }`}
                      placeholder="पूरा पता विस्तार से लिखें..."
                      rows={4}
                    />
                    {errors.currentAddress && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currentAddress}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permanent Address Card */}
            <Card className="border-2 border-emerald-200 shadow-xl bg-gradient-to-br from-emerald-50/50 to-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent"></div>
                <CardTitle className="text-xl font-bold flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div>स्थायी पता</div>
                      <div className="text-sm font-normal opacity-90">Permanent Address</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={copyCurrentToPermanent}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    वर्तमान पता कॉपी करें
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-800">राज्य (State) *</Label>
                    <div className="h-12">
                      <SelectInput
                        name="permanentFamilyState"
                        options={stateOptions}
                        value={formData.permanentFamilyState}
                        onChange={(val: any) => handleSelectChange("permanentFamilyState", val)}
                        placeholder="राज्य चुनें"
                      />
                    </div>
                    {errors.permanentFamilyState && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.permanentFamilyState}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-800">जिला (District) *</Label>
                    <div className="h-12">
                      <SelectInput
                        name="permanentFamilyDistrict"
                        options={permanentDistrictOptions}
                        value={formData.permanentFamilyDistrict}
                        onChange={(val: any) => handleSelectChange("permanentFamilyDistrict", val)}
                        placeholder="जिला चुनें"
                        disabled={!formData.permanentFamilyState}
                      />
                    </div>
                    {errors.permanentFamilyDistrict && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.permanentFamilyDistrict}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="permanentFamilyVillage" className="text-base font-semibold text-gray-800">
                      गांव (Village) *
                    </Label>
                    <Input
                      id="permanentFamilyVillage"
                      name="permanentFamilyVillage"
                      value={formData.permanentFamilyVillage}
                      onChange={handleChange}
                      className={`h-12 text-base border-2 transition-all duration-200 ${
                        errors.permanentFamilyVillage
                          ? "border-red-300 bg-red-50/50"
                          : "border-gray-200 focus:border-emerald-500 hover:border-emerald-300"
                      }`}
                      placeholder="गांव का नाम"
                    />
                    {errors.permanentFamilyVillage && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.permanentFamilyVillage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="permanentFamilyPincode" className="text-base font-semibold text-gray-800">
                      पिनकोड (Pincode) *
                    </Label>
                    <Input
                      id="permanentFamilyPincode"
                      name="permanentFamilyPincode"
                      value={formData.permanentFamilyPincode}
                      onChange={handleChange}
                      className={`h-12 text-base border-2 transition-all duration-200 ${
                        errors.permanentFamilyPincode
                          ? "border-red-300 bg-red-50/50"
                          : "border-gray-200 focus:border-emerald-500 hover:border-emerald-300"
                      }`}
                      placeholder="6 अंकों का पिनकोड"
                      maxLength={6}
                    />
                    {errors.permanentFamilyPincode && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.permanentFamilyPincode}
                      </p>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-3">
                    <Label htmlFor="permanentAddress" className="text-base font-semibold text-gray-800">
                      पूरा पता (Full Address) *
                    </Label>
                    <Textarea
                      id="permanentAddress"
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleChange}
                      className={`border-2 transition-all duration-200 ${
                        errors.permanentAddress
                          ? "border-red-300 bg-red-50/50"
                          : "border-gray-200 focus:border-emerald-500 hover:border-emerald-300"
                      }`}
                      placeholder="पूरा पता विस्तार से लिखें..."
                      rows={4}
                    />
                    {errors.permanentAddress && (
                      <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {errors.permanentAddress}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || isLoading}
                className="px-8 py-3 h-12 text-base border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                रद्द करें (Cancel)
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-8 py-3 h-12 text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                {(isSubmitting || isLoading) && <Loader2 className="h-5 w-5 animate-spin" />}
                परिवार जोड़ें (Add Family)
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

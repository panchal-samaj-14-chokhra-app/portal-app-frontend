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
import { Loader2, MapPin, User, Home, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

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
      <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-orange-50 to-orange-100">
          <DialogTitle className="text-2xl font-bold text-orange-800 flex items-center gap-2">
            <User className="h-6 w-6" />
            नया परिवार जोड़ें (Add New Family)
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-4">
          {/* GPS Status Alert */}
          {gpsStatus && (
            <Alert
              className={`mb-4 ${gpsStatus === "success" ? "border-green-200 bg-green-50" : gpsStatus === "error" ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}`}
            >
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                {gpsStatus === "loading" && "GPS स्थान प्राप्त कर रहे हैं..."}
                {gpsStatus === "success" && "GPS स्थान सफलतापूर्वक प्राप्त हुआ"}
                {gpsStatus === "error" && "GPS स्थान प्राप्त नहीं हो सका"}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Status Alert */}
          {submitStatus && (
            <Alert
              className={`mb-4 ${submitStatus === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              {submitStatus === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={submitStatus === "success" ? "text-green-700" : "text-red-700"}>
                {submitMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Card */}
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  बुनियादी जानकारी (Basic Information)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mukhiyaName" className="text-sm font-medium text-gray-700">
                      मुखिया का नाम (Head of Family) *
                    </Label>
                    <Input
                      id="mukhiyaName"
                      name="mukhiyaName"
                      value={formData.mukhiyaName}
                      onChange={handleChange}
                      className={`${errors.mukhiyaName ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-orange-500"}`}
                      placeholder="मुखिया का पूरा नाम दर्ज करें"
                    />
                    {errors.mukhiyaName && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.mukhiyaName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">आर्थिक स्थिति (Economic Status) *</Label>
                    <SelectInput
                      name="economicStatus"
                      value={formData.economicStatus}
                      options={economicStatusOptions}
                      onChange={(val: any) => handleSelectChange("economicStatus", val)}
                      placeholder="आर्थिक स्थिति चुनें"
                    />
                    {errors.economicStatus && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.economicStatus}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="anyComment" className="text-sm font-medium text-gray-700">
                      टिप्पणी (Comment)
                    </Label>
                    <Textarea
                      id="anyComment"
                      name="anyComment"
                      value={formData.anyComment}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-orange-500"
                      placeholder="कोई अतिरिक्त जानकारी या टिप्पणी..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Address Card */}
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  वर्तमान पता (Current Address)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">राज्य (State) *</Label>
                    <SelectInput
                      name="currentFamilyState"
                      options={stateOptions}
                      value={formData.currentFamilyState}
                      onChange={(val?: string) => handleSelectChange("currentFamilyState", val)}
                      placeholder="राज्य चुनें"
                    />
                    {errors.currentFamilyState && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currentFamilyState}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">जिला (District) *</Label>
                    <SelectInput
                      name="currentFamilyDistrict"
                      options={currentDistrictOptions}
                      value={formData.currentFamilyDistrict}
                      onChange={(val?: string) => handleSelectChange("currentFamilyDistrict", val)}
                      placeholder="जिला चुनें"
                      disabled={!formData.currentFamilyState}
                    />
                    {errors.currentFamilyDistrict && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currentFamilyDistrict}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentFamilyVillage" className="text-sm font-medium text-gray-700">
                      गांव (Village) *
                    </Label>
                    <Input
                      id="currentFamilyVillage"
                      name="currentFamilyVillage"
                      value={formData.currentFamilyVillage}
                      onChange={handleChange}
                      className={errors.currentFamilyVillage ? "border-red-300" : "border-gray-300"}
                      placeholder="गांव का नाम"
                    />
                    {errors.currentFamilyVillage && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currentFamilyVillage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentFamilyPincode" className="text-sm font-medium text-gray-700">
                      पिनकोड (Pincode) *
                    </Label>
                    <Input
                      id="currentFamilyPincode"
                      name="currentFamilyPincode"
                      value={formData.currentFamilyPincode}
                      onChange={handleChange}
                      className={errors.currentFamilyPincode ? "border-red-300" : "border-gray-300"}
                      placeholder="6 अंकों का पिनकोड"
                      maxLength={6}
                    />
                    {errors.currentFamilyPincode && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currentFamilyPincode}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="currentAddress" className="text-sm font-medium text-gray-700">
                      पूरा पता (Full Address) *
                    </Label>
                    <Textarea
                      id="currentAddress"
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleChange}
                      className={errors.currentAddress ? "border-red-300" : "border-gray-300"}
                      placeholder="पूरा पता विस्तार से लिखें..."
                      rows={3}
                    />
                    {errors.currentAddress && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currentAddress}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permanent Address Card */}
            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-lg text-green-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    स्थायी पता (Permanent Address)
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyCurrentToPermanent}
                    className="text-xs bg-transparent"
                  >
                    वर्तमान पता कॉपी करें
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">राज्य (State) *</Label>
                    <SelectInput
                      name="permanentFamilyState"
                      options={stateOptions}
                      value={formData.permanentFamilyState}
                      onChange={(val: any) => handleSelectChange("permanentFamilyState", val)}
                      placeholder="राज्य चुनें"
                    />
                    {errors.permanentFamilyState && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.permanentFamilyState}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">जिला (District) *</Label>
                    <SelectInput
                      name="permanentFamilyDistrict"
                      options={permanentDistrictOptions}
                      value={formData.permanentFamilyDistrict}
                      onChange={(val: any) => handleSelectChange("permanentFamilyDistrict", val)}
                      placeholder="जिला चुनें"
                      disabled={!formData.permanentFamilyState}
                    />
                    {errors.permanentFamilyDistrict && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.permanentFamilyDistrict}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permanentFamilyVillage" className="text-sm font-medium text-gray-700">
                      गांव (Village) *
                    </Label>
                    <Input
                      id="permanentFamilyVillage"
                      name="permanentFamilyVillage"
                      value={formData.permanentFamilyVillage}
                      onChange={handleChange}
                      className={errors.permanentFamilyVillage ? "border-red-300" : "border-gray-300"}
                      placeholder="गांव का नाम"
                    />
                    {errors.permanentFamilyVillage && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.permanentFamilyVillage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permanentFamilyPincode" className="text-sm font-medium text-gray-700">
                      पिनकोड (Pincode) *
                    </Label>
                    <Input
                      id="permanentFamilyPincode"
                      name="permanentFamilyPincode"
                      value={formData.permanentFamilyPincode}
                      onChange={handleChange}
                      className={errors.permanentFamilyPincode ? "border-red-300" : "border-gray-300"}
                      placeholder="6 अंकों का पिनकोड"
                      maxLength={6}
                    />
                    {errors.permanentFamilyPincode && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.permanentFamilyPincode}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="permanentAddress" className="text-sm font-medium text-gray-700">
                      पूरा पता (Full Address) *
                    </Label>
                    <Textarea
                      id="permanentAddress"
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleChange}
                      className={errors.permanentAddress ? "border-red-300" : "border-gray-300"}
                      placeholder="पूरा पता विस्तार से लिखें..."
                      rows={3}
                    />
                    {errors.permanentAddress && (
                      <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.permanentAddress}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || isLoading}
                className="px-6 bg-transparent"
              >
                रद्द करें (Cancel)
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-6 bg-orange-600 hover:bg-orange-700"
              >
                {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                परिवार जोड़ें (Add Family)
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

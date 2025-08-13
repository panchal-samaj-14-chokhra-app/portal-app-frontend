"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Home,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  Heart,
  Wallet,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
  Building,
} from "lucide-react"
import { SelectInput } from "./family-form/employment-info-section"
import { statesAndDistricts } from "./family-form/constants"
import type { FamilyData, Member } from "./family-form/types"

interface AddEditFamilyProps {
  familyDetails?: FamilyData
  isEditing?: boolean
  onSave?: (data: FamilyData) => void
  onCancel?: () => void
}

const economicStatusOptions = [
  { value: "bpl", label: "गरीबी रेखा से नीचे (BPL)" },
  { value: "apl", label: "गरीबी रेखा से ऊपर (APL)" },
  { value: "middle", label: "मध्यम वर्गीय (Middle Class)" },
  { value: "upper", label: "उच्च वर्गीय (Upper Middle Class)" },
]

const relationshipOptions = [
  { value: "head", label: "मुखिया (Head)" },
  { value: "spouse", label: "पति/पत्नी (Spouse)" },
  { value: "son", label: "पुत्र (Son)" },
  { value: "daughter", label: "पुत्री (Daughter)" },
  { value: "father", label: "पिता (Father)" },
  { value: "mother", label: "माता (Mother)" },
  { value: "brother", label: "भाई (Brother)" },
  { value: "sister", label: "बहन (Sister)" },
  { value: "other", label: "अन्य (Other)" },
]

const genderOptions = [
  { value: "male", label: "पुरुष (Male)" },
  { value: "female", label: "महिला (Female)" },
  { value: "other", label: "अन्य (Other)" },
]

export default function AddEditFamily({ familyDetails, isEditing = false, onSave, onCancel }: AddEditFamilyProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<FamilyData>({
    id: "",
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
    members: [],
    ...familyDetails,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null)
  const [editingMember, setEditingMember] = useState<number | null>(null)

  // Auto-fill effect when familyDetails changes
  useEffect(() => {
    if (familyDetails) {
      setFormData((prev) => {
        const updated = { ...prev, ...familyDetails }

        // Auto-fill person* address fields from familyDetails
        if (familyDetails.members && familyDetails.members.length > 0) {
          const updatedMembers = familyDetails.members.map((member) => ({
            ...member,
            // Fill person address fields with family address if empty
            personCurrentState: member.personCurrentState || familyDetails.currentFamilyState || "",
            personCurrentDistrict: member.personCurrentDistrict || familyDetails.currentFamilyDistrict || "",
            personCurrentVillage: member.personCurrentVillage || familyDetails.currentFamilyVillage || "",
            personCurrentPincode: member.personCurrentPincode || familyDetails.currentFamilyPincode || "",
            personCurrentAddress: member.personCurrentAddress || familyDetails.currentAddress || "",
            personPermanentState: member.personPermanentState || familyDetails.permanentFamilyState || "",
            personPermanentDistrict: member.personPermanentDistrict || familyDetails.permanentFamilyDistrict || "",
            personPermanentVillage: member.personPermanentVillage || familyDetails.permanentFamilyVillage || "",
            personPermanentPincode: member.personPermanentPincode || familyDetails.permanentFamilyPincode || "",
            personPermanentAddress: member.personPermanentAddress || familyDetails.permanentAddress || "",
          }))
          updated.members = updatedMembers
        }

        return updated
      })
    }
  }, [familyDetails])

  const stateOptions = Object.keys(statesAndDistricts).map((state) => ({
    label: state,
    value: state,
  }))

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "currentFamilyState" && { currentFamilyDistrict: "" }),
      ...(field === "permanentFamilyState" && { permanentFamilyDistrict: "" }),
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

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

  const addNewMember = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: "",
      relationshipWithHead: "",
      gender: "",
      age: "",
      dateOfBirth: "",
      maritalStatus: "",
      education: "",
      occupation: "",
      monthlyIncome: "",
      mobileNumber: "",
      email: "",
      aadharNumber: "",
      voterIdNumber: "",
      rationCardNumber: "",
      bankAccountNumber: "",
      ifscCode: "",
      personCurrentState: formData.currentFamilyState,
      personCurrentDistrict: formData.currentFamilyDistrict,
      personCurrentVillage: formData.currentFamilyVillage,
      personCurrentPincode: formData.currentFamilyPincode,
      personCurrentAddress: formData.currentAddress,
      personPermanentState: formData.permanentFamilyState,
      personPermanentDistrict: formData.permanentFamilyDistrict,
      personPermanentVillage: formData.permanentFamilyVillage,
      personPermanentPincode: formData.permanentFamilyPincode,
      personPermanentAddress: formData.permanentAddress,
    }
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }))
    setEditingMember(prev.members.length)
  }

  const updateMember = (index: number, updatedMember: Member) => {
    setFormData((prev) => {
      const updatedMembers = prev.members.map((member, i) => (i === index ? updatedMember : member))
      return { ...prev, members: updatedMembers }
    })
  }

  const deleteMember = (index: number) => {
    setFormData((prev) => {
      const updatedMembers = prev.members.filter((_, i) => i !== index)
      return { ...prev, members: updatedMembers }
    })
    if (editingMember === index) {
      setEditingMember(null)
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.mukhiyaName.trim()) {
      newErrors.mukhiyaName = "मुखिया का नाम आवश्यक है"
    }
    if (!formData.economicStatus) {
      newErrors.economicStatus = "आर्थिक स्थिति चुनना आवश्यक है"
    }
    if (!formData.currentFamilyState) {
      newErrors.currentFamilyState = "वर्तमान राज्य चुनना आवश्यक है"
    }
    if (!formData.currentFamilyDistrict) {
      newErrors.currentFamilyDistrict = "वर्तमान जिला चुनना आवश्यक है"
    }
    if (!formData.currentAddress.trim()) {
      newErrors.currentAddress = "वर्तमान पता आवश्यक है"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      if (onSave) {
        await onSave(formData)
        setSubmitStatus("success")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
              {isEditing ? "परिवार की जानकारी संपादित करें" : "नया परिवार जोड़ें"}
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {isEditing
              ? "परिवार की विस्तृत जानकारी को अपडेट करें और सभी सदस्यों की जानकारी को संशोधित करें"
              : "नए परिवार की संपूर्ण जानकारी दर्ज करें और सभी सदस्यों का विवरण जोड़ें"}
          </p>
        </div>

        {/* Status Alert */}
        {submitStatus && (
          <Alert
            className={`max-w-2xl mx-auto ${
              submitStatus === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
          >
            {submitStatus === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={submitStatus === "success" ? "text-green-700" : "text-red-700"}>
              {submitStatus === "success"
                ? "परिवार की जानकारी सफलतापूर्वक सहेजी गई!"
                : "जानकारी सहेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।"}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Family Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-3">
                <User className="h-6 w-6" />
                बुनियादी पारिवारिक जानकारी (Basic Family Information)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mukhiyaName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    मुखिया का नाम (Head of Family) *
                  </Label>
                  <Input
                    id="mukhiyaName"
                    name="mukhiyaName"
                    value={formData.mukhiyaName}
                    onChange={handleInputChange}
                    className={`h-12 ${errors.mukhiyaName ? "border-red-300" : "border-gray-300"} focus:border-orange-500 focus:ring-orange-200`}
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
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    आर्थिक स्थिति (Economic Status) *
                  </Label>
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
                  <Label htmlFor="anyComment" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    टिप्पणी (Comments)
                  </Label>
                  <Textarea
                    id="anyComment"
                    name="anyComment"
                    value={formData.anyComment}
                    onChange={handleInputChange}
                    className="min-h-[100px] border-gray-300 focus:border-orange-500 focus:ring-orange-200"
                    placeholder="कोई अतिरिक्त जानकारी या टिप्पणी यहाँ लिखें..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Address */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-3">
                <Home className="h-6 w-6" />
                वर्तमान पता (Current Address)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    राज्य (State) *
                  </Label>
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
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    जिला (District) *
                  </Label>
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
                  <Label htmlFor="currentFamilyVillage" className="text-sm font-semibold text-gray-700">
                    गांव (Village) *
                  </Label>
                  <Input
                    id="currentFamilyVillage"
                    name="currentFamilyVillage"
                    value={formData.currentFamilyVillage}
                    onChange={handleInputChange}
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    placeholder="गांव का नाम"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentFamilyPincode" className="text-sm font-semibold text-gray-700">
                    पिनकोड (Pincode) *
                  </Label>
                  <Input
                    id="currentFamilyPincode"
                    name="currentFamilyPincode"
                    value={formData.currentFamilyPincode}
                    onChange={handleInputChange}
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    placeholder="6 अंकों का पिनकोड"
                    maxLength={6}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="currentAddress" className="text-sm font-semibold text-gray-700">
                    पूरा पता (Full Address) *
                  </Label>
                  <Textarea
                    id="currentAddress"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    className={`min-h-[100px] ${errors.currentAddress ? "border-red-300" : "border-gray-300"} focus:border-blue-500 focus:ring-blue-200`}
                    placeholder="पूरा पता विस्तार से लिखें..."
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

          {/* Permanent Address */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="text-xl md:text-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6" />
                  स्थायी पता (Permanent Address)
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={copyCurrentToPermanent}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  वर्तमान पता कॉपी करें
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    राज्य (State) *
                  </Label>
                  <SelectInput
                    name="permanentFamilyState"
                    options={stateOptions}
                    value={formData.permanentFamilyState}
                    onChange={(val: any) => handleSelectChange("permanentFamilyState", val)}
                    placeholder="राज्य चुनें"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    जिला (District) *
                  </Label>
                  <SelectInput
                    name="permanentFamilyDistrict"
                    options={permanentDistrictOptions}
                    value={formData.permanentFamilyDistrict}
                    onChange={(val: any) => handleSelectChange("permanentFamilyDistrict", val)}
                    placeholder="जिला चुनें"
                    disabled={!formData.permanentFamilyState}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanentFamilyVillage" className="text-sm font-semibold text-gray-700">
                    गांव (Village) *
                  </Label>
                  <Input
                    id="permanentFamilyVillage"
                    name="permanentFamilyVillage"
                    value={formData.permanentFamilyVillage}
                    onChange={handleInputChange}
                    className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-200"
                    placeholder="गांव का नाम"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanentFamilyPincode" className="text-sm font-semibold text-gray-700">
                    पिनकोड (Pincode) *
                  </Label>
                  <Input
                    id="permanentFamilyPincode"
                    name="permanentFamilyPincode"
                    value={formData.permanentFamilyPincode}
                    onChange={handleInputChange}
                    className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-200"
                    placeholder="6 अंकों का पिनकोड"
                    maxLength={6}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="permanentAddress" className="text-sm font-semibold text-gray-700">
                    पूरा पता (Full Address) *
                  </Label>
                  <Textarea
                    id="permanentAddress"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    className="min-h-[100px] border-gray-300 focus:border-green-500 focus:ring-green-200"
                    placeholder="पूरा पता विस्तार से लिखें..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Members */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl md:text-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6" />
                  परिवार के सदस्य (Family Members)
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addNewMember}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  सदस्य जोड़ें
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              {formData.members.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">अभी तक कोई सदस्य नहीं जोड़ा गया है</p>
                  <Button type="button" onClick={addNewMember} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    पहला सदस्य जोड़ें
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.members.map((member, index) => (
                    <Card
                      key={member.id || index}
                      className="border-2 border-gray-200 hover:border-purple-300 transition-colors"
                    >
                      <CardHeader className="bg-gray-50 pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                              सदस्य {index + 1}
                            </Badge>
                            {member.name && <h3 className="font-semibold text-gray-800">{member.name}</h3>}
                            {member.relationshipWithHead && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {relationshipOptions.find((opt) => opt.value === member.relationshipWithHead)?.label}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingMember(editingMember === index ? null : index)}
                              className="h-8 w-8 p-0"
                            >
                              {editingMember === index ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMember(index)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {editingMember === index ? (
                        <CardContent className="pt-6">
                          <MemberForm
                            member={member}
                            onUpdate={(updatedMember) => updateMember(index, updatedMember)}
                            onCancel={() => setEditingMember(null)}
                          />
                        </CardContent>
                      ) : (
                        <CardContent className="pt-4">
                          <MemberSummary member={member} />
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-8 py-3 text-lg border-2 hover:bg-gray-50 bg-transparent"
            >
              <X className="h-5 w-5 mr-2" />
              रद्द करें (Cancel)
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="px-8 py-3 text-lg bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  सहेज रहे हैं...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {isEditing ? "अपडेट करें (Update)" : "सहेजें (Save)"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Member Form Component
function MemberForm({
  member,
  onUpdate,
  onCancel,
}: {
  member: Member
  onUpdate: (member: Member) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Member>(member)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onUpdate(formData)
    onCancel()
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${member.id}`} className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User className="h-4 w-4" />
            नाम (Name) *
          </Label>
          <Input
            id={`name-${member.id}`}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="h-10"
            placeholder="पूरा नाम"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Heart className="h-4 w-4" />
            रिश्ता (Relationship) *
          </Label>
          <SelectInput
            name="relationshipWithHead"
            value={formData.relationshipWithHead}
            options={relationshipOptions}
            onChange={(val: any) => handleSelectChange("relationshipWithHead", val)}
            placeholder="रिश्ता चुनें"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">लिंग (Gender) *</Label>
          <SelectInput
            name="gender"
            value={formData.gender}
            options={genderOptions}
            onChange={(val: any) => handleSelectChange("gender", val)}
            placeholder="लिंग चुनें"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`age-${member.id}`} className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            उम्र (Age)
          </Label>
          <Input
            id={`age-${member.id}`}
            name="age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
            className="h-10"
            placeholder="उम्र"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`dateOfBirth-${member.id}`} className="text-sm font-semibold text-gray-700">
            जन्म तिथि (Date of Birth)
          </Label>
          <Input
            id={`dateOfBirth-${member.id}`}
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`education-${member.id}`}
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <GraduationCap className="h-4 w-4" />
            शिक्षा (Education)
          </Label>
          <Input
            id={`education-${member.id}`}
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            className="h-10"
            placeholder="शैक्षणिक योग्यता"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`occupation-${member.id}`}
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            व्यवसाय (Occupation)
          </Label>
          <Input
            id={`occupation-${member.id}`}
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            className="h-10"
            placeholder="व्यवसाय/काम"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`monthlyIncome-${member.id}`}
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            मासिक आय (Monthly Income)
          </Label>
          <Input
            id={`monthlyIncome-${member.id}`}
            name="monthlyIncome"
            type="number"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
            className="h-10"
            placeholder="₹ मासिक आय"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`mobileNumber-${member.id}`}
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            मोबाइल नंबर (Mobile)
          </Label>
          <Input
            id={`mobileNumber-${member.id}`}
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="h-10"
            placeholder="10 अंकों का मोबाइल नंबर"
            maxLength={10}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`email-${member.id}`} className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            ईमेल (Email)
          </Label>
          <Input
            id={`email-${member.id}`}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="h-10"
            placeholder="email@example.com"
          />
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          रद्द करें
        </Button>
        <Button type="button" onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          सहेजें
        </Button>
      </div>
    </div>
  )
}

// Member Summary Component
function MemberSummary({ member }: { member: Member }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
      {member.name && (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">नाम:</span>
          <span>{member.name}</span>
        </div>
      )}
      {member.relationshipWithHead && (
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-gray-500" />
          <span className="font-medium">रिश्ता:</span>
          <span>{relationshipOptions.find((opt) => opt.value === member.relationshipWithHead)?.label}</span>
        </div>
      )}
      {member.gender && (
        <div className="flex items-center gap-2">
          <span className="font-medium">लिंग:</span>
          <span>{genderOptions.find((opt) => opt.value === member.gender)?.label}</span>
        </div>
      )}
      {member.age && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="font-medium">उम्र:</span>
          <span>{member.age} वर्ष</span>
        </div>
      )}
      {member.education && (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-gray-500" />
          <span className="font-medium">शिक्षा:</span>
          <span>{member.education}</span>
        </div>
      )}
      {member.occupation && (
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-gray-500" />
          <span className="font-medium">व्यवसाय:</span>
          <span>{member.occupation}</span>
        </div>
      )}
      {member.monthlyIncome && (
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-gray-500" />
          <span className="font-medium">मासिक आय:</span>
          <span>₹{member.monthlyIncome}</span>
        </div>
      )}
      {member.mobileNumber && (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="font-medium">मोबाइल:</span>
          <span>{member.mobileNumber}</span>
        </div>
      )}
      {member.email && (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="font-medium">ईमेल:</span>
          <span>{member.email}</span>
        </div>
      )}
    </div>
  )
}

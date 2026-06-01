"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { SelectInput } from "@/components/group-component/family-form/employment-info-section"
import { statesAndDistricts } from "@/components/group-component/family-form/constants"
import { useVillageDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"

interface EditVillageFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (villageId: string, data: any) => void
  isSubmitting: boolean
  villageId: string
  chakolaList: { id: string; name: string }[]
}

const initialForm = {
  name: "",
  choklaId: "",
  villageMemberName: "",
  mobileNumber: "",
  age: "",
  email: "",
  state: "",
  district: "",
  tehsil: "",
  isVillageHaveSchool: false,
  isVillageHavePrimaryHealthCare: false,
  isVillageHaveCommunityHall: false,
  latitude: "",
  longitude: "",
}

export default function EditVillageForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  villageId,
  chakolaList,
}: EditVillageFormProps) {
  const { data: village, isLoading } = useVillageDetails(villageId)
  const [formData, setFormData] = useState({ ...initialForm })
  const [displayId, setDisplayId] = useState<number | string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Populate when the full village record loads
  useEffect(() => {
    if (village) {
      setFormData({
        name: village.name || "",
        choklaId: village.choklaId || "",
        villageMemberName: village.villageMemberName || "",
        mobileNumber: village.mobileNumber || "",
        age: village.age != null ? String(village.age) : "",
        email: village.email || "",
        state: village.state || "",
        district: village.district || "",
        tehsil: village.tehsil || "",
        isVillageHaveSchool: !!village.isVillageHaveSchool,
        isVillageHavePrimaryHealthCare: !!village.isVillageHavePrimaryHealthCare,
        isVillageHaveCommunityHall: !!village.isVillageHaveCommunityHall,
        latitude: village.latitude != null ? String(village.latitude) : "",
        longitude: village.longitude != null ? String(village.longitude) : "",
      })
      setDisplayId(village.displayId ?? village.id ?? null)
      setErrors({})
    }
  }, [village])

  const stateOptions = Object.keys(statesAndDistricts).map((s) => ({ label: s, value: s }))
  const districtOptions =
    formData.state && statesAndDistricts[formData.state]
      ? statesAndDistricts[formData.state].map((d) => ({ label: d, value: d }))
      : []
  const chakolaOptions = (chakolaList || []).map((c) => ({ label: c.name, value: c.id }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "state") next.district = "" // reset district when state changes
      return next
    })
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSwitch = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "गांव का नाम आवश्यक है"
    if (!formData.villageMemberName.trim()) newErrors.villageMemberName = "गांव सदस्य का नाम आवश्यक है"
    if (formData.mobileNumber && !/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "वैध मोबाइल नंबर दर्ज करें"
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "वैध ईमेल पता दर्ज करें"
    }
    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 0)) {
      newErrors.age = "वैध आयु दर्ज करें"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!villageId) return
    if (!validate()) return
    onSubmit(villageId, {
      name: formData.name,
      choklaId: formData.choklaId,
      villageMemberName: formData.villageMemberName,
      mobileNumber: formData.mobileNumber,
      age: formData.age === "" ? null : Number(formData.age),
      email: formData.email,
      state: formData.state,
      district: formData.district,
      tehsil: formData.tehsil,
      isVillageHaveSchool: formData.isVillageHaveSchool,
      isVillageHavePrimaryHealthCare: formData.isVillageHavePrimaryHealthCare,
      isVillageHaveCommunityHall: formData.isVillageHaveCommunityHall,
      latitude: formData.latitude === "" ? null : Number(formData.latitude),
      longitude: formData.longitude === "" ? null : Number(formData.longitude),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden p-2 sm:p-4 lg:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-orange-800 text-center">
            गांव विवरण संपादित करें
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto px-1">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
                <h3 className="text-base sm:text-lg font-semibold text-orange-800 mb-3 sm:mb-4">बुनियादी जानकारी</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">गांव ID</label>
                    <p className="text-gray-900 font-mono text-sm bg-gray-100 px-3 py-2 rounded border border-gray-200">
                      {displayId ?? "—"}
                    </p>
                  </div>
                  <div>
                    <SelectInput
                      label="चोखरा"
                      value={formData.choklaId}
                      options={chakolaOptions}
                      onChange={(val) => handleSelectChange("choklaId", val)}
                      placeholder="चोखरा चुनें"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-1">गांव का नाम *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-orange-300 focus:border-orange-500 text-sm"
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-1">गांव सदस्य का नाम *</label>
                    <Input
                      name="villageMemberName"
                      value={formData.villageMemberName}
                      onChange={handleChange}
                      className="border-orange-300 focus:border-orange-500 text-sm"
                    />
                    {errors.villageMemberName && (
                      <p className="text-red-600 text-xs mt-1">{errors.villageMemberName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4">संपर्क जानकारी</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">मोबाइल नंबर</label>
                    <Input
                      name="mobileNumber"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="border-blue-300 focus:border-blue-500 text-sm"
                    />
                    {errors.mobileNumber && <p className="text-red-600 text-xs mt-1">{errors.mobileNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">ईमेल</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-blue-300 focus:border-blue-500 text-sm"
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">आयु</label>
                    <Input
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      className="border-blue-300 focus:border-blue-500 text-sm"
                    />
                    {errors.age && <p className="text-red-600 text-xs mt-1">{errors.age}</p>}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
                <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-3 sm:mb-4">स्थान की जानकारी</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <SelectInput
                      label="राज्य"
                      value={formData.state}
                      options={stateOptions}
                      onChange={(val) => handleSelectChange("state", val)}
                      placeholder="राज्य चुनें"
                    />
                  </div>
                  <div>
                    <SelectInput
                      label="जिला"
                      value={formData.district}
                      options={districtOptions}
                      onChange={(val) => handleSelectChange("district", val)}
                      placeholder="जिला चुनें"
                      disabled={!formData.state}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">तहसील</label>
                    <Input
                      name="tehsil"
                      value={formData.tehsil}
                      onChange={handleChange}
                      className="border-green-300 focus:border-green-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">अक्षांश (Latitude)</label>
                    <Input
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="border-green-300 focus:border-green-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">देशांतर (Longitude)</label>
                    <Input
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="border-green-300 focus:border-green-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
                <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-3 sm:mb-4">सुविधाओं की जानकारी</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center justify-between p-3 border border-purple-200 rounded-lg bg-white">
                    <span className="text-purple-700 font-medium text-sm">स्कूल</span>
                    <Switch
                      checked={formData.isVillageHaveSchool}
                      onCheckedChange={(c) => handleSwitch("isVillageHaveSchool", c)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-purple-200 rounded-lg bg-white">
                    <span className="text-purple-700 font-medium text-sm">स्वास्थ्य केंद्र</span>
                    <Switch
                      checked={formData.isVillageHavePrimaryHealthCare}
                      onCheckedChange={(c) => handleSwitch("isVillageHavePrimaryHealthCare", c)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-purple-200 rounded-lg bg-white">
                    <span className="text-purple-700 font-medium text-sm">कम्युनिटी हॉल</span>
                    <Switch
                      checked={formData.isVillageHaveCommunityHall}
                      onCheckedChange={(c) => handleSwitch("isVillageHaveCommunityHall", c)}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-300 w-full sm:w-auto bg-transparent"
                >
                  रद्द करें
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      सहेजा जा रहा है...
                    </>
                  ) : (
                    "सहेजें"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

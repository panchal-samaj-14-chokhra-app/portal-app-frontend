"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { SelectInput } from "@/components/group-component/family-form/employment-info-section"
import { statesAndDistricts } from "@/components/group-component/family-form/constants"

interface AddChokhlaFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function AddChokhlaForm({ isOpen, onClose, onSubmit, isSubmitting }: AddChokhlaFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    adhyaksh: "",
    contactNumber: "",
    state: "",
    district: "",
    villageName: "",
    email: "",
    password: "",
    repeatPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }))
    }

    // Clear district when state changes
    if (field === "state") {
      setFormData((prev) => ({ ...prev, district: "" }))
      if (errors.district) {
        setErrors((prev: any) => ({ ...prev, district: "" }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.name) newErrors.name = "चौकला का नाम आवश्यक है"
    if (!formData.adhyaksh) newErrors.adhyaksh = "अध्यक्ष का नाम आवश्यक है"
    if (!formData.contactNumber) {
      newErrors.contactNumber = "संपर्क नंबर आवश्यक है"
    } else if (!/^[6-9]\d{9}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "वैध मोबाइल नंबर दर्ज करें"
    }
    if (!formData.state) newErrors.state = "राज्य आवश्यक है"
    if (!formData.district) newErrors.district = "जिला आवश्यक है"
    if (!formData.villageName) newErrors.villageName = "गांव का नाम आवश्यक है"
    if (!formData.email) {
      newErrors.email = "ईमेल आवश्यक है"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "वैध ईमेल पता दर्ज करें"
    }
    if (!formData.password) {
      newErrors.password = "पासवर्ड आवश्यक है"
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(formData.password)
    ) {
      newErrors.password = "पासवर्ड मजबूत होना चाहिए (8+ अक्षर, बड़ा, छोटा, संख्या, विशेष चिन्ह)"
    }
    if (!formData.repeatPassword) {
      newErrors.repeatPassword = "पासवर्ड दोबारा लिखें आवश्यक है"
    } else if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "पासवर्ड मेल नहीं खाते"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      adhyaksh: "",
      contactNumber: "",
      state: "",
      district: "",
      villageName: "",
      email: "",
      password: "",
      repeatPassword: "",
    })
    setErrors({})
    setShowPassword(false)
    setShowRepeatPassword(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // Get state options from constants
  const stateOptions = Object.keys(statesAndDistricts).map((state) => ({
    label: state,
    value: state,
  }))

  // Get district options based on selected state
  const districtOptions =
    formData.state && statesAndDistricts[formData.state]
      ? statesAndDistricts[formData.state].map((district) => ({
          label: district,
          value: district,
        }))
      : []

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden p-2 sm:p-4 lg:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-orange-800 text-center">नया चौकला जोड़ें</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
              <h3 className="text-base sm:text-lg font-semibold text-orange-800 mb-3 sm:mb-4">बुनियादी जानकारी</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">चौकला का नाम *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-orange-300 focus:border-orange-500 text-sm"
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">अध्यक्ष *</label>
                  <Input
                    name="adhyaksh"
                    value={formData.adhyaksh}
                    onChange={handleChange}
                    className="border-orange-300 focus:border-orange-500 text-sm"
                  />
                  {errors.adhyaksh && <p className="text-red-600 text-xs mt-1">{errors.adhyaksh}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4">संपर्क जानकारी</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">संपर्क नंबर *</label>
                  <Input
                    name="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="border-blue-300 focus:border-blue-500 text-sm"
                  />
                  {errors.contactNumber && <p className="text-red-600 text-xs mt-1">{errors.contactNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">ईमेल *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-blue-300 focus:border-blue-500 text-sm"
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
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
                    required
                  />
                  {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <SelectInput
                    label="जिला"
                    value={formData.district}
                    options={districtOptions}
                    onChange={(val) => handleSelectChange("district", val)}
                    placeholder="जिला चुनें"
                    required
                    disabled={!formData.state}
                  />
                  {errors.district && <p className="text-red-600 text-xs mt-1">{errors.district}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">गांव *</label>
                  <Input
                    name="villageName"
                    value={formData.villageName}
                    onChange={handleChange}
                    className="border-green-300 focus:border-green-500 text-sm"
                  />
                  {errors.villageName && <p className="text-red-600 text-xs mt-1">{errors.villageName}</p>}
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-200">
              <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-3 sm:mb-4">सुरक्षा जानकारी</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">पासवर्ड *</label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="border-red-300 focus:border-red-500 pr-10 text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-red-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">पासवर्ड दोबारा लिखें *</label>
                  <div className="relative">
                    <Input
                      name="repeatPassword"
                      type={showRepeatPassword ? "text" : "password"}
                      value={formData.repeatPassword}
                      onChange={handleChange}
                      className="border-red-300 focus:border-red-500 pr-10 text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    >
                      {showRepeatPassword ? (
                        <EyeOff className="h-4 w-4 text-red-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                  {errors.repeatPassword && <p className="text-red-600 text-xs mt-1">{errors.repeatPassword}</p>}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
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
      </DialogContent>
    </Dialog>
  )
}

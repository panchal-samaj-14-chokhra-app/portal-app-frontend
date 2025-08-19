"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { SelectInput } from "@/components/group-component/family-form/employment-info-section"

interface AddUserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isSubmitting: boolean
  chokhlaList: { id: string; name: string }[]
  villages: {
    id: string
    name: string
    choklaId: string
  }[]
}

const GLOBAL_ROLES = [
  { label: "SUPER_ADMIN", value: "SUPER_ADMIN" },
  { label: "CHOKHLA_MEMBER", value: "CHOKHLA_MEMBER" },
  { label: "VILLAGE_MEMBER", value: "VILLAGE_MEMBER" },
]

export default function AddUserForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  chokhlaList,
  villages,
}: AddUserFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    repeatPassword: "",
    globalRole: "",
    choklaId: "",
    villageId: "",
  })

  const [errors, setErrors] = useState<any>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  // Filter villages based on selected chokhlaId
  const filteredVillages = villages.filter(
    (village) => village.choklaId === formData.choklaId
  )

  // Clear villageId if choklaId changes or role changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, villageId: "" }))
  }, [formData.choklaId, formData.globalRole])

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
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.fullName) newErrors.fullName = "पूरा नाम आवश्यक है"
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "मोबाइल नंबर आवश्यक है"
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "वैध मोबाइल नंबर दर्ज करें"
    }
    if (!formData.email) {
      newErrors.email = "ईमेल आवश्यक है"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "वैध ईमेल पता दर्ज करें"
    }
    if (!formData.globalRole) {
      newErrors.globalRole = "भूमिका आवश्यक है"
    } else {
      // Role-based validation
      if (formData.globalRole === "CHOKHLA_MEMBER") {
        if (!formData.choklaId) newErrors.choklaId = "चोखरा चुनें आवश्यक है"
      }
      if (formData.globalRole === "VILLAGE_MEMBER") {
        if (!formData.choklaId) newErrors.choklaId = "चोखरा चुनें आवश्यक है"
        if (!formData.villageId) newErrors.villageId = "गांव चुनें आवश्यक है"
      }
    }

    if (!formData.password) {
      newErrors.password = "पासवर्ड आवश्यक है"
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password = "पासवर्ड मजबूत होना चाहिए"
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
      const payload = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        globalRole: formData.globalRole,
        choklaId: formData.choklaId || null,
        villageId: formData.globalRole === "VILLAGE_MEMBER" ? formData.villageId : null,
      }
      onSubmit(payload)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      mobileNumber: "",
      email: "",
      password: "",
      repeatPassword: "",
      globalRole: "",
      choklaId: "",
      villageId: "",
    })
    setErrors({})
    setShowPassword(false)
    setShowRepeatPassword(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden p-2 sm:p-4 lg:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-orange-800 text-center">
            नया यूज़र जोड़ें
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Full Name */}
            <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
              <h3 className="text-base sm:text-lg font-semibold text-orange-800 mb-3 sm:mb-4">
                बुनियादी जानकारी
              </h3>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-1">
                  पूरा नाम *
                </label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="border-orange-300 focus:border-orange-500 text-sm"
                />
                {errors.fullName && (
                  <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
            </div>

            {/* Contact & Email */}
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4">
                संपर्क जानकारी
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    मोबाइल नंबर *
                  </label>
                  <Input
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="border-blue-300 focus:border-blue-500 text-sm"
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-600 text-xs mt-1">{errors.mobileNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    ईमेल *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-blue-300 focus:border-blue-500 text-sm"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Global Role */}
            <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
              <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-3 sm:mb-4">
                भूमिका
              </h3>
              <div>
                <SelectInput
                  label="भूमिका"
                  value={formData.globalRole}
                  options={GLOBAL_ROLES}
                  onChange={(val) => handleSelectChange("globalRole", val)}
                  placeholder="भूमिका चुनें"
                  required
                />
                {errors.globalRole && (
                  <p className="text-red-600 text-xs mt-1">{errors.globalRole}</p>
                )}
              </div>

              {(formData.globalRole === "CHOKHLA_MEMBER" ||
                formData.globalRole === "VILLAGE_MEMBER") && (
                  <div className="mt-4">
                    <SelectInput
                      label="चोखरा चुनें"
                      value={formData.choklaId}
                      options={chokhlaList.map((chokhla) => ({
                        label: chokhla.name,
                        value: chokhla.id,
                      }))}
                      onChange={(val) => handleSelectChange("choklaId", val)}
                      placeholder="चोखरा चुनें"
                      required
                    />
                    {errors.choklaId && (
                      <p className="text-red-600 text-xs mt-1">{errors.choklaId}</p>
                    )}
                  </div>
                )}

              {formData.globalRole === "VILLAGE_MEMBER" && (
                <div className="mt-4">
                  <SelectInput
                    label="गांव चुनें "
                    value={formData.villageId}
                    options={filteredVillages.map((village) => ({
                      label: village.name,
                      value: village.id,
                    }))}
                    onChange={(val) => handleSelectChange("villageId", val)}
                    placeholder="गांव चुनें"
                    required
                  />
                  {errors.villageId && (
                    <p className="text-red-600 text-xs mt-1">{errors.villageId}</p>
                  )}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-200">
              <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-3 sm:mb-4">
                सुरक्षा जानकारी
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    पासवर्ड *
                  </label>
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
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-red-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    पासवर्ड दोबारा लिखें *
                  </label>
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
                      onClick={() => setShowRepeatPassword((prev) => !prev)}
                    >
                      {showRepeatPassword ? (
                        <EyeOff className="h-4 w-4 text-red-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                  {errors.repeatPassword && (
                    <p className="text-red-600 text-xs mt-1">{errors.repeatPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
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

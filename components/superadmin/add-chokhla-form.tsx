"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2, X } from "lucide-react"
import { useState } from "react"

interface FormData {
  name: string
  adhyaksh: string
  contactNumber: string
  state: string
  district: string
  villageName: string
  email: string
  password: string
  repeatPassword: string
}

interface FormErrors {
  [key: string]: string
}

interface AddChokhlaFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  isSubmitting: boolean
}

export default function AddChokhlaForm({ isOpen, onClose, onSubmit, isSubmitting }: AddChokhlaFormProps) {
  const [formData, setFormData] = useState<FormData>({
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

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // Required field validation
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof FormData].trim()) {
        errors[key] = "यह फील्ड आवश्यक है"
      }
    })

    // Mobile number validation
    if (formData.contactNumber && !/^[6-9]\d{9}$/.test(formData.contactNumber)) {
      errors.contactNumber = "मान्य मोबाइल नंबर दर्ज करें (10 अंक, 6-9 से शुरू)"
    }

    // Email validation
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      errors.email = "मान्य ईमेल दर्ज करें"
    }

    // Password validation
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    if (formData.password && !strongPassword.test(formData.password)) {
      errors.password = "पासवर्ड मजबूत होना चाहिए (कम से कम 8 अक्षर, एक बड़ा, एक छोटा, एक संख्या, एक विशेष चिन्ह)"
    }

    // Repeat password validation
    if (formData.password !== formData.repeatPassword) {
      errors.repeatPassword = "पासवर्ड मेल नहीं खाते"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleClose = () => {
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
    setFormErrors({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-200">
          <h3 className="text-2xl font-bold text-orange-700">नया चौकला जोड़ें</h3>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-orange-100">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Form Container */}
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* बुनियादी जानकारी */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border-l-4 border-orange-500">
              <h4 className="text-lg font-semibold text-orange-800 mb-4">बुनियादी जानकारी</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">चौकला का नाम *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="focus:ring-orange-500 focus:border-orange-500"
                    placeholder="चौकला का नाम दर्ज करें"
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">अध्यक्ष *</label>
                  <Input
                    name="adhyaksh"
                    value={formData.adhyaksh}
                    onChange={handleChange}
                    className="focus:ring-orange-500 focus:border-orange-500"
                    placeholder="अध्यक्ष का नाम दर्ज करें"
                  />
                  {formErrors.adhyaksh && <p className="text-red-500 text-xs mt-1">{formErrors.adhyaksh}</p>}
                </div>
              </div>
            </div>

            {/* संपर्क जानकारी */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">संपर्क जानकारी</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">मोबाइल नंबर *</label>
                  <Input
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="focus:ring-blue-500 focus:border-blue-500"
                    placeholder="मोबाइल नंबर दर्ज करें"
                    maxLength={10}
                  />
                  {formErrors.contactNumber && <p className="text-red-500 text-xs mt-1">{formErrors.contactNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">ईमेल *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ईमेल दर्ज करें"
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
              </div>
            </div>

            {/* स्थान की जानकारी */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="text-lg font-semibold text-green-800 mb-4">स्थान की जानकारी</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">राज्य *</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="focus:ring-green-500 focus:border-green-500"
                    placeholder="राज्य दर्ज करें"
                  />
                  {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">जिला *</label>
                  <Input
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="focus:ring-green-500 focus:border-green-500"
                    placeholder="जिला दर्ज करें"
                  />
                  {formErrors.district && <p className="text-red-500 text-xs mt-1">{formErrors.district}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">गांव *</label>
                  <Input
                    name="villageName"
                    value={formData.villageName}
                    onChange={handleChange}
                    className="focus:ring-green-500 focus:border-green-500"
                    placeholder="गांव का नाम दर्ज करें"
                  />
                  {formErrors.villageName && <p className="text-red-500 text-xs mt-1">{formErrors.villageName}</p>}
                </div>
              </div>
            </div>

            {/* सुरक्षा जानकारी */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
              <h4 className="text-lg font-semibold text-purple-800 mb-4">सुरक्षा जानकारी</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">पासवर्ड *</label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="focus:ring-purple-500 focus:border-purple-500 pr-10"
                      placeholder="पासवर्ड दर्ज करें"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">पासवर्ड दोबारा लिखें *</label>
                  <div className="relative">
                    <Input
                      name="repeatPassword"
                      type={showRepeatPassword ? "text" : "password"}
                      value={formData.repeatPassword}
                      onChange={handleChange}
                      className="focus:ring-purple-500 focus:border-purple-500 pr-10"
                      placeholder="पासवर्ड दोबारा लिखें"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    >
                      {showRepeatPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {formErrors.repeatPassword && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.repeatPassword}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
          >
            रद्द करें
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                सहेज रहे हैं...
              </>
            ) : (
              "सहेजें"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

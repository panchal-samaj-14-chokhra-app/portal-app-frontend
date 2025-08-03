"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Save, AlertCircle } from "lucide-react"
import type { ChokhlaFormData, FormErrors } from "./types"

interface ChokhlaFormProps {
  formData: ChokhlaFormData
  errors: FormErrors
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
}

export function ChokhlaForm({ formData, errors, isSubmitting, onSubmit, onChange, onClose }: ChokhlaFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
          <h3 className="text-2xl font-bold text-orange-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">+</span>
            </div>
            नया चौकला जोड़ें
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-orange-600 hover:bg-orange-100">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-orange-800 border-b border-orange-200 pb-2">
                  बुनियादी जानकारी
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-orange-700 font-medium">
                    चौकला का नाम *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    className={`border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.name ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    placeholder="चौकला का नाम दर्ज करें"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adhyaksh" className="text-orange-700 font-medium">
                    अध्यक्ष का नाम *
                  </Label>
                  <Input
                    id="adhyaksh"
                    name="adhyaksh"
                    value={formData.adhyaksh}
                    onChange={onChange}
                    className={`border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.adhyaksh ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    placeholder="अध्यक्ष का नाम दर्ज करें"
                  />
                  {errors.adhyaksh && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.adhyaksh}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber" className="text-orange-700 font-medium">
                    संपर्क नंबर *
                  </Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={onChange}
                    className={`border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.contactNumber ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    placeholder="10 अंकों का फोन नंबर"
                    maxLength={10}
                  />
                  {errors.contactNumber && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.contactNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-orange-800 border-b border-orange-200 pb-2">
                  स्थान की जानकारी
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-orange-700 font-medium">
                    राज्य *
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={onChange}
                    className={`border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.state ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    placeholder="राज्य का नाम दर्ज करें"
                  />
                  {errors.state && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.state}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="text-orange-700 font-medium">
                    जिला *
                  </Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={onChange}
                    className={`border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.district ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    placeholder="जिले का नाम दर्ज करें"
                  />
                  {errors.district && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.district}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="villageName" className="text-orange-700 font-medium">
                    गांव का नाम *
                  </Label>
                  <Input
                    id="villageName"
                    name="villageName"
                    value={formData.villageName}
                    onChange={onChange}
                    className={`border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.villageName ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    placeholder="गांव का नाम दर्ज करें"
                  />
                  {errors.villageName && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.villageName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-800 border-b border-orange-200 pb-2">खाता की जानकारी</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-orange-700 font-medium">
                    ईमेल पता *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    className={`border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.email ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-orange-700 font-medium">
                    पासवर्ड *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={onChange}
                    className={`border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.password ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    placeholder="मजबूत पासवर्ड दर्ज करें"
                  />
                  {errors.password && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repeatPassword" className="text-orange-700 font-medium">
                    पासवर्ड दोबारा *
                  </Label>
                  <Input
                    id="repeatPassword"
                    name="repeatPassword"
                    type="password"
                    value={formData.repeatPassword}
                    onChange={onChange}
                    className={`border-orange-200 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.repeatPassword ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    placeholder="पासवर्ड दोबारा दर्ज करें"
                  />
                  {errors.repeatPassword && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.repeatPassword}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-orange-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
          >
            रद्द करें
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                सहेज रहे हैं...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                सहेजें
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

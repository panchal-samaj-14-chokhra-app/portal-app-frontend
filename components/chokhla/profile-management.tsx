"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Edit3, Save, User, Calendar, Loader2 } from "lucide-react"

interface ProfileManagementProps {
  chokhla: any
  isChokhlaLoading: boolean
  chokhlaError: any
  editProfile: boolean
  setEditProfile: (edit: boolean) => void
  profileForm: any
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleProfileSave: () => void
  isUpdatingChokhla: boolean
}

export function ProfileManagement({
  chokhla,
  isChokhlaLoading,
  chokhlaError,
  editProfile,
  setEditProfile,
  profileForm,
  handleProfileChange,
  handleProfileSave,
  isUpdatingChokhla,
}: ProfileManagementProps) {
  if (isChokhlaLoading) {
    return (
      <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="text-orange-600 font-medium">लोड हो रहा है...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (chokhlaError) {
    return (
      <Card className="shadow-xl border-red-100 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="text-center text-red-600">त्रुटि: {chokhlaError.message}</div>
        </CardContent>
      </Card>
    )
  }

  if (!chokhla || !profileForm) {
    return (
      <Card className="shadow-xl border-gray-100 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="text-center text-gray-600">कोई डेटा उपलब्ध नहीं है</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-orange-800 flex items-center gap-2">
            <User className="w-6 h-6" />
            चौकला प्रोफ़ाइल
          </CardTitle>
          {!editProfile ? (
            <Button
              variant="outline"
              onClick={() => setEditProfile(true)}
              className="border-orange-300 text-orange-600 hover:bg-orange-100"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              संपादित करें
            </Button>
          ) : (
            <Button
              onClick={handleProfileSave}
              disabled={isUpdatingChokhla}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {isUpdatingChokhla ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  सहेजा जा रहा है...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  सहेजें
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-orange-700">चौकला का नाम</label>
                <Input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  disabled={!editProfile}
                  className={`transition-all duration-200 ${
                    editProfile ? "border-orange-300 focus:border-orange-500" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-orange-700">अध्यक्ष</label>
                <Input
                  type="text"
                  name="adhyaksh"
                  value={profileForm.adhyaksh}
                  onChange={handleProfileChange}
                  disabled={!editProfile}
                  className={`transition-all duration-200 ${
                    editProfile ? "border-orange-300 focus:border-orange-500" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-orange-700">संपर्क नंबर</label>
                <Input
                  type="text"
                  name="contactNumber"
                  value={profileForm.contactNumber}
                  onChange={handleProfileChange}
                  disabled={!editProfile}
                  className={`transition-all duration-200 ${
                    editProfile ? "border-orange-300 focus:border-orange-500" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-orange-700">राज्य</label>
                <Input
                  type="text"
                  name="state"
                  value={profileForm.state}
                  onChange={handleProfileChange}
                  disabled={!editProfile}
                  className={`transition-all duration-200 ${
                    editProfile ? "border-orange-300 focus:border-orange-500" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-orange-700">जिला</label>
                <Input
                  type="text"
                  name="district"
                  value={profileForm.district}
                  onChange={handleProfileChange}
                  disabled={!editProfile}
                  className={`transition-all duration-200 ${
                    editProfile ? "border-orange-300 focus:border-orange-500" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-orange-700">गांव का नाम</label>
                <Input
                  type="text"
                  name="villageName"
                  value={profileForm.villageName}
                  onChange={handleProfileChange}
                  disabled={!editProfile}
                  className={`transition-all duration-200 ${
                    editProfile ? "border-orange-300 focus:border-orange-500" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-800">तारीख की जानकारी</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-orange-700">निर्माण तिथि:</span>
                  <span className="ml-2 text-orange-800">
                    {chokhla.createdDate ? new Date(chokhla.createdDate).toLocaleDateString("hi-IN") : "-"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-orange-700">अद्यतन तिथि:</span>
                  <span className="ml-2 text-orange-800">
                    {chokhla.updatedDate ? new Date(chokhla.updatedDate).toLocaleDateString("hi-IN") : "-"}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

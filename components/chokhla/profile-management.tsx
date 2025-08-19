"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, MapPin, Edit, Save, X, Building, Calendar, Shield } from "lucide-react"

interface Chokhla {
  id: string
  name: string
  adhyaksh: string
  contactNumber: string
  state: string
  district: string
  villageName: string
  createdAt?: string
  updatedAt?: string
}

interface ProfileManagementProps {
  chokhla: Chokhla
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
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (chokhlaError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <Shield className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">डेटा लोड करने में त्रुटि</h3>
              <p className="text-sm mt-2">चोखरा की जानकारी लोड नहीं हो सकी। कृपया पुनः प्रयास करें।</p>
            </div>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white">
              पुनः लोड करें
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">चोखरा प्रोफ़ाइल</h2>
          <p className="text-sm text-gray-600">चोखरा की जानकारी देखें और संपादित करें</p>
        </div>

        <div className="flex gap-2">
          {!editProfile ? (
            <Button
              onClick={() => setEditProfile(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              संपादित करें
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleProfileSave}
                disabled={isUpdatingChokhla}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdatingChokhla ? "सेव हो रहा है..." : "सेव करें"}
              </Button>
              <Button
                onClick={() => setEditProfile(false)}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                रद्द करें
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Basic Information */}
        <Card className="border-orange-200/50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <User className="w-5 h-5 mr-2 text-orange-500" />
              मूलभूत जानकारी
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                चोखरा का नाम
              </Label>
              {editProfile ? (
                <Input
                  id="name"
                  name="name"
                  value={profileForm?.name || ""}
                  onChange={handleProfileChange}
                  className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900 font-medium">{chokhla?.name || "N/A"}</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="adhyaksh" className="text-sm font-medium text-gray-700">
                अध्यक्ष का नाम
              </Label>
              {editProfile ? (
                <Input
                  id="adhyaksh"
                  name="adhyaksh"
                  value={profileForm?.adhyaksh || ""}
                  onChange={handleProfileChange}
                  className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900 font-medium">{chokhla?.adhyaksh || "N/A"}</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                संपर्क नंबर
              </Label>
              {editProfile ? (
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={profileForm?.contactNumber || ""}
                  onChange={handleProfileChange}
                  className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <p className="text-gray-900 font-medium">{chokhla?.contactNumber || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="border-orange-200/50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <MapPin className="w-5 h-5 mr-2 text-orange-500" />
              स्थान की जानकारी
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                राज्य
              </Label>
              {editProfile ? (
                <Input
                  id="state"
                  name="state"
                  value={profileForm?.state || ""}
                  onChange={handleProfileChange}
                  className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900 font-medium">{chokhla?.state || "N/A"}</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                जिला
              </Label>
              {editProfile ? (
                <Input
                  id="district"
                  name="district"
                  value={profileForm?.district || ""}
                  onChange={handleProfileChange}
                  className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900 font-medium">{chokhla?.district || "N/A"}</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="villageName" className="text-sm font-medium text-gray-700">
                गांव का नाम
              </Label>
              {editProfile ? (
                <Input
                  id="villageName"
                  name="villageName"
                  value={profileForm?.villageName || ""}
                  onChange={handleProfileChange}
                  className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-900 font-medium">{chokhla?.villageName || "N/A"}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Building className="w-5 h-5 mr-2 text-orange-500" />
            अतिरिक्त जानकारी
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-800">चोखरा ID</h4>
              </div>
              <p className="text-blue-700 font-mono text-sm">{chokhla?.id || "N/A"}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800">बनाया गया</h4>
              </div>
              <p className="text-green-700 text-sm">
                {chokhla?.createdAt ? new Date(chokhla.createdAt).toLocaleDateString("hi-IN") : "N/A"}
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-800">अंतिम अपडेट</h4>
              </div>
              <p className="text-purple-700 text-sm">
                {chokhla?.updatedAt ? new Date(chokhla.updatedAt).toLocaleDateString("hi-IN") : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

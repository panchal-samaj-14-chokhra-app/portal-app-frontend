"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Phone, Save } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

export function ProfileManagement() {
  const { profile, isLoadingProfile, handleProfileSubmit, isSubmitting } = useSuperAdmin()
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    mobileNumber: profile?.mobileNumber || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleProfileSubmit(formData)
  }

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">प्रोफाइल प्रबंधन</h2>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">प्रोफाइल प्रबंधन</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>प्रोफाइल जानकारी</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {profile?.firstName?.[0]}
                  {profile?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {profile?.firstName} {profile?.lastName}
                </h3>
                <p className="text-sm text-gray-600">सुपर एडमिन</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{profile?.mobileNumber}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">सुपर एडमिन</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                <strong>अंतिम लॉगिन:</strong>{" "}
                {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString("hi-IN") : "अज्ञात"}
              </p>
              <p className="text-xs text-gray-500">
                <strong>खाता बनाया गया:</strong>{" "}
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("hi-IN") : "अज्ञात"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>प्रोफाइल संपादित करें</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">पहला नाम</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="पहला नाम दर्ज करें"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">अंतिम नाम</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="अंतिम नाम दर्ज करें"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ईमेल पता</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="ईमेल पता दर्ज करें"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">मोबाइल नंबर</Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  placeholder="मोबाइल नंबर दर्ज करें"
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "सेव हो रहा है..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      प्रोफाइल सेव करें
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

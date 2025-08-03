"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Shield, Calendar, Activity } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const profileSchema = z.object({
  firstName: z.string().min(1, "पहला नाम आवश्यक है"),
  lastName: z.string().min(1, "अंतिम नाम आवश्यक है"),
  email: z.string().email("वैध ईमेल पता दर्ज करें"),
  mobileNumber: z.string().min(10, "वैध मोबाइल नंबर दर्ज करें"),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileManagement() {
  const { profile, isLoadingProfile, handleProfileSubmit, isSubmitting } = useSuperAdmin()
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      mobileNumber: profile?.mobileNumber || "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    await handleProfileSubmit(data)
    setIsEditing(false)
    reset(data)
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      mobileNumber: profile?.mobileNumber || "",
    })
  }

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardHeader>
          </Card>
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">प्रोफाइल उपलब्ध नहीं</h3>
          <p className="text-gray-500">प्रोफाइल की जानकारी लोड करने में समस्या हुई है।</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">प्रोफाइल प्रबंधन</h1>
        <p className="text-gray-600 mt-1">अपनी व्यक्तिगत जानकारी देखें और अपडेट करें</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-blue-100">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.firstName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-semibold">
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h3>
                <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  {profile.role}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{profile.email}</span>
              </div>
              {profile.mobileNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{profile.mobileNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  सदस्य बने: {new Date(profile.createdAt).toLocaleDateString("hi-IN")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  अंतिम लॉगिन: {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString("hi-IN") : "कभी नहीं"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>व्यक्तिगत जानकारी</CardTitle>
                  <CardDescription>अपनी प्रोफाइल की जानकारी अपडेट करें</CardDescription>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    संपादित करें
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">पहला नाम *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">अंतिम नाम *</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ईमेल पता *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">मोबाइल नंबर *</Label>
                  <Input
                    id="mobileNumber"
                    {...register("mobileNumber")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {errors.mobileNumber && <p className="text-sm text-red-600">{errors.mobileNumber.message}</p>}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      रद्द करें
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {isSubmitting ? "सेव हो रहा है..." : "सेव करें"}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

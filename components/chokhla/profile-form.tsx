"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ChokhlaProfile } from "./types"
import { VALIDATION_MESSAGES } from "./constants"
import { Edit, Save, X, Calendar, MapPin, Phone, User } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  adhyaksh: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  contactNumber: z
    .string()
    .min(10, VALIDATION_MESSAGES.PHONE_INVALID)
    .max(10, VALIDATION_MESSAGES.PHONE_INVALID)
    .regex(/^[0-9]+$/, VALIDATION_MESSAGES.PHONE_INVALID),
  state: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  district: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  villageName: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
})

interface ProfileFormProps {
  profile: ChokhlaProfile | null
  isLoading: boolean
  isUpdating: boolean
  onUpdate: (data: Partial<ChokhlaProfile>) => void
}

export function ProfileForm({ profile, isLoading, isUpdating, onUpdate }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      adhyaksh: "",
      contactNumber: "",
      state: "",
      district: "",
      villageName: "",
    },
  })

  useEffect(() => {
    if (profile && !isEditing) {
      form.reset({
        name: profile.name || "",
        adhyaksh: profile.adhyaksh || "",
        contactNumber: profile.contactNumber || "",
        state: profile.state || "",
        district: profile.district || "",
        villageName: profile.villageName || "",
      })
    }
  }, [profile, isEditing, form])

  const handleSave = (data: any) => {
    onUpdate(data)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        adhyaksh: profile.adhyaksh || "",
        contactNumber: profile.contactNumber || "",
        state: profile.state || "",
        district: profile.district || "",
        villageName: profile.villageName || "",
      })
    }
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-orange-600 font-medium">लोड हो रहा है...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-red-500">
            <X className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">प्रोफ़ाइल लोड नहीं हो सकी</p>
            <p className="text-sm">कृपया पेज को रिफ्रेश करें</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-orange-600" />
          चौकला प्रोफ़ाइल
        </CardTitle>
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            संपादित करें
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              रद्द करें
            </Button>
            <Button
              onClick={form.handleSubmit(handleSave)}
              disabled={isUpdating}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "सहेजा जा रहा है..." : "सहेजें"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-700 font-semibold">चौकला का नाम *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={`${
                          isEditing ? "border-orange-200 focus:border-orange-400" : "bg-gray-50 border-gray-200"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                name="adhyaksh"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-700 font-semibold">अध्यक्ष *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={`${
                          isEditing ? "border-orange-200 focus:border-orange-400" : "bg-gray-50 border-gray-200"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                name="contactNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-700 font-semibold flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      संपर्क नंबर *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        maxLength={10}
                        disabled={!isEditing}
                        className={`${
                          isEditing ? "border-orange-200 focus:border-orange-400" : "bg-gray-50 border-gray-200"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                name="villageName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-700 font-semibold flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      गांव का नाम *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={`${
                          isEditing ? "border-orange-200 focus:border-orange-400" : "bg-gray-50 border-gray-200"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                name="state"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-700 font-semibold">राज्य *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={`${
                          isEditing ? "border-orange-200 focus:border-orange-400" : "bg-gray-50 border-gray-200"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                name="district"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-700 font-semibold">जिला *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={`${
                          isEditing ? "border-orange-200 focus:border-orange-400" : "bg-gray-50 border-gray-200"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Metadata */}
            <div className="border-t pt-4">
              <div className="flex flex-wrap gap-4 text-sm">
                {profile.createdDate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    निर्माण: {new Date(profile.createdDate).toLocaleDateString("hi-IN")}
                  </Badge>
                )}
                {profile.updatedDate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    अद्यतन: {new Date(profile.updatedDate).toLocaleDateString("hi-IN")}
                  </Badge>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

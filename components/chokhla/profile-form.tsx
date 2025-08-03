"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Loader2, Save } from "lucide-react"
import { STATES_DISTRICTS } from "./constants"
import type { ChokhlaProfile, ProfileFormData } from "./types"

const profileSchema = z.object({
  firstName: z.string().min(2, "नाम कम से कम 2 अक्षर का होना चाहिए"),
  lastName: z.string().min(2, "उपनाम कम से कम 2 अक्षर का होना चाहिए"),
  email: z.string().email("वैध ईमेल पता दर्ज करें").optional().or(z.literal("")),
  mobileNumber: z.string().regex(/^\d{10}$/, "मोबाइल नंबर 10 अंकों का होना चाहिए"),
  state: z.string().min(1, "राज्य चुनना आवश्यक है"),
  district: z.string().min(1, "जिला चुनना आवश्यक है"),
  address: z.string().min(10, "पूरा पता कम से कम 10 अक्षर का होना चाहिए"),
})

interface ProfileFormProps {
  profile: ChokhlaProfile | null
  onSubmit: (data: ProfileFormData) => Promise<void>
  isLoading: boolean
}

export function ProfileForm({ profile, onSubmit, isLoading }: ProfileFormProps) {
  const [districts, setDistricts] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      state: "",
      district: "",
      address: "",
    },
  })

  const selectedState = form.watch("state")

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        mobileNumber: profile.mobileNumber,
        state: profile.state,
        district: profile.district,
        address: profile.address,
      })
    }
  }, [profile, form])

  // Update districts when state changes
  useEffect(() => {
    if (selectedState && STATES_DISTRICTS[selectedState]) {
      setDistricts(STATES_DISTRICTS[selectedState])
      // Don't clear district if it's valid for the selected state
      const currentDistrict = form.getValues("district")
      if (currentDistrict && !STATES_DISTRICTS[selectedState].includes(currentDistrict)) {
        form.setValue("district", "")
      }
    } else {
      setDistricts([])
    }
  }, [selectedState, form])

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
    } catch (error) {
      console.error("Profile update error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            प्रोफाइल लोड हो रहा है...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <User className="w-5 h-5" />
          प्रोफाइल सेटिंग्स
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      नाम <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="आपका नाम" className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      उपनाम <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="आपका उपनाम" className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="mobileNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      मोबाइल नंबर <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="1234567890" maxLength={10} className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">ईमेल (वैकल्पिक)</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="your@email.com" className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="state"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      राज्य <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="राज्य चुनें" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(STATES_DISTRICTS).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="district"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      जिला <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="जिला चुनें" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    पूरा पता <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="आपका पूरा पता दर्ज करें" className="border-gray-300 min-h-[80px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  प्रोफाइल अपडेट कर रहे हैं...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  प्रोफाइल अपडेट करें
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

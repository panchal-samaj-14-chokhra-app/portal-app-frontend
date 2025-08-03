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
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Zap, Droplets, GraduationCap, Heart, RouteIcon as Road, Loader2 } from "lucide-react"
import { STATES_DISTRICTS } from "./constants"
import type { VillageFormData } from "./types"

const villageSchema = z.object({
  name: z.string().min(2, "गांव का नाम कम से कम 2 अक्षर का होना चाहिए"),
  state: z.string().min(1, "राज्य चुनना आवश्यक है"),
  district: z.string().min(1, "जिला चुनना आवश्यक है"),
  pincode: z.string().regex(/^\d{6}$/, "पिनकोड 6 अंकों का होना चाहिए"),
  hasElectricity: z.boolean(),
  hasWaterSupply: z.boolean(),
  hasSchool: z.boolean(),
  hasHealthCenter: z.boolean(),
  hasRoadAccess: z.boolean(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})

interface VillageFormProps {
  onSubmit: (data: VillageFormData) => Promise<void>
  isLoading: boolean
}

export function VillageForm({ onSubmit, isLoading }: VillageFormProps) {
  const [districts, setDistricts] = useState<string[]>([])

  const form = useForm<VillageFormData>({
    resolver: zodResolver(villageSchema),
    defaultValues: {
      name: "",
      state: "",
      district: "",
      pincode: "",
      hasElectricity: false,
      hasWaterSupply: false,
      hasSchool: false,
      hasHealthCenter: false,
      hasRoadAccess: false,
      latitude: undefined,
      longitude: undefined,
    },
  })

  const selectedState = form.watch("state")

  useEffect(() => {
    if (selectedState && STATES_DISTRICTS[selectedState]) {
      setDistricts(STATES_DISTRICTS[selectedState])
      form.setValue("district", "")
    } else {
      setDistricts([])
    }
  }, [selectedState, form])

  const handleSubmit = async (data: VillageFormData) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <MapPin className="w-5 h-5" />
          नया गांव पंजीकृत करें
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      गांव का नाम <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="गांव का नाम दर्ज करें" className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="pincode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      पिनकोड <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123456" maxLength={6} className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

            {/* Location Coordinates */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">स्थान निर्देशांक (वैकल्पिक)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="latitude"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">अक्षांश (Latitude)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="any"
                          placeholder="जैसे: 28.6139"
                          className="border-gray-300"
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="longitude"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">देशांतर (Longitude)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="any"
                          placeholder="जैसे: 77.2090"
                          className="border-gray-300"
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-4">उपलब्ध सुविधाएं</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="hasElectricity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <FormLabel className="text-gray-700 cursor-pointer">बिजली की सुविधा</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="hasWaterSupply"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        <FormLabel className="text-gray-700 cursor-pointer">पानी की आपूर्ति</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="hasSchool"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-green-600" />
                        <FormLabel className="text-gray-700 cursor-pointer">स्कूल</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="hasHealthCenter"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-600" />
                        <FormLabel className="text-gray-700 cursor-pointer">स्वास्थ्य केंद्र</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="hasRoadAccess"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="flex items-center gap-2">
                        <Road className="w-4 h-4 text-gray-600" />
                        <FormLabel className="text-gray-700 cursor-pointer">सड़क पहुंच</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  गांव पंजीकृत कर रहे हैं...
                </>
              ) : (
                "गांव पंजीकृत करें"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

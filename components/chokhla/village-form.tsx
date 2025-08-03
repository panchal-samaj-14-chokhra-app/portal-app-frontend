"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { VillageFormData } from "./types"
import { VALIDATION_MESSAGES } from "./constants"

const villageSchema = z
  .object({
    name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    villageMemberName: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    mobileNumber: z
      .string()
      .min(10, VALIDATION_MESSAGES.PHONE_INVALID)
      .max(10, VALIDATION_MESSAGES.PHONE_INVALID)
      .regex(/^[0-9]+$/, VALIDATION_MESSAGES.PHONE_INVALID),
    age: z
      .string()
      .min(1, VALIDATION_MESSAGES.REQUIRED)
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120, {
        message: VALIDATION_MESSAGES.AGE_INVALID,
      }),
    email: z.string().email(VALIDATION_MESSAGES.EMAIL_INVALID).optional().or(z.literal("")),
    tehsil: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    district: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    state: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    isVillageHaveSchool: z.boolean(),
    isVillageHavePrimaryHealthCare: z.boolean(),
    isVillageHaveCommunityHall: z.boolean(),
    longitude: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          const num = Number(val)
          return !isNaN(num) && num >= -180 && num <= 180
        },
        { message: VALIDATION_MESSAGES.COORDINATES_INVALID },
      ),
    latitude: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          const num = Number(val)
          return !isNaN(num) && num >= -90 && num <= 90
        },
        { message: VALIDATION_MESSAGES.COORDINATES_INVALID },
      ),
    password: z
      .string()
      .min(8, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        VALIDATION_MESSAGES.PASSWORD_STRONG,
      ),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
    path: ["repeatPassword"],
  })

interface VillageFormProps {
  onSubmit: (data: VillageFormData) => void
  isLoading: boolean
  onCancel: () => void
}

export function VillageForm({ onSubmit, isLoading, onCancel }: VillageFormProps) {
  const form = useForm<VillageFormData>({
    resolver: zodResolver(villageSchema),
    defaultValues: {
      name: "",
      villageMemberName: "",
      mobileNumber: "",
      age: "",
      email: "",
      tehsil: "",
      district: "",
      state: "",
      isVillageHaveSchool: false,
      isVillageHavePrimaryHealthCare: false,
      isVillageHaveCommunityHall: false,
      longitude: "",
      latitude: "",
      password: "",
      repeatPassword: "",
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>नया गांव जोड़ें</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-700 font-semibold">गांव का नाम *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-orange-200 focus:border-orange-400"
                          placeholder="गांव का नाम दर्ज करें"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="villageMemberName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-700 font-semibold">गांव सदस्य का नाम *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-orange-200 focus:border-orange-400"
                          placeholder="सदस्य का नाम दर्ज करें"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="mobileNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-700 font-semibold">मोबाइल नंबर *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          maxLength={10}
                          className="border-orange-200 focus:border-orange-400"
                          placeholder="10 अंकों का मोबाइल नंबर"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="age"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-700 font-semibold">आयु *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          max="120"
                          className="border-orange-200 focus:border-orange-400"
                          placeholder="आयु दर्ज करें"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-700 font-semibold">ईमेल (वैकल्पिक)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="border-orange-200 focus:border-orange-400"
                          placeholder="example@email.com"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">स्थान की जानकारी</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    name="tehsil"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-orange-700 font-semibold">तहसील *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-orange-200 focus:border-orange-400"
                            placeholder="तहसील का नाम"
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
                            className="border-orange-200 focus:border-orange-400"
                            placeholder="जिले का नाम"
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
                            className="border-orange-200 focus:border-orange-400"
                            placeholder="राज्य का नाम"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Facilities */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">गांव की सुविधाएं</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    name="isVillageHaveSchool"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 border border-orange-200 rounded-lg">
                        <FormLabel className="text-orange-700 font-medium">स्कूल उपलब्ध है?</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="isVillageHavePrimaryHealthCare"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 border border-orange-200 rounded-lg">
                        <FormLabel className="text-orange-700 font-medium">प्राथमिक स्वास्थ्य केंद्र?</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="isVillageHaveCommunityHall"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 border border-orange-200 rounded-lg">
                        <FormLabel className="text-orange-700 font-medium">कम्युनिटी हॉल?</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">भौगोलिक निर्देशांक (वैकल्पिक)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="longitude"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-orange-700 font-semibold">देशांतर (Longitude)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="any"
                            className="border-orange-200 focus:border-orange-400"
                            placeholder="-180 से 180 के बीच"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="latitude"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-orange-700 font-semibold">अक्षांश (Latitude)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="any"
                            className="border-orange-200 focus:border-orange-400"
                            placeholder="-90 से 90 के बीच"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">लॉगिन जानकारी</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-orange-700 font-semibold">पासवर्ड *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="border-orange-200 focus:border-orange-400"
                            placeholder="मजबूत पासवर्ड बनाएं"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                        <p className="text-xs text-gray-600 mt-1">
                          कम से कम 8 अक्षर, एक बड़ा अक्षर, एक छोटा अक्षर, एक संख्या और एक विशेष चिन्ह
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="repeatPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-orange-700 font-semibold">पासवर्ड दोबारा लिखें *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="border-orange-200 focus:border-orange-400"
                            placeholder="पासवर्ड दोबारा दर्ज करें"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                >
                  रद्द करें
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white">
                  {isLoading ? "सहेजा जा रहा है..." : "सहेजें"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}

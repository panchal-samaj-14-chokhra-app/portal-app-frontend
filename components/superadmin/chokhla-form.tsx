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
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react"
import { STATES_DISTRICTS } from "./constants"
import type { ChokhlaFormData } from "./types"

const chokhlaSchema = z
  .object({
    firstName: z.string().min(2, "नाम कम से कम 2 अक्षर का होना चाहिए"),
    lastName: z.string().min(2, "उपनाम कम से कम 2 अक्षर का होना चाहिए"),
    email: z.string().email("वैध ईमेल पता दर्ज करें"),
    mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "वैध मोबाइल नंबर दर्ज करें"),
    password: z
      .string()
      .min(8, "पासवर्ड कम से कम 8 अक्षर का होना चाहिए")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "पासवर्ड में कम से कम एक छोटा अक्षर, एक बड़ा अक्षर, एक संख्या और एक विशेष चिह्न होना चाहिए",
      ),
    confirmPassword: z.string(),
    state: z.string().min(1, "राज्य चुनना आवश्यक है"),
    district: z.string().min(1, "जिला चुनना आवश्यक है"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "पासवर्ड मेल नहीं खाते",
    path: ["confirmPassword"],
  })

interface ChokhlaFormProps {
  onSubmit: (data: ChokhlaFormData) => Promise<void>
  isLoading: boolean
}

export function ChokhlaForm({ onSubmit, isLoading }: ChokhlaFormProps) {
  const [districts, setDistricts] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ChokhlaFormData>({
    resolver: zodResolver(chokhlaSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      state: "",
      district: "",
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

  const handleSubmit = async (data: ChokhlaFormData) => {
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
          <UserPlus className="w-5 h-5" />
          नया चोखला पंजीकृत करें
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-4">व्यक्तिगत जानकारी</h3>
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
                        <Input {...field} placeholder="नाम दर्ज करें" className="border-gray-300" />
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
                        <Input {...field} placeholder="उपनाम दर्ज करें" className="border-gray-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-4">संपर्क जानकारी</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        ईमेल <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="example@email.com" className="border-gray-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="mobileNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        मोबाइल नंबर <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="9876543210" maxLength={10} className="border-gray-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-800 mb-4">स्थान की जानकारी</h3>
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
            </div>

            {/* Security Information */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-800 mb-4">सुरक्षा जानकारी</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        पासवर्ड <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="पासवर्ड दर्ज करें"
                            className="border-gray-300 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="confirmPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        पासवर्ड पुष्टि <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="पासवर्ड दोबारा दर्ज करें"
                            className="border-gray-300 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Requirements */}
              <div className="mt-3 p-3 bg-white rounded border border-red-200">
                <p className="text-xs text-red-700 font-medium mb-2">पासवर्ड आवश्यकताएं:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  <li>• कम से कम 8 अक्षर</li>
                  <li>• एक छोटा अक्षर (a-z)</li>
                  <li>• एक बड़ा अक्षर (A-Z)</li>
                  <li>• एक संख्या (0-9)</li>
                  <li>• एक विशेष चिह्न (@$!%*?&)</li>
                </ul>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  चोखला पंजीकृत कर रहे हैं...
                </>
              ) : (
                "चोखला पंजीकृत करें"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

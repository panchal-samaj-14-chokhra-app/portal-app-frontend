"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2, UserPlus, Check, X } from "lucide-react"
import { INDIAN_STATES, STATE_DISTRICTS } from "./constants"
import type { ChokhlaFormData } from "./types"

const chokhlaSchema = z
  .object({
    firstName: z.string().min(2, "नाम कम से कम 2 अक्षर का होना चाहिए"),
    lastName: z.string().min(2, "उपनाम कम से कम 2 अक्षर का होना चाहिए"),
    email: z.string().email("वैध ईमेल पता दर्ज करें"),
    mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "वैध मोबाइल नंबर दर्ज करें"),
    state: z.string().min(1, "राज्य चुनना आवश्यक है"),
    district: z.string().min(1, "जिला चुनना आवश्यक है"),
    password: z
      .string()
      .min(8, "पासवर्ड कम से कम 8 अक्षर का होना चाहिए")
      .regex(/[A-Z]/, "पासवर्ड में कम से कम एक बड़ा अक्षर होना चाहिए")
      .regex(/[a-z]/, "पासवर्ड में कम से कम एक छोटा अक्षर होना चाहिए")
      .regex(/\d/, "पासवर्ड में कम से कम एक संख्या होनी चाहिए")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "पासवर्ड में कम से कम एक विशेष चिह्न होना चाहिए"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "पासवर्ड मेल नहीं खाते",
    path: ["confirmPassword"],
  })

interface ChokhlaFormProps {
  onSubmit: (data: ChokhlaFormData) => Promise<void>
  isSubmitting: boolean
}

export function ChokhlaForm({ onSubmit, isSubmitting }: ChokhlaFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedState, setSelectedState] = useState<string>("")

  const form = useForm<ChokhlaFormData>({
    resolver: zodResolver(chokhlaSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      state: "",
      district: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = form.watch("password")

  const passwordRequirements = [
    { label: "कम से कम 8 अक्षर", test: (pwd: string) => pwd.length >= 8 },
    { label: "एक बड़ा अक्षर (A-Z)", test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: "एक छोटा अक्षर (a-z)", test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: "एक संख्या (0-9)", test: (pwd: string) => /\d/.test(pwd) },
    { label: "एक विशेष चिह्न (!@#$%^&*)", test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ]

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    form.setValue("state", state)
    form.setValue("district", "") // Reset district when state changes
  }

  const handleSubmit = async (data: ChokhlaFormData) => {
    await onSubmit(data)
    form.reset()
    setSelectedState("")
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          नया चोखला पंजीकरण
        </CardTitle>
        <p className="text-sm text-gray-600">नए चोखला की जानकारी दर्ज करें</p>
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
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-4">स्थान की जानकारी</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="state"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        राज्य <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={handleStateChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="राज्य चुनें" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDIAN_STATES.map((state) => (
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
                          {selectedState &&
                            STATE_DISTRICTS[selectedState]?.map((district) => (
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

            {/* Password Information */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-800 mb-4">पासवर्ड सेटअप</h3>
              <div className="space-y-4">
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

                {/* Password Requirements */}
                {password && (
                  <div className="bg-white p-3 rounded border">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">पासवर्ड आवश्यकताएं:</Label>
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => {
                        const isValid = req.test(password)
                        return (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {isValid ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-red-500" />
                            )}
                            <span className={isValid ? "text-green-700" : "text-red-600"}>{req.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

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
            </div>

            <Separator />

            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  पंजीकरण कर रहे हैं...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  चोखला पंजीकृत करें
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

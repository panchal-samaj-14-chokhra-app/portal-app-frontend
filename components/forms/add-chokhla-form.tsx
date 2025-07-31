"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"

interface AddChokhlaFormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  address: string
}

interface AddChokhlaFormProps {
  onSubmit: (data: AddChokhlaFormData) => Promise<void>
  isLoading?: boolean
}

export function AddChokhlaForm({ onSubmit, isLoading = false }: AddChokhlaFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<AddChokhlaFormData>()

  const password = watch("password")

  const handleFormSubmit = async (data: AddChokhlaFormData) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">नया चौकला जोड़ें</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">नाम *</Label>
              <Input
                id="name"
                {...register("name", {
                  required: "नाम आवश्यक है",
                  minLength: { value: 2, message: "नाम कम से कम 2 अक्षर का होना चाहिए" },
                })}
                placeholder="चौकला का नाम दर्ज करें"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ईमेल *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "ईमेल आवश्यक है",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "वैध ईमेल पता दर्ज करें",
                  },
                })}
                placeholder="example@email.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">फोन नंबर *</Label>
              <Input
                id="phone"
                {...register("phone", {
                  required: "फोन नंबर आवश्यक है",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "वैध 10 अंकों का फोन नंबर दर्ज करें",
                  },
                })}
                placeholder="9876543210"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">पता</Label>
              <Input id="address" {...register("address")} placeholder="पूरा पता दर्ज करें" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">पासवर्ड *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "पासवर्ड आवश्यक है",
                    minLength: { value: 6, message: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए" },
                  })}
                  placeholder="पासवर्ड दर्ज करें"
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">पासवर्ड पुष्टि *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "पासवर्ड पुष्टि आवश्यक है",
                    validate: (value) => value === password || "पासवर्ड मेल नहीं खाते",
                  })}
                  placeholder="पासवर्ड दोबारा दर्ज करें"
                  className={`pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  जोड़ा जा रहा है...
                </>
              ) : (
                "चौकला जोड़ें"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => reset()} disabled={isLoading} className="flex-1">
              रीसेट करें
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

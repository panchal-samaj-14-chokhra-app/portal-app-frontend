"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2, User, Building2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Form validation schema
const chokhlaFormSchema = z
  .object({
    // Chokhla details
    name: z.string().min(2, "चौकला का नाम कम से कम 2 अक्षर का होना चाहिए"),
    adhyaksh: z.string().min(2, "अध्यक्ष का नाम कम से कम 2 अक्षर का होना चाहिए"),
    contactNumber: z.string().min(10, "संपर्क नंबर कम से कम 10 अंकों का होना चाहिए"),
    state: z.string().min(2, "राज्य का नाम कम से कम 2 अक्षर का होना चाहिए"),
    district: z.string().min(2, "जिला का नाम कम से कम 2 अक्षर का होना चाहिए"),
    villageName: z.string().min(2, "गांव का नाम कम से कम 2 अक्षर का होना चाहिए"),
    address: z.string().optional(),
    description: z.string().optional(),

    // Admin user details
    fullName: z.string().min(2, "पूरा नाम कम से कम 2 अक्षर का होना चाहिए"),
    email: z.string().email("वैध ईमेल पता दर्ज करें"),
    password: z.string().min(6, "पासवर्ड कम से कम 6 अक्षर का होना चाहिए"),
    confirmPassword: z.string().min(6, "पासवर्ड की पुष्टि करें"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "पासवर्ड मेल नहीं खाते",
    path: ["confirmPassword"],
  })

type ChokhlaFormData = z.infer<typeof chokhlaFormSchema>

interface AddChokhlaFormProps {
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function AddChokhlaForm({ onSubmit, isLoading = false }: AddChokhlaFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChokhlaFormData>({
    resolver: zodResolver(chokhlaFormSchema),
  })

  const handleFormSubmit = (data: ChokhlaFormData) => {
    const { confirmPassword, ...formData } = data
    onSubmit(formData)
  }

  const handleReset = () => {
    reset()
  }

  return (
    <ScrollArea className="h-[70vh] pr-4">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Chokhla Information */}
        <Card className="border-orange-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-orange-700 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              चौकला की जानकारी
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-orange-700 font-medium">
                  चौकला का नाम *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="चौकला का नाम दर्ज करें"
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adhyaksh" className="text-orange-700 font-medium">
                  अध्यक्ष का नाम *
                </Label>
                <Input
                  id="adhyaksh"
                  {...register("adhyaksh")}
                  placeholder="अध्यक्ष का नाम दर्ज करें"
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
                {errors.adhyaksh && <p className="text-red-500 text-sm">{errors.adhyaksh.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="text-orange-700 font-medium">
                  संपर्क नंबर *
                </Label>
                <Input
                  id="contactNumber"
                  {...register("contactNumber")}
                  placeholder="संपर्क नंबर दर्ज करें"
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
                {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-orange-700 font-medium">
                  राज्य *
                </Label>
                <Input
                  id="state"
                  {...register("state")}
                  placeholder="राज्य का नाम दर्ज करें"
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district" className="text-orange-700 font-medium">
                  जिला *
                </Label>
                <Input
                  id="district"
                  {...register("district")}
                  placeholder="जिला का नाम दर्ज करें"
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
                {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="villageName" className="text-orange-700 font-medium">
                  गांव का नाम *
                </Label>
                <Input
                  id="villageName"
                  {...register("villageName")}
                  placeholder="गांव का नाम दर्ज करें"
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
                {errors.villageName && <p className="text-red-500 text-sm">{errors.villageName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-orange-700 font-medium">
                पता
              </Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="पूरा पता दर्ज करें"
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-orange-700 font-medium">
                विवरण
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="चौकला के बारे में अतिरिक्त जानकारी"
                className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-orange-200" />

        {/* Admin User Information */}
        <Card className="border-orange-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-orange-700 flex items-center gap-2">
              <User className="w-5 h-5" />
              एडमिन यूज़र की जानकारी
            </CardTitle>
            <p className="text-sm text-orange-600">इस चौकला के लिए एक एडमिन यूज़र अकाउंट बनाया जाएगा</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-orange-700 font-medium">
                  पूरा नाम *
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="एडमिन का पूरा नाम दर्ज करें"
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-orange-700 font-medium">
                  ईमेल पता *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="admin@example.com"
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-orange-700 font-medium">
                  पासवर्ड *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="पासवर्ड दर्ज करें"
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-orange-500" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-orange-700 font-medium">
                  पासवर्ड की पुष्टि *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="पासवर्ड दोबारा दर्ज करें"
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-orange-500" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                चौकला बनाया जा रहा है...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4 mr-2" />
                चौकला बनाएं
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
          >
            रीसेट करें
          </Button>
        </div>
      </form>
    </ScrollArea>
  )
}

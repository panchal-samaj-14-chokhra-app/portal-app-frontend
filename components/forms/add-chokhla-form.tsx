"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2, Building2, User, Phone, Mail, MapPin, Lock } from "lucide-react"

const chokhlaFormSchema = z.object({
  // Chokhla Information
  name: z.string().min(2, "चौकला का नाम कम से कम 2 अक्षर का होना चाहिए"),
  adhyaksh: z.string().min(2, "अध्यक्ष का नाम कम से कम 2 अक्षर का होना चाहिए"),
  contactNumber: z.string().min(10, "संपर्क नंबर कम से कम 10 अंकों का होना चाहिए"),
  address: z.string().min(5, "पता कम से कम 5 अक्षर का होना चाहिए"),
  state: z.string().min(2, "राज्य का नाम कम से कम 2 अक्षर का होना चाहिए"),
  district: z.string().min(2, "जिला का नाम कम से कम 2 अक्षर का होना चाहिए"),
  villageName: z.string().min(2, "गांव का नाम कम से कम 2 अक्षर का होना चाहिए"),

  // Admin User Information
  fullName: z.string().min(2, "पूरा नाम कम से कम 2 अक्षर का होना चाहिए"),
  email: z.string().email("वैध ईमेल पता दर्ज करें"),
  password: z.string().min(6, "पासवर्ड कम से कम 6 अक्षर का होना चाहिए"),
})

type ChokhlaFormData = z.infer<typeof chokhlaFormSchema>

interface AddChokhlaFormProps {
  onSubmit: (data: ChokhlaFormData) => void
  isLoading?: boolean
}

export function AddChokhlaForm({ onSubmit, isLoading = false }: AddChokhlaFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChokhlaFormData>({
    resolver: zodResolver(chokhlaFormSchema),
  })

  const handleFormSubmit = (data: ChokhlaFormData) => {
    onSubmit(data)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <ScrollArea className="h-[70vh] pr-4">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Chokhla Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-orange-700">
            <Building2 className="w-5 h-5" />
            चौकला की जानकारी
          </div>
          <Separator className="bg-orange-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-orange-700 font-medium">
                चौकला का नाम *
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="चौकला का नाम दर्ज करें"
                className={`border-orange-300 focus:border-orange-500 focus:ring-orange-500 ${
                  errors.name ? "border-red-500" : ""
                }`}
                disabled={isLoading}
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
                className={`border-orange-300 focus:border-orange-500 focus:ring-orange-500 ${
                  errors.adhyaksh ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
              {errors.adhyaksh && <p className="text-red-500 text-sm">{errors.adhyaksh.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber" className="text-orange-700 font-medium">
                संपर्क नंबर *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                <Input
                  id="contactNumber"
                  {...register("contactNumber")}
                  placeholder="संपर्क नंबर दर्ज करें"
                  className={`pl-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500 ${
                    errors.contactNumber ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="villageName" className="text-orange-700 font-medium">
                गांव का नाम *
              </Label>
              <Input
                id="villageName"
                {...register("villageName")}
                placeholder="गांव का नाम दर्ज करें"
                className={`border-orange-300 focus:border-orange-500 focus:ring-orange-500 ${
                  errors.villageName ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
              {errors.villageName && <p className="text-red-500 text-sm">{errors.villageName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-orange-700 font-medium">
                राज्य *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                <Input
                  id="state"
                  {...register("state")}
                  placeholder="राज्य का नाम दर्ज करें"
                  className={`pl-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500 ${
                    errors.state ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
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
                className={`border-orange-300 focus:border-orange-500 focus:ring-orange-500 ${
                  errors.district ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
              {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-orange-700 font-medium">
              पूरा पता *
            </Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="पूरा पता दर्ज करें"
              className={`border-orange-300 focus:border-orange-500 focus:ring-orange-500 min-h-[80px] ${
                errors.address ? "border-red-500" : ""
              }`}
              disabled={isLoading}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>
        </div>

        {/* Admin User Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-orange-700">
            <User className="w-5 h-5" />
            चौकला एडमिन की जानकारी
          </div>
          <Separator className="bg-orange-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-orange-700 font-medium">
                पूरा नाम *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="पूरा नाम दर्ज करें"
                  className={`pl-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500 ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-orange-700 font-medium">
                ईमेल पता *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="ईमेल पता दर्ज करें"
                  className={`pl-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password" className="text-orange-700 font-medium">
                पासवर्ड *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="पासवर्ड दर्ज करें"
                  className={`pl-10 pr-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-orange-100"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-orange-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-orange-600" />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 shadow-lg"
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
            onClick={() => reset()}
            disabled={isLoading}
            className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold py-2.5"
          >
            रीसेट करें
          </Button>
        </div>
      </form>
    </ScrollArea>
  )
}

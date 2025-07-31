"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

const addChokhlaSchema = z.object({
  name: z.string().min(2, "चौकला का नाम कम से कम 2 अक्षर का होना चाहिए"),
  adminName: z.string().min(2, "एडमिन का नाम कम से कम 2 अक्षर का होना चाहिए"),
  adminEmail: z.string().email("वैध ईमेल पता दर्ज करें"),
  adminPhone: z.string().min(10, "फोन नंबर कम से कम 10 अंकों का होना चाहिए"),
  password: z.string().min(6, "पासवर्ड कम से कम 6 अक्षर का होना चाहिए"),
})

type AddChokhlaFormData = z.infer<typeof addChokhlaSchema>

interface AddChokhlaFormProps {
  onSuccess: (data: any) => void
  onCancel: () => void
}

export function AddChokhlaForm({ onSuccess, onCancel }: AddChokhlaFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddChokhlaFormData>({
    resolver: zodResolver(addChokhlaSchema),
  })

  const onSubmit = async (data: AddChokhlaFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newChokhla = {
        id: Date.now().toString(),
        name: data.name,
        adminName: data.adminName,
        adminEmail: data.adminEmail,
        adminPhone: data.adminPhone,
        password: data.password,
        createdAt: new Date().toISOString(),
        status: "active",
      }

      onSuccess(newChokhla)
      reset()
      toast.success("चौकला सफलतापूर्वक जोड़ा गया!")
    } catch (error) {
      toast.error("चौकला जोड़ने में त्रुटि हुई")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">नया चौकला जोड़ें</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">चौकला का नाम *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="चौकला का नाम दर्ज करें"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminName">एडमिन का नाम *</Label>
              <Input
                id="adminName"
                {...register("adminName")}
                placeholder="एडमिन का नाम दर्ज करें"
                className={errors.adminName ? "border-red-500" : ""}
              />
              {errors.adminName && <p className="text-sm text-red-500">{errors.adminName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">एडमिन का ईमेल *</Label>
              <Input
                id="adminEmail"
                type="email"
                {...register("adminEmail")}
                placeholder="admin@example.com"
                className={errors.adminEmail ? "border-red-500" : ""}
              />
              {errors.adminEmail && <p className="text-sm text-red-500">{errors.adminEmail.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminPhone">फोन नंबर *</Label>
              <Input
                id="adminPhone"
                {...register("adminPhone")}
                placeholder="1234567890"
                className={errors.adminPhone ? "border-red-500" : ""}
              />
              {errors.adminPhone && <p className="text-sm text-red-500">{errors.adminPhone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">पासवर्ड *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="पासवर्ड दर्ज करें"
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              रद्द करें
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  जोड़ा जा रहा है...
                </>
              ) : (
                "चौकला जोड़ें"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

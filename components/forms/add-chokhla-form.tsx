"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label/label"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"
import { useCreateChokhla } from "@/data-hooks/mutation-query/useQueryAndMutation"

const chokhlaSchema = z.object({
  name: z.string().min(2, "चौकला का नाम कम से कम 2 अक्षर का होना चाहिए"),
  adminName: z.string().min(2, "एडमिन का नाम कम से कम 2 अक्षर का होना चाहिए"),
  adminEmail: z.string().email("वैध ईमेल पता दर्ज करें"),
  adminPassword: z.string().min(6, "पासवर्ड कम से कम 6 अक्षर का होना चाहिए"),
})

type ChokhlaFormData = z.infer<typeof chokhlaSchema>

interface AddChokhlaFormProps {
  onSuccess: (data: any) => void
  onCancel: () => void
}

export function AddChokhlaForm({ onSuccess, onCancel }: AddChokhlaFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChokhlaFormData>({
    resolver: zodResolver(chokhlaSchema),
  })

  const createChokhla = useCreateChokhla(
    (data) => {
      reset()
      setError(null)
      onSuccess(data)
    },
    (error) => {
      setError(error.message || "चौकला बनाने में त्रुटि हुई")
    },
  )

  const onSubmit = (data: ChokhlaFormData) => {
    setError(null)
    createChokhla.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
        <Label htmlFor="adminPassword">एडमिन का पासवर्ड *</Label>
        <div className="relative">
          <Input
            id="adminPassword"
            type={showPassword ? "text" : "password"}
            {...register("adminPassword")}
            placeholder="पासवर्ड दर्ज करें"
            className={errors.adminPassword ? "border-red-500 pr-10" : "pr-10"}
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
        {errors.adminPassword && <p className="text-sm text-red-500">{errors.adminPassword.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          रद्द करें
        </Button>
        <Button type="submit" disabled={createChokhla.isPending}>
          {createChokhla.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          चौकला जोड़ें
        </Button>
      </div>
    </form>
  )
}

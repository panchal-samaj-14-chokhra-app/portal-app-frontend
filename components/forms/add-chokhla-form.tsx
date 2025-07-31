"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useCreateChokhla } from "@/data-hooks/mutation-query/useQueryAndMutation"

const chokhlaSchema = z
  .object({
    name: z.string().min(2, "Chokhla name must be at least 2 characters"),
    adminName: z.string().min(2, "Admin name must be at least 2 characters"),
    adminEmail: z.string().email("Please enter a valid email address"),
    adminPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ChokhlaFormData = z.infer<typeof chokhlaSchema>

interface AddChokhlaFormProps {
  onSuccess?: (data: any) => void
}

export function AddChokhlaForm({ onSuccess }: AddChokhlaFormProps) {
  const t = useTranslations()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const createChokhla = useCreateChokhla()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChokhlaFormData>({
    resolver: zodResolver(chokhlaSchema),
  })

  const onSubmit = async (data: ChokhlaFormData) => {
    try {
      const result = await createChokhla.mutateAsync({
        name: data.name,
        adminName: data.adminName,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
      })

      reset()
      onSuccess?.(result)
    } catch (error) {
      console.error("Failed to create chokhla:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {createChokhla.error && (
        <Alert variant="destructive">
          <AlertDescription>{createChokhla.error.message || "Failed to create chokhla"}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("forms.chokhlaName")} *</Label>
          <Input id="name" {...register("name")} placeholder={t("forms.enterChokhlaName")} disabled={isSubmitting} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminName">{t("forms.adminName")} *</Label>
          <Input
            id="adminName"
            {...register("adminName")}
            placeholder={t("forms.enterAdminName")}
            disabled={isSubmitting}
          />
          {errors.adminName && <p className="text-sm text-destructive">{errors.adminName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminEmail">{t("forms.adminEmail")} *</Label>
        <Input
          id="adminEmail"
          type="email"
          {...register("adminEmail")}
          placeholder={t("forms.enterAdminEmail")}
          disabled={isSubmitting}
        />
        {errors.adminEmail && <p className="text-sm text-destructive">{errors.adminEmail.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="adminPassword">{t("forms.password")} *</Label>
          <div className="relative">
            <Input
              id="adminPassword"
              type={showPassword ? "text" : "password"}
              {...register("adminPassword")}
              placeholder={t("forms.enterPassword")}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.adminPassword && <p className="text-sm text-destructive">{errors.adminPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("forms.confirmPassword")} *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder={t("forms.confirmPassword")}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isSubmitting}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("forms.createChokhla")}
        </Button>
      </div>
    </form>
  )
}

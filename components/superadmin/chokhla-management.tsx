"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Building2, User, Phone, MapPin, Eye } from "lucide-react"
import { useCreateChokhla } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { useToast } from "@/hooks/use-toast"
import { ChokhlaForm } from "./chokhla-form"
import { SuccessDialog } from "./success-dialog"
import { ErrorDialog } from "./error-dialog"
import type { Chokhla, ChokhlaFormData, FormErrors, CreatedChokhlaData } from "./types"
import { INITIAL_CHOKHLA_FORM, VALIDATION_MESSAGES } from "./constants"

interface ChokhlaManagementProps {
  chokhlas: Chokhla[]
  isLoading: boolean
  error?: string
}

export function ChokhlaManagement({ chokhlas, isLoading, error }: ChokhlaManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState<ChokhlaFormData>(INITIAL_CHOKHLA_FORM)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [createdData, setCreatedData] = useState<CreatedChokhlaData | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const { mutate: createChokhla, isPending } = useCreateChokhla()

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    let isValid = true

    // Required field validation
    const requiredFields: (keyof ChokhlaFormData)[] = [
      "name",
      "adhyaksh",
      "contactNumber",
      "state",
      "district",
      "villageName",
      "email",
      "password",
      "repeatPassword",
    ]

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        errors[field] = VALIDATION_MESSAGES.REQUIRED
        isValid = false
      }
    })

    // Email validation
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      errors.email = VALIDATION_MESSAGES.INVALID_EMAIL
      isValid = false
    }

    // Phone validation
    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      errors.contactNumber = VALIDATION_MESSAGES.INVALID_PHONE
      isValid = false
    }

    // Password validation
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    if (formData.password && !strongPassword.test(formData.password)) {
      errors.password = VALIDATION_MESSAGES.WEAK_PASSWORD
      isValid = false
    }

    // Password match validation
    if (formData.password !== formData.repeatPassword) {
      errors.repeatPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "फॉर्म में त्रुटि",
        description: "कृपया सभी आवश्यक फील्ड भरें और त्रुटियों को ठीक करें।",
        variant: "destructive",
      })
      return
    }

    createChokhla(formData, {
      onSuccess: (data) => {
        const { chokhla, user } = data
        setCreatedData({
          chokhlaId: chokhla.id,
          userId: user.id,
          password: user.passwordHash,
          email: user.email,
          fullName: user.fullName,
          role: user.globalRole,
        })
        setShowForm(false)
        setFormData(INITIAL_CHOKHLA_FORM)
        setFormErrors({})
        setShowSuccess(true)
        toast({
          title: "सफलता!",
          description: "चौकला सफलतापूर्वक जोड़ा गया।",
        })
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || "चौकला जोड़ने में त्रुटि हुई"
        setErrorMessage(message)
        setShowError(true)
      },
    })
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setFormData(INITIAL_CHOKHLA_FORM)
    setFormErrors({})
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <div className="text-red-600 mb-4">❌ डेटा लोड करने में त्रुटि</div>
          <p className="text-gray-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="mb-8 shadow-lg border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                चौकला प्रबंधन
              </CardTitle>
              <p className="text-sm text-orange-600">कुल चौकला: {chokhlas?.length || 0}</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              नया चौकला जोड़ें
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : chokhlas?.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">कोई चौकला नहीं मिला</p>
              <p className="text-gray-400 text-sm mt-2">नया चौकला जोड़ने के लिए ऊपर बटन दबाएं</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] bg-white border border-orange-200 rounded-lg shadow">
                <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      चौकला का नाम
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">अध्यक्ष</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">संपर्क</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">स्थान</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                      कार्रवाई
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {chokhlas?.map((chokhla, index) => (
                    <tr
                      key={chokhla.id}
                      className={`hover:bg-orange-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-orange-25"
                      }`}
                    >
                      <td className="px-4 py-3 text-orange-900 font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-orange-500" />
                          {chokhla.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-orange-800">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-orange-500" />
                          {chokhla.adhyaksh}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-orange-800">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-orange-500" />
                          {chokhla.contactNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-orange-800">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <div className="text-sm">
                            <div>{chokhla.villageName}</div>
                            <div className="text-xs text-orange-600">
                              {chokhla.district}, {chokhla.state}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/chokhla/${chokhla.id}`)}
                          className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          देखें
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <ChokhlaForm
          formData={formData}
          errors={formErrors}
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onClose={handleCloseForm}
        />
      )}

      {/* Success Dialog */}
      {showSuccess && createdData && (
        <SuccessDialog
          data={createdData}
          onClose={() => {
            setShowSuccess(false)
            setCreatedData(null)
          }}
        />
      )}

      {/* Error Dialog */}
      {showError && (
        <ErrorDialog
          message={errorMessage}
          onClose={() => setShowError(false)}
          onRetry={() => {
            setShowError(false)
            handleSubmit(new Event("submit") as any)
          }}
        />
      )}
    </>
  )
}

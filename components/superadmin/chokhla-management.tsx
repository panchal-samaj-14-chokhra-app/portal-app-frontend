"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Plus, MapPin, Home, UserCheck, UserX } from "lucide-react"
import { ChokhlaForm } from "./chokhla-form"
import { SuccessDialog } from "./success-dialog"
import { ErrorDialog } from "./error-dialog"
import type { Chokhla, ChokhlaFormData } from "./types"

interface ChokhlaManagementProps {
  isLoading?: boolean
}

export function ChokhlaManagement({ isLoading = false }: ChokhlaManagementProps) {
  const [chokhlas, setChokhlas] = useState<Chokhla[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dialog states
  const [successDialog, setSuccessDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    details?: Record<string, any>
  }>({
    isOpen: false,
    title: "",
    message: "",
  })

  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onRetry?: () => void
  }>({
    isOpen: false,
    title: "",
    message: "",
  })

  useEffect(() => {
    const fetchChokhlas = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockChokhlas: Chokhla[] = [
          {
            id: "1",
            firstName: "राम",
            lastName: "पटेल",
            mobileNumber: "9876543210",
            email: "ram.patel@example.com",
            state: "गुजरात",
            district: "अहमदाबाद",
            villages: [],
            totalVillages: 3,
            totalFamilies: 120,
            totalMembers: 480,
            isActive: true,
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15",
          },
          {
            id: "2",
            firstName: "श्याम",
            lastName: "शर्मा",
            mobileNumber: "9876543211",
            email: "shyam.sharma@example.com",
            state: "राजस्थान",
            district: "जयपुर",
            villages: [],
            totalVillages: 2,
            totalFamilies: 85,
            totalMembers: 340,
            isActive: false,
            createdAt: "2024-01-20",
            updatedAt: "2024-01-20",
          },
        ]

        setChokhlas(mockChokhlas)
      } catch (error) {
        console.error("Error fetching chokhlas:", error)
        setErrorDialog({
          isOpen: true,
          title: "डेटा लोड करने में त्रुटि",
          message: "चोखला की जानकारी लोड करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchChokhlas()
  }, [])

  const handleFormSubmit = async (data: ChokhlaFormData) => {
    try {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate temporary password for demo
      const tempPassword = Math.random().toString(36).slice(-8)

      const newChokhla: Chokhla = {
        id: Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        email: data.email,
        state: data.state,
        district: data.district,
        villages: [],
        totalVillages: 0,
        totalFamilies: 0,
        totalMembers: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setChokhlas((prev) => [...prev, newChokhla])
      setShowForm(false)

      setSuccessDialog({
        isOpen: true,
        title: "चोखला सफलतापूर्वक पंजीकृत हुआ",
        message: "नया चोखला सफलतापूर्वक जोड़ा गया है। लॉगिन विवरण नीचे दिए गए हैं:",
        details: {
          नाम: `${data.firstName} ${data.lastName}`,
          ईमेल: data.email,
          मोबाइल: data.mobileNumber,
          "अस्थायी पासवर्ड": tempPassword,
        },
      })
    } catch (error) {
      console.error("Error creating chokhla:", error)
      setErrorDialog({
        isOpen: true,
        title: "चोखला पंजीकरण में त्रुटि",
        message: "चोखला पंजीकृत करने में समस्या हुई है। कृपया पुनः प्रयास करें।",
        onRetry: () => handleFormSubmit(data),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showForm) {
    return (
      <>
        <ChokhlaForm onSubmit={handleFormSubmit} isLoading={isSubmitting} onCancel={() => setShowForm(false)} />

        <SuccessDialog
          isOpen={successDialog.isOpen}
          onClose={() => setSuccessDialog({ ...successDialog, isOpen: false })}
          title={successDialog.title}
          message={successDialog.message}
          details={successDialog.details}
        />

        <ErrorDialog
          isOpen={errorDialog.isOpen}
          onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
          title={errorDialog.title}
          message={errorDialog.message}
          onRetry={errorDialog.onRetry}
        />
      </>
    )
  }

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-8 w-16" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">चोखला प्रबंधन</h2>
          <p className="text-gray-600">सभी पंजीकृत चोखलाओं की जानकारी</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          नया चोखला जोड़ें
        </Button>
      </div>

      {chokhlas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोई चोखला पंजीकृत नहीं</h3>
            <p className="text-gray-500 text-center mb-4">अभी तक कोई चोखला पंजीकृत नहीं किया गया है।</p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              पहला चोखला जोड़ें
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chokhlas.map((chokhla) => (
            <Card key={chokhla.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Users className="w-5 h-5" />
                    {chokhla.firstName} {chokhla.lastName}
                  </CardTitle>
                  {chokhla.isActive ? (
                    <Badge className="bg-green-100 text-green-800">
                      <UserCheck className="w-3 h-3 mr-1" />
                      सक्रिय
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      <UserX className="w-3 h-3 mr-1" />
                      निष्क्रिय
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {chokhla.district}, {chokhla.state}
                </p>
                <p className="text-sm text-gray-500">{chokhla.email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{chokhla.totalVillages}</p>
                      <p className="text-xs text-gray-500">गांव</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">{chokhla.totalFamilies}</p>
                      <p className="text-xs text-gray-500">परिवार</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">{chokhla.totalMembers}</p>
                      <p className="text-xs text-gray-500">सदस्य</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    पंजीकृत: {new Date(chokhla.createdAt).toLocaleDateString("hi-IN")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import React, { useState, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Import custom components
import { ChokhlaHeader } from "@/components/chokhla/chokhla-header"
import { CokhlaSidebar } from "@/components/chokhla/chokhla-sidebar"
import { VillageForm } from "@/components/chokhla/village-form"
import { VillageTable } from "@/components/chokhla/village-table"
import { ProfileForm } from "@/components/chokhla/profile-form"
import { SuccessDialog } from "@/components/chokhla/success-dialog"
import { ErrorDialog } from "@/components/chokhla/error-dialog"

// Import hooks and types
import {
  useCreateVillage,
  useChokhlaDetails,
  useUpdateChokhla,
  useGetAllVillageswithChokhlaID,
} from "@/data-hooks/mutation-query/useQueryAndMutation"
import { TABS, SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/components/chokhla/constants"
import type { VillageFormData, SuccessData } from "@/components/chokhla/types"

function Chokhla() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const chokhlaId = useParams().chokhlaId as string

  // State management
  const [activeTab, setActiveTab] = useState("village")
  const [isVillageDialogOpen, setIsVillageDialogOpen] = useState(false)
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showErrorModal, setShowErrorModal] = useState(false)

  // API hooks
  const {
    data: villages,
    isLoading: isVillagesLoading,
    error: villagesError,
  } = useGetAllVillageswithChokhlaID(chokhlaId)
  const { data: chokhla, isLoading: isChokhlaLoading, error: chokhlaError } = useChokhlaDetails(chokhlaId)
  const { mutate: updateChokhla, isLoading: isUpdatingChokhla } = useUpdateChokhla(chokhlaId)
  const { mutate: createVillage, isLoading: isCreatingVillage } = useCreateVillage()

  // Computed values
  const userType = useMemo(() => session?.user?.role, [session?.user?.role])

  // Error handling
  const handleError = useCallback((error: any, defaultMessage: string = ERROR_MESSAGES.GENERIC) => {
    let message = defaultMessage

    if (error?.response?.data?.message) {
      message = error.response.data.message
    } else if (error?.message) {
      message = error.message
    } else if (typeof error === "string") {
      message = error
    }

    setErrorMessage(message)
    setShowErrorModal(true)
  }, [])

  // Success handling
  const showSuccessToast = useCallback(
    (message: string) => {
      toast({
        title: "सफल",
        description: message,
        variant: "default",
      })
    },
    [toast],
  )

  // Navigation handlers
  const handleBack = useCallback(() => router.back(), [router])
  const handleLogout = useCallback(() => signOut({ callbackUrl: "/login" }), [])
  const handleViewVillage = useCallback(
    (villageId: string) => {
      router.push(`/admin/village/${villageId}?chakolaId=${chokhlaId}`)
    },
    [router, chokhlaId],
  )

  // Village form handlers
  const handleVillageSubmit = useCallback(
    (data: VillageFormData) => {
      const payload = {
        ...data,
        age: data.age ? Number(data.age) : null,
        longitude: data.longitude ? Number(data.longitude) : null,
        latitude: data.latitude ? Number(data.latitude) : null,
        chakola: { connect: { id: chokhlaId } },
      }

      createVillage(payload, {
        onSuccess: (response) => {
          const successData: SuccessData = {
            ...response,
            password: data.password, // Store original password
          }

          setSuccessData(successData)
          setShowSuccessModal(true)
          setIsVillageDialogOpen(false)
          showSuccessToast(SUCCESS_MESSAGES.VILLAGE_CREATED)
        },
        onError: (error) => {
          handleError(error, "गांव जोड़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।")
        },
      })
    },
    [chokhlaId, createVillage, handleError, showSuccessToast],
  )

  // Profile update handler
  const handleProfileUpdate = useCallback(
    (data: any) => {
      updateChokhla(data, {
        onSuccess: () => {
          showSuccessToast(SUCCESS_MESSAGES.PROFILE_UPDATED)
        },
        onError: (error) => {
          handleError(error, "प्रोफ़ाइल अपडेट करने में त्रुटि हुई।")
        },
      })
    },
    [updateChokhla, handleError, showSuccessToast],
  )

  // Handle API errors
  React.useEffect(() => {
    if (villagesError) {
      handleError(villagesError, "गांवों की सूची लोड करने में त्रुटि हुई।")
    }
  }, [villagesError, handleError])

  React.useEffect(() => {
    if (chokhlaError) {
      handleError(chokhlaError, "चौकला की जानकारी लोड करने में त्रुटि हुई।")
    }
  }, [chokhlaError, handleError])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <ChokhlaHeader userType={userType || ""} onBack={handleBack} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <CokhlaSidebar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <section className="flex-1 min-w-0">
          {/* Village Management Tab */}
          {activeTab === "village" && (
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-orange-800">गांव प्रबंधन</CardTitle>
                {userType === "CHOKHLA_MEMBER" && (
                  <Dialog open={isVillageDialogOpen} onOpenChange={setIsVillageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Plus className="w-5 h-5 mr-2" />
                        गांव जोड़ें
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <VillageForm
                        onSubmit={handleVillageSubmit}
                        isLoading={isCreatingVillage}
                        onCancel={() => setIsVillageDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                <VillageTable
                  villages={villages || []}
                  isLoading={isVillagesLoading}
                  onViewVillage={handleViewVillage}
                />
              </CardContent>
            </Card>
          )}

          {/* Statistics Tab */}
          {activeTab === "statics" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-orange-800">आँकड़े</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-500">आँकड़े जल्द ही उपलब्ध होंगे</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-orange-800">रिपोर्ट्स</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-500">रिपोर्ट्स जल्द ही उपलब्ध होंगे</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <ProfileForm
              profile={chokhla}
              isLoading={isChokhlaLoading}
              isUpdating={isUpdatingChokhla}
              onUpdate={handleProfileUpdate}
            />
          )}
        </section>
      </main>

      {/* Success Dialog */}
      <SuccessDialog open={showSuccessModal} onOpenChange={setShowSuccessModal} data={successData} />

      {/* Error Dialog */}
      <ErrorDialog
        open={showErrorModal}
        onOpenChange={setShowErrorModal}
        message={errorMessage || ERROR_MESSAGES.GENERIC}
        onRetry={() => {
          setShowErrorModal(false)
          // You can add specific retry logic here if needed
        }}
      />
    </div>
  )
}

export default Chokhla

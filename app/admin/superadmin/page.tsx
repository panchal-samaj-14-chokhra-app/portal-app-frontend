"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useAllVillages, useAllChokhlas, useGetAllUserList } from "@/data-hooks/mutation-query/useQueryAndMutation"

// Import all the new components
import { SuperAdminHeader } from "@/components/superadmin/superadmin-header"
import { SuperAdminSidebar } from "@/components/superadmin/superadmin-sidebar"
import { VillageManagement } from "@/components/superadmin/village-management"
import { ChokhlaManagement } from "@/components/superadmin/chokhla-management"
import { StatisticsManagement } from "@/components/superadmin/statistics-management"
import { UserManagement } from "@/components/superadmin/user-management"
import { ProfileManagement } from "@/components/superadmin/profile-management"
import { ErrorDialog } from "@/components/superadmin/error-dialog"
import type { TabKey } from "@/components/superadmin/types"

function SuperAdmin() {
  const [activeTab, setActiveTab] = useState<TabKey>("village")
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const { data: userData } = useSession()
  const { toast } = useToast()

  // API hooks
  const { data: villages, isLoading: isVillagesLoading, error: villagesError } = useAllVillages()

  const { data: chokhlas, isLoading: isChokhlasLoading, error: chokhlasError } = useAllChokhlas()

  const { data: users, isLoading: usersLoading, error: usersError } = useGetAllUserList()

  const handleToggleActive = (userId: string, current: boolean) => {
    // TODO: Implement user activation/deactivation
    console.log("Toggle user active status:", userId, current)
    toast({
      title: "सुविधा जल्द आएगी",
      description: "यूज़र स्थिति बदलने की सुविधा जल्द ही उपलब्ध होगी।",
      variant: "default",
    })
  }

  const handleApiError = (error: any, context: string) => {
    const message = error?.response?.data?.message || error?.message || `${context} में त्रुटि हुई`
    setErrorMessage(message)
    setShowError(true)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "village":
        return (
          <VillageManagement
            villages={villages?.data || []}
            isLoading={isVillagesLoading}
            error={villagesError ? "गांव डेटा लोड करने में त्रुटि" : undefined}
          />
        )

      case "chokhla":
        return (
          <ChokhlaManagement
            chokhlas={chokhlas || []}
            isLoading={isChokhlasLoading}
            error={chokhlasError ? "चौकला डेटा लोड करने में त्रुटि" : undefined}
          />
        )

      case "statics":
        return (
          <StatisticsManagement
            villageCount={villages?.data?.length || 0}
            chokhlaCount={chokhlas?.length || 0}
            userCount={users?.length || 0}
          />
        )

      case "user":
        return (
          <UserManagement
            users={users || []}
            isLoading={usersLoading}
            error={usersError ? "यूज़र डेटा लोड करने में त्रुटि" : undefined}
            onToggleActive={handleToggleActive}
          />
        )

      case "profile":
        return <ProfileManagement userData={userData} />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <SuperAdminHeader />

      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <SuperAdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <section className="flex-1 min-w-0">{renderTabContent()}</section>
      </main>

      {/* Global Error Dialog */}
      {showError && <ErrorDialog message={errorMessage} onClose={() => setShowError(false)} />}
    </div>
  )
}

export default SuperAdmin

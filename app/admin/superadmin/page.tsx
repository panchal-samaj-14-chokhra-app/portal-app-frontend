"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { SuperAdminHeader } from "@/components/superadmin/superadmin-header"
import { SuperAdminSidebar } from "@/components/superadmin/superadmin-sidebar"
import { VillageManagement } from "@/components/superadmin/village-management"
import { ChokhlaManagement } from "@/components/superadmin/chokhla-management"
import { StatisticsManagement } from "@/components/superadmin/statistics-management"
import { UserManagement } from "@/components/superadmin/user-management"
import { ProfileManagement } from "@/components/superadmin/profile-management"

export default function SuperAdminPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("villages")

  const renderContent = () => {
    switch (activeTab) {
      case "villages":
        return <VillageManagement />
      case "chokhlas":
        return <ChokhlaManagement />
      case "statistics":
        return <StatisticsManagement />
      case "users":
        return <UserManagement />
      case "profile":
        return <ProfileManagement />
      default:
        return <VillageManagement />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SuperAdminHeader userEmail={session?.user?.email || undefined} userName={session?.user?.name || undefined} />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <SuperAdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useSuperAdmin } from "../providers/superadmin-provider"
import { VillageManagement } from "../village-management"
import { ChokhlaManagement } from "../chokhla-management"
import { UserManagement } from "../user-management"
import { StatisticsManagement } from "../statistics-management"
import { ProfileManagement } from "../profile-management"
import { ChokhlaForm } from "../chokhla-form"

export function SuperAdminContent() {
  const { activeTab } = useSuperAdmin()

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <StatisticsManagement />
      case "villages":
        return <VillageManagement />
      case "chokhlas":
        return <ChokhlaManagement />
      case "add-chokhla":
        return <ChokhlaForm />
      case "users":
        return <UserManagement />
      case "profile":
        return <ProfileManagement />
      default:
        return <StatisticsManagement />
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">{renderContent()}</div>
    </div>
  )
}

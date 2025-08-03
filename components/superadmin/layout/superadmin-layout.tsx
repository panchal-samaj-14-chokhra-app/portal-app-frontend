"use client"

import { SuperAdminHeader } from "../superadmin-header"
import { SuperAdminSidebar } from "../superadmin-sidebar"
import { SuperAdminContent } from "./superadmin-content"
import { SuperAdminDialogs } from "./superadmin-dialogs"
import { useSuperAdmin } from "../providers/superadmin-provider"

export function SuperAdminLayout() {
  const { profile, isLoadingProfile, handleLogout, activeTab, setActiveTab } = useSuperAdmin()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <SuperAdminHeader profile={profile} isLoading={isLoadingProfile} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <SuperAdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <SuperAdminContent />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SuperAdminDialogs />
    </div>
  )
}

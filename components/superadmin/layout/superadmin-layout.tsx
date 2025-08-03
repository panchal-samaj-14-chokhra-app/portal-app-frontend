"use client"

import { SuperAdminHeader } from "../superadmin-header"
import { SuperAdminSidebar } from "../superadmin-sidebar"
import { SuperAdminContent } from "./superadmin-content"
import { SuperAdminDialogs } from "./superadmin-dialogs"

export function SuperAdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <SuperAdminHeader />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <SuperAdminSidebar />

        {/* Content Area */}
        <SuperAdminContent />
      </div>

      {/* Dialogs */}
      <SuperAdminDialogs />
    </div>
  )
}

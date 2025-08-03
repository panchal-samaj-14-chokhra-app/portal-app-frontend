"use client"

import { SuperAdminHeader } from "@/components/superadmin/superadmin-header"
import { SuperAdminSidebar } from "@/components/superadmin/superadmin-sidebar"
import { SuperAdminContent } from "./superadmin-content"
import { SuperAdminDialogs } from "./superadmin-dialogs"

export function SuperAdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <SuperAdminHeader />

      <div className="flex">
        <SuperAdminSidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <SuperAdminContent />
          </div>
        </main>
      </div>

      <SuperAdminDialogs />
    </div>
  )
}

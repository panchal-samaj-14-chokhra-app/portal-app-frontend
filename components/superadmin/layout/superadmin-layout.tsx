"use client"

import { SuperAdminProvider } from "../providers/superadmin-provider"
import { SuperAdminContent } from "./superadmin-content"
import { SuperAdminDialogs } from "./superadmin-dialogs"

export function SuperAdminLayout() {
  return (
    <SuperAdminProvider>
      <div className="min-h-screen bg-gray-50">
        <SuperAdminContent />
        <SuperAdminDialogs />
      </div>
    </SuperAdminProvider>
  )
}

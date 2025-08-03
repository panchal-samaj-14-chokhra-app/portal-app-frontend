"use client"

import { useState } from "react"
import { SuperAdminHeader } from "../superadmin-header"
import { SuperAdminSidebar } from "../superadmin-sidebar"
import { SuperAdminContent } from "./superadmin-content"
import { SuperAdminDialogs } from "./superadmin-dialogs"
import type { TabType } from "../types"

export function SuperAdminLayout() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminHeader />

      <div className="flex h-[calc(100vh-80px)]">
        <SuperAdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-auto">
          <SuperAdminContent activeTab={activeTab} />
        </div>
      </div>

      <SuperAdminDialogs />
    </div>
  )
}

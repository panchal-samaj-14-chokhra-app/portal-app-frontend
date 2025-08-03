"use client"
import { SuperAdminProvider } from "@/components/superadmin/providers/superadmin-provider"
import { SuperAdminLayout } from "@/components/superadmin/layout/superadmin-layout"

export default function SuperAdminPage() {
  return (
    <SuperAdminProvider>
      <SuperAdminLayout />
    </SuperAdminProvider>
  )
}

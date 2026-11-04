import { Suspense } from "react"
import DutySettingsView from "@/components/superadmin/duty-settings-view"

export const dynamic = "force-dynamic"

export default function DutyRegisterSettingsPage() {
  return (
    <Suspense>
      <DutySettingsView />
    </Suspense>
  )
}

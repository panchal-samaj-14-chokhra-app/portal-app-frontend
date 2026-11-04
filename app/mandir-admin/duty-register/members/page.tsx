import { Suspense } from "react"
import DutyMembersView from "@/components/superadmin/duty-members-view"

export const dynamic = "force-dynamic"

export default function DutyRegisterMembersPage() {
  return (
    <Suspense>
      <DutyMembersView />
    </Suspense>
  )
}

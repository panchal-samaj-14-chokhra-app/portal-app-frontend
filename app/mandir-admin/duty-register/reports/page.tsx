import { Suspense } from "react"
import DutyReportView from "@/components/superadmin/duty-report-view"

export const dynamic = "force-dynamic"

export default function DutyRegisterReportsPage() {
  return (
    <Suspense>
      <DutyReportView />
    </Suspense>
  )
}

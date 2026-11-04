import { Suspense } from "react"
import DutyRegisterView from "@/components/superadmin/duty-register"

export const dynamic = "force-dynamic"

export default function DutyRegisterRegisterPage() {
  return (
    <Suspense>
      <DutyRegisterView />
    </Suspense>
  )
}

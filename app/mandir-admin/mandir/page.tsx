import { Suspense } from "react"
import MandirContent from "@/components/superadmin/mandir-content"

export const dynamic = "force-dynamic"

export default function MandirAdminMandirPage() {
  return (
    <Suspense>
      <MandirContent />
    </Suspense>
  )
}

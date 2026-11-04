"use client";
export const dynamic = "force-dynamic"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DutyEntryForm from "@/components/superadmin/duty-entry-form"

export default function NewDutyRegisterEntryPage() {
  const router = useRouter()
  const back = () => router.push("/mandir-admin/duty-register/register")

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={back}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold text-gray-800">नई ड्यूटी जोड़ें</h2>
      </div>
      <DutyEntryForm onSaved={back} onCancel={back} />
    </div>
  )
}

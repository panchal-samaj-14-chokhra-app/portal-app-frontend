export const dynamic = "force-dynamic"
"use client";
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDutyRegisterEntry } from "@/data-hooks/mutation-query/useDutyRegister"
import DutyEntryForm from "@/components/superadmin/duty-entry-form"

export default function EditDutyRegisterEntryPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const back = () => router.push("/mandir-admin/duty-register/register")

  const { data: entry, isLoading, error } = useDutyRegisterEntry(params.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={back}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold text-gray-800">ड्यूटी संपादित करें</h2>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-gray-500">
          <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
          लोड हो रहा है...
        </div>
      ) : error || !entry ? (
        <div className="py-16 text-center text-red-500">रिकॉर्ड लोड नहीं हो सका</div>
      ) : (
        <DutyEntryForm entry={entry} onSaved={back} onCancel={back} />
      )}
    </div>
  )
}

export const dynamic = "force-dynamic"
"use client";
import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2, Pencil, MapPin, Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useDutyRegisterEntry } from "@/data-hooks/mutation-query/useDutyRegister"
import { useDutySettings } from "@/data-hooks/mutation-query/useDutySettings"

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  )
}

export default function ViewDutyRegisterEntryPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [previewOpen, setPreviewOpen] = useState(false)
  const back = () => router.push("/mandir-admin/duty-register/register")

  const { data: entry, isLoading, error } = useDutyRegisterEntry(params.id)
  const { data: settings } = useDutySettings()

  const dutyTypeLabel = settings?.dutyTypes.find((t) => t.key === entry?.dutyType)?.label || entry?.dutyType
  const shiftLabel = settings?.shifts.find((s) => s.key === entry?.shift)?.label || entry?.shift
  const attendanceLabel = settings?.attendanceStatuses.find((s) => s.key === entry?.attendanceStatus)?.label || entry?.attendanceStatus

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={back}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-800">ड्यूटी विवरण</h2>
        </div>
        {entry && (
          <Link href={`/mandir-admin/duty-register/register/${entry.id}/edit`}>
            <Button size="sm" variant="outline">
              <Pencil className="w-4 h-4 mr-1" />
              संपादित करें
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-gray-500">
          <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
          लोड हो रहा है...
        </div>
      ) : error || !entry ? (
        <div className="py-16 text-center text-red-500">रिकॉर्ड लोड नहीं हो सका</div>
      ) : (
        <div className="w-full">
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Title row with photo avatar */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Photo avatar */}
                  {entry.checkinPhotoUrl ? (
                    <div className="shrink-0">
                      <img
                        src={entry.checkinPhotoUrl}
                        alt="चेक-इन फोटो"
                        onClick={() => setPreviewOpen(true)}
                        className="w-16 h-20 rounded-md object-cover border border-gray-200 shadow-sm cursor-pointer hover:opacity-90 hover:shadow-md transition-all"
                      />
                      {entry.checkinLat != null && entry.checkinLng != null && (
                        <a
                          href={`https://www.google.com/maps?q=${entry.checkinLat},${entry.checkinLng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex items-center gap-0.5 text-[10px] text-green-600 hover:underline justify-center"
                        >
                          <MapPin className="w-3 h-3" />
                          नक्शा
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="shrink-0 w-16 h-20 rounded-md bg-gray-100 border border-dashed border-gray-200 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800">{entry.title}</h3>
                    <span className="mt-1 inline-block rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">{attendanceLabel}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="तिथि" value={entry.dutyDate} />
                <Field label="स्थान" value={dutyTypeLabel} />
                <Field label="पाली" value={shiftLabel} />
                <Field label="सदस्य" value={entry.memberName} />
                <Field label="सदस्य भूमिका" value={entry.memberRole} />
                <Field label="नियुक्तकर्ता" value={entry.assignedBy} />
                <Field label="निर्धारित प्रारंभ" value={entry.scheduledStart} />
                <Field label="निर्धारित समाप्ति" value={entry.scheduledEnd} />
                <Field label="वास्तविक चेक-इन" value={entry.actualCheckin} />
                <Field label="वास्तविक चेक-आउट" value={entry.actualCheckout} />
                <Field label="सत्यापनकर्ता" value={entry.verifiedBy} />
              </div>
              {entry.remarks && (
                <div>
                  <div className="text-xs text-gray-500">टिप्पणी</div>
                  <div className="text-sm text-gray-800">{entry.remarks}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full-screen photo preview */}
      {entry?.checkinPhotoUrl && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-2xl p-2 bg-black border-0">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={entry.checkinPhotoUrl}
              alt="चेक-इन फोटो"
              className="w-full max-h-[80vh] object-contain rounded"
            />
            {entry.checkinLat != null && entry.checkinLng != null && (
              <a
                href={`https://www.google.com/maps?q=${entry.checkinLat},${entry.checkinLng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-green-400 hover:underline px-2 pb-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                {entry.checkinLat.toFixed(5)}, {entry.checkinLng.toFixed(5)}
              </a>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Plus, Pencil, Trash2, Loader2, Eye, List, CalendarDays, CalendarRange, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useConfirmDialog } from "@/hooks/use-confirm-dialog"
import { useDutySettings } from "@/data-hooks/mutation-query/useDutySettings"
import { useDutyRegisterList, useDeleteDutyRegisterEntry } from "@/data-hooks/mutation-query/useDutyRegister"
import DutyCalendarView from "@/components/superadmin/duty-calendar-view"

const PAGE_SIZE = 15

export default function DutyRegisterView() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { confirm, ConfirmDialog } = useConfirmDialog()

  const viewMode = (searchParams.get("view") || "list") as "list" | "month" | "week"

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") params.delete(key)
    else params.set(key, value)
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const { data: settings } = useDutySettings()
  const { data: entries, isLoading, error } = useDutyRegisterList({})
  const deleteMutation = useDeleteDutyRegisterEntry()

  const dutyTypes = settings?.dutyTypes || []
  const shifts = settings?.shifts || []
  const attendanceStatuses = settings?.attendanceStatuses || []

  const handleDelete = async (id: string) => {
    if (!(await confirm("क्या आप वाकई इस रिकॉर्ड को हटाना चाहते हैं?"))) return
    deleteMutation.mutate(id, {
      onSuccess: () => toast({ title: "हटा दिया गया" }),
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message || "हटाने में त्रुटि", variant: "destructive" }),
    })
  }

  // Pagination
  const [page, setPage] = useState(1)
  const total = entries?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageEntries = (entries || []).slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="inline-flex rounded-md border bg-gray-50 p-0.5 gap-0.5">
              <Button size="sm" variant="ghost"
                className={`h-7 px-2 text-xs ${viewMode === "list" ? "bg-white shadow-sm text-orange-600" : "text-gray-500"}`}
                onClick={() => setParam("view", "list")}>
                <List className="w-3.5 h-3.5 mr-1" />सूची
              </Button>
              <Button size="sm" variant="ghost"
                className={`h-7 px-2 text-xs ${viewMode === "week" ? "bg-white shadow-sm text-orange-600" : "text-gray-500"}`}
                onClick={() => setParam("view", "week")}>
                <CalendarRange className="w-3.5 h-3.5 mr-1" />सप्ताह
              </Button>
              <Button size="sm" variant="ghost"
                className={`h-7 px-2 text-xs ${viewMode === "month" ? "bg-white shadow-sm text-orange-600" : "text-gray-500"}`}
                onClick={() => setParam("view", "month")}>
                <CalendarDays className="w-3.5 h-3.5 mr-1" />माह
              </Button>
            </div>

            <div className="flex-1" />

            <Link href="/mandir-admin/duty-register/register/new">
              <Button size="sm" className="h-8 bg-gradient-to-r from-orange-500 to-orange-600">
                <Plus className="w-3.5 h-3.5 mr-1" />रिकॉर्ड
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Calendar views */}
      {(viewMode === "month" || viewMode === "week") && (
        isLoading ? (
          <div className="py-16 text-center text-gray-500">
            <Loader2 className="w-5 h-5 inline animate-spin mr-2" />लोड हो रहा है...
          </div>
        ) : (
          <DutyCalendarView
            entries={entries || []}
            dutyTypes={dutyTypes}
            shifts={shifts}
            attendanceStatuses={attendanceStatuses}
            calView={viewMode}
          />
        )
      )}

      {/* List */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-16 text-center text-gray-500">
                <Loader2 className="w-5 h-5 inline animate-spin mr-2" />लोड हो रहा है...
              </div>
            ) : error ? (
              <div className="py-16 text-center text-red-500">डेटा लोड नहीं हो सका</div>
            ) : !entries?.length ? (
              <div className="py-16 text-center text-gray-500">कोई रिकॉर्ड नहीं मिला</div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-left">
                      <tr>
                        <th className="px-4 py-2">तिथि</th>
                        <th className="px-4 py-2">स्थान / पाली</th>
                        <th className="px-4 py-2">शीर्षक</th>
                        <th className="px-4 py-2">सदस्य</th>
                        <th className="px-4 py-2">समय</th>
                        <th className="px-4 py-2">उपस्थिति</th>
                        <th className="px-4 py-2 text-right">कार्य</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pageEntries.map((entry) => {
                        const typeLabel = dutyTypes.find((t) => t.key === entry.dutyType)?.label || entry.dutyType
                        const shiftItem = shifts.find((s) => s.key === entry.shift)
                        const shiftLabel = shiftItem?.label || entry.shift
                        const shiftTiming = shiftItem?.start && shiftItem?.end ? `${shiftItem.start} – ${shiftItem.end}` : null
                        const attLabel = attendanceStatuses.find((s) => s.key === entry.attendanceStatus)?.label || entry.attendanceStatus
                        return (
                          <tr key={entry.id} className="hover:bg-orange-50/40">
                            <td className="px-4 py-2 whitespace-nowrap">{entry.dutyDate}</td>
                            <td className="px-4 py-2">
                              <div>{typeLabel}</div>
                              <div className="text-xs text-gray-400">{shiftLabel}</div>
                              {shiftTiming && <div className="text-xs text-orange-500 font-medium">{shiftTiming}</div>}
                            </td>
                            <td className="px-4 py-2">{entry.title}</td>
                            <td className="px-4 py-2">
                              <div>{entry.memberName}</div>
                              {entry.memberRole && <div className="text-xs text-gray-400">{entry.memberRole}</div>}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{shiftTiming || "—"}</td>
                            <td className="px-4 py-2">
                              <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">{attLabel}</span>
                            </td>
                            <td className="px-4 py-2 text-right whitespace-nowrap">
                              <Link href={`/mandir-admin/duty-register/register/${entry.id}/view`}>
                                <Button size="icon" variant="ghost"><Eye className="w-4 h-4" /></Button>
                              </Link>
                              <Link href={`/mandir-admin/duty-register/register/${entry.id}/edit`}>
                                <Button size="icon" variant="ghost"><Pencil className="w-4 h-4" /></Button>
                              </Link>
                              <Button size="icon" variant="ghost" onClick={() => handleDelete(entry.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y">
                  {pageEntries.map((entry) => {
                    const typeLabel = dutyTypes.find((t) => t.key === entry.dutyType)?.label || entry.dutyType
                    const shiftItem = shifts.find((s) => s.key === entry.shift)
                    const shiftTiming = shiftItem?.start && shiftItem?.end ? `${shiftItem.start} – ${shiftItem.end}` : null
                    const attLabel = attendanceStatuses.find((s) => s.key === entry.attendanceStatus)?.label || entry.attendanceStatus
                    const isPresent = entry.attendanceStatus?.toLowerCase().includes("present")
                    const isAbsent = entry.attendanceStatus?.toLowerCase().includes("absent")
                    return (
                      <div key={entry.id} className="px-4 py-3 hover:bg-orange-50/30">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            {/* Date + attendance */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-500">{entry.dutyDate}</span>
                              <span className={`rounded-full px-2 py-0.5 text-xs ${isPresent ? "bg-green-100 text-green-700" : isAbsent ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-700"}`}>
                                {attLabel}
                              </span>
                            </div>
                            {/* Member */}
                            <div className="font-medium text-gray-800 text-sm truncate">{entry.memberName}</div>
                            {entry.memberRole && <div className="text-xs text-gray-400 truncate">{entry.memberRole}</div>}
                            {/* Place + timing */}
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="text-xs text-gray-600">{typeLabel}</span>
                              {shiftItem && <span className="text-xs text-gray-400">· {shiftItem.label}</span>}
                              {shiftTiming && <span className="text-xs text-orange-500 font-medium">· {shiftTiming}</span>}
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Link href={`/mandir-admin/duty-register/register/${entry.id}/view`}>
                              <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                            </Link>
                            <Link href={`/mandir-admin/duty-register/register/${entry.id}/edit`}>
                              <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                            </Link>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(entry.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-600">
                    <span className="text-xs">
                      {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, total)} / {total} रिकॉर्ड
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline" size="icon" className="h-7 w-7"
                        disabled={safePage === 1}
                        onClick={() => setPage(safePage - 1)}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                        .reduce<(number | "…")[]>((acc, p, i, arr) => {
                          if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…")
                          acc.push(p)
                          return acc
                        }, [])
                        .map((p, i) =>
                          p === "…" ? (
                            <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-xs">…</span>
                          ) : (
                            <Button
                              key={p}
                              variant={p === safePage ? "default" : "outline"}
                              size="icon"
                              className={`h-7 w-7 text-xs ${p === safePage ? "bg-orange-500 hover:bg-orange-600 border-orange-500" : ""}`}
                              onClick={() => setPage(p as number)}
                            >
                              {p}
                            </Button>
                          )
                        )}
                      <Button
                        variant="outline" size="icon" className="h-7 w-7"
                        disabled={safePage === totalPages}
                        onClick={() => setPage(safePage + 1)}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {ConfirmDialog}
    </div>
  )
}

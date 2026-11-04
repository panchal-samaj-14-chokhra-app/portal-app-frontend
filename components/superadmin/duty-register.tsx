"use client"

import Link from "next/link"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Plus, Pencil, Trash2, Download, Loader2, X, Eye, ChevronDown, List, CalendarDays, CalendarRange } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useConfirmDialog } from "@/hooks/use-confirm-dialog"
import { useDutySettings } from "@/data-hooks/mutation-query/useDutySettings"
import { useDutyRegisterList, useDutyRegisterStats, useDeleteDutyRegisterEntry } from "@/data-hooks/mutation-query/useDutyRegister"
import type { DutyRegisterEntry } from "@/data-hooks/requests/duty-register"
import DutyCalendarView from "@/components/superadmin/duty-calendar-view"

const EXPORT_HEADERS = ["तिथि", "स्थान", "पाली", "शीर्षक", "सदस्य", "सदस्य भूमिका", "उपस्थिति"]

function buildExportRows(
  rows: DutyRegisterEntry[],
  dutyTypes: { key: string; label: string }[],
  shifts: { key: string; label: string }[],
  attendanceStatuses: { key: string; label: string }[]
) {
  return rows.map((r) => ({
    तिथि: r.dutyDate,
    स्थान: dutyTypes.find((t) => t.key === r.dutyType)?.label || r.dutyType,
    पाली: shifts.find((s) => s.key === r.shift)?.label || r.shift,
    शीर्षक: r.title,
    सदस्य: r.memberName,
    "सदस्य भूमिका": r.memberRole || "",
    उपस्थिति: attendanceStatuses.find((s) => s.key === r.attendanceStatus)?.label || r.attendanceStatus,
  }))
}

function toCsv(rows: ReturnType<typeof buildExportRows>) {
  const lines = [EXPORT_HEADERS.join(",")]
  for (const r of rows) {
    lines.push(
      EXPORT_HEADERS.map((h) => `"${String((r as any)[h] ?? "").replace(/"/g, '""')}"`).join(",")
    )
  }
  return lines.join("\n")
}

export default function DutyRegisterView() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { confirm, ConfirmDialog } = useConfirmDialog()

  const viewMode = (searchParams.get("view") || "list") as "list" | "month" | "week"
  const dateFrom = searchParams.get("dateFrom") || ""
  const dateTo = searchParams.get("dateTo") || ""
  const dutyType = searchParams.get("dutyType") || "all"
  const shift = searchParams.get("shift") || "all"
  const attendanceStatus = searchParams.get("attendanceStatus") || "all"
  const search = searchParams.get("search") || ""

  const hasFilters = !!dateFrom || !!dateTo || dutyType !== "all" || shift !== "all" || attendanceStatus !== "all" || !!search

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") params.delete(key)
    else params.set(key, value)
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const clearFilters = () => router.push(pathname, { scroll: false })

  const { data: settings } = useDutySettings()
  const { data: entries, isLoading, error } = useDutyRegisterList({
    dateFrom,
    dateTo,
    dutyType,
    shift,
    attendanceStatus,
    memberName: search,
  })
  const { data: stats } = useDutyRegisterStats()
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

  const exportFileName = `duty-register-${new Date().toISOString().slice(0, 10)}`

  const handleExportCsv = () => {
    if (!entries?.length) return
    const rows = buildExportRows(entries, dutyTypes, shifts, attendanceStatuses)
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${exportFileName}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportExcel = async () => {
    if (!entries?.length) return
    const XLSX = await import("xlsx")
    const rows = buildExportRows(entries, dutyTypes, shifts, attendanceStatuses)
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: EXPORT_HEADERS })
    worksheet["!cols"] = EXPORT_HEADERS.map(() => ({ wch: 16 }))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Duty Register")
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`)
  }

  // Rendered via the browser's own print engine (not jsPDF) so Devanagari text displays correctly —
  // jsPDF's built-in fonts don't support Hindi glyphs without embedding a custom font file.
  const handleExportPdf = () => {
    if (!entries?.length) return
    const rows = buildExportRows(entries, dutyTypes, shifts, attendanceStatuses)
    const win = window.open("", "_blank")
    if (!win) return
    const tableRows = rows
      .map((r) => `<tr>${EXPORT_HEADERS.map((h) => `<td>${(r as any)[h] ?? ""}</td>`).join("")}</tr>`)
      .join("")
    win.document.write(`<!doctype html>
      <html lang="hi"><head><meta charset="utf-8" />
      <title>${exportFileName}</title>
      <style>
        body { font-family: "Noto Sans Devanagari", "Nirmala UI", sans-serif; padding: 24px; }
        h1 { font-size: 18px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background: #fdf0e3; }
        @media print { body { padding: 0; } }
      </style>
      </head><body>
      <h1>ड्यूटी रजिस्टर</h1>
      <table><thead><tr>${EXPORT_HEADERS.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${tableRows}</tbody></table>
      <script>window.onload = () => setTimeout(() => window.print(), 200)</script>
      </body></html>`)
    win.document.close()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-3 space-y-2">
          {/* Row 1: filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 shrink-0">से</span>
              <Input type="date" value={dateFrom} onChange={(e) => setParam("dateFrom", e.target.value)} className="w-34 h-8 text-xs" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 shrink-0">तक</span>
              <Input type="date" value={dateTo} onChange={(e) => setParam("dateTo", e.target.value)} className="w-34 h-8 text-xs" />
            </div>
            <Select value={dutyType} onValueChange={(v) => setParam("dutyType", v)}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="सभी स्थान" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी स्थान</SelectItem>
                {dutyTypes.map((t) => (
                  <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={shift} onValueChange={(v) => setParam("shift", v)}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue placeholder="सभी पाली" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी पाली</SelectItem>
                {shifts.map((s) => (
                  <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={attendanceStatus} onValueChange={(v) => setParam("attendanceStatus", v)}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="सभी उपस्थिति" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी उपस्थिति</SelectItem>
                {attendanceStatuses.map((s) => (
                  <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={search}
              onChange={(e) => setParam("search", e.target.value)}
              placeholder="नाम / शीर्षक"
              className="w-36 h-8 text-xs"
            />
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                <X className="w-3.5 h-3.5 mr-1" />
                साफ़ करें
              </Button>
            )}
          </div>

          {/* Row 2: view toggle + export + record */}
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="inline-flex rounded-md border bg-gray-50 p-0.5 gap-0.5">
              <Button
                size="sm"
                variant="ghost"
                className={`h-7 px-2 text-xs ${viewMode === "list" ? "bg-white shadow-sm text-orange-600" : "text-gray-500"}`}
                onClick={() => setParam("view", "list")}
              >
                <List className="w-3.5 h-3.5 mr-1" />
                सूची
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`h-7 px-2 text-xs ${viewMode === "week" ? "bg-white shadow-sm text-orange-600" : "text-gray-500"}`}
                onClick={() => setParam("view", "week")}
              >
                <CalendarRange className="w-3.5 h-3.5 mr-1" />
                सप्ताह
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`h-7 px-2 text-xs ${viewMode === "month" ? "bg-white shadow-sm text-orange-600" : "text-gray-500"}`}
                onClick={() => setParam("view", "month")}
              >
                <CalendarDays className="w-3.5 h-3.5 mr-1" />
                माह
              </Button>
            </div>

            <div className="flex-1" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={!entries?.length} className="h-8">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  निर्यात ({entries?.length ?? 0})
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCsv}>CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>Excel (.xlsx)</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPdf}>PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/mandir-admin/duty-register/register/new">
              <Button size="sm" className="h-8 bg-gradient-to-r from-orange-500 to-orange-600">
                <Plus className="w-3.5 h-3.5 mr-1" />
                रिकॉर्ड
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Calendar views */}
      {(viewMode === "month" || viewMode === "week") && (
        isLoading ? (
          <div className="py-16 text-center text-gray-500">
            <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
            लोड हो रहा है...
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

      {/* Table */}
      {viewMode === "list" && <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="py-16 text-center text-gray-500">
              <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
              लोड हो रहा है...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-500">डेटा लोड नहीं हो सका</div>
          ) : !entries?.length ? (
            <div className="py-16 text-center text-gray-500">कोई रिकॉर्ड नहीं मिला</div>
          ) : (
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
                {entries.map((entry) => {
                  const typeLabel = dutyTypes.find((t) => t.key === entry.dutyType)?.label || entry.dutyType
                  const shiftItem = shifts.find((s) => s.key === entry.shift)
                  const shiftLabel = shiftItem?.label || entry.shift
                  const shiftTiming = shiftItem?.start && shiftItem?.end ? `${shiftItem.start} – ${shiftItem.end}` : null
                  const attLabel =
                    attendanceStatuses.find((s) => s.key === entry.attendanceStatus)?.label || entry.attendanceStatus
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
                      <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">
                        {shiftTiming || "—"}
                      </td>
                      <td className="px-4 py-2">
                        <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">{attLabel}</span>
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        <Link href={`/mandir-admin/duty-register/register/${entry.id}/view`}>
                          <Button size="icon" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/mandir-admin/duty-register/register/${entry.id}/edit`}>
                          <Button size="icon" variant="ghost">
                            <Pencil className="w-4 h-4" />
                          </Button>
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
          )}
        </CardContent>
      </Card>}

      {ConfirmDialog}
    </div>
  )
}

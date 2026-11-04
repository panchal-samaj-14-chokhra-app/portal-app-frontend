"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Download, Loader2, X, ChevronDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useDutySettings } from "@/data-hooks/mutation-query/useDutySettings"
import { useDutyRegisterList } from "@/data-hooks/mutation-query/useDutyRegister"
import type { DutyRegisterEntry } from "@/data-hooks/requests/duty-register"

const EXPORT_HEADERS = ["तिथि", "स्थान", "पाली", "शीर्षक", "सदस्य", "सदस्य भूमिका", "उपस्थिति"]

type ExportRow = { [key: string]: string }

function buildExportRows(
  rows: DutyRegisterEntry[],
  dutyTypes: { key: string; label: string }[],
  shifts: { key: string; label: string }[],
  attendanceStatuses: { key: string; label: string }[]
): ExportRow[] {
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

function toCsv(rows: ExportRow[]) {
  const lines = [EXPORT_HEADERS.join(",")]
  for (const r of rows) {
    lines.push(EXPORT_HEADERS.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))
  }
  return lines.join("\n")
}

export default function DutyReportView() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

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
  const { data: entries, isLoading } = useDutyRegisterList({
    dateFrom, dateTo, dutyType, shift, attendanceStatus, memberName: search,
  })

  const dutyTypes = settings?.dutyTypes || []
  const shifts = settings?.shifts || []
  const attendanceStatuses = settings?.attendanceStatuses || []

  const exportFileName = `duty-report-${dateFrom || "all"}-${dateTo || "all"}`

  const buildReportParams = () => {
    const p = new URLSearchParams()
    if (dateFrom) p.set("dateFrom", dateFrom)
    if (dateTo) p.set("dateTo", dateTo)
    if (dutyType && dutyType !== "all") p.set("dutyType", dutyType)
    if (shift && shift !== "all") p.set("shift", shift)
    if (attendanceStatus && attendanceStatus !== "all") p.set("attendanceStatus", attendanceStatus)
    if (search) p.set("memberName", search)
    return p.toString()
  }

  const handleExportCsv = () => {
    if (!entries?.length) return
    const rows = buildExportRows(entries, dutyTypes, shifts, attendanceStatuses)
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = `${exportFileName}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportExcel = async () => {
    if (!entries?.length) return
    const XLSX = await import("xlsx")
    const rows = buildExportRows(entries, dutyTypes, shifts, attendanceStatuses)
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: EXPORT_HEADERS })
    worksheet["!cols"] = EXPORT_HEADERS.map(() => ({ wch: 16 }))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report")
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`)
  }

  const handleExportPdf = () => {
    if (!entries?.length) return
    const qs = buildReportParams()
    const base = process.env.NEXT_PUBLIC_REQUEST_URL || ""
    window.open(`${base}/duty-register/report/pdf${qs ? `?${qs}` : ""}`, "_blank")
  }

  // Summary stats
  const presentCount = (entries || []).filter(e => e.attendanceStatus?.toLowerCase().includes("present")).length
  const absentCount = (entries || []).filter(e => e.attendanceStatus?.toLowerCase().includes("absent")).length

  return (
    <div className="space-y-4">
      {/* Filter card */}
      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 shrink-0">से</span>
              <Input type="date" value={dateFrom} onChange={(e) => setParam("dateFrom", e.target.value)} className="w-36 h-8 text-xs" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 shrink-0">तक</span>
              <Input type="date" value={dateTo} onChange={(e) => setParam("dateTo", e.target.value)} className="w-36 h-8 text-xs" />
            </div>
            <Select value={dutyType} onValueChange={(v) => setParam("dutyType", v)}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="सभी स्थान" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी स्थान</SelectItem>
                {dutyTypes.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={shift} onValueChange={(v) => setParam("shift", v)}>
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="सभी पाली" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी पाली</SelectItem>
                {shifts.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={attendanceStatus} onValueChange={(v) => setParam("attendanceStatus", v)}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="सभी उपस्थिति" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी उपस्थिति</SelectItem>
                {attendanceStatuses.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              value={search} onChange={(e) => setParam("search", e.target.value)}
              placeholder="नाम / शीर्षक" className="w-36 h-8 text-xs"
            />
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                <X className="w-3.5 h-3.5 mr-1" />साफ़ करें
              </Button>
            )}
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
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      {!isLoading && entries && entries.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Card><CardContent className="p-3">
            <div className="text-xl font-bold text-orange-600">{entries.length}</div>
            <div className="text-xs text-gray-500">कुल रिकॉर्ड</div>
          </CardContent></Card>
          <Card><CardContent className="p-3">
            <div className="text-xl font-bold text-green-600">{presentCount}</div>
            <div className="text-xs text-gray-500">उपस्थित</div>
          </CardContent></Card>
          <Card><CardContent className="p-3">
            <div className="text-xl font-bold text-red-500">{absentCount}</div>
            <div className="text-xs text-gray-500">अनुपस्थित</div>
          </CardContent></Card>
        </div>
      )}

      {/* Results table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="py-16 text-center text-gray-500">
              <Loader2 className="w-5 h-5 inline animate-spin mr-2" />लोड हो रहा है...
            </div>
          ) : !hasFilters ? (
            <div className="py-16 text-center text-gray-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm">फ़िल्टर लगाएं और रिपोर्ट देखें</p>
            </div>
          ) : !entries?.length ? (
            <div className="py-16 text-center text-gray-500">कोई रिकॉर्ड नहीं मिला</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-4 py-2">तिथि</th>
                  <th className="px-4 py-2">स्थान / पाली</th>
                  <th className="px-4 py-2">सदस्य</th>
                  <th className="px-4 py-2">उपस्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entries.map((entry) => {
                  const typeLabel = dutyTypes.find((t) => t.key === entry.dutyType)?.label || entry.dutyType
                  const shiftItem = shifts.find((s) => s.key === entry.shift)
                  const attLabel = attendanceStatuses.find((s) => s.key === entry.attendanceStatus)?.label || entry.attendanceStatus
                  const isPresent = entry.attendanceStatus?.toLowerCase().includes("present")
                  const isAbsent = entry.attendanceStatus?.toLowerCase().includes("absent")
                  return (
                    <tr key={entry.id} className="hover:bg-orange-50/40">
                      <td className="px-4 py-2 whitespace-nowrap text-xs">{entry.dutyDate}</td>
                      <td className="px-4 py-2">
                        <div className="text-sm">{typeLabel}</div>
                        <div className="text-xs text-gray-400">{shiftItem?.label || entry.shift}
                          {shiftItem?.start && shiftItem?.end && <span className="text-orange-500 ml-1">· {shiftItem.start}–{shiftItem.end}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div>{entry.memberName}</div>
                        {entry.memberRole && <div className="text-xs text-gray-400">{entry.memberRole}</div>}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${isPresent ? "bg-green-100 text-green-700" : isAbsent ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-700"}`}>
                          {attLabel}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

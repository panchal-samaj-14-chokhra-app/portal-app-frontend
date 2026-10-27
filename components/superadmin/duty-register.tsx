"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft, CalendarDays, Check, ClipboardList, Download, Loader2,
  Pencil, Plus, Search, Trash2, UserCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useDutyList, useDutyStats, useCreateDuty, useUpdateDuty, useDeleteDuty } from "@/data-hooks/mutation-query/useDutyRegister"
import type { DutyEntry, DutyStatus, AttendanceStatus } from "@/data-hooks/requests/duty-register"

const DUTY_TYPES = ["Pooja", "Aarti", "Cleaning", "Security", "Prasad", "Management", "Other"] as const
const DUTY_TYPE_HI: Record<string, string> = {
  Pooja: "पूजा", Aarti: "आरती", Cleaning: "सफाई", Security: "सुरक्षा",
  Prasad: "प्रसाद वितरण", Management: "प्रबंधन", Other: "अन्य",
}
const SHIFTS = ["Morning", "Afternoon", "Evening", "Night"] as const
const SHIFT_HI: Record<string, string> = { Morning: "सुबह", Afternoon: "दोपहर", Evening: "शाम", Night: "रात" }
const ROLES = ["Priest", "Volunteer", "Security", "Cleaner", "Manager"] as const
const ROLE_HI: Record<string, string> = {
  Priest: "पुजारी", Volunteer: "स्वयंसेवक", Security: "सुरक्षाकर्मी",
  Cleaner: "सफाईकर्मी", Manager: "प्रबंधक",
}
const DUTY_STATUSES: DutyStatus[] = ["Assigned", "InProgress", "Completed", "Cancelled"]
const DUTY_STATUS_HI: Record<DutyStatus, string> = {
  Assigned: "आवंटित", InProgress: "प्रगति में", Completed: "पूर्ण", Cancelled: "रद्द",
}
const DUTY_STATUS_BADGE: Record<DutyStatus, string> = {
  Assigned: "bg-blue-100 text-blue-800",
  InProgress: "bg-amber-100 text-amber-800",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
}
const ATTENDANCE_STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late", "Leave"]
const ATTENDANCE_HI: Record<AttendanceStatus, string> = {
  Present: "उपस्थित", Absent: "अनुपस्थित", Late: "देरी से", Leave: "अवकाश",
}
const ATTENDANCE_BADGE: Record<AttendanceStatus, string> = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  Late: "bg-amber-100 text-amber-800",
  Leave: "bg-gray-100 text-gray-700",
}

const todayIST = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
const fld = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

type DlgState = { mode: "closed" } | { mode: "add" } | { mode: "edit"; entry: DutyEntry }

export default function DutyRegister() {
  const { toast } = useToast()
  const today = todayIST()

  const [dateFilter, setDateFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [shiftFilter, setShiftFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [attFilter, setAttFilter] = useState("all")
  const [q, setQ] = useState("")
  const [dlg, setDlg] = useState<DlgState>({ mode: "closed" })

  const params = useMemo(() => {
    const p: Record<string, string> = {}
    if (dateFilter) p.date = dateFilter
    if (typeFilter !== "all") p.dutyType = typeFilter
    if (shiftFilter !== "all") p.shift = shiftFilter
    if (statusFilter !== "all") p.dutyStatus = statusFilter
    if (attFilter !== "all") p.attendanceStatus = attFilter
    return p
  }, [dateFilter, typeFilter, shiftFilter, statusFilter, attFilter])

  const { data, isLoading, error } = useDutyList(params)
  const { data: statsData } = useDutyStats()
  const createM = useCreateDuty()
  const updateM = useUpdateDuty()
  const deleteM = useDeleteDuty()

  const saving = createM.isPending || updateM.isPending || deleteM.isPending

  const rows: DutyEntry[] = useMemo(() => {
    const list = data?.data || []
    if (!q.trim()) return list
    const needle = q.trim().toLowerCase()
    return list.filter((r) =>
      `${r.memberName} ${r.title} ${r.dutyType}`.toLowerCase().includes(needle),
    )
  }, [data, q])

  const stats = statsData?.data

  const exportCsv = () => {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
    const lines = [
      ["तिथि", "प्रकार", "शीर्षक", "पाली", "सदस्य", "भूमिका", "आवंटित", "अनुसूचित प्रारंभ", "अनुसूचित समाप्ति",
        "वास्तविक चेकइन", "वास्तविक चेकआउट", "उपस्थिति", "ड्यूटी स्थिति", "टिप्पणी", "सत्यापनकर्ता"].map(esc).join(","),
      ...rows.map((r) =>
        [r.dutyDate, DUTY_TYPE_HI[r.dutyType] || r.dutyType, r.title, SHIFT_HI[r.shift] || r.shift,
          r.memberName, r.memberRole ? (ROLE_HI[r.memberRole] || r.memberRole) : "",
          r.assignedBy || "", r.scheduledStart || "", r.scheduledEnd || "",
          r.actualCheckin || "", r.actualCheckout || "",
          ATTENDANCE_HI[r.attendanceStatus], DUTY_STATUS_HI[r.dutyStatus],
          r.remarks || "", r.verifiedBy || ""].map(esc).join(","),
      ),
    ]
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `duty-register-${dateFilter || today}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (error) return <p className="py-10 text-center text-red-600">डेटा लोड नहीं हो सका: {(error as Error).message}</p>

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "कुल", value: stats?.total, icon: ClipboardList, color: "text-gray-700" },
          { label: "आज", value: stats?.today, icon: CalendarDays, color: "text-blue-700" },
          { label: "आवंटित (लंबित)", value: stats?.pending, icon: UserCheck, color: "text-amber-700" },
          { label: "पूर्ण", value: stats?.completed, icon: Check, color: "text-green-700" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-orange-200/60 bg-white/90">
            <CardContent className="flex items-center gap-3 p-3">
              <Icon className={`h-5 w-5 ${color}`} />
              <div>
                <p className="text-xl font-bold text-gray-900">{value ?? "…"}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-orange-200/60 bg-white/90">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center text-orange-700">
              <ClipboardList className="mr-2 h-5 w-5" />
              ड्यूटी रजिस्टर
            </CardTitle>
            <Button size="sm" onClick={() => setDlg({ mode: "add" })} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-1 h-4 w-4" />नई ड्यूटी
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="तिथि"
            />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="प्रकार">
              <option value="all">सभी प्रकार</option>
              {DUTY_TYPES.map((t) => <option key={t} value={t}>{DUTY_TYPE_HI[t]}</option>)}
            </select>
            <select value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="पाली">
              <option value="all">सभी पाली</option>
              {SHIFTS.map((s) => <option key={s} value={s}>{SHIFT_HI[s]}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="ड्यूटी स्थिति">
              <option value="all">सभी स्थिति</option>
              {DUTY_STATUSES.map((s) => <option key={s} value={s}>{DUTY_STATUS_HI[s]}</option>)}
            </select>
            <select value={attFilter} onChange={(e) => setAttFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="उपस्थिति">
              <option value="all">सभी उपस्थिति</option>
              {ATTENDANCE_STATUSES.map((s) => <option key={s} value={s}>{ATTENDANCE_HI[s]}</option>)}
            </select>
            <div className="relative flex-1 min-w-[160px]">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="नाम या शीर्षक से खोजें" className="pl-8" />
            </div>
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={rows.length === 0} className="h-10">
              <Download className="mr-1.5 h-4 w-4" />CSV ({rows.length})
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-14">
              <Loader2 className="h-7 w-7 animate-spin text-orange-600" />
            </div>
          ) : rows.length === 0 ? (
            <p className="py-10 text-center text-gray-500">कोई ड्यूटी रिकॉर्ड नहीं मिला।</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-orange-50 text-left text-xs uppercase text-gray-600">
                  <tr>
                    <th className="p-2.5">तिथि</th>
                    <th className="p-2.5">प्रकार / पाली</th>
                    <th className="p-2.5">शीर्षक</th>
                    <th className="p-2.5">सदस्य</th>
                    <th className="p-2.5">समय</th>
                    <th className="p-2.5">उपस्थिति</th>
                    <th className="p-2.5">स्थिति</th>
                    <th className="p-2.5 text-right">कार्य</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-orange-50/30">
                      <td className="whitespace-nowrap p-2.5 font-medium">{r.dutyDate}</td>
                      <td className="p-2.5">
                        <div className="font-medium">{DUTY_TYPE_HI[r.dutyType] || r.dutyType}</div>
                        <div className="text-xs text-gray-500">{SHIFT_HI[r.shift] || r.shift}</div>
                      </td>
                      <td className="max-w-[160px] truncate p-2.5">{r.title}</td>
                      <td className="p-2.5">
                        <div>{r.memberName}</div>
                        {r.memberRole && <div className="text-xs text-gray-500">{ROLE_HI[r.memberRole] || r.memberRole}</div>}
                      </td>
                      <td className="p-2.5 text-xs text-gray-600">
                        {r.scheduledStart && <div>अनुसूचित: {r.scheduledStart}–{r.scheduledEnd || "?"}</div>}
                        {r.actualCheckin && <div>वास्तविक: {r.actualCheckin}–{r.actualCheckout || "?"}</div>}
                      </td>
                      <td className="p-2.5">
                        <Badge className={`border-transparent ${ATTENDANCE_BADGE[r.attendanceStatus]}`}>
                          {ATTENDANCE_HI[r.attendanceStatus]}
                        </Badge>
                      </td>
                      <td className="p-2.5">
                        <Badge className={`border-transparent ${DUTY_STATUS_BADGE[r.dutyStatus]}`}>
                          {DUTY_STATUS_HI[r.dutyStatus]}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap p-2.5 text-right">
                        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setDlg({ mode: "edit", entry: r })} aria-label="संपादित करें">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <DutyDialog
        state={dlg}
        today={today}
        saving={saving}
        onClose={() => setDlg({ mode: "closed" })}
        onCreate={(p) =>
          createM.mutate(p, {
            onSuccess: () => { toast({ title: "ड्यूटी सहेजी गई", variant: "success" }); setDlg({ mode: "closed" }) },
            onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
          })
        }
        onUpdate={(id, p) =>
          updateM.mutate({ id, payload: p }, {
            onSuccess: () => { toast({ title: "ड्यूटी अपडेट हुई", variant: "success" }); setDlg({ mode: "closed" }) },
            onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
          })
        }
        onDelete={(id) =>
          deleteM.mutate(id, {
            onSuccess: () => { toast({ title: "हटा दिया गया", variant: "success" }); setDlg({ mode: "closed" }) },
            onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
          })
        }
      />
    </div>
  )
}

function DutyDialog({ state, today, saving, onClose, onCreate, onUpdate, onDelete }: {
  state: DlgState
  today: string
  saving: boolean
  onClose: () => void
  onCreate: (p: Partial<DutyEntry>) => void
  onUpdate: (id: string, p: Partial<DutyEntry>) => void
  onDelete: (id: string) => void
}) {
  const open = state.mode !== "closed"
  const key = state.mode === "edit" ? state.entry.id : state.mode
  return (
    <Dialog open={open} onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {open && (
          <DutyForm
            key={key}
            entry={state.mode === "edit" ? state.entry : null}
            today={today}
            saving={saving}
            onClose={onClose}
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function DutyForm({ entry, today, saving, onClose, onCreate, onUpdate, onDelete }: {
  entry: DutyEntry | null
  today: string
  saving: boolean
  onClose: () => void
  onCreate: (p: Partial<DutyEntry>) => void
  onUpdate: (id: string, p: Partial<DutyEntry>) => void
  onDelete: (id: string) => void
}) {
  const [dutyDate, setDutyDate] = useState(entry?.dutyDate || today)
  const [dutyType, setDutyType] = useState(entry?.dutyType || "Pooja")
  const [title, setTitle] = useState(entry?.title || "")
  const [shift, setShift] = useState(entry?.shift || "Morning")
  const [memberName, setMemberName] = useState(entry?.memberName || "")
  const [memberRole, setMemberRole] = useState(entry?.memberRole || "")
  const [assignedBy, setAssignedBy] = useState(entry?.assignedBy || "")
  const [scheduledStart, setScheduledStart] = useState(entry?.scheduledStart || "")
  const [scheduledEnd, setScheduledEnd] = useState(entry?.scheduledEnd || "")
  const [actualCheckin, setActualCheckin] = useState(entry?.actualCheckin || "")
  const [actualCheckout, setActualCheckout] = useState(entry?.actualCheckout || "")
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>(entry?.attendanceStatus || "Present")
  const [dutyStatus, setDutyStatus] = useState<DutyStatus>(entry?.dutyStatus || "Assigned")
  const [remarks, setRemarks] = useState(entry?.remarks || "")
  const [verifiedBy, setVerifiedBy] = useState(entry?.verifiedBy || "")
  const [err, setErr] = useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    if (!dutyDate) return setErr("तिथि आवश्यक है")
    if (!title.trim()) return setErr("शीर्षक आवश्यक है")
    if (!memberName.trim()) return setErr("सदस्य का नाम आवश्यक है")
    const payload: Partial<DutyEntry> = {
      dutyDate, dutyType, title: title.trim(), shift,
      memberName: memberName.trim(), memberRole: memberRole || null,
      assignedBy: assignedBy || null,
      scheduledStart: scheduledStart || null, scheduledEnd: scheduledEnd || null,
      actualCheckin: actualCheckin || null, actualCheckout: actualCheckout || null,
      attendanceStatus, dutyStatus,
      remarks: remarks.trim() || null,
      verifiedBy: verifiedBy.trim() || null,
    }
    if (entry) onUpdate(entry.id, payload)
    else onCreate(payload)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-orange-700">
          {entry ? "ड्यूटी संपादित करें" : "नई ड्यूटी जोड़ें"}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">तिथि *</label>
          <input type="date" required value={dutyDate} onChange={(e) => setDutyDate(e.target.value)} className={fld} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">पाली *</label>
          <select value={shift} onChange={(e) => setShift(e.target.value)} className={fld}>
            {SHIFTS.map((s) => <option key={s} value={s}>{SHIFT_HI[s]}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">ड्यूटी प्रकार *</label>
          <select value={dutyType} onChange={(e) => setDutyType(e.target.value)} className={fld}>
            {DUTY_TYPES.map((t) => <option key={t} value={t}>{DUTY_TYPE_HI[t]}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">शीर्षक *</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="जैसे: प्रातः आरती" required maxLength={120} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">सदस्य का नाम *</label>
          <Input value={memberName} onChange={(e) => setMemberName(e.target.value)} placeholder="नाम" required maxLength={80} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">भूमिका</label>
          <select value={memberRole} onChange={(e) => setMemberRole(e.target.value)} className={fld}>
            <option value="">— चुनें —</option>
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_HI[r]}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">आवंटित किसने किया</label>
        <Input value={assignedBy} onChange={(e) => setAssignedBy(e.target.value)} placeholder="प्रभारी / व्यवस्थापक का नाम" maxLength={80} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">अनुसूचित प्रारंभ</label>
          <input type="time" value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} className={fld} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">अनुसूचित समाप्ति</label>
          <input type="time" value={scheduledEnd} onChange={(e) => setScheduledEnd(e.target.value)} className={fld} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">वास्तविक चेकइन</label>
          <input type="time" value={actualCheckin} onChange={(e) => setActualCheckin(e.target.value)} className={fld} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">वास्तविक चेकआउट</label>
          <input type="time" value={actualCheckout} onChange={(e) => setActualCheckout(e.target.value)} className={fld} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">उपस्थिति</label>
          <select value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value as AttendanceStatus)} className={fld}>
            {ATTENDANCE_STATUSES.map((s) => <option key={s} value={s}>{ATTENDANCE_HI[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">ड्यूटी स्थिति</label>
          <select value={dutyStatus} onChange={(e) => setDutyStatus(e.target.value as DutyStatus)} className={fld}>
            {DUTY_STATUSES.map((s) => <option key={s} value={s}>{DUTY_STATUS_HI[s]}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">टिप्पणी / विवरण</label>
        <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} maxLength={500} placeholder="कार्य का विवरण या आंतरिक नोट" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">सत्यापनकर्ता (Verified By)</label>
        <Input value={verifiedBy} onChange={(e) => setVerifiedBy(e.target.value)} placeholder="पर्यवेक्षक का नाम" maxLength={80} />
      </div>

      {err && <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

      <DialogFooter className="gap-2 sm:justify-between">
        {entry ? (
          <Button
            type="button"
            variant="ghost"
            className="text-red-600 hover:text-red-700"
            disabled={saving}
            onClick={() => window.confirm("क्या आप इस ड्यूटी रिकॉर्ड को हटाना चाहते हैं?") && onDelete(entry.id)}
          >
            <Trash2 className="mr-1 h-4 w-4" />हटाएँ
          </Button>
        ) : <span />}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>रद्द करें</Button>
          <Button type="submit" disabled={saving} className="bg-orange-600 hover:bg-orange-700">
            {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}सहेजें
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}

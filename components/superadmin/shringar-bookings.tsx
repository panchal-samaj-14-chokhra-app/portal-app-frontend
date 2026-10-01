"use client"

import { useMemo, useState } from "react"
import { signOut } from "next-auth/react"
import { Ban, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Download, List, Loader2, Pencil, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { SessionExpiredError, type Booking } from "@/data-hooks/requests/shringar"
import {
  useBlockDates,
  useCreateBooking,
  useDeleteBooking,
  useShringarBookings,
  useUpdateBooking,
} from "@/data-hooks/mutation-query/useShringar"

const MONTHS = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"]
const WEEKDAYS = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]
const MONTHS_AHEAD = 24 // 2 years

const STATUS: Record<string, { label: string; badge: string; cell: string }> = {
  pending: { label: "प्रतीक्षा में", badge: "bg-amber-100 text-amber-800", cell: "bg-amber-50 border-amber-300 text-amber-900" },
  confirmed: { label: "पुष्ट", badge: "bg-green-100 text-green-700", cell: "bg-green-50 border-green-300 text-green-900" },
  blocked: { label: "बंद", badge: "bg-gray-200 text-gray-700", cell: "bg-gray-100 border-gray-300 text-gray-600" },
  cancelled: { label: "रद्द", badge: "bg-red-100 text-red-700", cell: "" },
}

const pad = (n: number) => String(n).padStart(2, "0")
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`
const todayIST = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
const prettyDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}
const addDays = (s: string, n: number) => {
  const d = new Date(`${s}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

type DialogState =
  | { mode: "closed" }
  | { mode: "add"; date: string }
  | { mode: "edit"; booking: Booking }
  | { mode: "block" }

const fieldClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export default function ShringarBookings() {
  const { toast } = useToast()
  const { data, isLoading, error } = useShringarBookings()
  const createM = useCreateBooking()
  const updateM = useUpdateBooking()
  const deleteM = useDeleteBooking()
  const blockM = useBlockDates()

  const today = todayIST()
  const bookings: Booking[] = data?.data || []
  const maxDate = data?.window?.to || addDays(today, 730)

  const [view, setView] = useState<"calendar" | "list">("calendar")
  const [monthIdx, setMonthIdx] = useState(0)
  const [dlg, setDlg] = useState<DialogState>({ mode: "closed" })

  // list filters
  const [q, setQ] = useState("")
  const [statusFilter, setStatusFilter] = useState("active")
  const [scope, setScope] = useState<"upcoming" | "all">("upcoming")

  const active = useMemo(() => bookings.filter((b) => b.status !== "cancelled"), [bookings])
  const byDate = useMemo(() => new Map(active.map((b) => [b.date, b])), [active])
  const upcoming = active.filter((b) => b.date >= today)
  const counts = {
    pending: upcoming.filter((b) => b.status === "pending").length,
    confirmed: upcoming.filter((b) => b.status === "confirmed").length,
    blocked: upcoming.filter((b) => b.status === "blocked").length,
  }

  const months = useMemo(() => {
    const [y, m] = today.split("-").map(Number)
    return Array.from({ length: MONTHS_AHEAD + 1 }, (_, i) => {
      const d = new Date(Date.UTC(y, m - 1 + i, 1))
      return { y: d.getUTCFullYear(), m: d.getUTCMonth() }
    })
  }, [today])

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return bookings
      .filter((b) => (scope === "upcoming" ? b.date >= today : true))
      .filter((b) => (statusFilter === "active" ? b.status !== "cancelled" : statusFilter === "all" ? true : b.status === statusFilter))
      .filter((b) => !needle || `${b.name} ${b.phone || ""} ${b.email || ""}`.toLowerCase().includes(needle))
  }, [bookings, q, statusFilter, scope, today])

  const exportCsv = () => {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
    const lines = [
      ["तिथि", "नाम", "मोबाइल", "ईमेल", "स्थिति", "स्रोत", "टिप्पणी", "अनुरोध की तिथि"].map(esc).join(","),
      ...rows.map((b) =>
        [b.date, b.name, b.phone, b.email, STATUS[b.status]?.label, b.source === "website" ? "वेबसाइट" : "एडमिन", b.note, b.createdAt?.slice(0, 10)]
          .map(esc)
          .join(","),
      ),
    ]
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `shringar-bookings-${today}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const quickStatus = (b: Booking, status: Booking["status"]) =>
    updateM.mutate(
      { id: b.id, payload: { status } },
      {
        onSuccess: () => toast({ title: status === "confirmed" ? "बुकिंग पुष्ट की गई" : "बुकिंग रद्द की गई", variant: "success" }),
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
      },
    )

  if (error instanceof SessionExpiredError) {
    return (
      <Card className="border-orange-200/60 bg-white/90">
        <CardContent className="space-y-3 py-8 text-center">
          <p className="font-medium text-gray-800">{error.message}</p>
          <p className="text-sm text-gray-500">सुरक्षा के लिए बुकिंग डेटा देखने हेतु लॉगिन आवश्यक है।</p>
          <Button onClick={() => signOut({ callbackUrl: "/login" })} className="bg-orange-600 hover:bg-orange-700">
            फिर से लॉगिन करें
          </Button>
        </CardContent>
      </Card>
    )
  }
  if (error) {
    return <p className="py-10 text-center text-red-600">बुकिंग लोड नहीं हो सकी: {(error as Error).message}</p>
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-orange-600" />
      </div>
    )
  }

  const cur = months[monthIdx]
  const firstWd = new Date(Date.UTC(cur.y, cur.m, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(cur.y, cur.m + 1, 0)).getUTCDate()
  const cells: (number | null)[] = [...Array(firstWd).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const openDate = (date: string) => {
    const b = byDate.get(date)
    setDlg(b ? { mode: "edit", booking: b } : { mode: "add", date })
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { k: "pending", n: counts.pending, t: "प्रतीक्षा में" },
          { k: "confirmed", n: counts.confirmed, t: "पुष्ट" },
          { k: "blocked", n: counts.blocked, t: "बंद तिथियाँ" },
        ].map((c) => (
          <Card key={c.k} className="border-orange-200/60 bg-white/90">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{c.n}</p>
              <p className="text-xs text-gray-500">{c.t} (आगामी)</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-orange-200/60 bg-white/90">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center text-orange-700">
              <CalendarDays className="mr-2 h-5 w-5" />
              श्रृंगार बुकिंग
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex rounded-md border border-orange-200 p-0.5">
                <Button size="sm" variant={view === "calendar" ? "default" : "ghost"} onClick={() => setView("calendar")} className={view === "calendar" ? "bg-orange-600 hover:bg-orange-700" : ""}>
                  <CalendarDays className="mr-1 h-4 w-4" />कैलेंडर
                </Button>
                <Button size="sm" variant={view === "list" ? "default" : "ghost"} onClick={() => setView("list")} className={view === "list" ? "bg-orange-600 hover:bg-orange-700" : ""}>
                  <List className="mr-1 h-4 w-4" />सूची
                </Button>
              </div>
              <Button size="sm" variant="outline" onClick={() => setDlg({ mode: "add", date: addDays(today, 1) })}>
                <CalendarPlus className="mr-1 h-4 w-4" />बुकिंग जोड़ें
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDlg({ mode: "block" })}>
                <Ban className="mr-1 h-4 w-4" />तिथि बंद करें
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {view === "calendar" ? (
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <Button size="sm" variant="outline" onClick={() => setMonthIdx((i) => Math.max(0, i - 1))} disabled={monthIdx === 0} aria-label="पिछला महीना">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {MONTHS[cur.m]} {cur.y}
                  </h3>
                  <select
                    aria-label="महीना चुनें"
                    value={monthIdx}
                    onChange={(e) => setMonthIdx(Number(e.target.value))}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {months.map((mo, i) => (
                      <option key={i} value={i}>
                        {MONTHS[mo.m]} {mo.y}
                      </option>
                    ))}
                  </select>
                </div>
                <Button size="sm" variant="outline" onClick={() => setMonthIdx((i) => Math.min(months.length - 1, i + 1))} disabled={monthIdx === months.length - 1} aria-label="अगला महीना">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="py-1">
                    {w}
                  </div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {cells.map((d, i) => {
                  if (d === null) return <div key={`b${i}`} />
                  const date = ymd(cur.y, cur.m, d)
                  const b = byDate.get(date)
                  const past = date < today
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => openDate(date)}
                      aria-label={`${prettyDate(date)}${b ? ` — ${STATUS[b.status].label}: ${b.name}` : " — खाली"}`}
                      className={`min-h-[3.75rem] rounded-md border p-1 text-left transition hover:shadow sm:min-h-[4.5rem] ${
                        b ? STATUS[b.status].cell : past ? "border-transparent bg-gray-50 text-gray-400" : "border-gray-200 bg-white text-gray-800 hover:border-orange-400"
                      }`}
                    >
                      <span className="block text-xs font-semibold sm:text-sm">{d}</span>
                      {b && <span className="mt-0.5 block truncate text-[10px] leading-tight sm:text-xs">{b.status === "blocked" ? `बंद${b.name !== "तिथि बंद" ? ` · ${b.name}` : ""}` : b.name}</span>}
                    </button>
                  )
                })}
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                {["pending", "confirmed", "blocked"].map((k) => (
                  <span key={k} className="flex items-center gap-1.5">
                    <span className={`h-3.5 w-3.5 rounded border ${STATUS[k].cell}`} />
                    {STATUS[k].label}
                  </span>
                ))}
                <span className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 rounded border border-gray-200 bg-white" /> खाली (क्लिक करके जोड़ें)
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="नाम, मोबाइल या ईमेल से खोजें" className="pl-8" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="स्थिति">
                  <option value="active">सक्रिय (रद्द को छोड़कर)</option>
                  <option value="pending">प्रतीक्षा में</option>
                  <option value="confirmed">पुष्ट</option>
                  <option value="blocked">बंद</option>
                  <option value="cancelled">रद्द</option>
                  <option value="all">सभी</option>
                </select>
                <select value={scope} onChange={(e) => setScope(e.target.value as "upcoming" | "all")} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="अवधि">
                  <option value="upcoming">आगामी तिथियाँ</option>
                  <option value="all">सभी तिथियाँ</option>
                </select>
                <Button type="button" variant="outline" onClick={exportCsv} disabled={rows.length === 0}>
                  <Download className="mr-1.5 h-4 w-4" />CSV ({rows.length})
                </Button>
              </div>

              {rows.length === 0 ? (
                <p className="py-10 text-center text-gray-500">कोई बुकिंग नहीं मिली।</p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead className="bg-orange-50 text-left text-xs uppercase text-gray-600">
                      <tr>
                        <th className="p-2.5">तिथि</th>
                        <th className="p-2.5">नाम</th>
                        <th className="p-2.5">मोबाइल</th>
                        <th className="p-2.5">ईमेल</th>
                        <th className="p-2.5">स्थिति</th>
                        <th className="p-2.5">स्रोत</th>
                        <th className="p-2.5 text-right">कार्य</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {rows.map((b) => (
                        <tr key={b.id} className={b.status === "pending" ? "bg-amber-50/50" : ""}>
                          <td className="whitespace-nowrap p-2.5 font-medium">{prettyDate(b.date)}</td>
                          <td className="p-2.5">{b.status === "blocked" ? <span className="text-gray-500">{b.name}</span> : b.name}</td>
                          <td className="p-2.5">{b.phone ? <a href={`tel:${b.phone}`} className="text-orange-700 hover:underline">{b.phone}</a> : "—"}</td>
                          <td className="max-w-[10rem] truncate p-2.5">{b.email || "—"}</td>
                          <td className="p-2.5">
                            <Badge className={`border-transparent ${STATUS[b.status].badge}`}>{STATUS[b.status].label}</Badge>
                          </td>
                          <td className="p-2.5 text-xs text-gray-500">{b.source === "website" ? "वेबसाइट" : "एडमिन"}</td>
                          <td className="whitespace-nowrap p-2.5 text-right">
                            {b.status === "pending" && (
                              <Button size="sm" variant="outline" className="mr-1 h-7 border-green-300 px-2 text-green-700" onClick={() => quickStatus(b, "confirmed")}>
                                पुष्टि
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setDlg({ mode: "edit", booking: b })} aria-label="संपादित करें">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <BookingDialog
        state={dlg}
        today={today}
        maxDate={maxDate}
        onClose={() => setDlg({ mode: "closed" })}
        saving={createM.isPending || updateM.isPending || deleteM.isPending || blockM.isPending}
        onCreate={(p) =>
          createM.mutate(p, {
            onSuccess: () => {
              toast({ title: "सहेजा गया", variant: "success" })
              setDlg({ mode: "closed" })
            },
            onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
          })
        }
        onUpdate={(id, p) =>
          updateM.mutate(
            { id, payload: p },
            {
              onSuccess: () => {
                toast({ title: "सहेजा गया", variant: "success" })
                setDlg({ mode: "closed" })
              },
              onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
            },
          )
        }
        onDelete={(id) =>
          deleteM.mutate(id, {
            onSuccess: () => {
              toast({ title: "हटा दिया गया", variant: "success" })
              setDlg({ mode: "closed" })
            },
            onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
          })
        }
        onBlock={(dates, note) =>
          blockM.mutate(
            { dates, note },
            {
              onSuccess: (r) => {
                const { created, skipped } = r.data
                toast({
                  title: `${created.length} तिथियाँ बंद की गईं`,
                  description: skipped.length ? `${skipped.length} तिथियाँ छोड़ी गईं (पहले से बुक/बंद या सीमा से बाहर)` : undefined,
                  variant: "success",
                })
                setDlg({ mode: "closed" })
              },
              onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
            },
          )
        }
      />
    </div>
  )
}

function BookingDialog({
  state,
  today,
  maxDate,
  saving,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onBlock,
}: {
  state: DialogState
  today: string
  maxDate: string
  saving: boolean
  onClose: () => void
  onCreate: (p: Partial<Booking>) => void
  onUpdate: (id: string, p: Partial<Booking>) => void
  onDelete: (id: string) => void
  onBlock: (dates: string[], note: string) => void
}) {
  const open = state.mode !== "closed"
  // key remounts the form whenever a different booking/date is opened, so fields always start fresh
  const key = state.mode === "edit" ? state.booking.id : state.mode === "add" ? `add-${state.date}` : state.mode
  return (
    <Dialog open={open} onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        {open && <DialogForm key={key} state={state} today={today} maxDate={maxDate} saving={saving} onClose={onClose} onCreate={onCreate} onUpdate={onUpdate} onDelete={onDelete} onBlock={onBlock} />}
      </DialogContent>
    </Dialog>
  )
}

function DialogForm({ state, today, maxDate, saving, onClose, onCreate, onUpdate, onDelete, onBlock }: any) {
  const editing: Booking | null = state.mode === "edit" ? state.booking : null
  const [date, setDate] = useState<string>(editing?.date || (state.mode === "add" ? state.date : addDays(today, 1)))
  const [toDate, setToDate] = useState<string>(addDays(today, 1))
  const [name, setName] = useState(editing?.name || "")
  const [phone, setPhone] = useState(editing?.phone || "")
  const [email, setEmail] = useState(editing?.email || "")
  const [status, setStatus] = useState<string>(editing?.status || (state.mode === "block" ? "blocked" : "confirmed"))
  const [note, setNote] = useState(editing?.note || "")
  const [err, setErr] = useState("")

  const isBlock = status === "blocked"

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    if (state.mode === "block") {
      if (toDate < date) return setErr("अंतिम तिथि शुरुआती तिथि से पहले नहीं हो सकती")
      const dates: string[] = []
      for (let d = date; d <= toDate && dates.length <= 62; d = addDays(d, 1)) dates.push(d)
      if (dates.length > 62) return setErr("एक बार में अधिकतम 62 तिथियाँ बंद की जा सकती हैं")
      return onBlock(dates, name)
    }
    if (!isBlock && name.trim().length < 2) return setErr("कृपया नाम दर्ज करें")
    const payload: Partial<Booking> = { date, name, phone: isBlock ? null : phone, email: isBlock ? null : email, status: status as Booking["status"], note }
    if (editing) onUpdate(editing.id, payload)
    else onCreate(payload)
  }

  const title = state.mode === "block" ? "तिथियाँ बंद करें" : editing ? "बुकिंग संपादित करें" : "नई बुकिंग जोड़ें"

  return (
    <form onSubmit={submit} className="space-y-3">
      <DialogHeader>
        <DialogTitle className="text-orange-700">{title}</DialogTitle>
      </DialogHeader>

      {editing && (
        <p className="text-xs text-gray-500">
          {editing.source === "website" ? "वेबसाइट से प्राप्त अनुरोध" : "एडमिन द्वारा जोड़ा गया"} · {new Date(editing.createdAt).toLocaleString("hi-IN")}
        </p>
      )}

      {state.mode === "block" ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">से (तिथि)</label>
            <input type="date" required value={date} min={today} max={maxDate} onChange={(e) => setDate(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">तक (तिथि)</label>
            <input type="date" required value={toDate} min={date} max={maxDate} onChange={(e) => setToDate(e.target.value)} className={fieldClass} />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">कारण (वैकल्पिक, जनता को नहीं दिखेगा)</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="जैसे: नवरात्रि — ट्रस्ट द्वारा श्रृंगार" maxLength={80} />
          </div>
          <p className="col-span-2 text-xs text-gray-500">पहले से बुक या बंद तिथियाँ छोड़ दी जाएँगी।</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">तिथि</label>
              <input type="date" required value={date} min={editing ? undefined : today} max={maxDate} onChange={(e) => setDate(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">स्थिति</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
                <option value="pending">प्रतीक्षा में</option>
                <option value="confirmed">पुष्ट</option>
                <option value="blocked">बंद (उपलब्ध नहीं)</option>
                {editing && <option value="cancelled">रद्द (तिथि खाली होगी)</option>}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{isBlock ? "कारण" : "नाम"}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={isBlock ? "जैसे: ट्रस्ट श्रृंगार" : "भक्त का नाम"} maxLength={80} />
          </div>
          {!isBlock && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">मोबाइल</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" placeholder="10 अंक" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">ईमेल</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">आंतरिक टिप्पणी</label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={500} placeholder="केवल टीम को दिखेगी" />
          </div>
        </>
      )}

      {err && <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

      <DialogFooter className="gap-2 sm:justify-between">
        {editing ? (
          <Button
            type="button"
            variant="ghost"
            className="text-red-600 hover:text-red-700"
            disabled={saving}
            onClick={() => window.confirm("क्या आप वाकई इस बुकिंग को हटाना चाहते हैं?") && onDelete(editing.id)}
          >
            <Trash2 className="mr-1 h-4 w-4" />हटाएँ
          </Button>
        ) : (
          <span />
        )}
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

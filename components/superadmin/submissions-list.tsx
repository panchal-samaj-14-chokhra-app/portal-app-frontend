"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Trash2, Phone, Mail, MapPin, Save, Inbox } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  getSubmissions, updateSubmission, deleteSubmission,
  type Submission, type SubmissionKind, type SubmissionStatus,
} from "@/data-hooks/requests/submissions"

const STATUS_LABEL: Record<SubmissionStatus, string> = { new: "नई", in_progress: "प्रक्रियाधीन", resolved: "निपटाई गई" }
const STATUS_STYLE: Record<SubmissionStatus, string> = {
  new: "bg-red-100 text-red-700 border-red-200",
  in_progress: "bg-amber-100 text-amber-700 border-amber-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
}

const COPY: Record<SubmissionKind, { empty: string; resolved: string }> = {
  grievance: { empty: "अभी तक कोई शिकायत दर्ज नहीं हुई है।", resolved: "निपटाई गई" },
  testimonial: { empty: "अभी तक किसी ने अपना अनुभव नहीं भेजा है।", resolved: "देखी गई" },
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("hi-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  } catch {
    return iso
  }
}

function Row({ item, kind, onChanged }: { item: Submission; kind: SubmissionKind; onChanged: () => void }) {
  const { toast } = useToast()
  const [note, setNote] = useState(item.adminNote || "")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const update = useMutation({
    mutationFn: (p: { status?: SubmissionStatus; adminNote?: string }) => updateSubmission(item.id, p),
    onSuccess: () => { toast({ title: "सहेजा गया", variant: "success" }); onChanged() },
    onError: (e: any) => toast({ title: "त्रुटि", description: e?.response?.data?.message || e?.message, variant: "destructive" }),
  })
  const remove = useMutation({
    mutationFn: () => deleteSubmission(item.id),
    onSuccess: () => { toast({ title: "हटा दिया गया", variant: "success" }); onChanged() },
    onError: (e: any) => toast({ title: "त्रुटि", description: e?.response?.data?.message || e?.message, variant: "destructive" }),
  })

  return (
    <Card className="border-orange-200/60">
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-900">{item.name}</span>
              <Badge variant="outline" className="font-mono text-xs">{item.ref}</Badge>
              <Badge className={`border ${STATUS_STYLE[item.status]}`}>{kind === "testimonial" && item.status === "resolved" ? COPY.testimonial.resolved : STATUS_LABEL[item.status]}</Badge>
            </div>
            <p className="mt-0.5 text-xs text-gray-500">{formatDate(item.createdAt)}</p>
          </div>
          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setConfirmDelete(true)} aria-label="हटाएँ">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-700">
          {item.phone && <a href={`tel:+91${item.phone}`} className="inline-flex items-center gap-1.5 hover:text-orange-700"><Phone className="h-4 w-4 text-orange-500" />{item.phone}</a>}
          {item.email && <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1.5 break-all hover:text-orange-700"><Mail className="h-4 w-4 text-orange-500" />{item.email}</a>}
          {item.place && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-orange-500" />{item.place}</span>}
        </div>

        {item.subject && <p className="font-medium text-gray-900">{item.subject}</p>}
        {item.message && <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{item.message}</p>}

        {item.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.images.map((url, i) => (
              <a key={url + i} href={url} target="_blank" rel="noopener noreferrer" title="बड़ा देखें">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`${item.name} — फ़ोटो ${i + 1}`} className="h-24 w-24 rounded-md border object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.3")} />
              </a>
            ))}
          </div>
        )}

        <div className="grid gap-2 border-t pt-3 sm:grid-cols-[180px_1fr_auto] sm:items-start">
          <select
            value={item.status}
            disabled={update.isPending}
            onChange={(e) => update.mutate({ status: e.target.value as SubmissionStatus })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            aria-label="स्थिति"
          >
            <option value="new">नई</option>
            <option value="in_progress">प्रक्रियाधीन</option>
            <option value="resolved">{COPY[kind].resolved}</option>
          </select>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="आंतरिक टिप्पणी (वेबसाइट पर नहीं दिखती)" rows={2} />
          <Button size="sm" variant="outline" disabled={update.isPending || note === (item.adminNote || "")} onClick={() => update.mutate({ adminNote: note })}>
            {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}सहेजें
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>क्या आप इसे हटाना चाहते हैं?</AlertDialogTitle>
            <AlertDialogDescription>{item.ref} — {item.name}। फ़ोटो भी हट जाएँगी और यह वापस नहीं आएगा।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => remove.mutate()}>हाँ, हटाएँ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

// Lists what visitors sent from the website forms (grievances or testimonials), newest first.
export default function SubmissionsList({ kind }: { kind: SubmissionKind }) {
  const qc = useQueryClient()
  const [status, setStatus] = useState<"" | SubmissionStatus>("")
  const [search, setSearch] = useState("")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["submissions", kind, status, q, page],
    queryFn: () => getSubmissions({ kind, status: status || undefined, q: q || undefined, page }),
    staleTime: 0,
  })
  const refresh = () => qc.invalidateQueries({ queryKey: ["submissions"] })

  const countOf = (s: SubmissionStatus) => data?.counts.find((c) => c.kind === kind && c.status === s)?.n || 0
  const totalAll = (["new", "in_progress", "resolved"] as SubmissionStatus[]).reduce((n, s) => n + countOf(s), 0)
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  const tab = (value: "" | SubmissionStatus, label: string, n: number) => (
    <Button key={value || "all"} size="sm" variant={status === value ? "default" : "outline"} className={status === value ? "bg-orange-600 hover:bg-orange-700" : ""} onClick={() => { setStatus(value); setPage(1) }}>
      {label} <span className="ml-1.5 rounded-full bg-black/10 px-1.5 text-xs">{n}</span>
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {tab("", "सभी", totalAll)}
        {tab("new", "नई", countOf("new"))}
        {tab("in_progress", "प्रक्रियाधीन", countOf("in_progress"))}
        {tab("resolved", COPY[kind].resolved, countOf("resolved"))}
        <form
          className="ml-auto flex w-full gap-2 sm:w-auto"
          onSubmit={(e) => { e.preventDefault(); setQ(search.trim()); setPage(1) }}
        >
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="नाम, मोबाइल, ईमेल या शब्द खोजें" className="sm:w-64" />
          <Button type="submit" variant="outline" size="icon" aria-label="खोजें"><Search className="h-4 w-4" /></Button>
        </form>
      </div>

      {isLoading && <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-orange-600" /></div>}
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">सूची लोड नहीं हो सकी। कृपया पेज रीफ़्रेश करें।</p>}

      {data && data.data.length === 0 && !isLoading && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-orange-200 py-12 text-center text-gray-500">
          <Inbox className="h-8 w-8 text-orange-300" />
          {q || status ? "इस खोज / फ़िल्टर में कुछ नहीं मिला।" : COPY[kind].empty}
        </div>
      )}

      <div className={`space-y-3 ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        {data?.data.map((item) => <Row key={item.id} item={item} kind={kind} onChanged={refresh} />)}
      </div>

      {data && pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>पिछला</Button>
          <span className="text-sm text-gray-600">{page} / {pages} (कुल {data.total})</span>
          <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>अगला</Button>
        </div>
      )}
    </div>
  )
}

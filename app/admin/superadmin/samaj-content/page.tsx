"use client"

import { useState, useRef, useEffect } from "react"
import {
  Plus, Pencil, Trash2, Loader2, Newspaper, FileText, Calendar, MessageSquare,
  Eye, EyeOff, Upload, ChevronUp, ChevronDown, Save, AlertTriangle, CheckCircle, Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { uploadBlogImage } from "@/data-hooks/requests/blog"
import { getSubmissions, updateSubmission, deleteSubmission } from "@/data-hooks/requests/submissions"
import type { Submission, SubmissionStatus } from "@/data-hooks/requests/submissions"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import SectionFeatureFlags from "@/components/superadmin/section-feature-flags"
import { ToggleLeft } from "lucide-react"
import {
  useSamajNewsAdmin, useCreateSamajNews, useUpdateSamajNews, useDeleteSamajNews,
  useSamajPressAdmin, useCreateSamajPress, useUpdateSamajPress, useDeleteSamajPress,
  useSamajEventsAdmin, useCreateSamajEvent, useUpdateSamajEvent, useDeleteSamajEvent,
  useSamajPosts, useUpdateSamajPost, useDeleteSamajPost,
} from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajNews, SamajPressRelease, SamajEvent } from "@/data-hooks/requests/samaj-content"
import {
  useHeroFeedAdmin, useCreateHeroFeed, useUpdateHeroFeed, useDeleteHeroFeed,
} from "@/data-hooks/mutation-query/useHeroFeed"
import type { HeroFeed } from "@/data-hooks/requests/hero-feed"
import { FEED_TYPES } from "@/data-hooks/requests/hero-feed"
import { Heart, LayoutTemplate } from "lucide-react"
import { usePortalConfig, useUpdatePortalConfig } from "@/data-hooks/mutation-query/usePortalConfig"

type Tab = "hero" | "news" | "press" | "events" | "posts" | "feed" | "grievances" | "flags"

const TABS: { id: Tab; label: string; icon: any; desc: string }[] = [
  { id: "hero",       label: "होमपेज हीरो",     icon: LayoutTemplate,  desc: "होमपेज का शीर्षक, उपशीर्षक, स्थान एवं टैगलाइन" },
  { id: "news",       label: "समाचार",           icon: Newspaper,       desc: "समाज के समाचार एवं सूचनाएं" },
  { id: "press",      label: "प्रेस विज्ञप्ति",  icon: FileText,        desc: "आधिकारिक विज्ञप्तियां" },
  { id: "events",     label: "कार्यक्रम",        icon: Calendar,        desc: "आगामी एवं बीते आयोजन" },
  { id: "posts",      label: "पोस्ट मॉडरेशन",   icon: MessageSquare,   desc: "सदस्यों की पोस्ट प्रबंधन" },
  { id: "feed",       label: "हीरो फीड",         icon: Heart,           desc: "होमपेज हीरो सेक्शन — बधाई · जन्मदिवस · शोक संदेश" },
  { id: "grievances", label: "शिकायतें",         icon: AlertTriangle,   desc: "नियमावली पृष्ठ से प्राप्त शिकायतें" },
  { id: "flags",      label: "फ़ीचर फ्लैग्स",    icon: ToggleLeft,      desc: "समाज पोर्टल फ़ीचर चालू / बंद करें" },
]

function fmtDate(d?: string) {
  if (!d) return "—"
  try { return new Date(d).toLocaleDateString("hi-IN", { year: "numeric", month: "short", day: "numeric" }) } catch { return "—" }
}

// ── Upload helpers (mirrors ContentSectionEditor) ─────────────────────────────

function ImageUploadField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)
  const upload = async (f?: File) => {
    if (!f) return
    try { setBusy(true); onChange(await uploadBlogImage(f)) }
    catch (e: any) { toast({ title: "अपलोड त्रुटि", description: e?.message, variant: "destructive" }) }
    finally { setBusy(false) }
  }
  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <Input value={value || ""} onChange={e => onChange(e.target.value)} placeholder="इमेज URL या अपलोड करें" className="flex-1" />
        <label className="inline-flex items-center px-3 py-2 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer text-sm whitespace-nowrap">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <input type="file" accept="image/*" className="hidden" onChange={e => { upload(e.target.files?.[0]); e.currentTarget.value = "" }} />
        </label>
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-16 rounded object-cover border" onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
      )}
    </div>
  )
}

const MAX_PDF_SIZE = 2 * 1024 * 1024

function PdfUploadField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)
  const upload = async (f?: File) => {
    if (!f) return
    if (f.type !== "application/pdf") {
      toast({ title: "अमान्य फ़ाइल", description: "कृपया केवल PDF फ़ाइल चुनें", variant: "destructive" }); return
    }
    if (f.size > MAX_PDF_SIZE) {
      toast({ title: "फ़ाइल बड़ी है", description: "PDF का आकार अधिकतम 2MB होना चाहिए", variant: "destructive" }); return
    }
    try { setBusy(true); onChange(await uploadBlogImage(f)) }
    catch (e: any) { toast({ title: "अपलोड त्रुटि", description: e?.message, variant: "destructive" }) }
    finally { setBusy(false) }
  }
  return (
    <div className="flex gap-2">
      <Input value={value || ""} onChange={e => onChange(e.target.value)} placeholder="PDF URL या अपलोड करें (अधिकतम 2MB)" className="flex-1" />
      <label className="inline-flex items-center px-3 py-2 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer text-sm whitespace-nowrap">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        <input type="file" accept="application/pdf" className="hidden" onChange={e => { upload(e.target.files?.[0]); e.currentTarget.value = "" }} />
      </label>
    </div>
  )
}

// ── Confirm Delete ────────────────────────────────────────────────────────────

function ConfirmDelete({ open, onClose, onConfirm, label }: { open: boolean; onClose: () => void; onConfirm: () => void; label: string }) {
  return (
    <AlertDialog open={open} onOpenChange={v => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>हटाएं?</AlertDialogTitle>
          <AlertDialogDescription>"{label}" को स्थायी रूप से हटाया जाएगा।</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>रद्द करें</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">हटाएं</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// HERO SECTION PANEL
// ══════════════════════════════════════════════════════════════════════════════

const HERO_FIELDS = [
  { key: "portal_name",     label: "पोर्टल नाम",   placeholder: "पंचाल समाज",        hint: "नेवबार और होमपेज मुख्य शीर्षक पर दिखता है" },
  { key: "portal_subtitle", label: "उपशीर्षक",     placeholder: "चौदह चौखरा",        hint: "पोर्टल नाम के नीचे दिखता है (ग्रेडिएंट रंग में)" },
  { key: "portal_tagline",  label: "टैगलाइन",      placeholder: "पंचाल समाज पोर्टल", hint: "शीर्षक के ऊपर छोटी लाइन" },
  { key: "portal_location", label: "स्थान / जिले", placeholder: "बांसवाड़ा · डूंगरपुर · प्रतापगढ़ · साबरकांठा — राजस्थान", hint: "होमपेज हीरो में स्थान पंक्ति" },
]

function HeroSectionPanel() {
  const { toast } = useToast()
  const { data: config, isLoading } = usePortalConfig()
  const updateConfig = useUpdatePortalConfig()

  const [form, setForm] = useState<Record<string, string>>({})
  const [dirty, setDirty] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!config) return
    const vals: Record<string, string> = {}
    HERO_FIELDS.forEach(f => {
      vals[f.key] = config.find(c => c.key === f.key)?.value ?? ""
    })
    setForm(vals)
    setDirty({})
  }, [config])

  const handleChange = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    setDirty(d => ({ ...d, [key]: true }))
  }

  const handleSave = (key: string) => {
    updateConfig.mutate(
      { key, value: form[key] },
      {
        onSuccess: () => {
          toast({ title: "सहेज लिया गया", variant: "success" })
          setDirty(d => ({ ...d, [key]: false }))
        },
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">होमपेज हीरो सेक्शन</CardTitle>
        <CardDescription>होमपेज पर दिखने वाला मुख्य शीर्षक, उपशीर्षक, टैगलाइन और स्थान संपादित करें। प्रत्येक फ़ील्ड अलग से सहेजी जाती है।</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Live preview */}
            <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-3">लाइव प्रीव्यू</p>
              <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-1">{form.portal_tagline || "—"}</p>
              <p className="text-2xl font-extrabold text-gray-900 leading-tight">{form.portal_name || "—"}</p>
              <p className="text-2xl font-extrabold leading-tight mb-1"
                style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg,#c2410c,#ea580c,#f97316)", WebkitBackgroundClip: "text" }}>
                {form.portal_subtitle || "—"}
              </p>
              <p className="text-orange-600/80 text-xs font-medium">{form.portal_location || "—"}</p>
            </div>

            {/* Fields */}
            {HERO_FIELDS.map(field => (
              <div key={field.key} className="space-y-1.5">
                <Label className="font-semibold text-gray-700">{field.label}</Label>
                {field.key === "portal_location" ? (
                  <Input
                    value={form[field.key] || ""}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input
                    value={form[field.key] || ""}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">{field.hint}</p>
                  <Button
                    size="sm"
                    onClick={() => handleSave(field.key)}
                    disabled={!dirty[field.key] || updateConfig.isPending}
                    className="bg-orange-600 hover:bg-orange-700 text-white h-7 px-3 text-xs">
                    {updateConfig.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                    सहेजें
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// NEWS PANEL
// ══════════════════════════════════════════════════════════════════════════════

function NewsPanel() {
  const { toast } = useToast()
  const { data: items, isLoading } = useSamajNewsAdmin()
  const create = useCreateSamajNews()
  const update = useUpdateSamajNews()
  const remove = useDeleteSamajNews()
  const [open, setOpen]       = useState(false)
  const [form, setForm]       = useState<Partial<SamajNews>>({ status: "published", tag: "समाचार" })
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)
  const saving = create.isPending || update.isPending

  const openCreate = () => { setEditing(null); setForm({ status: "published", tag: "समाचार" }); setOpen(true) }
  const openEdit   = (item: SamajNews) => { setEditing(item.id); setForm({ ...item }); setOpen(true) }
  const closeForm  = () => { setOpen(false); setEditing(null); setForm({ status: "published", tag: "समाचार" }) }

  const handleSave = () => {
    if (!form.title) return
    const cb = {
      onSuccess: () => { toast({ title: editing ? "अपडेट हो गया" : "जोड़ा गया", variant: "success" }); closeForm() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
    }
    if (editing) update.mutate({ id: editing, payload: form }, cb)
    else create.mutate(form, cb)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">समाज समाचार</CardTitle>
            <CardDescription>समाचार जोड़ें, संपादित करें या हटाएं</CardDescription>
          </div>
          <Button onClick={openCreate} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-1.5" />नया समाचार
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
          ) : !items?.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">अभी कोई समाचार नहीं है।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>शीर्षक</TableHead>
                  <TableHead className="hidden sm:table-cell">टैग</TableHead>
                  <TableHead className="hidden md:table-cell">तिथि</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead className="text-right">क्रिया</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{item.title}</div>
                      {item.summary && <div className="text-xs text-gray-400 truncate mt-0.5">{item.summary}</div>}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">{item.tag}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-500">{fmtDate(item.publishedAt)}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "published" ? "default" : "secondary"}
                        className={item.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                        {item.status === "published" ? "प्रकाशित" : "ड्राफ़्ट"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setDeleting({ id: item.id, title: item.title })}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={v => !v && closeForm()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "समाचार अपडेट करें" : "नया समाचार जोड़ें"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>शीर्षक *</Label>
              <Input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="समाचार का शीर्षक" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>टैग</Label>
                <Input value={form.tag || ""} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="समाचार" />
              </div>
              <div className="space-y-1.5">
                <Label>स्थिति</Label>
                <Select value={form.status || "published"} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">प्रकाशित</SelectItem>
                    <SelectItem value="draft">ड्राफ़्ट</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>सारांश</Label>
              <Textarea value={form.summary || ""} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="संक्षिप्त विवरण..." rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>विस्तृत सामग्री</Label>
              <Textarea value={form.content || ""} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="पूरी सामग्री..." rows={4} />
            </div>
            <div className="space-y-1.5">
              <Label>इमेज</Label>
              <ImageUploadField value={form.imageUrl || ""} onChange={v => setForm(f => ({ ...f, imageUrl: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={!form.title || saving} className="bg-orange-600 hover:bg-orange-700 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}{editing ? "अपडेट करें" : "जोड़ें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""}
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => { toast({ title: "हटा दिया गया", variant: "success" }); setDeleting(null) }, onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) }) }} />
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PRESS RELEASE PANEL — full mandir-style editor
// ══════════════════════════════════════════════════════════════════════════════

function PressPanel() {
  const { toast } = useToast()
  const { data: items, isLoading } = useSamajPressAdmin()
  const create = useCreateSamajPress()
  const update = useUpdateSamajPress()
  const remove = useDeleteSamajPress()
  const [open, setOpen]         = useState(false)
  const [form, setForm]         = useState<Partial<SamajPressRelease>>({})
  const [editing, setEditing]   = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)
  const saving = create.isPending || update.isPending

  const openCreate = () => { setEditing(null); setForm({}); setOpen(true) }
  const openEdit   = (item: SamajPressRelease) => { setEditing(item.id); setForm({ ...item }); setOpen(true) }
  const closeForm  = () => { setOpen(false); setEditing(null); setForm({}) }

  const handleSave = () => {
    if (!form.title) return
    const cb = {
      onSuccess: () => { toast({ title: editing ? "विज्ञप्ति अपडेट हुई" : "विज्ञप्ति जोड़ी गई", variant: "success" }); closeForm() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
    }
    if (editing) update.mutate({ id: editing, payload: form }, cb)
    else create.mutate(form, cb)
  }

  // reorder items in the displayed list (locally triggers individual updates)
  const moveItem = (item: SamajPressRelease, dir: -1 | 1) => {
    if (!items) return
    const idx = items.findIndex(i => i.id === item.id)
    const other = items[idx + dir]
    if (!other) return
    // swap publishedAt dates so the sort order reflects the visual order
    const dateA = item.publishedAt
    const dateB = other.publishedAt
    update.mutate({ id: item.id,  payload: { publishedAt: dateB } })
    update.mutate({ id: other.id, payload: { publishedAt: dateA } })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">प्रेस विज्ञप्ति</CardTitle>
            <CardDescription>
              इमेज व PDF अपलोड के साथ विज्ञप्तियां जोड़ें। सबसे नई विज्ञप्ति पोर्टल पर सबसे ऊपर दिखती है।
            </CardDescription>
          </div>
          <Button onClick={openCreate} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-1.5" />नई विज्ञप्ति
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
          ) : !items?.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">अभी कोई प्रेस विज्ञप्ति नहीं है।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 pl-4">क्रम</TableHead>
                  <TableHead>शीर्षक</TableHead>
                  <TableHead className="hidden sm:table-cell">प्रकाशक</TableHead>
                  <TableHead className="hidden md:table-cell">तिथि</TableHead>
                  <TableHead className="hidden sm:table-cell">फ़ाइल</TableHead>
                  <TableHead className="text-right">क्रिया</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={item.id}>
                    {/* reorder buttons */}
                    <TableCell className="pl-2">
                      <div className="flex flex-col">
                        <Button size="sm" variant="ghost" className="h-6 px-1 text-gray-400 hover:text-orange-600"
                          disabled={idx === 0 || update.isPending}
                          onClick={() => moveItem(item, -1)}><ChevronUp className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 px-1 text-gray-400 hover:text-orange-600"
                          disabled={idx === items.length - 1 || update.isPending}
                          onClick={() => moveItem(item, 1)}><ChevronDown className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{item.title}</div>
                      {item.summary && <div className="text-xs text-gray-400 truncate mt-0.5">{item.summary}</div>}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-gray-500">{item.publishedBy || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-500">{fmtDate(item.publishedAt)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        {item.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imageUrl} alt="" className="h-8 w-8 rounded object-cover border" onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
                        )}
                        {item.pdfUrl && (
                          <a href={item.pdfUrl} target="_blank" rel="noreferrer"
                            className="text-xs text-orange-600 underline hover:text-orange-700 whitespace-nowrap">PDF</a>
                        )}
                        {!item.imageUrl && !item.pdfUrl && <span className="text-gray-300 text-xs">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setDeleting({ id: item.id, title: item.title })}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit dialog — full mandir-style fields */}
      <Dialog open={open} onOpenChange={v => !v && closeForm()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "प्रेस विज्ञप्ति अपडेट करें" : "नई प्रेस विज्ञप्ति जोड़ें"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* शीर्षक */}
            <div className="space-y-1.5">
              <Label>शीर्षक *</Label>
              <Input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="विज्ञप्ति का शीर्षक" />
            </div>

            {/* प्रकाशक + तिथि */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>प्रकाशक</Label>
                <Input value={form.publishedBy || ""} onChange={e => setForm(f => ({ ...f, publishedBy: e.target.value }))} placeholder="समाज अध्यक्ष" />
              </div>
              <div className="space-y-1.5">
                <Label>दिनांक</Label>
                <Input type="date" value={form.publishedAt ? new Date(form.publishedAt).toLocaleDateString("en-CA") : ""}
                  onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))} />
              </div>
            </div>

            {/* सारांश */}
            <div className="space-y-1.5">
              <Label>सारांश</Label>
              <Textarea value={form.summary || ""} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="संक्षिप्त विवरण..." rows={2} />
            </div>

            {/* विस्तृत सामग्री */}
            <div className="space-y-1.5">
              <Label>विस्तृत सामग्री</Label>
              <Textarea value={form.content || ""} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="पूरी सामग्री..." rows={4} />
            </div>

            {/* इमेज — with upload */}
            <div className="space-y-1.5">
              <Label>इमेज <span className="text-xs text-gray-400">(वैकल्पिक — शेयर करने पर लिंक के साथ दिखेगी)</span></Label>
              <ImageUploadField value={form.imageUrl || ""} onChange={v => setForm(f => ({ ...f, imageUrl: v }))} />
            </div>

            {/* PDF — with upload, 2MB limit */}
            <div className="space-y-1.5">
              <Label>PDF / लिंक <span className="text-xs text-gray-400">(अधिकतम 2MB)</span></Label>
              <PdfUploadField value={form.pdfUrl || ""} onChange={v => setForm(f => ({ ...f, pdfUrl: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={!form.title || saving} className="bg-orange-600 hover:bg-orange-700 text-white">
              {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
              {editing ? "सहेजें" : "जोड़ें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""}
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => { toast({ title: "हटा दिया गया", variant: "success" }); setDeleting(null) }, onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) }) }} />
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// EVENTS PANEL
// ══════════════════════════════════════════════════════════════════════════════

function EventsPanel() {
  const { toast } = useToast()
  const { data: items, isLoading } = useSamajEventsAdmin()
  const create = useCreateSamajEvent()
  const update = useUpdateSamajEvent()
  const remove = useDeleteSamajEvent()
  const [open, setOpen]       = useState(false)
  const [form, setForm]       = useState<Partial<SamajEvent>>({})
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)
  const saving = create.isPending || update.isPending

  const openCreate = () => { setEditing(null); setForm({}); setOpen(true) }
  const openEdit   = (item: SamajEvent) => { setEditing(item.id); setForm({ ...item }); setOpen(true) }
  const closeForm  = () => { setOpen(false); setEditing(null); setForm({}) }
  const handleSave = () => {
    if (!form.title || !form.date) return
    const cb = {
      onSuccess: () => { toast({ title: editing ? "कार्यक्रम अपडेट हुआ" : "कार्यक्रम जोड़ा गया", variant: "success" }); closeForm() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
    }
    if (editing) update.mutate({ id: editing, payload: form }, cb)
    else create.mutate(form, cb)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">कार्यक्रम एवं आयोजन</CardTitle>
            <CardDescription>आगामी एवं बीते कार्यक्रम प्रबंधित करें</CardDescription>
          </div>
          <Button onClick={openCreate} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-1.5" />नया कार्यक्रम
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
          ) : !items?.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">अभी कोई कार्यक्रम नहीं है।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>कार्यक्रम</TableHead>
                  <TableHead className="hidden sm:table-cell">तिथि</TableHead>
                  <TableHead className="hidden md:table-cell">स्थान</TableHead>
                  <TableHead className="text-right">क्रिया</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => {
                  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
                  const isUpcoming = !item.date || item.date >= today
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.title}
                          <Badge variant={isUpcoming ? "default" : "secondary"}
                            className={isUpcoming ? "bg-green-100 text-green-700 hover:bg-green-100 text-[10px]" : "text-[10px]"}>
                            {isUpcoming ? "आगामी" : "बीता"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-gray-500">{item.date || "—"}{item.time ? ` · ${item.time}` : ""}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-gray-500 max-w-[180px] truncate">{item.venue || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setDeleting({ id: item.id, title: item.title })}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={v => !v && closeForm()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "कार्यक्रम अपडेट करें" : "नया कार्यक्रम जोड़ें"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>कार्यक्रम का नाम *</Label>
              <Input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="कार्यक्रम का शीर्षक" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>तिथि *</Label>
                <Input type="date" value={form.date || ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>समय</Label>
                <Input value={form.time || ""} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="सुबह 10 बजे" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>स्थान / पता</Label>
              <Input value={form.venue || ""} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} placeholder="बांसवाड़ा, राजस्थान" />
            </div>
            <div className="space-y-1.5">
              <Label>संपर्क नंबर</Label>
              <Input value={form.contact || ""} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-1.5">
              <Label>इमेज</Label>
              <ImageUploadField value={form.imageUrl || ""} onChange={v => setForm(f => ({ ...f, imageUrl: v }))} />
            </div>
            <div className="space-y-1.5">
              <Label>विवरण</Label>
              <Textarea value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="कार्यक्रम का विवरण..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={!form.title || !form.date || saving} className="bg-orange-600 hover:bg-orange-700 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}{editing ? "अपडेट करें" : "जोड़ें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""}
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => { toast({ title: "हटा दिया गया", variant: "success" }); setDeleting(null) }, onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) }) }} />
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// POSTS MODERATION PANEL
// ══════════════════════════════════════════════════════════════════════════════

function PostsPanel() {
  const { toast } = useToast()
  const { data: posts, isLoading } = useSamajPosts()
  const update = useUpdateSamajPost()
  const remove = useDeleteSamajPost()
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">पोस्ट मॉडरेशन</CardTitle>
          <CardDescription>सदस्यों की पोस्ट देखें और प्रबंधित करें। पोस्ट को छिपाएं या हटाएं।</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
          ) : !posts?.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">अभी कोई पोस्ट नहीं है।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>सदस्य</TableHead>
                  <TableHead>पोस्ट</TableHead>
                  <TableHead className="hidden md:table-cell">तिथि</TableHead>
                  <TableHead className="hidden sm:table-cell">स्थिति</TableHead>
                  <TableHead className="text-right">क्रिया</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      <div>{post.authorName}</div>
                      {post.authorRole && <div className="text-xs text-gray-400">{post.authorRole}</div>}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm text-gray-700 line-clamp-2">{post.content}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{post.likesCount} लाइक · {post._count?.comments || 0} टिप्पणी</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-500 whitespace-nowrap">{fmtDate(post.createdAt)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={post.status === "published" ? "default" : "secondary"}
                        className={post.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}>
                        {post.status === "published" ? "दिखाई दे रही" : "छिपी"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                          title={post.status === "published" ? "छिपाएं" : "दिखाएं"}
                          onClick={() => update.mutate({ id: post.id, payload: { status: post.status === "published" ? "hidden" : "published" } }, { onSuccess: () => toast({ title: post.status === "published" ? "पोस्ट छिपाई गई" : "पोस्ट दिखाई गई", variant: "success" }) })}>
                          {post.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50"
                          onClick={() => setDeleting({ id: post.id, title: post.content.slice(0, 40) })}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""}
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => { toast({ title: "पोस्ट हटाई गई", variant: "success" }); setDeleting(null) }, onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) }) }} />
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// CROP IMAGE UPLOAD
// ══════════════════════════════════════════════════════════════════════════════

// Crop ratio: 1:1 square (hero card format)
const CROP_W = 480
const CROP_H = 480

function CropImageUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { toast } = useToast()
  const [src, setSrc]       = useState<string | null>(null)
  const [busy, setBusy]     = useState(false)
  const [offsetX, setOffsetX] = useState(0.5) // 0–1 horizontal crop center
  const [offsetY, setOffsetY] = useState(0.5) // 0–1 vertical crop center
  const imgRef  = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [naturalW, setNaturalW] = useState(0)
  const [naturalH, setNaturalH] = useState(0)

  const loadFile = (f?: File) => {
    if (!f) return
    const reader = new FileReader()
    reader.onload = e => { setSrc(e.target?.result as string); setOffsetX(0.5); setOffsetY(0.5) }
    reader.readAsDataURL(f)
  }

  const renderPreview = () => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || !naturalW || !naturalH) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const srcRatio = naturalW / naturalH
    const tgtRatio = CROP_W / CROP_H

    let sw: number, sh: number, sx: number, sy: number
    if (srcRatio > tgtRatio) {
      sh = naturalH
      sw = sh * tgtRatio
      sx = (naturalW - sw) * offsetX
      sy = 0
    } else {
      sw = naturalW
      sh = sw / tgtRatio
      sx = 0
      sy = (naturalH - sh) * offsetY
    }
    ctx.clearRect(0, 0, CROP_W, CROP_H)
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, CROP_W, CROP_H)
  }

  useEffect(() => { renderPreview() }, [offsetX, offsetY, naturalW, naturalH])

  const uploadCropped = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(async (blob: Blob | null) => {
      if (!blob) return
      try {
        setBusy(true)
        const { uploadBlogImage } = await import("@/data-hooks/requests/blog")
        const file = new File([blob], "hero-feed.jpg", { type: "image/jpeg" })
        const url = await uploadBlogImage(file)
        onChange(url)
        setSrc(null)
        toast({ title: "इमेज अपलोड हो गई", variant: "success" })
      } catch (e: any) {
        toast({ title: "अपलोड त्रुटि", description: e?.message, variant: "destructive" })
      } finally {
        setBusy(false)
      }
    }, "image/jpeg", 0.92)
  }

  if (!src) return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <Input value={value || ""} onChange={e => onChange(e.target.value)} placeholder="इमेज URL या फ़ाइल अपलोड करें" className="flex-1" />
        <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer text-sm whitespace-nowrap">
          <Upload className="w-4 h-4" /> क्रॉप करें
          <input type="file" accept="image/*" className="hidden" onChange={e => { loadFile(e.target.files?.[0]); e.currentTarget.value = "" }} />
        </label>
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-24 rounded-lg object-cover border border-gray-200" onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
      )}
    </div>
  )

  return (
    <div className="space-y-3 p-3 border border-orange-200 rounded-xl bg-orange-50">
      <p className="text-xs font-semibold text-orange-700">इमेज क्रॉप करें (1:1 स्क्वायर)</p>
      <div className="flex gap-3 items-start flex-wrap">
        <canvas ref={canvasRef} width={CROP_W} height={CROP_H}
          className="rounded-xl border border-orange-200 shadow-sm"
          style={{ width: 160, height: 160 }} />
        <div className="flex-1 space-y-3 min-w-[180px]">
          {/* Hidden img for drawing */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} src={src} alt="" className="hidden"
            onLoad={e => {
              const t = e.target as HTMLImageElement
              setNaturalW(t.naturalWidth)
              setNaturalH(t.naturalHeight)
            }} />
          <div className="space-y-1">
            <label className="text-xs text-gray-600">बाएं–दाएं</label>
            <input type="range" min={0} max={1} step={0.01} value={offsetX}
              onChange={e => setOffsetX(Number(e.target.value))}
              className="w-full accent-orange-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-600">ऊपर–नीचे</label>
            <input type="range" min={0} max={1} step={0.01} value={offsetY}
              onChange={e => setOffsetY(Number(e.target.value))}
              className="w-full accent-orange-500" />
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={uploadCropped} disabled={busy || !naturalW}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Upload className="w-3.5 h-3.5 mr-1" />}
              अपलोड करें
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSrc(null)} className="text-xs text-gray-500">
              रद्द करें
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// HERO FEED PANEL
// ══════════════════════════════════════════════════════════════════════════════

const EMPTY_FEED: Partial<HeroFeed> = { type: "badhai", heading: "", personName: "", details: "", imageUrl: "", status: "published" }

function HeroFeedPanel() {
  const { toast } = useToast()
  const { data: itemsRaw, isLoading } = useHeroFeedAdmin()
  const items: HeroFeed[] = (itemsRaw as HeroFeed[] | undefined) ?? []
  const create = useCreateHeroFeed()
  const update = useUpdateHeroFeed()
  const remove = useDeleteHeroFeed()

  const [open, setOpen]       = useState(false)
  const [form, setForm]       = useState<Partial<HeroFeed>>(EMPTY_FEED)
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; label: string } | null>(null)
  const saving = create.isPending || update.isPending

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY_FEED }); setOpen(true) }
  const openEdit   = (item: HeroFeed) => { setEditing(item.id); setForm({ ...item }); setOpen(true) }
  const closeForm  = () => { setOpen(false); setEditing(null); setForm({ ...EMPTY_FEED }) }

  const set = (k: keyof HeroFeed, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.heading?.trim() || !form.personName?.trim() || !form.imageUrl?.trim()) {
      toast({ title: "अधूरी जानकारी", description: "शीर्षक, व्यक्ति का नाम और इमेज आवश्यक हैं", variant: "destructive" }); return
    }
    const cb = {
      onSuccess: () => { toast({ title: editing ? "अपडेट हो गया" : "जोड़ा गया", variant: "success" }); closeForm() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
    }
    if (editing) update.mutate({ id: editing, ...form }, cb)
    else create.mutate(form, cb)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">हीरो फीड</CardTitle>
            <CardDescription>होमपेज पर दिखने वाले बधाई, जन्मदिवस, शोक संदेश प्रबंधित करें</CardDescription>
          </div>
          <Button size="sm" onClick={openCreate} className="bg-orange-500 hover:bg-orange-600 text-white shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />जोड़ें
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-orange-400" /></div>}
          {!isLoading && items.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">अभी कोई फीड नहीं है। ऊपर "जोड़ें" दबाएं।</p>
          )}
          {!isLoading && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => {
                const ft = FEED_TYPES.find(t => t.value === item.type)
                return (
                  <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white flex flex-col">
                    {item.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.heading} className="w-full h-48 object-cover" onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
                    )}
                    <div className="p-3 flex-1 flex flex-col">
                      {ft && <span className={`self-start text-[11px] font-bold px-2 py-0.5 rounded-full mb-1 ${ft.bg} ${ft.color}`}>{ft.label}</span>}
                      <p className="font-bold text-gray-800 text-sm line-clamp-2">{item.heading}</p>
                      <p className="text-orange-600 text-xs mt-0.5">{item.personName}</p>
                      {item.details && <p className="text-gray-400 text-[11px] mt-0.5 line-clamp-1">{item.details}</p>}
                      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-50">
                        <Badge variant="secondary"
                          className={item.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {item.status === "published" ? "प्रकाशित" : "ड्राफ्ट"}
                        </Badge>
                        <span className="text-xs text-gray-400 ml-auto">{item.likesCount} ♥</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-500 hover:bg-gray-100" onClick={() => openEdit(item)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => setDeleting({ id: item.id, label: item.heading })}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={v => !v && closeForm()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "फीड संपादित करें" : "नई फीड जोड़ें"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>प्रकार</Label>
              <Select value={form.type} onValueChange={v => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FEED_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>शीर्षक *</Label>
              <Input value={form.heading || ""} onChange={e => set("heading", e.target.value)} placeholder="जैसे: जन्मदिवस की हार्दिक शुभकामनाएं" />
            </div>
            <div className="space-y-1.5">
              <Label>व्यक्ति का नाम *</Label>
              <Input value={form.personName || ""} onChange={e => set("personName", e.target.value)} placeholder="व्यक्ति का पूरा नाम" />
            </div>
            <div className="space-y-1.5">
              <Label>विवरण (वैकल्पिक)</Label>
              <Textarea value={form.details || ""} onChange={e => set("details", e.target.value)} placeholder="अतिरिक्त जानकारी जैसे पता, परिवार आदि" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>इमेज * (1:1 स्क्वायर साइज़)</Label>
              <CropImageUpload value={form.imageUrl || ""} onChange={v => set("imageUrl", v)} />
            </div>
            <div className="space-y-1.5">
              <Label>स्थिति</Label>
              <Select value={form.status || "published"} onValueChange={v => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">प्रकाशित</SelectItem>
                  <SelectItem value="draft">ड्राफ्ट</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
              {editing ? "अपडेट करें" : "जोड़ें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.label || ""}
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id, {
            onSuccess: () => { toast({ title: "फीड हटाई गई", variant: "success" }); setDeleting(null) },
            onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
          })
        }} />
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// GRIEVANCES PANEL
// ══════════════════════════════════════════════════════════════════════════════

const STATUS_LABELS: Record<SubmissionStatus, { label: string; color: string }> = {
  new:         { label: "नई",        color: "bg-red-100 text-red-700" },
  in_progress: { label: "विचाराधीन", color: "bg-yellow-100 text-yellow-700" },
  resolved:    { label: "हल हुई",    color: "bg-green-100 text-green-700" },
}

function GrievancesPanel() {
  const { toast } = useToast()
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Submission | null>(null)
  const [adminNote, setAdminNote] = useState("")
  const [savingNote, setSavingNote] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-grievances", statusFilter, q, page],
    queryFn: () => getSubmissions({ kind: "grievance", status: statusFilter !== "all" ? statusFilter : undefined, q: q || undefined, page }),
    staleTime: 30_000,
  })

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status?: SubmissionStatus; adminNote?: string } }) =>
      updateSubmission(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-grievances"] }); toast({ title: "अपडेट हो गया", variant: "success" }) },
    onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteSubmission(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-grievances"] }); setDeletingId(null); toast({ title: "शिकायत हटाई गई", variant: "success" }) },
    onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
  })

  const openDetail = (g: Submission) => { setSelected(g); setAdminNote(g.adminNote || "") }
  const closeDetail = () => setSelected(null)

  const saveNote = async () => {
    if (!selected) return
    setSavingNote(true)
    try {
      await updateSubmission(selected.id, { adminNote })
      qc.invalidateQueries({ queryKey: ["admin-grievances"] })
      toast({ title: "नोट सहेजा गया", variant: "success" })
      setSelected(prev => prev ? { ...prev, adminNote } : null)
    } catch (e: any) {
      toast({ title: "त्रुटि", description: e?.message, variant: "destructive" })
    } finally {
      setSavingNote(false)
    }
  }

  const items = data?.data || []
  const total = data?.total || 0

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />शिकायतें
            {total > 0 && <span className="text-xs font-normal text-gray-400 ml-1">({total} कुल)</span>}
          </CardTitle>
          <CardDescription>नियमावली पृष्ठ से प्राप्त शिकायतें</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input value={q} onChange={e => { setQ(e.target.value); setPage(1) }}
              placeholder="नाम, मोबाइल या विवरण खोजें..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400">
              <option value="all">सभी स्थिति</option>
              <option value="new">नई</option>
              <option value="in_progress">विचाराधीन</option>
              <option value="resolved">हल हुई</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
          ) : !items.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">कोई शिकायत नहीं मिली।</div>
          ) : (
            <div className={`space-y-2 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
              {items.map(g => {
                const st = STATUS_LABELS[g.status] || STATUS_LABELS.new
                return (
                  <div key={g.id} className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer"
                    onClick={() => openDetail(g)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-orange-700 text-sm">{g.ref}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${st.color}`}>{st.label}</span>
                          {g.name === "अज्ञात" && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">अज्ञात</span>}
                        </div>
                        {g.subject && <p className="text-sm font-semibold text-red-700 mb-0.5">{g.subject}</p>}
                        <p className="text-sm text-gray-600 line-clamp-2">{g.message}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                          {g.name !== "अज्ञात" && <span>👤 {g.name}</span>}
                          {g.phone && <span>📞 {g.phone}</span>}
                          {g.place && <span>📍 {g.place}</span>}
                          <span>{fmtDate(g.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:bg-red-50"
                          onClick={e => { e.stopPropagation(); setDeletingId(g.id) }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-400">पृष्ठ {page}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>पिछला</Button>
                <Button size="sm" variant="outline" disabled={items.length < 20} onClick={() => setPage(p => p + 1)}>अगला</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={v => !v && closeDetail()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <span className="text-orange-600">{selected.ref}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_LABELS[selected.status]?.color}`}>
                    {STATUS_LABELS[selected.status]?.label}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Against person */}
                {selected.subject && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-red-600 mb-1">जिसके खिलाफ शिकायत</p>
                    <p className="text-sm text-red-800 font-semibold">{selected.subject}</p>
                  </div>
                )}

                {/* Complainant */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1.5 text-sm">
                  <p className="text-xs font-bold text-gray-500 mb-1">शिकायतकर्ता</p>
                  <div className="flex items-center gap-2"><span className="text-gray-400 w-16">नाम:</span><span className="font-medium">{selected.name}</span></div>
                  {selected.phone && <div className="flex items-center gap-2"><span className="text-gray-400 w-16">मोबाइल:</span><span>{selected.phone}</span></div>}
                  {selected.email && <div className="flex items-center gap-2"><span className="text-gray-400 w-16">ईमेल:</span><span>{selected.email}</span></div>}
                  {selected.place && <div className="flex items-center gap-2"><span className="text-gray-400 w-16">गांव:</span><span>{selected.place}</span></div>}
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1.5">शिकायत का विवरण</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100 rounded-xl p-3 bg-white">{selected.message}</p>
                </div>

                {/* Images */}
                {selected.images?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1.5">फ़ोटो</p>
                    <div className="flex gap-2 flex-wrap">
                      {selected.images.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="block w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-orange-400 transition-colors">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`फ़ोटो ${i + 1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status update */}
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1.5">स्थिति बदलें</p>
                  <div className="flex gap-2">
                    {(["new", "in_progress", "resolved"] as SubmissionStatus[]).map(s => (
                      <button key={s} onClick={() => updateMut.mutate({ id: selected.id, payload: { status: s } })}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${selected.status === s ? STATUS_LABELS[s].color + " border-current" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                        {STATUS_LABELS[s].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin note */}
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1.5">आंतरिक नोट</p>
                  <Textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} rows={3}
                    placeholder="कार्यवाही, टिप्पणी आदि..." className="text-sm resize-none" />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={closeDetail}>बंद करें</Button>
                <Button onClick={saveNote} disabled={savingNote} className="bg-orange-500 hover:bg-orange-600 text-white">
                  {savingNote ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                  नोट सहेजें
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deletingId} onOpenChange={v => !v && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>शिकायत हटाएं?</AlertDialogTitle>
            <AlertDialogDescription>यह क्रिया पूर्ववत नहीं की जा सकती। फ़ोटो भी हट जाएंगी।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMut.mutate(deletingId)}
              className="bg-red-600 hover:bg-red-700 text-white">हटाएं</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function SamajContentPage() {
  const [tab, setTab] = useState<Tab>("hero")
  const active = TABS.find(t => t.id === tab)!

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-orange-100">
          <active.icon className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">समाज पोर्टल प्रबंधन</h2>
          <p className="text-sm text-gray-500">{active.desc}</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              tab === t.id
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                : "text-gray-600 hover:bg-white hover:text-orange-700"
            }`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {tab === "hero"       && <HeroSectionPanel />}
      {tab === "news"       && <NewsPanel />}
      {tab === "press"      && <PressPanel />}
      {tab === "events"     && <EventsPanel />}
      {tab === "posts"      && <PostsPanel />}
      {tab === "feed"       && <HeroFeedPanel />}
      {tab === "grievances" && <GrievancesPanel />}
      {tab === "flags"  && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <SectionFeatureFlags
            section="samaj_portal"
            title="समाज पोर्टल — फ़ीचर फ्लैग्स"
            description="इन फ़ीचर को चालू या बंद करने पर वेबसाइट के नेवबार एवं सेक्शन तुरंत प्रभावित होंगे।"
          />
        </div>
      )}
    </div>
  )
}

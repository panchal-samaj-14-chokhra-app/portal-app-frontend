"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Newspaper, FileText, Calendar, MessageSquare, Eye, EyeOff } from "lucide-react"
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
import {
  useSamajNewsAdmin, useCreateSamajNews, useUpdateSamajNews, useDeleteSamajNews,
  useSamajPressAdmin, useCreateSamajPress, useUpdateSamajPress, useDeleteSamajPress,
  useSamajEventsAdmin, useCreateSamajEvent, useUpdateSamajEvent, useDeleteSamajEvent,
  useSamajPosts, useUpdateSamajPost, useDeleteSamajPost,
} from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajNews, SamajPressRelease, SamajEvent } from "@/data-hooks/requests/samaj-content"

type Tab = "news" | "press" | "events" | "posts"

const TABS: { id: Tab; label: string; icon: any; desc: string }[] = [
  { id: "news",   label: "समाचार",          icon: Newspaper,      desc: "समाज के समाचार एवं सूचनाएं" },
  { id: "press",  label: "प्रेस विज्ञप्ति", icon: FileText,       desc: "आधिकारिक विज्ञप्तियां" },
  { id: "events", label: "कार्यक्रम",       icon: Calendar,       desc: "आगामी एवं बीते आयोजन" },
  { id: "posts",  label: "पोस्ट मॉडरेशन",  icon: MessageSquare,  desc: "सदस्यों की पोस्ट प्रबंधन" },
]

function fmtDate(d?: string) {
  if (!d) return "—"
  try { return new Date(d).toLocaleDateString("hi-IN", { year: "numeric", month: "short", day: "numeric" }) } catch { return "—" }
}

// ── Confirm Delete ────────────────────────────────────────────────────────────

function ConfirmDelete({ open, onClose, onConfirm, label }: { open: boolean; onClose: () => void; onConfirm: () => void; label: string }) {
  return (
    <AlertDialog open={open} onOpenChange={v => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>हटाएं?</AlertDialogTitle>
          <AlertDialogDescription>"{label}" को स्थायी रूप से हटाया जाएगा। यह क्रिया पूर्ववत नहीं की जा सकती।</AlertDialogDescription>
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
// NEWS PANEL
// ══════════════════════════════════════════════════════════════════════════════

function NewsPanel() {
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
    if (editing) update.mutate({ id: editing, payload: form }, { onSuccess: closeForm })
    else create.mutate(form, { onSuccess: closeForm })
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
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...
            </div>
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
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => openEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setDeleting({ id: item.id, title: item.title })}>
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

      <Dialog open={open} onOpenChange={v => !v && closeForm()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "समाचार अपडेट करें" : "नया समाचार जोड़ें"}</DialogTitle>
          </DialogHeader>
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
              <Label>इमेज URL</Label>
              <Input value={form.imageUrl || ""} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={!form.title || saving} className="bg-orange-600 hover:bg-orange-700 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              {editing ? "अपडेट करें" : "जोड़ें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""}
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PRESS PANEL
// ══════════════════════════════════════════════════════════════════════════════

function PressPanel() {
  const { data: items, isLoading } = useSamajPressAdmin()
  const create = useCreateSamajPress()
  const update = useUpdateSamajPress()
  const remove = useDeleteSamajPress()
  const [open, setOpen]       = useState(false)
  const [form, setForm]       = useState<Partial<SamajPressRelease>>({})
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)
  const saving = create.isPending || update.isPending

  const openCreate = () => { setEditing(null); setForm({}); setOpen(true) }
  const openEdit   = (item: SamajPressRelease) => { setEditing(item.id); setForm({ ...item }); setOpen(true) }
  const closeForm  = () => { setOpen(false); setEditing(null); setForm({}) }
  const handleSave = () => {
    if (!form.title) return
    if (editing) update.mutate({ id: editing, payload: form }, { onSuccess: closeForm })
    else create.mutate(form, { onSuccess: closeForm })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">प्रेस विज्ञप्ति</CardTitle>
            <CardDescription>आधिकारिक विज्ञप्तियां जोड़ें, संपादित करें या हटाएं</CardDescription>
          </div>
          <Button onClick={openCreate} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-1.5" />नई विज्ञप्ति
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...
            </div>
          ) : !items?.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">अभी कोई प्रेस विज्ञप्ति नहीं है।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>शीर्षक</TableHead>
                  <TableHead className="hidden sm:table-cell">प्रकाशक</TableHead>
                  <TableHead className="hidden md:table-cell">तिथि</TableHead>
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
                    <TableCell className="hidden sm:table-cell text-sm text-gray-500">{item.publishedBy || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-500">{fmtDate(item.publishedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => openEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setDeleting({ id: item.id, title: item.title })}>
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

      <Dialog open={open} onOpenChange={v => !v && closeForm()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "प्रेस विज्ञप्ति अपडेट करें" : "नई प्रेस विज्ञप्ति जोड़ें"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>शीर्षक *</Label>
              <Input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="विज्ञप्ति का शीर्षक" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>प्रकाशक</Label>
                <Input value={form.publishedBy || ""} onChange={e => setForm(f => ({ ...f, publishedBy: e.target.value }))} placeholder="समाज अध्यक्ष" />
              </div>
              <div className="space-y-1.5">
                <Label>तिथि</Label>
                <Input type="date" value={form.publishedAt ? new Date(form.publishedAt).toLocaleDateString("en-CA") : ""} onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))} />
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>इमेज URL</Label>
                <Input value={form.imageUrl || ""} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label>PDF URL</Label>
                <Input value={form.pdfUrl || ""} onChange={e => setForm(f => ({ ...f, pdfUrl: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={!form.title || saving} className="bg-orange-600 hover:bg-orange-700 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              {editing ? "अपडेट करें" : "जोड़ें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""}
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// EVENTS PANEL
// ══════════════════════════════════════════════════════════════════════════════

function EventsPanel() {
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
    if (editing) update.mutate({ id: editing, payload: form }, { onSuccess: closeForm })
    else create.mutate(form, { onSuccess: closeForm })
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
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...
            </div>
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
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => openEdit(item)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setDeleting({ id: item.id, title: item.title })}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
          <DialogHeader>
            <DialogTitle>{editing ? "कार्यक्रम अपडेट करें" : "नया कार्यक्रम जोड़ें"}</DialogTitle>
          </DialogHeader>
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
              <Label>इमेज URL</Label>
              <Input value={form.imageUrl || ""} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label>विवरण</Label>
              <Textarea value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="कार्यक्रम का विवरण..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={!form.title || !form.date || saving} className="bg-orange-600 hover:bg-orange-700 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              {editing ? "अपडेट करें" : "जोड़ें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""}
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// POSTS MODERATION PANEL
// ══════════════════════════════════════════════════════════════════════════════

function PostsPanel() {
  const { data: posts, isLoading } = useSamajPosts({ status: "all" })
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
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...
            </div>
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
                          onClick={() => update.mutate({ id: post.id, payload: { status: post.status === "published" ? "hidden" : "published" } })}>
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
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function SamajContentPage() {
  const [tab, setTab] = useState<Tab>("news")
  const active = TABS.find(t => t.id === tab)!

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-orange-100">
          <active.icon className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">समाज पोर्टल प्रबंधन</h2>
          <p className="text-sm text-gray-500">{active.desc}</p>
        </div>
      </div>

      {/* Tab bar — matches existing admin tab style */}
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

      {tab === "news"   && <NewsPanel />}
      {tab === "press"  && <PressPanel />}
      {tab === "events" && <EventsPanel />}
      {tab === "posts"  && <PostsPanel />}
    </div>
  )
}

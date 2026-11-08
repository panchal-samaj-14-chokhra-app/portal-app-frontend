"use client"

import { useState } from "react"
import RichTextEditor from "@/components/superadmin/rich-text-editor"
import { Plus, Pencil, Trash2, Loader2, BookOpen, ScrollText, ChevronLeft, ChevronUp, ChevronDown, Eye, EyeOff, Save } from "lucide-react"
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
import {
  useNiyamavaliArticlesAdmin, useCreateNiyamavaliArticle,
  useUpdateNiyamavaliArticle, useDeleteNiyamavaliArticle,
  useNiyamavaliSectionsAdmin, useCreateNiyamavaliSection,
  useUpdateNiyamavaliSection, useDeleteNiyamavaliSection,
} from "@/data-hooks/mutation-query/useNiyamavali"
import type { NiyamavaliArticle, NiyamavaliSection, NiyamavaliGroup } from "@/data-hooks/requests/niyamavali"
import { NIYAMAVALI_GROUPS } from "@/data-hooks/requests/niyamavali"

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={status === "published"
      ? "bg-green-100 text-green-700 hover:bg-green-100 border-0"
      : "bg-gray-100 text-gray-500 hover:bg-gray-100 border-0"}>
      {status === "published" ? "प्रकाशित" : "ड्राफ़्ट"}
    </Badge>
  )
}

function GroupBadge({ group }: { group?: string }) {
  const g = NIYAMAVALI_GROUPS.find(x => x.value === group) ?? NIYAMAVALI_GROUPS[0]
  return (
    <Badge className={`${g.bg} ${g.color} hover:${g.bg} border-0 font-medium`}>
      {g.label}
    </Badge>
  )
}

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


function SectionsPanel({ article, onBack }: { article: NiyamavaliArticle; onBack: () => void }) {
  const { toast } = useToast()
  const { data: sections, isLoading } = useNiyamavaliSectionsAdmin(article.id)
  const create = useCreateNiyamavaliSection()
  const update = useUpdateNiyamavaliSection()
  const remove = useDeleteNiyamavaliSection()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<NiyamavaliSection>>({ status: "published", order: 0, content: "" })
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)
  const saving = create.isPending || update.isPending

  const openCreate = () => {
    const nextOrder = sections?.length ?? 0
    setEditing(null); setForm({ status: "published", order: nextOrder, content: "", articleId: article.id }); setOpen(true)
  }
  const openEdit = (s: NiyamavaliSection) => { setEditing(s.id); setForm({ ...s }); setOpen(true) }
  const closeForm = () => { setOpen(false); setEditing(null); setForm({ status: "published", order: 0, content: "" }) }

  const handleSave = () => {
    if (!form.title) return
    const cb = {
      onSuccess: () => { toast({ title: editing ? "अनुभाग अपडेट हुआ" : "अनुभाग जोड़ा गया", variant: "success" }); closeForm() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
    }
    if (editing) update.mutate({ id: editing, payload: form }, cb)
    else create.mutate({ ...form, articleId: article.id }, cb)
  }

  const toggleStatus = (s: NiyamavaliSection) =>
    update.mutate({ id: s.id, payload: { status: s.status === "published" ? "draft" : "published" } },
      { onSuccess: () => toast({ title: "स्थिति बदली", variant: "success" }) })

  const moveOrder = (s: NiyamavaliSection, dir: 1 | -1) => {
    if (!sections) return
    const idx = sections.findIndex(x => x.id === s.id)
    const other = sections[idx + dir]
    if (!other) return
    update.mutate({ id: s.id, payload: { order: other.order } }, { onSuccess: () => {} })
    update.mutate({ id: other.id, payload: { order: s.order } }, { onSuccess: () => {} })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-orange-600 hover:bg-orange-50 -ml-2 mb-1" onClick={onBack}>
              <ChevronLeft className="w-4 h-4 mr-0.5" />वापस
            </Button>
            <CardTitle className="text-base">{article.title} — अनुभाग</CardTitle>
            <CardDescription>इस अनुच्छेद के अनुभाग (Sections) प्रबंधित करें</CardDescription>
          </div>
          <Button onClick={openCreate} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-1.5" />नया अनुभाग
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
          ) : !sections?.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">अभी कोई अनुभाग नहीं है।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">क्र.</TableHead>
                  <TableHead>शीर्षक</TableHead>
                  <TableHead className="hidden md:table-cell">सामग्री झलक</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead className="text-right">क्रिया</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((sec, i) => (
                  <TableRow key={sec.id}>
                    <TableCell className="text-sm text-gray-500 font-mono">{i + 1}</TableCell>
                    <TableCell className="font-medium max-w-[160px]"><div className="truncate">{sec.title}</div></TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-gray-400 max-w-[200px]">
                      <div className="truncate">{sec.content?.replace(/<[^>]+>/g, "").slice(0, 70) || "—"}</div>
                    </TableCell>
                    <TableCell><StatusBadge status={sec.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveOrder(sec, -1)} disabled={i === 0}><ChevronUp className="w-3.5 h-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveOrder(sec, 1)} disabled={i === sections.length - 1}><ChevronDown className="w-3.5 h-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:bg-gray-100" onClick={() => toggleStatus(sec)}>
                          {sec.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => openEdit(sec)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setDeleting({ id: sec.id, title: sec.title })}><Trash2 className="w-4 h-4" /></Button>
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
        <DialogContent className="max-w-[960px] w-[96vw] max-h-[96vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "अनुभाग संपादित करें" : "नया अनुभाग जोड़ें"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>अनुभाग शीर्षक *</Label>
                <Input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="जैसे: विवाह समारोह की विधि" />
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
              <Label>सामग्री</Label>
              <RichTextEditor
                key={editing || "new"}
                initialValue={form.content || ""}
                onChange={v => setForm(f => ({ ...f, content: v }))}
                placeholder="नियम का विवरण यहाँ लिखें..."
              />
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
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id, {
            onSuccess: () => { toast({ title: "अनुभाग हटाया गया", variant: "success" }); setDeleting(null) },
            onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
          })
        }} />
    </>
  )
}

function ArticlesPanel({ onSelectArticle }: { onSelectArticle: (a: NiyamavaliArticle) => void }) {
  const { toast } = useToast()
  const { data: articles, isLoading } = useNiyamavaliArticlesAdmin()
  const create = useCreateNiyamavaliArticle()
  const update = useUpdateNiyamavaliArticle()
  const remove = useDeleteNiyamavaliArticle()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<NiyamavaliArticle>>({ status: "published", group: "shubh", order: 0 })
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)
  const saving = create.isPending || update.isPending

  // Group articles by their group value for display
  const grouped = NIYAMAVALI_GROUPS.map(g => ({
    ...g,
    articles: (articles ?? []).filter(a => (a.group || "shubh") === g.value),
  })).filter(g => g.articles.length > 0)

  const openCreate = () => { setEditing(null); setForm({ status: "published", group: "shubh", order: articles?.length ?? 0 }); setOpen(true) }
  const openEdit = (a: NiyamavaliArticle) => { setEditing(a.id); setForm({ ...a }); setOpen(true) }
  const closeForm = () => { setOpen(false); setEditing(null); setForm({ status: "published", order: 0 }) }

  const handleSave = () => {
    if (!form.title) return
    const cb = {
      onSuccess: () => { toast({ title: editing ? "लेख अपडेट हुआ" : "लेख जोड़ा गया", variant: "success" }); closeForm() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
    }
    if (editing) update.mutate({ id: editing, payload: form }, cb)
    else create.mutate(form, cb)
  }

  const moveOrder = (a: NiyamavaliArticle, dir: 1 | -1) => {
    if (!articles) return
    const idx = articles.findIndex(x => x.id === a.id)
    const other = articles[idx + dir]
    if (!other) return
    update.mutate({ id: a.id, payload: { order: other.order } }, { onSuccess: () => {} })
    update.mutate({ id: other.id, payload: { order: a.order } }, { onSuccess: () => {} })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">नियमावली — अनुच्छेद</CardTitle>
            <CardDescription>प्रत्येक अनुच्छेद में अनेक अनुभाग होंगे। "अनुभाग" बटन दबाकर अनुभाग जोड़ें।</CardDescription>
          </div>
          <Button onClick={openCreate} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-1.5" />नया अनुच्छेद
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
          ) : !articles?.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">अभी कोई अनुच्छेद नहीं है।</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {grouped.map(grp => (
                <div key={grp.value}>
                  {/* Group header */}
                  <div className={`flex items-center gap-2 px-4 py-2 ${grp.bg}`}>
                    <span className={`text-xs font-bold uppercase tracking-wider ${grp.color}`}>{grp.label}</span>
                    <span className={`text-xs ${grp.color} opacity-70`}>({grp.articles.length} अनुच्छेद)</span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-14">अनु.</TableHead>
                        <TableHead>शीर्षक</TableHead>
                        <TableHead className="hidden sm:table-cell">विवरण</TableHead>
                        <TableHead className="hidden md:table-cell">अनुभाग</TableHead>
                        <TableHead>स्थिति</TableHead>
                        <TableHead className="text-right">क्रिया</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grp.articles.map((art, i) => (
                        <TableRow key={art.id}>
                          <TableCell className="text-sm text-gray-500 font-mono">{art.articleNumber || (i + 1)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ScrollText className={`w-4 h-4 shrink-0 ${grp.color}`} />
                              <span className="font-medium">{art.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-gray-400 max-w-[180px]">
                            <div className="truncate">{art.description || "—"}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-gray-500">{art._count?.sections ?? "—"}</TableCell>
                          <TableCell><StatusBadge status={art.status} /></TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-0.5">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveOrder(art, -1)} disabled={i === 0}><ChevronUp className="w-3.5 h-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveOrder(art, 1)} disabled={i === grp.articles.length - 1}><ChevronDown className="w-3.5 h-3.5" /></Button>
                              <Button size="sm" variant="outline" className="h-8 px-2.5 text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => onSelectArticle(art)}>
                                अनुभाग
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => openEdit(art)}><Pencil className="w-4 h-4" /></Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setDeleting({ id: art.id, title: art.title })}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={v => !v && closeForm()}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "अनुच्छेद अपडेट करें" : "नया अनुच्छेद जोड़ें"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>शीर्षक *</Label>
              <Input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="जैसे: विवाह (शादी)" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>अनुच्छेद संख्या</Label>
                <Input value={form.articleNumber || ""} onChange={e => setForm(f => ({ ...f, articleNumber: e.target.value }))} placeholder="1" />
              </div>
              <div className="space-y-1.5">
                <Label>क्रम</Label>
                <Input type="number" value={form.order ?? 0} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>विवरण</Label>
              <Textarea value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>समूह</Label>
              <Select value={(form.group as string) || "shubh"} onValueChange={v => setForm(f => ({ ...f, group: v as NiyamavaliGroup }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {NIYAMAVALI_GROUPS.map(g => (
                    <SelectItem key={g.value} value={g.value}>
                      <span className={g.color}>{g.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={!form.title || saving} className="bg-orange-600 hover:bg-orange-700 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}{editing ? "सहेजें" : "जोड़ें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""}
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id, {
            onSuccess: () => { toast({ title: "अनुच्छेद हटाया गया", variant: "success" }); setDeleting(null) },
            onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
          })
        }} />
    </>
  )
}

export default function NiyamavaliManagement() {
  const [selectedArticle, setSelectedArticle] = useState<NiyamavaliArticle | null>(null)

  if (selectedArticle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100"><ScrollText className="w-5 h-5 text-orange-600" /></div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">अनुभाग प्रबंधन</h2>
            <p className="text-sm text-gray-500">{selectedArticle.title}</p>
          </div>
        </div>
        <SectionsPanel article={selectedArticle} onBack={() => setSelectedArticle(null)} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-orange-100"><BookOpen className="w-5 h-5 text-orange-600" /></div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">नियमावली प्रबंधन</h2>
          <p className="text-sm text-gray-500">अनुच्छेद जोड़ें → "अनुभाग" बटन से उसके अनुभाग संपादित करें</p>
        </div>
      </div>
      <ArticlesPanel onSelectArticle={setSelectedArticle} />
    </div>
  )
}

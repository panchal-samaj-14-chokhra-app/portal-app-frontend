"use client"

import { useState } from "react"
import {
  Plus, Pencil, Trash2, Loader2, BookOpen, List, FileText,
  Eye, EyeOff, ChevronRight, ChevronLeft, Save, Upload,
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
import {
  useNiyamavaliPublicationsAdmin, useCreateNiyamavaliPublication,
  useUpdateNiyamavaliPublication, useDeleteNiyamavaliPublication,
  useNiyamavaliCategoriesAdmin, useCreateNiyamavaliCategory,
  useUpdateNiyamavaliCategory, useDeleteNiyamavaliCategory,
  useNiyamavaliSubcategoriesAdmin, useCreateNiyamavaliSubcategory,
  useUpdateNiyamavaliSubcategory, useDeleteNiyamavaliSubcategory,
  useNiyamavaliArticlesAdmin, useCreateNiyamavaliArticle,
  useUpdateNiyamavaliArticle, useDeleteNiyamavaliArticle,
} from "@/data-hooks/mutation-query/useNiyamavali"
import type {
  NiyamavaliPublication, NiyamavaliCategory, NiyamavaliSubcategory, NiyamavaliArticle,
} from "@/data-hooks/requests/niyamavali"

// ── Shared helpers ────────────────────────────────────────────────────────────

function ConfirmDelete({ open, onClose, onConfirm, label }: { open: boolean; onClose: () => void; onConfirm: () => void; label: string }) {
  return (
    <AlertDialog open={open} onOpenChange={v => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>हटाएं?</AlertDialogTitle>
          <AlertDialogDescription>"{label}" को स्थायी रूप से हटाया जाएगा। इसके सभी उप-भाग और लेख भी हट जाएंगे।</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>रद्द करें</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">हटाएं</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

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
        <Input value={value || ""} onChange={e => onChange(e.target.value)} placeholder="कवर इमेज URL या अपलोड करें" className="flex-1" />
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

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "published" ? "default" : "secondary"}
      className={status === "published" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
      {status === "published" ? "प्रकाशित" : "ड्राफ़्ट"}
    </Badge>
  )
}

// ── Publications Panel ────────────────────────────────────────────────────────

function PublicationsPanel({ onSelectPub }: { onSelectPub: (id: string, title: string) => void }) {
  const { toast } = useToast()
  const { data: items, isLoading } = useNiyamavaliPublicationsAdmin()
  const create = useCreateNiyamavaliPublication()
  const update = useUpdateNiyamavaliPublication()
  const remove = useDeleteNiyamavaliPublication()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<NiyamavaliPublication>>({ status: "published", order: 0 })
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)
  const saving = create.isPending || update.isPending

  const openCreate = () => { setEditing(null); setForm({ status: "published", order: 0 }); setOpen(true) }
  const openEdit = (item: NiyamavaliPublication) => { setEditing(item.id); setForm({ ...item }); setOpen(true) }
  const closeForm = () => { setOpen(false); setEditing(null); setForm({ status: "published", order: 0 }) }
  const handleSave = () => {
    if (!form.title) return
    const cb = {
      onSuccess: () => { toast({ title: editing ? "प्रकाशन अपडेट हुआ" : "प्रकाशन जोड़ा गया", variant: "success" }); closeForm() },
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
            <CardTitle className="text-base">प्रकाशन (Publications)</CardTitle>
            <CardDescription>नियमावली प्रकाशनों की सूची — प्रत्येक प्रकाशन में भाग (Categories) होते हैं</CardDescription>
          </div>
          <Button onClick={openCreate} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-1.5" />नया प्रकाशन
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
          ) : !items?.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">अभी कोई प्रकाशन नहीं है।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>शीर्षक</TableHead>
                  <TableHead className="hidden sm:table-cell">वर्ष</TableHead>
                  <TableHead className="hidden md:table-cell">भाग</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead className="text-right">क्रिया</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-orange-400 shrink-0" />
                        <div>
                          <div>{item.title}</div>
                          {item.subtitle && <div className="text-xs text-gray-400">{item.subtitle}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-gray-500">{item.year || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-500">{item._count?.categories ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="outline" className="h-8 px-2.5 text-orange-600 border-orange-200 hover:bg-orange-50"
                          onClick={() => onSelectPub(item.id, item.title)}>
                          भाग <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
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
          <DialogHeader><DialogTitle>{editing ? "प्रकाशन अपडेट करें" : "नया प्रकाशन जोड़ें"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>शीर्षक *</Label>
              <Input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="पंचाल समाज चौदह चौखरा" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>उपशीर्षक</Label>
                <Input value={form.subtitle || ""} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="सामाजिक नियमावली" />
              </div>
              <div className="space-y-1.5">
                <Label>वर्ष</Label>
                <Input value={form.year || ""} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2026" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>क्रम</Label>
                <Input type="number" value={form.order ?? 0} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
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
              <Label>परिचय</Label>
              <Textarea value={form.introduction || ""} onChange={e => setForm(f => ({ ...f, introduction: e.target.value }))} placeholder="शुभ प्रसंग • अशुभ प्रसंग..." rows={4} />
            </div>
            <div className="space-y-1.5">
              <Label>कवर इमेज</Label>
              <ImageUploadField value={form.coverImage || ""} onChange={v => setForm(f => ({ ...f, coverImage: v }))} />
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
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => { toast({ title: "हटा दिया", variant: "success" }); setDeleting(null) }, onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) }) }} />
    </>
  )
}

// ── Categories Panel ──────────────────────────────────────────────────────────

function CategoriesPanel({
  publicationId, publicationTitle, onBack, onSelectCat,
}: {
  publicationId: string; publicationTitle: string;
  onBack: () => void; onSelectCat: (id: string, title: string) => void;
}) {
  const { toast } = useToast()
  const { data: items, isLoading } = useNiyamavaliCategoriesAdmin(publicationId)
  const create = useCreateNiyamavaliCategory()
  const update = useUpdateNiyamavaliCategory()
  const remove = useDeleteNiyamavaliCategory()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<NiyamavaliCategory>>({ status: "published", order: 0 })
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)
  const saving = create.isPending || update.isPending

  const openCreate = () => { setEditing(null); setForm({ status: "published", order: 0, publicationId }); setOpen(true) }
  const openEdit = (item: NiyamavaliCategory) => { setEditing(item.id); setForm({ ...item }); setOpen(true) }
  const closeForm = () => { setOpen(false); setEditing(null); setForm({ status: "published", order: 0 }) }
  const handleSave = () => {
    if (!form.title) return
    const cb = {
      onSuccess: () => { toast({ title: editing ? "भाग अपडेट हुआ" : "भाग जोड़ा गया", variant: "success" }); closeForm() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
    }
    if (editing) update.mutate({ id: editing, payload: form }, cb)
    else create.mutate({ ...form, publicationId }, cb)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-orange-600 hover:bg-orange-50 -ml-2 mb-1" onClick={onBack}>
              <ChevronLeft className="w-4 h-4 mr-0.5" />वापस
            </Button>
            <CardTitle className="text-base">भाग — {publicationTitle}</CardTitle>
            <CardDescription>इस प्रकाशन के भाग (Bhag / Categories) प्रबंधित करें</CardDescription>
          </div>
          <Button onClick={openCreate} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-1.5" />नया भाग
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
          ) : !items?.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">अभी कोई भाग नहीं है।</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>भाग शीर्षक</TableHead>
                  <TableHead className="hidden sm:table-cell">क्रम</TableHead>
                  <TableHead className="hidden md:table-cell">लेख</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead className="text-right">क्रिया</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div>{item.title}</div>
                      {item.description && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{item.description}</div>}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-gray-500">{item.order}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-500">{item._count?.articles ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="outline" className="h-8 px-2.5 text-orange-600 border-orange-200 hover:bg-orange-50"
                          onClick={() => onSelectCat(item.id, item.title)}>
                          लेख <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
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
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "भाग अपडेट करें" : "नया भाग जोड़ें"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>भाग शीर्षक *</Label>
              <Input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="भाग–1 : शुभ प्रसंगों की सामाजिक नियमावली" />
            </div>
            <div className="space-y-1.5">
              <Label>विवरण</Label>
              <Textarea value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="इस भाग का संक्षिप्त विवरण..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>क्रम</Label>
                <Input type="number" value={form.order ?? 0} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
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
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => { toast({ title: "भाग हटाया गया", variant: "success" }); setDeleting(null) }, onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) }) }} />
    </>
  )
}

// ── Articles Panel ────────────────────────────────────────────────────────────

function ArticlesPanel({
  categoryId, categoryTitle, pubTitle, onBack,
}: {
  categoryId: string; categoryTitle: string; pubTitle: string; onBack: () => void;
}) {
  const { toast } = useToast()
  const { data: items, isLoading } = useNiyamavaliArticlesAdmin(categoryId)
  const { data: subcats } = useNiyamavaliSubcategoriesAdmin(categoryId)
  const create = useCreateNiyamavaliArticle()
  const update = useUpdateNiyamavaliArticle()
  const remove = useDeleteNiyamavaliArticle()

  // Subcategory CRUD inline
  const createSub = useCreateNiyamavaliSubcategory()
  const updateSub = useUpdateNiyamavaliSubcategory()
  const removeSub = useDeleteNiyamavaliSubcategory()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<NiyamavaliArticle>>({ status: "published", order: 0, content: "" })
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)

  const [subOpen, setSubOpen] = useState(false)
  const [subForm, setSubForm] = useState<Partial<NiyamavaliSubcategory>>({ status: "published", order: 0 })
  const [subEditing, setSubEditing] = useState<string | null>(null)
  const [subDeleting, setSubDeleting] = useState<{ id: string; title: string } | null>(null)

  const saving = create.isPending || update.isPending

  const openCreate = () => { setEditing(null); setForm({ status: "published", order: 0, content: "", categoryId }); setOpen(true) }
  const openEdit = (item: NiyamavaliArticle) => { setEditing(item.id); setForm({ ...item }); setOpen(true) }
  const closeForm = () => { setOpen(false); setEditing(null); setForm({ status: "published", order: 0, content: "" }) }
  const handleSave = () => {
    if (!form.title) return
    const cb = {
      onSuccess: () => { toast({ title: editing ? "लेख अपडेट हुआ" : "लेख जोड़ा गया", variant: "success" }); closeForm() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
    }
    if (editing) update.mutate({ id: editing, payload: form }, cb)
    else create.mutate({ ...form, categoryId }, cb)
  }
  const toggleStatus = (item: NiyamavaliArticle) =>
    update.mutate({ id: item.id, payload: { status: item.status === "published" ? "draft" : "published" } },
      { onSuccess: () => toast({ title: "स्थिति बदली", variant: "success" }) })

  const openSubCreate = () => { setSubEditing(null); setSubForm({ status: "published", order: 0, categoryId }); setSubOpen(true) }
  const openSubEdit = (item: NiyamavaliSubcategory) => { setSubEditing(item.id); setSubForm({ ...item }); setSubOpen(true) }
  const closeSubForm = () => { setSubOpen(false); setSubEditing(null); setSubForm({ status: "published", order: 0 }) }
  const handleSubSave = () => {
    if (!subForm.title) return
    const cb = {
      onSuccess: () => { toast({ title: subEditing ? "उपभाग अपडेट हुआ" : "उपभाग जोड़ा गया", variant: "success" }); closeSubForm() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
    }
    if (subEditing) updateSub.mutate({ id: subEditing, payload: subForm }, cb)
    else createSub.mutate({ ...subForm, categoryId }, cb)
  }

  return (
    <>
      <div className="space-y-4">
        {/* Subcategories compact manager */}
        {(subcats && subcats.length > 0) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
              <CardTitle className="text-sm text-gray-600">उपभाग ({subcats.length})</CardTitle>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={openSubCreate}><Plus className="w-3 h-3 mr-1" />उपभाग</Button>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <div className="flex flex-wrap gap-2">
                {subcats.map(s => (
                  <div key={s.id} className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-lg px-2.5 py-1 text-xs">
                    <span className="text-orange-800 font-medium">{s.title}</span>
                    <button onClick={() => openSubEdit(s)} className="text-orange-400 hover:text-orange-700"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => setSubDeleting({ id: s.id, title: s.title })} className="text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Articles list */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-orange-600 hover:bg-orange-50 -ml-2 mb-1" onClick={onBack}>
                <ChevronLeft className="w-4 h-4 mr-0.5" />वापस
              </Button>
              <CardTitle className="text-base">लेख — {categoryTitle}</CardTitle>
              <CardDescription className="text-xs">{pubTitle}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={openSubCreate} size="sm" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                <Plus className="w-4 h-4 mr-1" />उपभाग
              </Button>
              <Button onClick={openCreate} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="w-4 h-4 mr-1.5" />नया लेख
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
            ) : !items?.length ? (
              <div className="text-center py-12 text-gray-400 text-sm">अभी कोई लेख नहीं है।</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">अनु.</TableHead>
                    <TableHead>शीर्षक</TableHead>
                    <TableHead className="hidden sm:table-cell">उपभाग</TableHead>
                    <TableHead className="hidden md:table-cell">सामग्री</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead className="text-right">क्रिया</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-sm text-gray-500">{item.articleNumber || (idx + 1)}</TableCell>
                      <TableCell className="font-medium max-w-[160px] truncate">{item.title}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-gray-400">{item.subcategory?.title || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-gray-400 max-w-[160px]">
                        <div className="truncate">{item.content?.replace(/<[^>]+>/g, "").slice(0, 60) || "—"}</div>
                      </TableCell>
                      <TableCell><StatusBadge status={item.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:bg-gray-100" onClick={() => toggleStatus(item)}>
                            {item.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
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
      </div>

      {/* Article dialog */}
      <Dialog open={open} onOpenChange={v => !v && closeForm()}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "लेख संपादित करें" : "नया लेख जोड़ें"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>लेख शीर्षक *</Label>
              <Input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="जैसे: श्रीमंत मुहूर्त एवं गोद भराई" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>अनुच्छेद संख्या</Label>
                <Input value={form.articleNumber || ""} onChange={e => setForm(f => ({ ...f, articleNumber: e.target.value }))} placeholder="1" />
              </div>
              <div className="space-y-1.5">
                <Label>क्रम</Label>
                <Input type="number" value={form.order ?? 0} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
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
            {subcats && subcats.length > 0 && (
              <div className="space-y-1.5">
                <Label>उपभाग (वैकल्पिक)</Label>
                <Select value={form.subcategoryId || ""} onValueChange={v => setForm(f => ({ ...f, subcategoryId: v || undefined }))}>
                  <SelectTrigger><SelectValue placeholder="— कोई उपभाग नहीं —" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">— कोई उपभाग नहीं —</SelectItem>
                    {subcats.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>सामग्री (HTML / plain text) *</Label>
              <p className="text-xs text-gray-400">
                HTML tags जैसे &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;ol&gt;&lt;li&gt;, &lt;strong&gt;, &lt;br&gt; उपयोग करें।
              </p>
              <Textarea
                value={form.content || ""}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="<h3>नियम 1</h3><p>विवरण यहाँ लिखें...</p>"
                rows={16}
                className="font-mono text-sm leading-relaxed"
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

      {/* Subcategory dialog */}
      <Dialog open={subOpen} onOpenChange={v => !v && closeSubForm()}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{subEditing ? "उपभाग अपडेट करें" : "नया उपभाग जोड़ें"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>उपभाग शीर्षक *</Label>
              <Input value={subForm.title || ""} onChange={e => setSubForm(f => ({ ...f, title: e.target.value }))} placeholder="उपभाग का नाम" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>क्रम</Label>
                <Input type="number" value={subForm.order ?? 0} onChange={e => setSubForm(f => ({ ...f, order: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>स्थिति</Label>
                <Select value={subForm.status || "published"} onValueChange={v => setSubForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">प्रकाशित</SelectItem>
                    <SelectItem value="draft">ड्राफ़्ट</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeSubForm}>रद्द करें</Button>
            <Button onClick={handleSubSave} disabled={!subForm.title || createSub.isPending || updateSub.isPending} className="bg-orange-600 hover:bg-orange-700 text-white">
              {(createSub.isPending || updateSub.isPending) && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              {subEditing ? "सहेजें" : "जोड़ें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""}
        onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => { toast({ title: "लेख हटाया गया", variant: "success" }); setDeleting(null) }, onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) }) }} />
      <ConfirmDelete open={!!subDeleting} onClose={() => setSubDeleting(null)} label={subDeleting?.title || ""}
        onConfirm={() => { if (subDeleting) removeSub.mutate(subDeleting.id, { onSuccess: () => { toast({ title: "उपभाग हटाया गया", variant: "success" }); setSubDeleting(null) }, onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) }) }} />
    </>
  )
}

// ── Main exported component ───────────────────────────────────────────────────

export default function NiyamavaliManagement() {
  const [selectedPub, setSelectedPub] = useState<{ id: string; title: string } | null>(null)
  const [selectedCat, setSelectedCat] = useState<{ id: string; title: string } | null>(null)

  if (selectedCat && selectedPub) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100">
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">नियमावली — लेख</h2>
            <p className="text-sm text-gray-500">{selectedPub.title} → {selectedCat.title}</p>
          </div>
        </div>
        <ArticlesPanel
          categoryId={selectedCat.id}
          categoryTitle={selectedCat.title}
          pubTitle={selectedPub.title}
          onBack={() => setSelectedCat(null)}
        />
      </div>
    )
  }

  if (selectedPub) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100">
            <List className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">नियमावली — भाग</h2>
            <p className="text-sm text-gray-500">{selectedPub.title}</p>
          </div>
        </div>
        <CategoriesPanel
          publicationId={selectedPub.id}
          publicationTitle={selectedPub.title}
          onBack={() => setSelectedPub(null)}
          onSelectCat={(id, title) => setSelectedCat({ id, title })}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-orange-100">
          <BookOpen className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">नियमावली प्रबंधन</h2>
          <p className="text-sm text-gray-500">प्रकाशन चुनें → भाग देखें → लेख जोड़ें / संपादित करें</p>
        </div>
      </div>
      <PublicationsPanel onSelectPub={(id, title) => setSelectedPub({ id, title })} />
    </div>
  )
}

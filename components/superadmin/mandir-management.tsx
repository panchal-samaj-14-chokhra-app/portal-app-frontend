"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Pencil, Trash2, Loader2, ArrowLeft, Save, Upload, ImageIcon } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import RichTextEditor from "./rich-text-editor"
import { useBlogs, useBlog, useCreateBlog, useUpdateBlog, useDeleteBlog } from "@/data-hooks/mutation-query/useBlog"
import { uploadBlogImage } from "@/data-hooks/requests/blog"
import MandirContent from "./mandir-content"
import MandirSubscribers from "./mandir-subscribers"

type View = { mode: "list" } | { mode: "new" } | { mode: "edit"; id: string }

const empty = { title: "", excerpt: "", author: "", coverImage: "", content: "", status: "draft" }

function BlogEditor({ id, onBack }: { id?: string; onBack: () => void }) {
  const { toast } = useToast()
  const { data: existing, isLoading } = useBlog(id)
  const create = useCreateBlog()
  const update = useUpdateBlog()
  const [form, setForm] = useState<any>(empty)
  const [seeded, setSeeded] = useState(false)
  const [uploading, setUploading] = useState(false)

  // seed form once when editing an existing blog
  if (id && existing && !seeded) {
    setForm({
      title: existing.title || "", excerpt: existing.excerpt || "", author: existing.author || "",
      coverImage: existing.coverImage || "", content: existing.content || "", status: existing.status || "draft",
    })
    setSeeded(true)
  }

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))
  const saving = (create as any).isPending || (update as any).isPending

  const onUpload = async (file?: File) => {
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadBlogImage(file)
      set("coverImage", url)
      toast({ title: "इमेज अपलोड हुई", variant: "success" })
    } catch (e: any) {
      toast({ title: "अपलोड त्रुटि", description: e?.message || "इमेज अपलोड नहीं हुई", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const save = (status?: string) => {
    if (!form.title.trim()) {
      toast({ title: "शीर्षक आवश्यक है", variant: "destructive" })
      return
    }
    const payload = { ...form, status: status ?? form.status }
    const onDone = (label: string) => {
      toast({ title: label, variant: "success" })
      onBack()
    }
    if (id) {
      update.mutate({ id, payload }, { onSuccess: () => onDone("ब्लॉग अपडेट हुआ"), onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) })
    } else {
      create.mutate(payload, { onSuccess: () => onDone("ब्लॉग बनाया गया"), onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) })
    }
  }

  if (id && isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-orange-600" /></div>
  }

  return (
    <Card className="bg-white/90 border-orange-200/50">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center text-orange-700">
            <FileText className="w-5 h-5 mr-2" />
            {id ? "ब्लॉग संपादित करें" : "नया ब्लॉग लिखें"}
          </CardTitle>
          <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1.5" />वापस</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">शीर्षक *</label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="ब्लॉग का शीर्षक" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">लेखक</label>
            <Input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="लेखक का नाम" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">स्थिति</label>
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">ड्राफ्ट (Draft)</SelectItem>
                <SelectItem value="published">प्रकाशित (Published)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">संक्षिप्त विवरण (Excerpt)</label>
          <Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="सूची में दिखने वाला छोटा विवरण" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">कवर इमेज</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="इमेज URL या नीचे अपलोड करें" className="flex-1" />
            <label className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer text-sm whitespace-nowrap">
              {uploading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Upload className="w-4 h-4 mr-1.5" />}
              अपलोड
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
            </label>
          </div>
          {form.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.coverImage} alt="cover" className="mt-2 h-28 rounded object-cover border" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ब्लॉग सामग्री</label>
          <RichTextEditor key={id || "new"} initialValue={form.content} onChange={(html) => set("content", html)} />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={() => save("draft")} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
            ड्राफ्ट सहेजें
          </Button>
          <Button onClick={() => save("published")} disabled={saving} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
            प्रकाशित करें
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function BlogList({ onNew, onEdit }: { onNew: () => void; onEdit: (id: string) => void }) {
  const { toast } = useToast()
  const { data: blogs, isLoading } = useBlogs("all")
  const del = useDeleteBlog()
  const [confirm, setConfirm] = useState<{ id: string; title: string } | null>(null)

  return (
    <Card className="bg-white/90 border-orange-200/50">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center text-orange-700"><FileText className="w-5 h-5 mr-2" />ब्लॉग प्रबंधन</CardTitle>
            <CardDescription>मंदिर वेबसाइट के लिए ब्लॉग लिखें एवं प्रकाशित करें।</CardDescription>
          </div>
          <Button onClick={onNew} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <Plus className="w-4 h-4 mr-1.5" />नया ब्लॉग
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-orange-600" /></div>
        ) : !blogs || blogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-14 h-14 mx-auto mb-3 text-gray-300" />
            अभी तक कोई ब्लॉग नहीं — "नया ब्लॉग" से शुरू करें।
          </div>
        ) : (
          <div className="space-y-3">
            {blogs.map((b: any) => (
              <div key={b.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                {b.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.coverImage} alt="" className="w-14 h-14 rounded object-cover border shrink-0" onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")} />
                ) : (
                  <div className="w-14 h-14 rounded bg-orange-50 flex items-center justify-center shrink-0"><ImageIcon className="w-5 h-5 text-orange-300" /></div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 truncate">{b.title}</div>
                  <div className="text-xs text-gray-500 truncate">{b.author || "—"} · {new Date(b.createdAt).toLocaleDateString("hi-IN")}</div>
                </div>
                <Badge variant={b.status === "published" ? "default" : "secondary"} className={b.status === "published" ? "bg-green-100 text-green-700" : ""}>
                  {b.status === "published" ? "प्रकाशित" : "ड्राफ्ट"}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => onEdit(b.id)} className="border-blue-200 text-blue-600 hover:bg-blue-50"><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => setConfirm({ id: b.id, title: b.title })} className="border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ब्लॉग हटाएं?</AlertDialogTitle>
            <AlertDialogDescription>"{confirm?.title}" को हटाने की पुष्टि करें। यह क्रिया वापस नहीं होगी।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (!confirm) return
                del.mutate(confirm.id, {
                  onSuccess: () => { toast({ title: "ब्लॉग हटाया गया", variant: "success" }); setConfirm(null) },
                  onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
                })
              }}
            >
              हां, हटाएं
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function BlogsTab() {
  const [view, setView] = useState<View>({ mode: "list" })
  if (view.mode === "new") return <BlogEditor onBack={() => setView({ mode: "list" })} />
  if (view.mode === "edit") return <BlogEditor id={view.id} onBack={() => setView({ mode: "list" })} />
  return <BlogList onNew={() => setView({ mode: "new" })} onEdit={(id) => setView({ mode: "edit", id })} />
}

const TABS = [
  { key: "content", label: "वेबसाइट सामग्री" },
  { key: "blogs", label: "ब्लॉग" },
  { key: "subscribers", label: "सदस्य एवं ईमेल" },
]

export default function MandirManagement() {
  const [tab, setTab] = useState("content")
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-orange-200 pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? "bg-orange-500 text-white" : "text-orange-700 hover:bg-orange-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "content" && <MandirContent />}
      {tab === "blogs" && <BlogsTab />}
      {tab === "subscribers" && <MandirSubscribers />}
    </div>
  )
}

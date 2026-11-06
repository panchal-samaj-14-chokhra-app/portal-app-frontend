"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Newspaper, FileText, Calendar, MessageSquare, X, Check } from "lucide-react"
import {
  useSamajNewsAdmin, useCreateSamajNews, useUpdateSamajNews, useDeleteSamajNews,
  useSamajPressAdmin, useCreateSamajPress, useUpdateSamajPress, useDeleteSamajPress,
  useSamajEventsAdmin, useCreateSamajEvent, useUpdateSamajEvent, useDeleteSamajEvent,
  useSamajPosts, useUpdateSamajPost, useDeleteSamajPost,
} from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajNews, SamajPressRelease, SamajEvent, SamajPost } from "@/data-hooks/requests/samaj-content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Tab = "news" | "press" | "events" | "posts"

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "news",   label: "समाचार",          icon: Newspaper },
  { id: "press",  label: "प्रेस विज्ञप्ति", icon: FileText },
  { id: "events", label: "कार्यक्रम",       icon: Calendar },
  { id: "posts",  label: "पोस्ट",           icon: MessageSquare },
]

// ── Generic text field ────────────────────────────────────────────────────────

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <Input {...props} />
    </div>
  )
}

function TextArea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <textarea {...props} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
    </div>
  )
}

// ── Confirm delete dialog ──────────────────────────────────────────────────────

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
// NEWS PANEL
// ══════════════════════════════════════════════════════════════════════════════

function NewsPanel() {
  const { data: items, isLoading } = useSamajNewsAdmin()
  const create = useCreateSamajNews()
  const update = useUpdateSamajNews()
  const remove = useDeleteSamajNews()
  const [form, setForm]       = useState<Partial<SamajNews>>({})
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)

  const startEdit = (item: SamajNews) => { setEditing(item.id); setForm(item) }
  const cancelEdit = () => { setEditing(null); setForm({}) }

  const handleSave = () => {
    if (!form.title) return
    if (editing) {
      update.mutate({ id: editing, payload: form }, { onSuccess: cancelEdit })
    } else {
      create.mutate(form, { onSuccess: cancelEdit })
    }
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="bg-orange-50 rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-gray-700 text-sm">{editing ? "समाचार अपडेट करें" : "नया समाचार जोड़ें"}</h3>
        <Field label="शीर्षक *" value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="समाचार का शीर्षक" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="टैग" value={form.tag || ""} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="समाचार" />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">स्थिति</label>
            <Select value={form.status || "published"} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="published">प्रकाशित</SelectItem>
                <SelectItem value="draft">ड्राफ़्ट</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TextArea label="सारांश" value={form.summary || ""} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} rows={2} placeholder="संक्षिप्त विवरण..." />
        <TextArea label="विस्तृत सामग्री" value={form.content || ""} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} placeholder="पूरी सामग्री..." />
        <Field label="इमेज URL" value={form.imageUrl || ""} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={!form.title || create.isPending || update.isPending}
            className="bg-orange-600 hover:bg-orange-700 text-white">
            {(create.isPending || update.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {editing ? "अपडेट करें" : "जोड़ें"}
          </Button>
          {editing && <Button size="sm" variant="ghost" onClick={cancelEdit}><X className="w-4 h-4" /> रद्द करें</Button>}
        </div>
      </div>

      {/* List */}
      {isLoading && <div className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>}
      <div className="space-y-2">
        {items?.map(item => (
          <div key={item.id} className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-orange-100 text-orange-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">{item.tag}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {item.status === "published" ? "प्रकाशित" : "ड्राफ़्ट"}
                </span>
              </div>
              <div className="font-semibold text-gray-800 text-sm mt-1 leading-snug">{item.title}</div>
              {item.summary && <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.summary}</div>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(item)} className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setDeleting({ id: item.id, title: item.title })} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!isLoading && (!items || items.length === 0) && (
          <div className="text-center py-8 text-gray-400 text-sm">अभी कोई समाचार नहीं है।</div>
        )}
      </div>
      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""} onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
    </div>
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
  const [form, setForm]       = useState<Partial<SamajPressRelease>>({})
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)

  const startEdit = (item: SamajPressRelease) => { setEditing(item.id); setForm(item) }
  const cancelEdit = () => { setEditing(null); setForm({}) }
  const handleSave = () => {
    if (!form.title) return
    if (editing) update.mutate({ id: editing, payload: form }, { onSuccess: cancelEdit })
    else create.mutate(form, { onSuccess: cancelEdit })
  }

  return (
    <div className="space-y-4">
      <div className="bg-teal-50 rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-gray-700 text-sm">{editing ? "प्रेस विज्ञप्ति अपडेट करें" : "नई प्रेस विज्ञप्ति जोड़ें"}</h3>
        <Field label="शीर्षक *" value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="विज्ञप्ति का शीर्षक" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="प्रकाशक" value={form.publishedBy || ""} onChange={e => setForm(f => ({ ...f, publishedBy: e.target.value }))} placeholder="समाज अध्यक्ष" />
          <Field label="तिथि" type="date" value={form.publishedAt ? new Date(form.publishedAt).toLocaleDateString("en-CA") : ""} onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))} />
        </div>
        <TextArea label="सारांश" value={form.summary || ""} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} rows={2} placeholder="संक्षिप्त विवरण..." />
        <TextArea label="विस्तृत सामग्री" value={form.content || ""} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} placeholder="पूरी सामग्री..." />
        <div className="grid grid-cols-2 gap-3">
          <Field label="इमेज URL" value={form.imageUrl || ""} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
          <Field label="PDF URL" value={form.pdfUrl || ""} onChange={e => setForm(f => ({ ...f, pdfUrl: e.target.value }))} placeholder="https://..." />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={!form.title || create.isPending || update.isPending}
            className="bg-teal-600 hover:bg-teal-700 text-white">
            {(create.isPending || update.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {editing ? "अपडेट करें" : "जोड़ें"}
          </Button>
          {editing && <Button size="sm" variant="ghost" onClick={cancelEdit}><X className="w-4 h-4" /> रद्द करें</Button>}
        </div>
      </div>

      {isLoading && <div className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>}
      <div className="space-y-2">
        {items?.map(item => (
          <div key={item.id} className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm leading-snug">{item.title}</div>
              {item.publishedBy && <div className="text-xs text-gray-400 mt-0.5">{item.publishedBy} · {new Date(item.publishedAt).toLocaleDateString("hi-IN")}</div>}
              {item.summary && <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.summary}</div>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(item)} className="p-1.5 hover:bg-teal-50 rounded-lg text-teal-500"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setDeleting({ id: item.id, title: item.title })} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!isLoading && (!items || items.length === 0) && (
          <div className="text-center py-8 text-gray-400 text-sm">अभी कोई प्रेस विज्ञप्ति नहीं है।</div>
        )}
      </div>
      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""} onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
    </div>
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
  const [form, setForm]       = useState<Partial<SamajEvent>>({})
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)

  const startEdit = (item: SamajEvent) => { setEditing(item.id); setForm(item) }
  const cancelEdit = () => { setEditing(null); setForm({}) }
  const handleSave = () => {
    if (!form.title || !form.date) return
    if (editing) update.mutate({ id: editing, payload: form }, { onSuccess: cancelEdit })
    else create.mutate(form, { onSuccess: cancelEdit })
  }

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-gray-700 text-sm">{editing ? "कार्यक्रम अपडेट करें" : "नया कार्यक्रम जोड़ें"}</h3>
        <Field label="कार्यक्रम का नाम *" value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="कार्यक्रम का शीर्षक" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="तिथि *" type="date" value={form.date || ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <Field label="समय" value={form.time || ""} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="सुबह 10 बजे" />
        </div>
        <Field label="स्थान / पता" value={form.venue || ""} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} placeholder="बांसवाड़ा, राजस्थान" />
        <Field label="संपर्क नंबर" value={form.contact || ""} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
        <Field label="इमेज URL" value={form.imageUrl || ""} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
        <TextArea label="विवरण" value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="कार्यक्रम का विवरण..." />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={!form.title || !form.date || create.isPending || update.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {(create.isPending || update.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {editing ? "अपडेट करें" : "जोड़ें"}
          </Button>
          {editing && <Button size="sm" variant="ghost" onClick={cancelEdit}><X className="w-4 h-4" /> रद्द करें</Button>}
        </div>
      </div>

      {isLoading && <div className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>}
      <div className="space-y-2">
        {items?.map(item => (
          <div key={item.id} className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm leading-snug">{item.title}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.date}{item.time && ` · ${item.time}`}{item.venue && ` · ${item.venue}`}</div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(item)} className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-500"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setDeleting({ id: item.id, title: item.title })} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!isLoading && (!items || items.length === 0) && (
          <div className="text-center py-8 text-gray-400 text-sm">अभी कोई कार्यक्रम नहीं है।</div>
        )}
      </div>
      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""} onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// POSTS PANEL (admin view — moderate/delete)
// ══════════════════════════════════════════════════════════════════════════════

function PostsPanel() {
  const { data: posts, isLoading } = useSamajPosts({ status: "all" })
  const update = useUpdateSamajPost()
  const remove = useDeleteSamajPost()
  const [deleting, setDeleting] = useState<{ id: string; title: string } | null>(null)

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">सदस्यों की पोस्ट देखें और प्रबंधित करें। पोस्ट को छिपाएं या हटाएं।</p>
      {isLoading && <div className="text-center py-8 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>}
      {posts?.map(post => (
        <div key={post.id} className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs shrink-0">
            {post.authorName.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 text-xs">{post.authorName}{post.authorRole && ` · ${post.authorRole}`}</div>
            <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">{post.content}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{new Date(post.createdAt).toLocaleString("hi-IN")} · {post.likesCount} लाइक · {post._count?.comments || 0} टिप्पणी</div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => update.mutate({ id: post.id, payload: { status: post.status === "published" ? "hidden" : "published" } })}
              className={`p-1.5 rounded-lg text-xs ${post.status === "published" ? "text-gray-400 hover:bg-gray-50" : "text-orange-500 hover:bg-orange-50"}`}
              title={post.status === "published" ? "छिपाएं" : "प्रकाशित करें"}
            >
              {post.status === "published" ? "छिपाएं" : "दिखाएं"}
            </button>
            <button onClick={() => setDeleting({ id: post.id, title: post.content.slice(0, 40) })} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
      {!isLoading && (!posts || posts.length === 0) && (
        <div className="text-center py-8 text-gray-400 text-sm">अभी कोई पोस्ट नहीं है।</div>
      )}
      <ConfirmDelete open={!!deleting} onClose={() => setDeleting(null)} label={deleting?.title || ""} onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function SamajContentPage() {
  const [tab, setTab] = useState<Tab>("news")
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">समाज कंटेंट प्रबंधन</h1>
        <p className="text-gray-400 text-sm mt-1">समाचार, प्रेस विज्ञप्ति, कार्यक्रम और पोस्ट प्रबंधित करें।</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab === t.id ? "bg-white text-orange-700 shadow" : "text-gray-500 hover:text-gray-700"}`}>
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

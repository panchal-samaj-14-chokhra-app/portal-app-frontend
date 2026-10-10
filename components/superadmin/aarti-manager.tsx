"use client"

import { useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, FileText, Loader2, Pencil, Plus, Save, Trash2, Upload, Video, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import RichTextEditor from "./rich-text-editor"
import { useContent } from "@/data-hooks/mutation-query/useContent"
import { getContent, upsertContent } from "@/data-hooks/requests/content"
import { uploadBlogImage } from "@/data-hooks/requests/blog"

// आरती एवं स्तुति: every article or video is one complete item in the list stored under the content key
// "aarti-stuti". Create / edit / delete / switch on-off each save the whole list (read fresh from the server first),
// and the website shows the items that are switched on.
const KEY = "aarti-stuti"
const LEGACY_VIDEOS = "aarti-videos"
const LEGACY_ARTICLES = "aarti-articles"

const CATEGORIES = ["आरती", "मंत्र", "साधना", "स्तोत्र", "भक्ति"]

type Kind = "article" | "video"
type Item = {
  id: string
  type: Kind
  title: string
  category: string
  topic: string
  date: string
  status: "on" | "off"
  image: string
  // video
  url: string
  description: string
  // article
  body: string
}

const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-3)

const blank = (type: Kind): Item => ({
  id: newId(),
  type,
  title: "",
  category: "आरती",
  topic: "",
  date: new Date().toISOString().slice(0, 10),
  status: "on",
  image: "",
  url: "",
  description: "",
  body: "",
})

export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url.trim())
    const host = u.hostname.replace(/^(www|m|music)\./, "")
    let id: string | null = null
    if (host === "youtu.be") id = u.pathname.split("/")[1] || null
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const parts = u.pathname.split("/").filter(Boolean)
      if (parts[0] === "watch") id = u.searchParams.get("v")
      else if (["embed", "shorts", "live", "v"].includes(parts[0])) id = parts[1] || null
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}

const thumbOf = (it: Item) => it.image || (it.type === "video" ? (youtubeId(it.url) ? `https://i.ytimg.com/vi/${youtubeId(it.url)}/hqdefault.jpg` : "") : "")

const str = (v: unknown) => (typeof v === "string" ? v : "")

function fromSaved(raw: any, forced?: Kind): Item {
  const type: Kind = raw?.type === "video" || raw?.type === "article" ? raw.type : forced || "article"
  return {
    id: str(raw?.id) || newId(),
    type,
    title: str(raw?.title),
    category: str(raw?.category),
    topic: str(raw?.topic),
    date: str(raw?.date).slice(0, 10),
    status: raw?.status === "off" ? "off" : "on",
    image: str(raw?.image),
    url: str(raw?.url),
    description: str(raw?.description),
    body: str(raw?.body),
  }
}

// the list as saved: { items: [...] } under the key; entries made by the first version (two separate lists) are carried over
function listFrom(main: any, videos: any, articles: any): { items: Item[]; imported: boolean } {
  if (main && Array.isArray(main.items)) return { items: main.items.map((x: any) => fromSaved(x)), imported: false }
  const legacy = [
    ...(Array.isArray(videos?.items) ? videos.items.map((x: any) => fromSaved(x, "video")) : []),
    ...(Array.isArray(articles?.items) ? articles.items.map((x: any) => fromSaved(x, "article")) : []),
  ]
  return { items: legacy, imported: legacy.length > 0 }
}

function ImageUpload({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)
  const up = async (f?: File) => {
    if (!f) return
    try {
      setBusy(true)
      onChange(await uploadBlogImage(f))
    } catch (e: any) {
      toast({ title: "अपलोड त्रुटि", description: e?.message, variant: "destructive" })
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-32 max-w-full rounded-lg border object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.3")} />
          <button type="button" onClick={() => onChange("")} aria-label="इमेज हटाएँ" className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div>
        <label className="inline-flex w-fit cursor-pointer items-center whitespace-nowrap rounded-md border border-orange-300 px-3 py-2 text-sm text-orange-700 hover:bg-orange-50">
          {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" />}
          {value ? "दूसरी इमेज चुनें" : label}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { up(e.target.files?.[0]); e.target.value = "" }} />
        </label>
      </div>
    </div>
  )
}

function ItemForm({ initial, isNew, saving, onSave, onCancel }: { initial: Item; isNew: boolean; saving: boolean; onSave: (it: Item) => void; onCancel: () => void }) {
  const { toast } = useToast()
  const [it, setIt] = useState<Item>(initial)
  const set = (patch: Partial<Item>) => setIt((p) => ({ ...p, ...patch }))
  const vid = it.type === "video" ? youtubeId(it.url) : null

  const submit = () => {
    if (!it.title.trim()) return toast({ title: "शीर्षक आवश्यक है", variant: "destructive" })
    if (it.type === "video" && !vid) return toast({ title: "सही YouTube लिंक दर्ज करें", description: "जैसे: https://www.youtube.com/watch?v=… या https://youtu.be/…", variant: "destructive" })
    if (it.type === "article" && !it.body.replace(/<[^>]+>/g, "").trim() && !it.body.includes("<img")) return toast({ title: "लेख की सामग्री लिखें", variant: "destructive" })
    onSave({ ...it, title: it.title.trim(), url: it.url.trim() })
  }

  return (
    <Card className="bg-white/90 border-orange-200/50">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-orange-700">{isNew ? "नई सामग्री जोड़ें" : "सामग्री संपादित करें"}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={saving}><ArrowLeft className="mr-1.5 h-4 w-4" />रद्द करें</Button>
            <Button onClick={submit} disabled={saving} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
              {isNew ? "प्रकाशित करें" : "सहेजें"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* type */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">सामग्री का प्रकार</label>
          <div className="inline-flex rounded-lg border border-orange-200 p-1">
            {([["article", "लेख (Article)", FileText], ["video", "वीडियो (Video)", Video]] as const).map(([k, label, Icon]) => (
              <button
                key={k}
                type="button"
                disabled={!isNew && it.type !== k}
                onClick={() => set({ type: k })}
                className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${it.type === k ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50"} disabled:opacity-40`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
          {!isNew && <p className="mt-1 text-xs text-gray-500">प्रकार बदलने के लिए नई सामग्री जोड़ें।</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">शीर्षक *</label>
          <Input value={it.title} onChange={(e) => set({ title: e.target.value })} placeholder={it.type === "video" ? "वीडियो का शीर्षक" : "लेख का शीर्षक"} />
        </div>

        {it.type === "video" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">YouTube वीडियो का लिंक *</label>
            <Input value={it.url} onChange={(e) => set({ url: e.target.value })} placeholder="https://www.youtube.com/watch?v=… या https://youtu.be/…" />
            {it.url && !vid && <p className="mt-1 text-xs text-red-600">यह सही YouTube लिंक नहीं लग रहा।</p>}
            {vid && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`} alt="" className="mt-2 h-24 rounded-lg border object-cover" />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">श्रेणी</label>
            <select
              value={it.category}
              onChange={(e) => set({ category: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              {it.category && !CATEGORIES.includes(it.category) && <option value={it.category}>{it.category}</option>}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">प्रकाशन तिथि</label>
            <Input type="date" value={it.date} onChange={(e) => set({ date: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">विषय विवरण (छोटा परिचय — कार्ड और शेयर में दिखेगा)</label>
          <Input value={it.topic} onChange={(e) => set({ topic: e.target.value })} placeholder="जैसे: माँ त्रिपुरा सुंदरी की संध्या आरती" />
        </div>

        {it.type === "video" ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">विवरण</label>
              <Textarea rows={5} value={it.description} onChange={(e) => set({ description: e.target.value })} placeholder="वीडियो के बारे में लिखें" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">कवर इमेज (वैकल्पिक — न देने पर YouTube की थंबनेल दिखेगी)</label>
              <ImageUpload value={it.image} onChange={(v) => set({ image: v })} label="इमेज अपलोड करें" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">मुख्य इमेज (वैकल्पिक)</label>
              <ImageUpload value={it.image} onChange={(v) => set({ image: v })} label="इमेज अपलोड करें" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">लेख की सामग्री *</label>
              <RichTextEditor key={it.id} initialValue={it.body} onChange={(html) => set({ body: html })} placeholder="यहाँ लेख लिखें — शीर्षक, पैराग्राफ, बोल्ड, सूची आदि जोड़ सकते हैं..." />
            </div>
          </>
        )}

        <div className="flex items-center gap-3">
          <Switch checked={it.status === "on"} onCheckedChange={(v) => set({ status: v ? "on" : "off" })} />
          <span className={`text-sm font-medium ${it.status === "on" ? "text-green-700" : "text-gray-500"}`}>
            {it.status === "on" ? "चालू — वेबसाइट पर दिखेगी" : "बंद — वेबसाइट पर नहीं दिखेगी"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AartiManager({ onBack }: { onBack: () => void }) {
  const { toast } = useToast()
  const qc = useQueryClient()
  const main = useContent(KEY)
  const legacyVideos = useContent(LEGACY_VIDEOS)
  const legacyArticles = useContent(LEGACY_ARTICLES)
  const [busy, setBusy] = useState<string | null>(null)
  const [editing, setEditing] = useState<{ item: Item; isNew: boolean } | null>(null)
  const [filter, setFilter] = useState<"all" | Kind>("all")

  const loading = main.isLoading || legacyVideos.isLoading || legacyArticles.isLoading
  const { items, imported } = useMemo(() => listFrom(main.data, legacyVideos.data, legacyArticles.data), [main.data, legacyVideos.data, legacyArticles.data])

  // Read the saved list again right before writing, so a change made elsewhere is not overwritten
  const commit = async (change: (list: Item[]) => Item[], busyKey: string, okMessage: string): Promise<boolean> => {
    setBusy(busyKey)
    try {
      const [m, v, a] = await Promise.all([getContent(KEY), getContent(LEGACY_VIDEOS).catch(() => null), getContent(LEGACY_ARTICLES).catch(() => null)])
      const next = change(listFrom(m, v, a).items)
      await upsertContent(KEY, { title: "आरती एवं स्तुति", items: next })
      await qc.invalidateQueries({ queryKey: ["content", KEY] })
      toast({ title: okMessage, variant: "success" })
      return true
    } catch (e: any) {
      toast({ title: "सहेजने में त्रुटि", description: e?.message, variant: "destructive" })
      return false
    } finally {
      setBusy(null)
    }
  }

  const save = async (item: Item) => {
    const isNew = editing?.isNew
    const ok = await commit(
      (list) => (list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list]),
      "save",
      isNew ? "सामग्री प्रकाशित हो गई" : "सामग्री सहेज ली गई"
    )
    if (ok) setEditing(null)
  }

  const remove = async (item: Item) => {
    if (!window.confirm(`"${item.title || "यह सामग्री"}" को हटाएँ? यह वेबसाइट से भी हट जाएगी।`)) return
    await commit((list) => list.filter((x) => x.id !== item.id), `del-${item.id}`, "सामग्री हटा दी गई")
  }

  const toggle = (item: Item) =>
    commit((list) => list.map((x) => (x.id === item.id ? { ...x, status: item.status === "on" ? "off" : "on" } : x)), `tg-${item.id}`, item.status === "on" ? "बंद कर दी गई" : "चालू कर दी गई")

  if (editing) {
    return <ItemForm key={editing.item.id} initial={editing.item} isNew={editing.isNew} saving={busy === "save"} onSave={save} onCancel={() => setEditing(null)} />
  }

  const shown = items.filter((i) => filter === "all" || i.type === filter)

  return (
    <Card className="bg-white/90 border-orange-200/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-orange-700">आरती एवं स्तुति — सामग्री ({items.length})</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-1.5 h-4 w-4" />वापस</Button>
            <Button onClick={() => setEditing({ item: blank("article"), isNew: true })} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              <Plus className="mr-1.5 h-4 w-4" />नई सामग्री जोड़ें
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {imported && (
          <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            पहले जोड़ी गई सामग्री यहाँ दिखाई गई है। कोई भी बदलाव सहेजते ही यह नई सूची में सुरक्षित हो जाएगी।
          </p>
        )}

        <div className="inline-flex rounded-lg border border-orange-200 p-1">
          {([["all", "सभी"], ["article", "लेख"], ["video", "वीडियो"]] as const).map(([k, label]) => (
            <button key={k} type="button" onClick={() => setFilter(k)} className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${filter === k ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50"}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-orange-600" /></div>
        ) : shown.length === 0 ? (
          <div className="rounded-lg border border-dashed border-orange-300 py-12 text-center text-gray-500">
            <p>अभी कोई सामग्री नहीं है।</p>
            <Button className="mt-4" variant="outline" onClick={() => setEditing({ item: blank("article"), isNew: true })}>
              <Plus className="mr-1.5 h-4 w-4" />पहली सामग्री जोड़ें
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {shown.map((it) => {
              const thumb = thumbOf(it)
              return (
                <li key={it.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-full shrink-0 items-center justify-center overflow-hidden rounded-md bg-orange-100 sm:w-32">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="h-full w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                    ) : it.type === "video" ? <Video className="h-7 w-7 text-orange-400" /> : <FileText className="h-7 w-7 text-orange-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className={`rounded-full px-2 py-0.5 font-medium ${it.type === "video" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{it.type === "video" ? "वीडियो" : "लेख"}</span>
                      {it.category && <span className="rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-700">{it.category}</span>}
                      {it.date && <span className="text-gray-500">{it.date}</span>}
                    </div>
                    <p className="mt-1 truncate font-medium text-gray-900">{it.title || "(बिना शीर्षक)"}</p>
                    {it.topic && <p className="truncate text-xs text-gray-500">{it.topic}</p>}
                  </div>
                  <div className="flex items-center gap-2 sm:shrink-0">
                    <label className="flex items-center gap-1.5 text-xs text-gray-600" title="वेबसाइट पर दिखाएँ">
                      <Switch checked={it.status === "on"} disabled={busy === `tg-${it.id}`} onCheckedChange={() => toggle(it)} />
                      {it.status === "on" ? "चालू" : "बंद"}
                    </label>
                    <Button size="sm" variant="outline" onClick={() => setEditing({ item: it, isNew: false })}><Pencil className="mr-1 h-4 w-4" />संपादित करें</Button>
                    <Button size="sm" variant="ghost" className="text-red-600" disabled={busy === `del-${it.id}`} onClick={() => remove(it)} aria-label="हटाएँ">
                      {busy === `del-${it.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

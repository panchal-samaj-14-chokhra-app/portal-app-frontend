"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2, Plus, Trash2, Upload, ImageIcon, ChevronUp, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import RichTextEditor from "./rich-text-editor"
import { useContent, useUpsertContent } from "@/data-hooks/mutation-query/useContent"
import { uploadBlogImage, uploadVideo } from "@/data-hooks/requests/blog"
import type { SectionDef, SectionField } from "@/lib/mandir-sections"

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)
  const up = async (f?: File) => {
    if (!f) return
    try { setBusy(true); onChange(await uploadBlogImage(f)) }
    catch (e: any) { toast({ title: "अपलोड त्रुटि", description: e?.message, variant: "destructive" }) }
    finally { setBusy(false) }
  }
  return (
    <div>
      <div className="flex gap-2">
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="इमेज URL या अपलोड करें" className="flex-1" />
        <label className="inline-flex items-center px-3 py-2 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer text-sm whitespace-nowrap">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => up(e.target.files?.[0])} />
        </label>
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-1 h-16 rounded object-cover border" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
      )}
    </div>
  )
}

const MAX_PDF_SIZE = 2 * 1024 * 1024 // 2MB

function PdfField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)
  const up = async (f?: File) => {
    if (!f) return
    if (f.type !== "application/pdf") {
      toast({ title: "अमान्य फ़ाइल", description: "कृपया केवल PDF फ़ाइल चुनें", variant: "destructive" })
      return
    }
    if (f.size > MAX_PDF_SIZE) {
      toast({ title: "फ़ाइल बहुत बड़ी है", description: "PDF का आकार अधिकतम 2MB होना चाहिए", variant: "destructive" })
      return
    }
    try { setBusy(true); onChange(await uploadBlogImage(f)) }
    catch (e: any) { toast({ title: "अपलोड त्रुटि", description: e?.message, variant: "destructive" }) }
    finally { setBusy(false) }
  }
  return (
    <div className="flex gap-2">
      <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="लिंक URL या PDF अपलोड करें (अधिकतम 2MB)" className="flex-1" />
      <label className="inline-flex items-center px-3 py-2 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer text-sm whitespace-nowrap">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => up(e.target.files?.[0])} />
      </label>
    </div>
  )
}

function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <Input type="date" value={value || ""} onChange={(e) => onChange(e.target.value)} />
}

function MultiImageField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)
  const list = Array.isArray(value) ? value : []
  const addFiles = async (files: FileList | null) => {
    if (!files || !files.length) return
    try {
      setBusy(true)
      const uploaded = await Promise.all(Array.from(files).map((f) => uploadBlogImage(f)))
      onChange([...list, ...uploaded])
    } catch (e: any) {
      toast({ title: "अपलोड त्रुटि", description: e?.message, variant: "destructive" })
    } finally {
      setBusy(false)
    }
  }
  const removeAt = (i: number) => onChange(list.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {list.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {list.map((url, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-16 w-16 object-cover rounded border" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="inline-flex items-center px-3 py-2 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer text-sm whitespace-nowrap w-fit">
        {busy ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Upload className="w-4 h-4 mr-1.5" />}
        इमेज जोड़ें
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </label>
    </div>
  )
}

function SelectField({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <option value="">— चुनें —</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

function RowsField({ field, value, onChange }: { field: SectionField; value: any[]; onChange: (v: any[]) => void }) {
  const rows = Array.isArray(value) ? value : []
  const cols = field.rowFields || []
  const setCell = (i: number, k: string, v: string) => onChange(rows.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)))
  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= rows.length) return
    const next = [...rows]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="space-y-2">
      {rows.length === 0 && <p className="text-xs text-gray-400">कोई पंक्ति नहीं — नीचे "पंक्ति जोड़ें" दबाएँ।</p>}
      {rows.map((r, i) => (
        <div key={i} className="flex items-start gap-2 rounded-md border border-gray-200 bg-white p-2">
          <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
            {cols.map((c) => (
              <Input key={c.key} value={r?.[c.key] || ""} onChange={(e) => setCell(i, c.key, e.target.value)} placeholder={c.label} aria-label={c.label} />
            ))}
          </div>
          <div className="flex shrink-0 flex-col">
            <Button type="button" size="sm" variant="ghost" className="h-6 px-1" onClick={() => move(i, -1)} disabled={i === 0} aria-label="ऊपर"><ChevronUp className="w-4 h-4" /></Button>
            <Button type="button" size="sm" variant="ghost" className="h-6 px-1" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="नीचे"><ChevronDown className="w-4 h-4" /></Button>
          </div>
          <Button type="button" size="sm" variant="ghost" className="h-8 px-2 text-red-600" onClick={() => onChange(rows.filter((_, idx) => idx !== i))} aria-label="पंक्ति हटाएँ">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...rows, {}])}><Plus className="w-4 h-4 mr-1" />पंक्ति जोड़ें</Button>
    </div>
  )
}

const MAX_VIDEO_SIZE = 15 * 1024 * 1024 // 15MB: it is downloaded by every visitor, so keep it small

function VideoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { toast } = useToast()
  const [percent, setPercent] = useState<number | null>(null)
  const up = async (f?: File) => {
    if (!f) return
    if (!/^video\/(mp4|webm)$/.test(f.type)) {
      toast({ title: "अमान्य फ़ाइल", description: "कृपया MP4 (या WebM) वीडियो चुनें", variant: "destructive" })
      return
    }
    if (f.size > MAX_VIDEO_SIZE) {
      toast({ title: "वीडियो बहुत बड़ा है", description: `आकार ${(f.size / 1048576).toFixed(1)}MB है; अधिकतम 15MB। कृपया इसे छोटा/कंप्रेस करके अपलोड करें।`, variant: "destructive" })
      return
    }
    try { setPercent(0); onChange(await uploadVideo(f, setPercent)) }
    catch (e: any) { toast({ title: "अपलोड त्रुटि", description: e?.message, variant: "destructive" }) }
    finally { setPercent(null) }
  }
  return (
    <div>
      <div className="flex gap-2">
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="वीडियो URL या अपलोड करें (MP4)" className="flex-1" />
        <label className="inline-flex items-center px-3 py-2 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer text-sm whitespace-nowrap">
          {percent !== null ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />{percent}%</> : <Upload className="w-4 h-4" />}
          <input type="file" accept="video/mp4,video/webm" className="hidden" disabled={percent !== null} onChange={(e) => { up(e.target.files?.[0]); e.target.value = "" }} />
        </label>
        {value && <Button type="button" variant="outline" size="sm" onClick={() => onChange("")}><Trash2 className="w-4 h-4" /></Button>}
      </div>
      {value && (
        <video src={value} muted loop playsInline controls preload="metadata" className="mt-2 h-32 rounded border bg-black" />
      )}
      <p className="mt-1 text-xs text-gray-500">खाली छोड़ने पर होम पेज पर पहले जैसी मंदिर की फ़ोटो ही दिखेगी। वीडियो धीमे इंटरनेट / डेटा सेवर पर अपने-आप नहीं चलता।</p>
    </div>
  )
}

function FieldInput({ field, value, onChange }: { field: SectionField; value: any; onChange: (v: any) => void }) {
  if (field.type === "select") return <SelectField value={value} options={field.options || []} onChange={onChange} />
  if (field.type === "rows") return <RowsField field={field} value={value} onChange={onChange} />
  if (field.type === "richtext") return <RichTextEditor initialValue={value || ""} onChange={onChange} />
  if (field.type === "image") return <ImageField value={value} onChange={onChange} />
  if (field.type === "pdf") return <PdfField value={value} onChange={onChange} />
  if (field.type === "video") return <VideoField value={value} onChange={onChange} />
  if (field.type === "images") return <MultiImageField value={value} onChange={onChange} />
  if (field.type === "date") return <DateField value={value} onChange={onChange} />
  if (field.type === "textarea") return <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={field.label} />
  return <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={field.label} />
}

export default function ContentSectionEditor({ section, onBack }: { section: SectionDef; onBack: () => void }) {
  const { toast } = useToast()
  const { data: content, isLoading } = useContent(section.key)
  const upsert = useUpsertContent()
  const seededRef = useRef(false)
  const [title, setTitle] = useState("")
  const [html, setHtml] = useState("")
  const [items, setItems] = useState<any[]>([])
  const [fields, setFields] = useState<Record<string, any>>({})

  // Seed the form exactly once when the content first loads — synchronously during render
  // (not in a useEffect). RichTextEditor is uncontrolled and copies `initialValue` into the
  // DOM only on its own first mount; seeding a render later would mount it with an empty
  // string first and it would never pick up the real value afterwards. A ref (not state) for
  // the seeded flag ensures a refetch/re-render can never overwrite local edits (e.g. a deletion).
  if (content && !seededRef.current) {
    seededRef.current = true
    setTitle(content.title || "")
    setHtml(content.html || "")
    setItems(Array.isArray(content.items) ? content.items : [])
    setFields(content.items && !Array.isArray(content.items) ? content.items : {})
  }

  const saving = (upsert as any).isPending
  const save = () => {
    const payload: any = { title }
    if (section.type === "html") payload.html = html
    else if (section.type === "items") payload.items = items
    else payload.items = fields // single record stored in items
    upsert.mutate(
      { key: section.key, payload },
      {
        onSuccess: () => { toast({ title: "सहेजा गया", variant: "success" }); onBack() },
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
      }
    )
  }

  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)

  const addItem = () => setItems((p) => [...p, {}])
  const moveItem = (i: number, d: number) =>
    setItems((p) => {
      const j = i + d
      if (j < 0 || j >= p.length) return p
      const next = [...p]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  const setItemField = (i: number, k: string, v: any) =>
    setItems((p) => p.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)))

  const removeItem = (i: number) => {
    if (!window.confirm("क्या आप वाकई इस आइटम को हटाना चाहते हैं?")) return
    const previous = items
    const next = items.filter((_, idx) => idx !== i)
    setItems(next)
    setDeletingIndex(i)
    upsert.mutate(
      { key: section.key, payload: { title, items: next } },
      {
        onSuccess: () => {
          toast({ title: "हटा दिया गया", variant: "success" })
          setDeletingIndex(null)
        },
        onError: (e: any) => {
          setItems(previous)
          setDeletingIndex(null)
          toast({ title: "हटाने में त्रुटि", description: e?.message, variant: "destructive" })
        },
      }
    )
  }

  if (isLoading) return <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-orange-600" /></div>

  return (
    <Card className="bg-white/90 border-orange-200/50">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-orange-700">{section.title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1.5" />वापस</Button>
            <Button onClick={save} disabled={saving} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}सहेजें
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">शीर्षक</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="अनुभाग का शीर्षक" />
        </div>

        {section.type === "html" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">सामग्री</label>
            <RichTextEditor key={section.key} initialValue={html} onChange={setHtml} />
          </div>
        )}

        {section.type === "fields" && (
          <div className="grid grid-cols-1 gap-3">
            {(section.fields || []).map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <FieldInput
                  field={f}
                  value={fields[f.key] ?? (f.type === "images" || f.type === "rows" ? [] : "")}
                  onChange={(v) => setFields((p) => ({ ...p, [f.key]: v }))}
                />
              </div>
            ))}
          </div>
        )}

        {section.type === "items" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">{section.itemLabel || "आइटम"} सूची ({items.length})</p>
              <Button size="sm" variant="outline" onClick={addItem}><Plus className="w-4 h-4 mr-1" />जोड़ें</Button>
            </div>
            {items.length === 0 && <p className="text-sm text-gray-400">कोई आइटम नहीं — "जोड़ें" से शुरू करें।</p>}
            {items.map((it, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 relative bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">{section.itemLabel} {i + 1}</span>
                  <div className="flex items-center">
                    <Button type="button" size="sm" variant="ghost" className="h-7 px-1.5" onClick={() => moveItem(i, -1)} disabled={i === 0} aria-label="ऊपर ले जाएँ"><ChevronUp className="w-4 h-4" /></Button>
                    <Button type="button" size="sm" variant="ghost" className="h-7 px-1.5" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} aria-label="नीचे ले जाएँ"><ChevronDown className="w-4 h-4" /></Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeItem(i)}
                    disabled={deletingIndex === i}
                    className="text-red-600 h-7 px-2"
                  >
                    {deletingIndex === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(section.fields || []).map((f) => (
                    <div
                      key={f.key}
                      className={
                        f.type === "textarea" || f.type === "image" || f.type === "pdf" || f.type === "video" || f.type === "images" || f.type === "rows"
                          ? "sm:col-span-2"
                          : ""
                      }
                    >
                      <label className="block text-xs text-gray-600 mb-0.5">{f.label}</label>
                      <FieldInput field={f} value={f.type === "images" || f.type === "rows" ? it[f.key] || [] : it[f.key] || ""} onChange={(v) => setItemField(i, f.key, v)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2, Plus, Trash2, Upload, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import RichTextEditor from "./rich-text-editor"
import { useContent, useUpsertContent } from "@/data-hooks/mutation-query/useContent"
import { uploadBlogImage } from "@/data-hooks/requests/blog"
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

function FieldInput({ field, value, onChange }: { field: SectionField; value: any; onChange: (v: any) => void }) {
  if (field.type === "richtext") return <RichTextEditor initialValue={value || ""} onChange={onChange} />
  if (field.type === "image") return <ImageField value={value} onChange={onChange} />
  if (field.type === "pdf") return <PdfField value={value} onChange={onChange} />
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
                  value={fields[f.key] ?? (f.type === "images" ? [] : "")}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(section.fields || []).map((f) => (
                    <div
                      key={f.key}
                      className={
                        f.type === "textarea" || f.type === "image" || f.type === "pdf" || f.type === "images"
                          ? "sm:col-span-2"
                          : ""
                      }
                    >
                      <label className="block text-xs text-gray-600 mb-0.5">{f.label}</label>
                      <FieldInput field={f} value={f.type === "images" ? it[f.key] || [] : it[f.key] || ""} onChange={(v) => setItemField(i, f.key, v)} />
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

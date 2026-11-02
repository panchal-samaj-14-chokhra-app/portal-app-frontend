"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  BookOpen, Plus, Pencil, Trash2, Loader2, ArrowLeft, Save, Eye, Printer,
  Download, Share2, Search, Calendar, CheckCircle, FileText, Copy, MessageCircle, X, Settings
} from "lucide-react"
import {
  useOrders, useOrder, useCreateOrder, useUpdateOrder, useDeleteOrder, useNextOrderNumber,
} from "@/data-hooks/mutation-query/useOrderBook"
import Image from "next/image"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Signatory { name: string; designation: string }

const DEFAULT_SIGNATORIES: Signatory[] = [
  { name: "", designation: "अध्यक्ष" },
  { name: "", designation: "मंत्री" },
  { name: "", designation: "कोषाध्यक्ष" },
]

const DESIGNATION_OPTIONS = [
  "अध्यक्ष", "उपाध्यक्ष", "मंत्री", "कोषाध्यक्ष",
  "मंदिर प्रबंधक", "अन्य अधिकृत अधिकारी",
]

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shreetripurasundari.com"

// ─── Toolbar for the editor ───────────────────────────────────────────────────

function EditorToolbar({ onCmd }: { onCmd: (cmd: string, val?: string) => void }) {
  const btn = (label: string, cmd: string, val?: string) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onCmd(cmd, val) }}
      title={label}
      className="px-2 py-1 text-sm hover:bg-orange-100 rounded border border-transparent hover:border-orange-200 font-medium text-gray-700"
    >
      {label}
    </button>
  )
  return (
    <div className="flex flex-wrap gap-0.5 px-2 py-1 bg-gray-50 border-b border-gray-200 rounded-t">
      {btn("B", "bold")}
      {btn("I", "italic")}
      {btn("U", "underline")}
      <span className="w-px bg-gray-300 mx-1 self-stretch" />
      {btn("H2", "formatBlock", "h2")}
      {btn("H3", "formatBlock", "h3")}
      {btn("¶", "formatBlock", "p")}
      <span className="w-px bg-gray-300 mx-1 self-stretch" />
      {btn("•", "insertUnorderedList")}
      {btn("1.", "insertOrderedList")}
      <span className="w-px bg-gray-300 mx-1 self-stretch" />
      {btn("← →", "justifyLeft")}
      {btn("| |", "justifyCenter")}
      {btn("→ ←", "justifyRight")}
      {btn("≡", "justifyFull")}
      <span className="w-px bg-gray-300 mx-1 self-stretch" />
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onCmd("insertTable") }}
        title="तालिका डालें"
        className="px-2 py-1 text-sm hover:bg-orange-100 rounded border border-transparent hover:border-orange-200 text-gray-700"
      >
        ⊞
      </button>
    </div>
  )
}

// ─── A4 Document for print / preview ─────────────────────────────────────────

function A4Document({
  orderNumber, title, subject, date, content, signatories, settings, printRef,
}: {
  orderNumber: string; title: string; subject?: string; date: string
  content: string; signatories: Signatory[]; settings: any; printRef?: React.RefObject<HTMLDivElement>
}) {
  const wmOpacity = settings?.wmOpacity ?? 0.07
  const wmSize = settings?.wmSize ?? 180

  return (
    <div ref={printRef} className="a4-page font-[serif] text-gray-900 bg-white relative overflow-hidden"
      style={{ width: "210mm", minHeight: "297mm", padding: "15mm 20mm", boxSizing: "border-box", fontFamily: "'Times New Roman', Times, serif", fontSize: "12pt", lineHeight: "1.6" }}>

      {/* Watermark */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
        <Image src="/images/main-logo.png" alt="" width={wmSize} height={wmSize}
          style={{ opacity: wmOpacity, userSelect: "none", width: wmSize, height: wmSize, objectFit: "contain" }} />
      </div>

      {/* Content layer */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Letterhead ── */}
        <div style={{ textAlign: "center", marginBottom: "8mm", borderBottom: "2px solid #c2410c", paddingBottom: "4mm" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "4px" }}>
            <Image src="/images/main-logo.png" alt="मंदिर लोगो" width={56} height={56} style={{ borderRadius: "50%" }} />
            <div>
              <div style={{ fontSize: "20pt", fontWeight: "bold", color: "#c2410c", fontFamily: "'Noto Serif Devanagari', serif" }}>
                श्री त्रिपुरा सुंदरी देवस्थान ट्रस्ट
              </div>
              <div style={{ fontSize: "10pt", color: "#555", marginTop: "2px" }}>
                उमराई, तलवाड़ा, बांसवाड़ा, राजस्थान — 327001
              </div>
            </div>
          </div>
        </div>

        {/* ── Order meta ── */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6mm", fontSize: "10pt" }}>
          <div>
            <strong>आदेश संख्या:</strong> {orderNumber}
          </div>
          <div>
            <strong>दिनांक:</strong> {new Date(date).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>

        {/* ── Title & Subject ── */}
        <div style={{ textAlign: "center", marginBottom: "6mm" }}>
          <div style={{ fontSize: "15pt", fontWeight: "bold", textDecoration: "underline", marginBottom: "3mm" }}>{title}</div>
          {subject && <div style={{ fontSize: "11pt" }}><strong>विषय:</strong> {subject}</div>}
        </div>

        {/* ── Body ── */}
        <div
          className="order-body-content"
          style={{ minHeight: "100mm" }}
          dangerouslySetInnerHTML={{ __html: content || "<p>यहाँ दस्तावेज़ की सामग्री लिखें...</p>" }}
        />

        {/* ── Signatures ── */}
        {signatories.length > 0 && (
          <div style={{ marginTop: "16mm", borderTop: "1px solid #ccc", paddingTop: "6mm" }}>
            <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "8mm" }}>
              {signatories.map((s, i) => (
                <div key={i} style={{ textAlign: "center", minWidth: "40mm" }}>
                  <div style={{ height: "14mm", borderBottom: "1px solid #333", marginBottom: "3mm" }} />
                  {s.name && <div style={{ fontWeight: "bold", fontSize: "10pt" }}>{s.name}</div>}
                  <div style={{ fontSize: "10pt", color: "#444" }}>{s.designation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ marginTop: "10mm", borderTop: "1px solid #c2410c", paddingTop: "3mm", textAlign: "center", fontSize: "9pt", color: "#666" }}>
          श्री त्रिपुरा सुंदरी देवस्थान ट्रस्ट, उमराई, तलवाड़ा, बांसवाड़ा, राजस्थान
          &nbsp;|&nbsp; {SITE_URL.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>
  )
}

// ─── Signatory Manager ────────────────────────────────────────────────────────

function SignatoryManager({ value, onChange }: { value: Signatory[]; onChange: (s: Signatory[]) => void }) {
  const add = () => onChange([...value, { name: "", designation: "अन्य अधिकृत अधिकारी" }])
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i))
  const set = (i: number, k: keyof Signatory, v: string) => {
    const next = [...value]; next[i] = { ...next[i], [k]: v }; onChange(next)
  }
  return (
    <div className="space-y-2">
      {value.map((s, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input placeholder="नाम (वैकल्पिक)" value={s.name} onChange={(e) => set(i, "name", e.target.value)} className="flex-1 text-sm" />
          <Select value={s.designation} onValueChange={(v) => set(i, "designation", v)}>
            <SelectTrigger className="w-48 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DESIGNATION_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              <SelectItem value={s.designation}>{s.designation}</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" variant="ghost" onClick={() => remove(i)} className="text-red-500 hover:bg-red-50 shrink-0"><X className="w-4 h-4" /></Button>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={add} className="text-orange-700 border-orange-300 hover:bg-orange-50">
        <Plus className="w-3 h-3 mr-1" /> हस्ताक्षरकर्ता जोड़ें
      </Button>
    </div>
  )
}

// ─── Print styles injected once ──────────────────────────────────────────────

function PrintStyles() {
  return (
    <style>{`
      @media print {
        body > *:not(#print-root) { display: none !important; }
        #print-root { display: block !important; }
        @page { size: A4; margin: 0; }
        .a4-page { width: 210mm !important; min-height: 297mm !important; padding: 15mm 20mm !important; box-shadow: none !important; }
        .order-body-content table { border-collapse: collapse; width: 100%; }
        .order-body-content td, .order-body-content th { border: 1px solid #ccc; padding: 4px 8px; }
      }
    `}</style>
  )
}

function triggerPrint(node: HTMLElement) {
  const clone = node.cloneNode(true) as HTMLElement
  const root = document.createElement("div")
  root.id = "print-root"
  root.style.cssText = "position:fixed;inset:0;background:#fff;z-index:99999;overflow:auto;"
  root.appendChild(clone)
  document.body.appendChild(root)
  window.print()
  document.body.removeChild(root)
}

// ─── Editor View ──────────────────────────────────────────────────────────────

function OrderEditor({ id, onBack }: { id?: string; onBack: () => void }) {
  const { toast } = useToast()
  const { data: existing, isLoading } = useOrder(id)
  const { data: autoNumber } = useNextOrderNumber(!id)
  const create = useCreateOrder()
  const update = useUpdateOrder()
  const printRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>()
  const [preview, setPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [shareMenu, setShareMenu] = useState(false)
  const [seeded, setSeeded] = useState(false)

  const [form, setForm] = useState({
    orderNumber: "", title: "", subject: "", date: new Date().toISOString().split("T")[0],
    content: "", status: "draft", signatories: DEFAULT_SIGNATORIES,
    settings: { wmOpacity: 0.07, wmSize: 180 },
  })

  // Seed form when editing
  if (id && existing && !seeded) {
    setForm({
      orderNumber: existing.orderNumber || "",
      title: existing.title || "",
      subject: existing.subject || "",
      date: existing.date ? existing.date.split("T")[0] : new Date().toISOString().split("T")[0],
      content: existing.content || "",
      status: existing.status || "draft",
      signatories: (existing.signatories as Signatory[]) || DEFAULT_SIGNATORIES,
      settings: (existing.settings as any) || { wmOpacity: 0.07, wmSize: 180 },
    })
    setSeeded(true)
  }
  if (!id && autoNumber && !form.orderNumber) {
    setForm((f) => ({ ...f, orderNumber: autoNumber }))
  }

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const exec = useCallback((cmd: string, val?: string) => {
    if (cmd === "insertTable") {
      const table = `<table border="1" style="border-collapse:collapse;width:100%;margin:8px 0"><tr><td style="padding:4px 8px">&nbsp;</td><td style="padding:4px 8px">&nbsp;</td><td style="padding:4px 8px">&nbsp;</td></tr><tr><td style="padding:4px 8px">&nbsp;</td><td style="padding:4px 8px">&nbsp;</td><td style="padding:4px 8px">&nbsp;</td></tr></table>`
      document.execCommand("insertHTML", false, table)
    } else {
      document.execCommand(cmd, false, val)
    }
    editorRef.current?.focus()
    set("content", editorRef.current?.innerHTML || "")
  }, [])

  const onEditorInput = () => {
    const html = editorRef.current?.innerHTML || ""
    setForm((f) => ({ ...f, content: html }))
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => { if (id) doSave("draft", html) }, 3000)
  }

  const saving = (create as any).isPending || (update as any).isPending

  const doSave = (status: string, contentOverride?: string) => {
    const payload = { ...form, content: contentOverride ?? form.content, status }
    if (!payload.title.trim()) {
      toast({ title: "शीर्षक आवश्यक है", variant: "destructive" }); return
    }
    if (id) {
      update.mutate({ id, payload }, {
        onSuccess: () => { if (status === "published") { toast({ title: "आदेश प्रकाशित हुआ", variant: "success" }); onBack() } else { toast({ title: "ड्राफ्ट सहेजा गया" }) } },
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
      })
    } else {
      create.mutate(payload, {
        onSuccess: () => { toast({ title: status === "published" ? "आदेश प्रकाशित हुआ" : "ड्राफ्ट सहेजा गया", variant: "success" }); onBack() },
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
      })
    }
  }

  const onPrint = () => { if (printRef.current) triggerPrint(printRef.current) }
  const onShare = () => setShareMenu(true)
  const publicUrl = `${SITE_URL}/orders/${form.orderNumber}`

  if (id && isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-orange-600" /></div>

  return (
    <>
      <PrintStyles />
      <div className="space-y-4">

        {/* ── Top Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 border border-orange-200/50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" />वापस</Button>
            <h2 className="text-orange-700 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />{id ? "आदेश संपादित करें" : "नया आदेश"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setPreview(!preview)}>
              <Eye className="w-4 h-4 mr-1" />{preview ? "संपादन" : "पूर्वावलोकन"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="w-4 h-4 mr-1" />सेटिंग
            </Button>
            <Button size="sm" variant="outline" onClick={onPrint}>
              <Printer className="w-4 h-4 mr-1" />प्रिंट / PDF
            </Button>
            {form.status === "published" && (
              <Button size="sm" variant="outline" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-1" />साझा करें
              </Button>
            )}
            <Button size="sm" variant="outline" disabled={saving} onClick={() => doSave("draft")}>
              {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}ड्राफ्ट
            </Button>
            <Button size="sm" disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              onClick={() => doSave("published")}>
              {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}प्रकाशित करें
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Left panel: metadata ── */}
          <div className="space-y-4">

            <Card className="bg-white/90 border-orange-200/50">
              <CardContent className="p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">आदेश संख्या</label>
                  <Input value={form.orderNumber} onChange={(e) => set("orderNumber", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">शीर्षक *</label>
                  <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="आदेश / सूचना का शीर्षक" className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">विषय</label>
                  <Input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="संदर्भ / विषय" className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">दिनांक</label>
                  <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="text-sm" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-orange-200/50">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm text-orange-700">हस्ताक्षर अनुभाग</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <SignatoryManager value={form.signatories} onChange={(s) => set("signatories", s)} />
              </CardContent>
            </Card>

            {showSettings && (
              <Card className="bg-white/90 border-orange-200/50">
                <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm text-orange-700">वॉटरमार्क सेटिंग</CardTitle></CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">पारदर्शिता ({Math.round((form.settings?.wmOpacity ?? 0.07) * 100)}%)</label>
                    <input type="range" min="1" max="30" value={Math.round((form.settings?.wmOpacity ?? 0.07) * 100)}
                      onChange={(e) => set("settings", { ...form.settings, wmOpacity: Number(e.target.value) / 100 })}
                      className="w-full" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">आकार ({form.settings?.wmSize ?? 180}px)</label>
                    <input type="range" min="80" max="300" value={form.settings?.wmSize ?? 180}
                      onChange={(e) => set("settings", { ...form.settings, wmSize: Number(e.target.value) })}
                      className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Right panel: A4 document ── */}
          <div className="lg:col-span-2">
            <div className="bg-gray-200 rounded-lg p-4 overflow-auto">
              <div className="shadow-2xl mx-auto" style={{ width: "210mm", minWidth: "210mm" }}>
                {preview ? (
                  <A4Document {...form} printRef={printRef} />
                ) : (
                  <div className="font-[serif] text-gray-900 bg-white relative overflow-hidden"
                    style={{ width: "210mm", minHeight: "297mm", padding: "15mm 20mm", boxSizing: "border-box", fontFamily: "'Times New Roman', Times, serif", fontSize: "12pt", lineHeight: "1.6" }}>

                    {/* Watermark */}
                    <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
                      <Image src="/images/main-logo.png" alt="" width={form.settings?.wmSize ?? 180} height={form.settings?.wmSize ?? 180}
                        style={{ opacity: form.settings?.wmOpacity ?? 0.07, userSelect: "none", width: form.settings?.wmSize ?? 180, height: form.settings?.wmSize ?? 180, objectFit: "contain" }} />
                    </div>

                    <div style={{ position: "relative", zIndex: 1 }}>
                      {/* Letterhead */}
                      <div style={{ textAlign: "center", marginBottom: "8mm", borderBottom: "2px solid #c2410c", paddingBottom: "4mm" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "4px" }}>
                          <Image src="/images/main-logo.png" alt="" width={56} height={56} style={{ borderRadius: "50%" }} />
                          <div>
                            <div style={{ fontSize: "20pt", fontWeight: "bold", color: "#c2410c" }}>श्री त्रिपुरा सुंदरी देवस्थान ट्रस्ट</div>
                            <div style={{ fontSize: "10pt", color: "#555", marginTop: "2px" }}>उमराई, तलवाड़ा, बांसवाड़ा, राजस्थान — 327001</div>
                          </div>
                        </div>
                      </div>
                      {/* Meta */}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6mm", fontSize: "10pt" }}>
                        <div><strong>आदेश संख्या:</strong> {form.orderNumber || "—"}</div>
                        <div><strong>दिनांक:</strong> {form.date ? new Date(form.date).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}</div>
                      </div>
                      {/* Title */}
                      <div style={{ textAlign: "center", marginBottom: "6mm" }}>
                        <div style={{ fontSize: "15pt", fontWeight: "bold", textDecoration: "underline", marginBottom: "3mm" }}>{form.title || "शीर्षक"}</div>
                        {form.subject && <div style={{ fontSize: "11pt" }}><strong>विषय:</strong> {form.subject}</div>}
                      </div>

                      {/* Editable body */}
                      <EditorToolbar onCmd={exec} />
                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={onEditorInput}
                        className="order-body-content outline-none focus:ring-1 focus:ring-orange-300 rounded-b min-h-[100mm] p-2"
                        style={{ fontSize: "12pt", lineHeight: "1.8", fontFamily: "inherit" }}
                        dangerouslySetInnerHTML={{ __html: form.content }}
                      />

                      {/* Signatures */}
                      {form.signatories.length > 0 && (
                        <div style={{ marginTop: "16mm", borderTop: "1px solid #ccc", paddingTop: "6mm" }}>
                          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "8mm" }}>
                            {form.signatories.map((s, i) => (
                              <div key={i} style={{ textAlign: "center", minWidth: "40mm" }}>
                                <div style={{ height: "14mm", borderBottom: "1px solid #333", marginBottom: "3mm" }} />
                                {s.name && <div style={{ fontWeight: "bold", fontSize: "10pt" }}>{s.name}</div>}
                                <div style={{ fontSize: "10pt", color: "#444" }}>{s.designation}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Footer */}
                      <div style={{ marginTop: "10mm", borderTop: "1px solid #c2410c", paddingTop: "3mm", textAlign: "center", fontSize: "9pt", color: "#666" }}>
                        श्री त्रिपुरा सुंदरी देवस्थान ट्रस्ट, उमराई, तलवाड़ा, बांसवाड़ा, राजस्थान &nbsp;|&nbsp; {SITE_URL.replace(/^https?:\/\//, "")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden A4 for print (always renders the static version) */}
        <div className="hidden">
          <A4Document {...form} printRef={printRef} />
        </div>
      </div>

      {/* Share Dialog */}
      <AlertDialog open={shareMenu} onOpenChange={setShareMenu}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><Share2 className="w-5 h-5 text-orange-600" />साझा करें</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-3 py-2">
            <Button className="w-full justify-start gap-3" variant="outline" onClick={() => { navigator.clipboard.writeText(publicUrl); toast({ title: "लिंक कॉपी हुआ" }); setShareMenu(false) }}>
              <Copy className="w-4 h-4" /> लिंक कॉपी करें
            </Button>
            <Button className="w-full justify-start gap-3 bg-green-600 hover:bg-green-700 text-white" onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(`${form.title}\n${publicUrl}`)}`); setShareMenu(false) }}>
              <MessageCircle className="w-4 h-4" /> WhatsApp पर भेजें
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline" onClick={() => { onPrint(); setShareMenu(false) }}>
              <Download className="w-4 h-4" /> PDF डाउनलोड करें
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>बंद करें</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function OrderDashboard({ onNew, onEdit }: { onNew: () => void; onEdit: (id: string) => void }) {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [confirm, setConfirm] = useState<{ id: string; title: string } | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const del = useDeleteOrder()

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const { data: orders, isLoading } = useOrders({
    status, search: debouncedSearch || undefined,
    dateFrom: dateFrom || undefined, dateTo: dateTo || undefined,
  })
  const { data: previewOrder, isLoading: previewLoading } = useOrder(preview ?? undefined)

  return (
    <>
      <Card className="bg-white/90 border-orange-200/50">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center text-orange-700"><BookOpen className="w-5 h-5 mr-2" />आदेश पुस्तिका</CardTitle>
              <p className="text-sm text-gray-500 mt-1">मंदिर के आधिकारिक आदेश, सूचनाएँ एवं दस्तावेज़</p>
            </div>
            <Button onClick={onNew} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              <Plus className="w-4 h-4 mr-1.5" />नया आदेश
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
              <Input className="pl-8 text-sm" placeholder="खोजें..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी</SelectItem>
                <SelectItem value="draft">ड्राफ्ट</SelectItem>
                <SelectItem value="published">प्रकाशित</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Input type="date" className="text-sm w-36" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <span className="text-gray-400 text-sm">से</span>
              <Input type="date" className="text-sm w-36" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-orange-600" /></div>
          ) : !orders?.length ? (
            <div className="text-center py-14 text-gray-500">
              <BookOpen className="w-14 h-14 mx-auto mb-3 text-gray-300" />
              कोई आदेश नहीं मिला
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o: any) => (
                <div key={o.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded bg-orange-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">{o.title}</div>
                    <div className="text-xs text-gray-500 flex flex-wrap gap-2 mt-0.5">
                      <span className="font-mono">{o.orderNumber}</span>
                      <span>·</span>
                      <span>{new Date(o.date).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      {o.createdBy && <><span>·</span><span>{o.createdBy}</span></>}
                    </div>
                  </div>
                  <Badge className={o.status === "published" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600"}>
                    {o.status === "published" ? "प्रकाशित" : "ड्राफ्ट"}
                  </Badge>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="outline" title="पूर्वावलोकन" onClick={() => setPreview(o.id)} className="border-blue-200 text-blue-600 hover:bg-blue-50"><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" title="संपादन" onClick={() => onEdit(o.id)} className="border-orange-200 text-orange-600 hover:bg-orange-50"><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" title="हटाएं" onClick={() => setConfirm({ id: o.id, title: o.title })} className="border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirm */}
      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>आदेश हटाएं?</AlertDialogTitle>
            <AlertDialogDescription>"{confirm?.title}" हटाने की पुष्टि करें। यह क्रिया वापस नहीं होगी।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (!confirm) return
                del.mutate(confirm.id, {
                  onSuccess: () => { toast({ title: "आदेश हटाया गया" }); setConfirm(null) },
                  onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
                })
              }}>हां, हटाएं</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview dialog */}
      <AlertDialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-2">
          <AlertDialogHeader className="sr-only"><AlertDialogTitle>पूर्वावलोकन</AlertDialogTitle></AlertDialogHeader>
          {previewLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-orange-600" /></div>
          ) : previewOrder ? (
            <div className="overflow-auto">
              <A4Document
                orderNumber={previewOrder.orderNumber}
                title={previewOrder.title}
                subject={previewOrder.subject}
                date={previewOrder.date}
                content={previewOrder.content}
                signatories={(previewOrder.signatories as Signatory[]) || []}
                settings={previewOrder.settings || {}}
              />
            </div>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel>बंद करें</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

type View = { mode: "list" } | { mode: "new" } | { mode: "edit"; id: string }

export default function OrderBook() {
  const [view, setView] = useState<View>({ mode: "list" })
  if (view.mode === "new") return <OrderEditor onBack={() => setView({ mode: "list" })} />
  if (view.mode === "edit") return <OrderEditor id={view.id} onBack={() => setView({ mode: "list" })} />
  return <OrderDashboard onNew={() => setView({ mode: "new" })} onEdit={(id) => setView({ mode: "edit", id })} />
}

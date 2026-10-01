"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Loader2, Users, MessageSquare, Phone, Download, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import RichTextEditor from "./rich-text-editor"
import { useSubscribers, useContactMessages, useBroadcast } from "@/data-hooks/mutation-query/useContent"

export default function MandirSubscribers() {
  const { toast } = useToast()
  const { data, isLoading } = useSubscribers()
  const { data: contactData, isLoading: contactLoading } = useContactMessages()
  const broadcast = useBroadcast()
  const [subject, setSubject] = useState("")
  const [html, setHtml] = useState("")

  const [query, setQuery] = useState("")
  const [source, setSource] = useState("all")

  const subs = data?.data || []
  const sourceLabel = (src?: string) =>
    src === "mandir-contact" ? "Reach Out" : src === "mandir-newsletter" ? "Newsletter" : src || "—"
  const sources: string[] = Array.from(new Set<string>(subs.map((s: any) => s.source).filter(Boolean)))
  const filtered = subs.filter((s: any) => {
    if (source !== "all" && s.source !== source) return false
    const q = query.trim().toLowerCase()
    return !q || `${s.email} ${s.name || ""}`.toLowerCase().includes(q)
  })

  const exportCsv = () => {
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`
    const lines = [
      ["Email", "Name", "Source", "Status", "Subscribed on"].map(esc).join(","),
      ...filtered.map((s: any) =>
        [s.email, s.name, sourceLabel(s.source), s.isActive ? "Active" : "Inactive", new Date(s.createdAt).toISOString().slice(0, 10)].map(esc).join(","),
      ),
    ]
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
  const activeCount = subs.filter((s: any) => s.isActive).length
  const messages = contactData?.data || []

  const send = () => {
    if (!subject.trim() || !html.trim()) {
      toast({ title: "विषय एवं संदेश आवश्यक हैं", variant: "destructive" })
      return
    }
    broadcast.mutate(
      { subject, html },
      {
        onSuccess: (r: any) => {
          toast({ title: "ईमेल भेजे गए", description: `${r.sent}/${r.total || r.sent} सदस्यों को भेजा गया`, variant: "success" })
          setSubject(""); setHtml("")
        },
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Broadcast composer */}
      <Card className="bg-white/90 border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700"><Send className="w-5 h-5 mr-2" />सभी सदस्यों को ईमेल भेजें</CardTitle>
          <CardDescription>कोई जानकारी प्रकाशित होने पर सभी सक्रिय सदस्यों ({activeCount}) को ईमेल भेजें।</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">विषय (Subject)</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="ईमेल का विषय" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">संदेश</label>
            <RichTextEditor key="broadcast" initialValue="" onChange={setHtml} placeholder="संदेश लिखें..." />
          </div>
          <div className="flex justify-end">
            <Button onClick={send} disabled={(broadcast as any).isPending} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              {(broadcast as any).isPending ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
              {activeCount} सदस्यों को भेजें
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter subscriber list (News and updates + Reach Out opt-ins) */}
      <Card className="bg-white/90 border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700"><Users className="w-5 h-5 mr-2" />न्यूज़लेटर सदस्य ({subs.length})</CardTitle>
          <CardDescription>वे सभी जिन्होंने ईमेल अपडेट्स की सदस्यता ली है — News and updates से या Reach Out फ़ॉर्म से।</CardDescription>
        </CardHeader>
        <CardContent>
          {subs.length > 0 && (
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ईमेल या नाम से खोजें" className="pl-8" />
              </div>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="स्रोत"
              >
                <option value="all">सभी स्रोत</option>
                {sources.map((src) => (
                  <option key={src} value={src}>{sourceLabel(src)}</option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
                <Download className="w-4 h-4 mr-1.5" />CSV ({filtered.length})
              </Button>
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-orange-600" /></div>
          ) : subs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">अभी तक कोई सदस्य नहीं।</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">कोई परिणाम नहीं मिला।</p>
          ) : (
            <div className="divide-y">
              {filtered.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 py-2">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{s.email}</div>
                    <div className="text-xs text-gray-500">{s.name || "—"} · {new Date(s.createdAt).toLocaleDateString("hi-IN")}</div>
                  </div>
                  {s.source && (
                    <Badge variant="outline" className="text-gray-500 border-gray-300 shrink-0">
                      {sourceLabel(s.source)}
                    </Badge>
                  )}
                  <Badge variant={s.isActive ? "default" : "secondary"} className={s.isActive ? "bg-green-100 text-green-700" : ""}>
                    {s.isActive ? "सक्रिय" : "निष्क्रिय"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reach Out messages — separate table with name/phone/comment, not part of the newsletter list */}
      <Card className="bg-white/90 border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700"><MessageSquare className="w-5 h-5 mr-2" />Reach Out संदेश ({messages.length})</CardTitle>
          <CardDescription>वेबसाइट के "Reach Out" फ़ॉर्म से प्राप्त संदेश, नाम व फ़ोन सहित।</CardDescription>
        </CardHeader>
        <CardContent>
          {contactLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-orange-600" /></div>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">अभी तक कोई संदेश नहीं।</p>
          ) : (
            <div className="divide-y">
              {messages.map((m: any) => (
                <div key={m.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-gray-900">{m.name || "—"}</div>
                    <div className="text-xs text-gray-500 shrink-0">{new Date(m.createdAt).toLocaleDateString("hi-IN")}</div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    {m.email && (
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{m.email}</span>
                    )}
                    {m.phone && (
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{m.phone}</span>
                    )}
                  </div>
                  {m.message && <p className="text-sm text-gray-700 whitespace-pre-line">{m.message}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

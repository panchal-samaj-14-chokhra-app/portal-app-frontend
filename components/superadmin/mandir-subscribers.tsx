"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Loader2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import RichTextEditor from "./rich-text-editor"
import { useSubscribers, useBroadcast } from "@/data-hooks/mutation-query/useContent"

export default function MandirSubscribers() {
  const { toast } = useToast()
  const { data, isLoading } = useSubscribers()
  const broadcast = useBroadcast()
  const [subject, setSubject] = useState("")
  const [html, setHtml] = useState("")

  const subs = data?.data || []
  const activeCount = subs.filter((s: any) => s.isActive).length

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

      {/* Subscriber list */}
      <Card className="bg-white/90 border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700"><Users className="w-5 h-5 mr-2" />सदस्य ({subs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-orange-600" /></div>
          ) : subs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">अभी तक कोई सदस्य नहीं।</p>
          ) : (
            <div className="divide-y">
              {subs.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 py-2">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{s.email}</div>
                    <div className="text-xs text-gray-500">{s.name || "—"} · {new Date(s.createdAt).toLocaleDateString("hi-IN")}</div>
                  </div>
                  <Badge variant={s.isActive ? "default" : "secondary"} className={s.isActive ? "bg-green-100 text-green-700" : ""}>
                    {s.isActive ? "सक्रिय" : "निष्क्रिय"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Briefcase, Plus, Pencil, Trash2, Eye, Loader2, Search, Phone, Mail, MapPin, Users, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useBusinesses, useCreateBusiness, useUpdateBusiness, useDeleteBusiness } from "@/data-hooks/mutation-query/useBusiness"
import { useContent, useUpsertContent } from "@/data-hooks/mutation-query/useContent"

const empty = {
  name: "", mobile: "", founderName: "", founderMobile: "", founderEmail: "",
  employees: "", type: "", address: "", isListed: false,
}

function BusinessForm({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: any }) {
  const { toast } = useToast()
  const create = useCreateBusiness()
  const update = useUpdateBusiness()
  const editing = !!initial?.id
  const [form, setForm] = useState<any>(empty)
  const [key, setKey] = useState<string>("")

  // reseed the form whenever a different record opens
  const openKey = (initial?.id || "new") + ":" + String(open)
  if (open && key !== openKey) {
    setForm(initial ? { ...empty, ...initial } : empty)
    setKey(openKey)
  }

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))
  const saving = (create as any).isPending || (update as any).isPending

  const submit = () => {
    if (!form.name?.trim() || !form.mobile?.trim() || !form.founderName?.trim()) {
      toast({ title: "नाम, मोबाइल एवं संस्थापक नाम आवश्यक हैं", variant: "destructive" })
      return
    }
    const done = (msg: string) => { toast({ title: msg, variant: "success" }); onClose() }
    const err = (e: any) => toast({ title: "त्रुटि", description: e?.response?.data?.message || e?.message, variant: "destructive" })
    if (editing) update.mutate({ id: initial.id, payload: form }, { onSuccess: () => done("व्यापार अपडेट हुआ"), onError: err })
    else create.mutate(form, { onSuccess: () => done("व्यापार जोड़ा गया"), onError: err })
  }

  const F = ({ label, k, type = "text", req }: any) => (
    <div>
      <Label className="text-xs">{label}{req && <span className="text-red-500"> *</span>}</Label>
      <Input value={form[k] || ""} onChange={(e) => set(k, e.target.value)} type={type} />
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editing ? "व्यापार संपादित करें" : "नया व्यापार जोड़ें"}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <F label="व्यापार का नाम" k="name" req />
          <F label="व्यापार मोबाइल" k="mobile" req />
          <F label="संस्थापक नाम" k="founderName" req />
          <F label="संस्थापक मोबाइल" k="founderMobile" />
          <F label="संस्थापक ईमेल" k="founderEmail" type="email" />
          <F label="कर्मचारी संख्या" k="employees" />
          <F label="व्यापार का प्रकार" k="type" />
          <div className="sm:col-span-2">
            <Label className="text-xs">पता</Label>
            <Textarea value={form.address || ""} onChange={(e) => set("address", e.target.value)} rows={2} />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2 pt-1">
            <Switch checked={!!form.isListed} onCheckedChange={(v) => set("isListed", v)} />
            <Label className="text-sm">सूची में दिखाएं (ऐप पर प्रकाशित)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>रद्द करें</Button>
          <Button onClick={submit} disabled={saving} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}{editing ? "अपडेट करें" : "जोड़ें"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FooterContactEditor() {
  const { toast } = useToast()
  const { data: content } = useContent("business-footer")
  const upsert = useUpsertContent()
  const seeded = useRef(false)
  const [c, setC] = useState({ pocName: "", mobile: "", email: "" })

  useEffect(() => {
    if (content && !seeded.current) {
      seeded.current = true
      const it = content.items && !Array.isArray(content.items) ? content.items : {}
      setC({ pocName: it.pocName || "", mobile: it.mobile || "", email: it.email || "" })
    }
  }, [content])

  const set = (k: string, v: string) => setC((p) => ({ ...p, [k]: v }))
  const saving = (upsert as any).isPending
  const save = () =>
    upsert.mutate(
      { key: "business-footer", payload: { items: c } },
      {
        onSuccess: () => toast({ title: "फुटर संपर्क सहेजा गया", variant: "success" }),
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
      }
    )

  return (
    <Card className="bg-white/90 border-orange-200/50">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-700"><Phone className="w-5 h-5 mr-2" />निर्देशिका फुटर संपर्क</CardTitle>
        <CardDescription>ये विवरण व्यापार निर्देशिका ऐप के फुटर में दिखेंगे।</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">संपर्क व्यक्ति (POC)</Label>
            <Input value={c.pocName} onChange={(e) => set("pocName", e.target.value)} placeholder="नाम" />
          </div>
          <div>
            <Label className="text-xs">मोबाइल नंबर</Label>
            <Input value={c.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="मोबाइल" />
          </div>
          <div>
            <Label className="text-xs">ईमेल</Label>
            <Input value={c.email} onChange={(e) => set("email", e.target.value)} placeholder="ईमेल" type="email" />
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <Button onClick={save} disabled={saving} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}सहेजें
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function BusinessDirectoryInner() {
  const { toast } = useToast()
  const { data: businesses, isLoading } = useBusinesses()
  const update = useUpdateBusiness()
  const del = useDeleteBusiness()
  const [q, setQ] = useState("")
  const [form, setForm] = useState<{ open: boolean; initial?: any }>({ open: false })
  const [view, setView] = useState<any | null>(null)
  const [confirm, setConfirm] = useState<any | null>(null)

  const list = (businesses || []) as any[]
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return list
    return list.filter((b) => (b.name || "").toLowerCase().includes(s) || (b.type || "").toLowerCase().includes(s) || (b.founderName || "").toLowerCase().includes(s))
  }, [list, q])
  const pending = list.filter((b) => !b.isListed).length

  const toggleListed = (b: any) => {
    update.mutate(
      { id: b.id, payload: { isListed: !b.isListed } },
      {
        onSuccess: () => toast({ title: !b.isListed ? "सूची में दिखाया गया" : "सूची से हटाया गया", variant: "success" }),
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
      }
    )
  }

  return (
    <Card className="bg-white/90 border-orange-200/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center text-orange-700"><Briefcase className="w-5 h-5 mr-2" />व्यापार निर्देशिका</CardTitle>
            <CardDescription>
              ऐप से जोड़े गए व्यापार पहले लंबित रहते हैं; "सूची में दिखाएं" चालू करने पर ही ऐप पर दिखेंगे।
              {pending > 0 && <span className="ml-1 text-orange-600 font-medium">({pending} लंबित)</span>}
            </CardDescription>
          </div>
          <Button onClick={() => setForm({ open: true })} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <Plus className="w-4 h-4 mr-1.5" />नया व्यापार
          </Button>
        </div>
        <div className="relative mt-2 max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="नाम / प्रकार / संस्थापक खोजें" className="pl-8" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-orange-600" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500"><Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />कोई व्यापार नहीं मिला।</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{b.name}</span>
                    {b.type && <Badge variant="secondary" className="text-xs">{b.type}</Badge>}
                    <Badge className={b.isListed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {b.isListed ? "सूची में" : "लंबित"}
                    </Badge>
                    {b.isMember && <Badge className="bg-blue-100 text-blue-700">सदस्य</Badge>}
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-0.5">
                    {b.founderName} · {b.mobile}
                    {b.isMember && (b.chokhlaName || b.villageName) ? ` · ${b.chokhlaName || ""}${b.villageName ? " / " + b.villageName : ""}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1.5 mr-1" title="सूची में दिखाएं">
                    <Switch checked={!!b.isListed} onCheckedChange={() => toggleListed(b)} />
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setView(b)} className="border-gray-200"><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline" onClick={() => setForm({ open: true, initial: b })} className="border-blue-200 text-blue-600 hover:bg-blue-50"><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline" onClick={() => setConfirm(b)} className="border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add / Edit */}
      <BusinessForm open={form.open} initial={form.initial} onClose={() => setForm({ open: false })} />

      {/* View */}
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{view?.name}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2"><Badge className={view.isListed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>{view.isListed ? "सूची में" : "लंबित"}</Badge>{view.type && <Badge variant="secondary">{view.type}</Badge>}</div>
              <p><b>संस्थापक:</b> {view.founderName}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{view.mobile}{view.founderMobile ? ` / ${view.founderMobile}` : ""}</p>
              {view.founderEmail && <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{view.founderEmail}</p>}
              {view.employees && <p className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" />कर्मचारी: {view.employees}</p>}
              {view.address && <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" />{view.address}</p>}
              <div className="pt-2 border-t mt-2">
                <p><b>समाज सदस्य:</b> {view.isMember ? "हाँ" : "नहीं"}</p>
                {view.isMember && (
                  <p className="text-gray-600">चोखरा: {view.chokhlaName || "—"} · गांव: {view.villageName || "—"}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>व्यापार हटाएं?</AlertDialogTitle>
            <AlertDialogDescription>"{confirm?.name}" को हटाने की पुष्टि करें। यह क्रिया वापस नहीं होगी।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (!confirm) return
                del.mutate(confirm.id, {
                  onSuccess: () => { toast({ title: "व्यापार हटाया गया", variant: "success" }); setConfirm(null) },
                  onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
                })
              }}
            >हां, हटाएं</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default function BusinessDirectory() {
  return (
    <div className="space-y-4">
      <FooterContactEditor />
      <BusinessDirectoryInner />
    </div>
  )
}

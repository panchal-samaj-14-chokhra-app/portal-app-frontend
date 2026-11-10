"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Loader2, UserCog, Upload, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useKaryakarniAdmin, useCreateKaryakarniMember, useUpdateKaryakarniMember, useDeleteKaryakarniMember } from "@/data-hooks/mutation-query/useKaryakarni"
import { uploadBlogImage } from "@/data-hooks/requests/blog"
import type { KaryakarniMember } from "@/data-hooks/requests/karyakarni"

type SectionType = "choudah_chokhara" | "chokhara"

const SECTIONS: { id: SectionType; label: string; desc: string }[] = [
  { id: "choudah_chokhara", label: "चौदह चोखरा कार्यकारिणी", desc: "समाज की मुख्य कार्यकारिणी समिति के सदस्य" },
  { id: "chokhara",         label: "चोखरा कार्यकारिणी",       desc: "प्रत्येक चोखरे की कार्यकारिणी समिति के सदस्य" },
]

const EMPTY: Partial<KaryakarniMember> = { name: "", location: "", designation: "", organization: "", phone: "", imageUrl: "", order: 0 }

function MemberAvatar({ member }: { member: KaryakarniMember }) {
  const initial = member.name?.trim()?.[0]?.toUpperCase() || "?"
  if (member.imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={member.imageUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#8B0000]/20" />
  }
  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm"
      style={{ background: "linear-gradient(135deg, #c2410c, #8B0000)" }}>
      {initial}
    </div>
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
        <Input value={value || ""} onChange={e => onChange(e.target.value)} placeholder="फ़ोटो URL या अपलोड करें (वैकल्पिक)" className="flex-1" />
        <label className="inline-flex items-center px-3 py-2 rounded-md border border-orange-300 text-orange-700 hover:bg-orange-50 cursor-pointer text-sm whitespace-nowrap">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <input type="file" accept="image/*" className="hidden" onChange={e => { upload(e.target.files?.[0]); e.currentTarget.value = "" }} />
        </label>
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-16 w-16 rounded-full object-cover border" onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
      )}
    </div>
  )
}

function MemberPanel({ type }: { type: SectionType }) {
  const { toast } = useToast()
  const { data: members, isLoading } = useKaryakarniAdmin(type)
  const create  = useCreateKaryakarniMember()
  const update  = useUpdateKaryakarniMember()
  const remove  = useDeleteKaryakarniMember()

  const [open, setOpen]       = useState(false)
  const [form, setForm]       = useState<Partial<KaryakarniMember>>(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; name: string } | null>(null)
  const saving = create.isPending || update.isPending

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY, type }); setOpen(true) }
  const openEdit   = (m: KaryakarniMember) => { setEditing(m.id); setForm({ ...m }); setOpen(true) }
  const closeForm  = () => { setOpen(false); setEditing(null); setForm(EMPTY) }
  const set = (k: keyof KaryakarniMember, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.name?.trim() || !form.designation?.trim())
      return toast({ title: "नाम और पद आवश्यक हैं", variant: "destructive" })
    const payload = { ...form, type }
    const cb = {
      onSuccess: () => { toast({ title: editing ? "अपडेट हो गया" : "सदस्य जोड़ा गया", variant: "success" }); closeForm() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
    }
    if (editing) update.mutate({ id: editing, ...payload }, cb)
    else create.mutate(payload, cb)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">{SECTIONS.find(s => s.id === type)?.label}</CardTitle>
            <CardDescription>{SECTIONS.find(s => s.id === type)?.desc}</CardDescription>
          </div>
          <Button onClick={openCreate} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />सदस्य जोड़ें
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />लोड हो रहा है...</div>
          ) : !members?.length ? (
            <div className="text-center py-12 text-gray-400 text-sm">अभी कोई सदस्य नहीं है।</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map(m => (
                <div key={m.id} className="flex flex-col items-center text-center bg-[#FDF8F0] border border-[#8B0000]/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                  <MemberAvatar member={m} />
                  <h4 className="mt-3 font-bold text-gray-800 text-sm leading-tight">{m.name}{m.location ? `, ${m.location}` : ""}</h4>
                  {(m.designation || m.organization) && (
                    <p className="mt-1.5 text-xs text-gray-500 leading-snug px-2">
                      <span className="font-semibold text-[#8B0000]">{m.designation}</span>
                      {m.organization ? `, ${m.organization}` : ""}
                    </p>
                  )}
                  {m.phone && <p className="mt-2 text-xs text-gray-400">📞 {m.phone}</p>}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-[#8B0000]/10 w-full justify-center">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => openEdit(m)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setDeleting({ id: m.id, name: m.name })}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={v => !v && closeForm()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "सदस्य संपादित करें" : "नया सदस्य जोड़ें"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>नाम *</Label>
                <Input value={form.name || ""} onChange={e => set("name", e.target.value)} placeholder="धुलजी भाई पंचाल" />
              </div>
              <div className="space-y-1.5">
                <Label>स्थान / गांव</Label>
                <Input value={form.location || ""} onChange={e => set("location", e.target.value)} placeholder="पालोदा" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>पद *</Label>
              <Input value={form.designation || ""} onChange={e => set("designation", e.target.value)} placeholder="अध्यक्ष" />
            </div>
            <div className="space-y-1.5">
              <Label>संगठन / पद विवरण</Label>
              <Input value={form.organization || ""} onChange={e => set("organization", e.target.value)} placeholder="मंदिर श्री त्रिपुरा सुंदरी व्यवस्थापक मंडल" />
            </div>
            <div className="space-y-1.5">
              <Label>मोबाइल नंबर</Label>
              <Input value={form.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="9983663466" />
            </div>
            <div className="space-y-1.5">
              <Label>क्रम संख्या</Label>
              <Input type="number" value={form.order ?? 0} onChange={e => set("order", Number(e.target.value))} placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label>फ़ोटो (वैकल्पिक)</Label>
              <ImageUploadField value={form.imageUrl || ""} onChange={v => set("imageUrl", v)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700 text-white">
              {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
              {editing ? "सहेजें" : "जोड़ें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={v => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>सदस्य हटाएं?</AlertDialogTitle>
            <AlertDialogDescription>"{deleting?.name}" को स्थायी रूप से हटाया जाएगा।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700"
              onClick={() => deleting && remove.mutate(deleting.id, {
                onSuccess: () => { toast({ title: "सदस्य हटा दिया गया", variant: "success" }); setDeleting(null) },
                onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
              })}>
              हटाएं
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function KaryakarniManagement() {
  const [section, setSection] = useState<SectionType>("choudah_chokhara")

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-1 justify-center ${
              section === s.id
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                : "text-gray-600 hover:bg-white hover:text-orange-700"
            }`}>
            <UserCog className="w-4 h-4" />{s.label}
          </button>
        ))}
      </div>

      <MemberPanel key={section} type={section} />
    </div>
  )
}

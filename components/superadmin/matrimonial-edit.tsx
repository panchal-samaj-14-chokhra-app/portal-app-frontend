"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Trash2, Pencil, Upload, ImagePlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  useMatrimonialProfile, useUpdateMatrimonialProfile, useDeleteMatrimonialImage, useUploadMatrimonialImages,
} from "@/data-hooks/mutation-query/useMatrimonial"

type F = { key: string; label: string; type?: "text" | "textarea" | "number" | "date" | "bool" | "select"; options?: { value: string; label: string }[] }

const GENDER = [{ value: "MALE", label: "पुरुष" }, { value: "FEMALE", label: "महिला" }, { value: "OTHER", label: "अन्य" }]
const MARITAL = [
  { value: "single", label: "अविवाहित" },
  { value: "married", label: "विवाहित" },
  { value: "divorced", label: "तलाकशुदा" },
  { value: "widowed", label: "विधवा/विधुर" },
]
const MAX_PHOTOS = 5

const SECTIONS: { title: string; fields: F[] }[] = [
  { title: "व्यक्तिगत जानकारी / Personal", fields: [
    { key: "name", label: "पूरा नाम" }, { key: "lastName", label: "उपनाम" }, { key: "petName", label: "पुकारू नाम" },
    { key: "dateOfBirth", label: "जन्म तिथि", type: "date" }, { key: "age", label: "आयु", type: "number" },
    { key: "timeOfBirth", label: "जन्म समय" }, { key: "placeOfBirth", label: "जन्म स्थान" },
    { key: "address", label: "पूरा पता", type: "textarea" }, { key: "district", label: "जिला" }, { key: "state", label: "राज्य" },
    { key: "email", label: "ईमेल" }, { key: "mobileNumber", label: "मोबाइल नंबर" }, { key: "employerOrganizationName", label: "नियोक्ता / संस्था" },
    { key: "height", label: "ऊंचाई (cm)", type: "number" }, { key: "weight", label: "वज़न (kg)", type: "number" }, { key: "complexion", label: "रंग" },
    { key: "gender", label: "लिंग", type: "select", options: GENDER }, { key: "motherTongue", label: "मातृभाषा" },
    { key: "isPhysicallyAble", label: "शारीरिक रूप से सक्षम", type: "bool" },
  ] },
  { title: "पारिवारिक जानकारी / Family", fields: [
    { key: "fatherName", label: "पिता का नाम" }, { key: "motherName", label: "माता का नाम" }, { key: "grandfatherName", label: "दादाजी का नाम" },
    { key: "caste", label: "जाति" }, { key: "subCaste", label: "उप-जाति" }, { key: "gotra", label: "गोत्र" },
    { key: "annualFamilyIncome", label: "पारिवारिक वार्षिक आय", type: "number" }, { key: "familyOccupation", label: "पारिवारिक व्यवसाय" },
    { key: "manglik", label: "मांगलिक है", type: "bool" },
  ] },
  { title: "शिक्षा और करियर / Education & Career", fields: [
    { key: "education", label: "शिक्षा" }, { key: "occupation", label: "पेशा" }, { key: "income", label: "वार्षिक आय", type: "number" },
    { key: "maritalStatus", label: "वैवाहिक स्थिति", type: "select", options: MARITAL },
  ] },
  { title: "जीवनसाथी प्राथमिकताएं / Preferences", fields: [
    { key: "agePreferenceMin", label: "न्यूनतम आयु", type: "number" }, { key: "agePreferenceMax", label: "अधिकतम आयु", type: "number" },
    { key: "castePreference", label: "जाति प्राथमिकता" }, { key: "locationPreference", label: "स्थान प्राथमिकता" },
  ] },
  { title: "मेरे बारे में / About", fields: [
    { key: "aboutMe", label: "अपने बारे में", type: "textarea" }, { key: "hobbies", label: "शौक", type: "textarea" },
    { key: "socialLinks", label: "सोशल मीडिया लिंक" }, { key: "wantsToJoinEvent", label: "मैट्रिमोनियल इवेंट में भाग लेना चाहता/चाहती हूं", type: "bool" },
  ] },
  { title: "गोपनीयता एवं स्थिति / Privacy & Status", fields: [
    { key: "showContactInformation", label: "संपर्क जानकारी दिखाएं", type: "bool" },
    { key: "showAddressDetails", label: "पता विवरण दिखाएं", type: "bool" },
    { key: "showImages", label: "फोटो दिखाएं", type: "bool" },
    { key: "isProfileActive", label: "ऐप पर दिखाएं (Active)", type: "bool" },
  ] },
]

const NUM_KEYS = new Set(["age", "height", "weight", "income", "annualFamilyIncome", "agePreferenceMin", "agePreferenceMax"])
const ALL = SECTIONS.flatMap((s) => s.fields)
const ALL_KEYS = ALL.map((f) => f.key)

export default function MatrimonialEdit({ profileId, viewOnly = false, onBack }: { profileId: string; viewOnly?: boolean; onBack: () => void }) {
  const { toast } = useToast()
  const [readOnly, setReadOnly] = useState(viewOnly)
  const { data: profile, isLoading } = useMatrimonialProfile(profileId)
  const update = useUpdateMatrimonialProfile()
  const delImg = useDeleteMatrimonialImage()
  const upImg = useUploadMatrimonialImages()
  const seeded = useRef(false)
  const [form, setForm] = useState<any>({})

  if (profile && !seeded.current) {
    seeded.current = true
    const seed: any = {}
    ALL.forEach((f) => {
      let v = profile[f.key]
      if (f.key === "dateOfBirth" && v) v = String(v).slice(0, 10)
      seed[f.key] = v ?? (f.type === "bool" ? false : "")
    })
    setForm(seed)
  }

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))
  const saving = (update as any).isPending
  const uploading = (upImg as any).isPending

  const save = () => {
    const payload: any = {}
    ALL_KEYS.forEach((k) => {
      let v = form[k]
      if (NUM_KEYS.has(k)) v = v === "" || v == null ? null : Number(v)
      else if (typeof v === "string") v = v.trim() === "" ? null : v
      payload[k] = v
    })
    update.mutate({ id: profileId, payload }, {
      onSuccess: () => { toast({ title: "प्रोफ़ाइल सहेजी गई", variant: "success" }); onBack() },
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.response?.data?.message || e?.message, variant: "destructive" }),
    })
  }

  const images = profile?.images || []
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || [])
    e.target.value = ""
    if (!files.length) return
    const room = MAX_PHOTOS - images.length
    if (room <= 0) { toast({ title: `अधिकतम ${MAX_PHOTOS} फोटो`, variant: "destructive" }); return }
    if (files.length > room) { toast({ title: `केवल ${room} और फोटो जोड़ी जा सकती हैं`, variant: "destructive" }); files = files.slice(0, room) }
    upImg.mutate({ profileId, files }, {
      onSuccess: () => toast({ title: "फोटो जोड़ी गई", variant: "success" }),
      onError: (er: any) => toast({ title: "अपलोड त्रुटि", description: er?.response?.data?.message || er?.message, variant: "destructive" }),
    })
  }

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-600" /></div>
  if (!profile) return <div className="text-center py-20 text-gray-500">प्रोफ़ाइल नहीं मिली।</div>

  const Field = ({ f }: { f: F }) => {
    const v = form[f.key]
    if (f.type === "bool")
      return <div className="flex items-center gap-2 py-1"><Switch checked={!!v} onCheckedChange={(c) => set(f.key, c)} disabled={readOnly} /><Label className="text-sm">{f.label}</Label></div>
    return (
      <div>
        <Label className="text-xs text-gray-600">{f.label}</Label>
        {f.type === "textarea" ? (
          <Textarea value={v || ""} onChange={(e) => set(f.key, e.target.value)} disabled={readOnly} rows={2} />
        ) : f.type === "select" ? (
          <Select value={v || ""} onValueChange={(val) => set(f.key, val)} disabled={readOnly}>
            <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
            <SelectContent>{(f.options || []).map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
        ) : (
          <Input type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} value={v ?? ""} onChange={(e) => set(f.key, e.target.value)} disabled={readOnly} />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* sub-header (page header above stays intact) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-4 shadow-sm border border-orange-200/50">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1.5" />वापस</Button>
          <div>
            <h2 className="text-lg font-bold text-orange-700">{[profile.name, profile.lastName].filter(Boolean).join(" ") || "प्रोफ़ाइल"}</h2>
            <p className="text-xs text-gray-500">प्रोफ़ाइल #{profile.profileNumber} · {readOnly ? "देखें" : "संपादन"}</p>
          </div>
          <Badge className={profile.isProfileActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}>{profile.isProfileActive ? "सक्रिय" : "ऐप से हटाई गई"}</Badge>
        </div>
        {readOnly ? (
          <Button onClick={() => setReadOnly(false)} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"><Pencil className="w-4 h-4 mr-1.5" />संपादित करें</Button>
        ) : (
          <Button onClick={save} disabled={saving} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}सहेजें
          </Button>
        )}
      </div>

      {/* photos */}
      <Card className="bg-white border-orange-200/50">
        <CardHeader><CardTitle className="text-orange-700 text-base">फोटो ({images.length}/{MAX_PHOTOS})</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {images.map((img: any) => (
              <div key={img.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-28 h-28 object-cover rounded-lg border" onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.3")} />
                {!readOnly && (
                  <button onClick={() => delImg.mutate(img.id, { onSuccess: () => toast({ title: "फोटो हटाई गई", variant: "success" }), onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }) })}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            ))}
            {!readOnly && images.length < MAX_PHOTOS && (
              <label className="w-28 h-28 rounded-lg border-2 border-dashed border-orange-300 flex flex-col items-center justify-center gap-1 text-orange-500 cursor-pointer hover:bg-orange-50 text-xs">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
                {uploading ? "अपलोड..." : "फोटो जोड़ें"}
                <input type="file" accept="image/*" multiple className="hidden" onChange={onPick} disabled={uploading} />
              </label>
            )}
            {images.length === 0 && readOnly && <p className="text-sm text-gray-400">कोई फोटो नहीं।</p>}
          </div>
          {!readOnly && <p className="text-xs text-gray-400 mt-2">अधिकतम {MAX_PHOTOS} फोटो। बड़ी इमेज स्वतः छोटी कर दी जाती हैं।</p>}
        </CardContent>
      </Card>

      {/* form sections */}
      {SECTIONS.map((s) => (
        <Card key={s.title} className="bg-white border-orange-200/50">
          <CardHeader><CardTitle className="text-orange-700 text-base">{s.title}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {s.fields.map((f) => <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2 lg:col-span-3" : ""}><Field f={f} /></div>)}
            </div>
          </CardContent>
        </Card>
      ))}

      {!readOnly && (
        <div className="flex justify-end pb-4">
          <Button onClick={save} disabled={saving} size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}प्रोफ़ाइल सहेजें
          </Button>
        </div>
      )}
    </div>
  )
}

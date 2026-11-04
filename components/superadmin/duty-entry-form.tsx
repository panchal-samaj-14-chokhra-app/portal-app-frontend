"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useDutySettings } from "@/data-hooks/mutation-query/useDutySettings"
import { useDutyMembersList } from "@/data-hooks/mutation-query/useDutyMembers"
import { useCreateDutyRegisterEntry, useUpdateDutyRegisterEntry } from "@/data-hooks/mutation-query/useDutyRegister"
import type { DutyRegisterEntry } from "@/data-hooks/requests/duty-register"
import GeoPhotoCapture, { type GeoPhoto } from "./geo-photo-capture"

const todayISO = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })

const EMPTY_FORM = {
  dutyDate: "",
  dutyType: "",
  title: "",
  shift: "",
  dutyMemberId: "",
  memberName: "",
  memberRole: "",
  assignedBy: "",
  scheduledStart: "",
  scheduledEnd: "",
  actualCheckin: "",
  actualCheckout: "",
  attendanceStatus: "Present",
  checkinPhoto: null as GeoPhoto | null,
  remarks: "",
  verifiedBy: "",
}

export default function DutyEntryForm({
  entry,
  onSaved,
  onCancel,
}: {
  entry?: DutyRegisterEntry
  onSaved: () => void
  onCancel: () => void
}) {
  const { toast } = useToast()
  const { data: settings } = useDutySettings()
  const { data: dutyMembers } = useDutyMembersList({})

  const createMutation = useCreateDutyRegisterEntry()
  const updateMutation = useUpdateDutyRegisterEntry()

  const [form, setForm] = useState<typeof EMPTY_FORM>(() =>
    entry
      ? {
          dutyDate: entry.dutyDate,
          dutyType: entry.dutyType,
          title: entry.title,
          shift: entry.shift,
          dutyMemberId: entry.dutyMemberId || "",
          memberName: entry.memberName,
          memberRole: entry.memberRole || "",
          assignedBy: entry.assignedBy || "",
          scheduledStart: entry.scheduledStart || "",
          scheduledEnd: entry.scheduledEnd || "",
          actualCheckin: entry.actualCheckin || "",
          actualCheckout: entry.actualCheckout || "",
          attendanceStatus: entry.attendanceStatus,
          checkinPhoto: entry.checkinPhotoUrl
            ? { url: entry.checkinPhotoUrl, lat: entry.checkinLat ?? null, lng: entry.checkinLng ?? null }
            : null,
          remarks: entry.remarks || "",
          verifiedBy: entry.verifiedBy || "",
        }
      : { ...EMPTY_FORM, dutyDate: todayISO() }
  )

  const dutyTypes = settings?.dutyTypes || []
  const shifts = settings?.shifts || []
  const attendanceStatuses = settings?.attendanceStatuses || []
  const activeMembers = (dutyMembers || []).filter((m) => m.active)

  // Selecting a member profile snapshots its current duty place/shift/name into the entry;
  // the admin can still edit any of these afterward before saving.
  const selectMember = (memberId: string) => {
    const m = activeMembers.find((x) => x.id === memberId)
    if (!m) return
    const placeKey = m.dutyTypes?.[0] || ""
    const placeLabel = dutyTypes.find((t) => t.key === placeKey)?.label || placeKey
    setForm({
      ...form,
      dutyMemberId: m.id,
      memberName: m.name,
      memberRole: placeLabel,
      dutyType: placeKey,
      shift: m.shift || "",
      title: form.title || `${placeLabel || "ड्यूटी"} - ${m.name}`,
    })
  }

  const handleSave = () => {
    if (!form.dutyDate || !form.dutyType || !form.shift || !form.memberName) {
      toast({ title: "कृपया आवश्यक फ़ील्ड भरें (तिथि, स्थान, पाली, सदस्य)", variant: "destructive" })
      return
    }
    const title = form.title || `${dutyTypes.find((t) => t.key === form.dutyType)?.label || form.dutyType} - ${form.memberName}`
    const { checkinPhoto, ...rest } = form
    const payload = {
      ...rest,
      title,
      checkinPhotoUrl: checkinPhoto?.url || "",
      checkinLat: checkinPhoto?.lat ?? null,
      checkinLng: checkinPhoto?.lng ?? null,
    }
    const onSuccess = () => {
      toast({ title: "सहेजा गया" })
      onSaved()
    }
    const onError = (e: any) => toast({ title: "त्रुटि", description: e?.message || "सहेजने में त्रुटि", variant: "destructive" })
    if (entry) updateMutation.mutate({ id: entry.id, payload }, { onSuccess, onError })
    else createMutation.mutate(payload, { onSuccess, onError })
  }

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500">तिथि *</label>
          <Input type="date" value={form.dutyDate} onChange={(e) => setForm({ ...form, dutyDate: e.target.value })} />
        </div>

        <div>
          <label className="text-xs text-gray-500">सदस्य प्रोफाइल से चुनें *</label>
          <Select value={form.dutyMemberId || "none"} onValueChange={(v) => (v === "none" ? setForm({ ...form, dutyMemberId: "" }) : selectMember(v))}>
            <SelectTrigger>
              <SelectValue placeholder="चुनें" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— मैन्युअल रूप से भरें —</SelectItem>
              {activeMembers.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} {m.chokhlaName || m.villageName ? `— ${[m.chokhlaName, m.villageName].filter(Boolean).join("/")}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.dutyMemberId && (
            <p className="mt-1 text-xs text-gray-400">
              {[form.memberRole, shifts.find((s) => s.key === form.shift)?.label].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {!form.dutyMemberId && (
          <>
            <div>
              <label className="text-xs text-gray-500">सदस्य का नाम *</label>
              <Input value={form.memberName} onChange={(e) => setForm({ ...form, memberName: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-gray-500">स्थान *</label>
                <Select value={form.dutyType} onValueChange={(v) => setForm({ ...form, dutyType: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {dutyTypes.map((t) => (
                      <SelectItem key={t.key} value={t.key}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-500">पाली *</label>
                <Select value={form.shift} onValueChange={(v) => setForm({ ...form, shift: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map((s) => (
                      <SelectItem key={s.key} value={s.key}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        <div>
          <label className="text-xs text-gray-500">उपस्थिति स्थिति</label>
          <Select value={form.attendanceStatus} onValueChange={(v) => setForm({ ...form, attendanceStatus: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {attendanceStatuses.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-gray-500">चेक-इन फोटो</label>
          <GeoPhotoCapture value={form.checkinPhoto} onChange={(v) => setForm({ ...form, checkinPhoto: v })} />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          रद्द करें
        </Button>
        <Button
          onClick={handleSave}
          disabled={createMutation.isPending || updateMutation.isPending}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 sm:w-auto"
        >
          {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
          सहेजें
        </Button>
      </div>
    </div>
  )
}

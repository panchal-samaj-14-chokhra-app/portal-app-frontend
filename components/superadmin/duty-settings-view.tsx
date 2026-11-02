"use client"

import { useState } from "react"
import { Loader2, Pencil, Plus, Save, Settings, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useDutySettings, useUpdateDutySettings } from "@/data-hooks/mutation-query/useDutySettings"
import type { DutyTypeItem, DutySettingsData, ShiftItem, StatusItem } from "@/data-hooks/requests/duty-settings"

// ── Generic editable list ──────────────────────────────────────────────────────

type SimpleItem = { key: string; label: string }

function SimpleList({
  title,
  items,
  onSave,
  saving,
}: {
  title: string
  items: SimpleItem[]
  onSave: (updated: SimpleItem[]) => void
  saving: boolean
}) {
  const [list, setList] = useState<SimpleItem[]>(items)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editKey, setEditKey] = useState("")
  const [editLabel, setEditLabel] = useState("")
  const [addKey, setAddKey] = useState("")
  const [addLabel, setAddLabel] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const dirty = JSON.stringify(list) !== JSON.stringify(items)

  const startEdit = (i: number) => {
    setEditIdx(i)
    setEditKey(list[i].key)
    setEditLabel(list[i].label)
  }

  const confirmEdit = () => {
    if (!editKey.trim() || !editLabel.trim() || editIdx === null) return
    setList((prev) => prev.map((item, i) => i === editIdx ? { key: editKey.trim(), label: editLabel.trim() } : item))
    setEditIdx(null)
  }

  const remove = (i: number) => setList((prev) => prev.filter((_, idx) => idx !== i))

  const addItem = () => {
    if (!addKey.trim() || !addLabel.trim()) return
    if (list.some((item) => item.key === addKey.trim())) return
    setList((prev) => [...prev, { key: addKey.trim(), label: addLabel.trim() }])
    setAddKey("")
    setAddLabel("")
    setAddOpen(false)
  }

  return (
    <Card className="border-orange-200/60 bg-white/90">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-orange-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {list.map((item, i) => (
          <div key={item.key} className="flex items-center gap-2 rounded-md border bg-orange-50/40 px-3 py-2">
            {editIdx === i ? (
              <>
                <Input value={editKey} onChange={(e) => setEditKey(e.target.value)} placeholder="Key (English)" className="h-8 w-28 text-xs" />
                <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} placeholder="Label (हिंदी)" className="h-8 flex-1 text-xs" />
                <Button size="sm" className="h-7 px-2 bg-green-600 hover:bg-green-700" onClick={confirmEdit}><Save className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditIdx(null)}><X className="h-3.5 w-3.5" /></Button>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-400 w-24 truncate">{item.key}</span>
                <span className="flex-1 text-sm font-medium text-gray-800">{item.label}</span>
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => startEdit(i)} aria-label="संपादित करें"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-red-500 hover:text-red-700" onClick={() => remove(i)} aria-label="हटाएँ"><Trash2 className="h-3.5 w-3.5" /></Button>
              </>
            )}
          </div>
        ))}

        {addOpen ? (
          <div className="flex items-center gap-2 rounded-md border border-dashed border-orange-300 px-3 py-2">
            <Input value={addKey} onChange={(e) => setAddKey(e.target.value)} placeholder="Key (English)" className="h-8 w-28 text-xs" />
            <Input value={addLabel} onChange={(e) => setAddLabel(e.target.value)} placeholder="Label (हिंदी)" className="h-8 flex-1 text-xs" />
            <Button size="sm" className="h-7 px-2 bg-orange-600 hover:bg-orange-700" onClick={addItem}><Plus className="h-3.5 w-3.5" /></Button>
            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setAddOpen(false)}><X className="h-3.5 w-3.5" /></Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="h-8 w-full border-dashed text-orange-600" onClick={() => setAddOpen(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" />नया जोड़ें
          </Button>
        )}

        {dirty && (
          <Button
            size="sm"
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={saving}
            onClick={() => onSave(list)}
          >
            {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
            सहेजें
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ── Shifts list (has start/end times) ─────────────────────────────────────────

function ShiftList({
  items,
  onSave,
  saving,
}: {
  items: ShiftItem[]
  onSave: (updated: ShiftItem[]) => void
  saving: boolean
}) {
  const [list, setList] = useState<ShiftItem[]>(items)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [edit, setEdit] = useState<ShiftItem>({ key: "", label: "", start: "", end: "" })
  const [addOpen, setAddOpen] = useState(false)
  const [add, setAdd] = useState<ShiftItem>({ key: "", label: "", start: "", end: "" })
  const dirty = JSON.stringify(list) !== JSON.stringify(items)

  const startEdit = (i: number) => { setEditIdx(i); setEdit({ ...list[i] }) }

  const confirmEdit = () => {
    if (!edit.key.trim() || !edit.label.trim() || editIdx === null) return
    setList((prev) => prev.map((item, i) => i === editIdx ? { ...edit, key: edit.key.trim(), label: edit.label.trim() } : item))
    setEditIdx(null)
  }

  const remove = (i: number) => setList((prev) => prev.filter((_, idx) => idx !== i))

  const addItem = () => {
    if (!add.key.trim() || !add.label.trim()) return
    setList((prev) => [...prev, { ...add, key: add.key.trim(), label: add.label.trim() }])
    setAdd({ key: "", label: "", start: "", end: "" })
    setAddOpen(false)
  }

  return (
    <Card className="border-orange-200/60 bg-white/90">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-orange-700">पाली (Shifts)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {list.map((item, i) => (
          <div key={item.key} className="rounded-md border bg-orange-50/40 px-3 py-2">
            {editIdx === i ? (
              <div className="grid grid-cols-2 gap-2">
                <Input value={edit.key} onChange={(e) => setEdit((p) => ({ ...p, key: e.target.value }))} placeholder="Key (English)" className="h-8 text-xs" />
                <Input value={edit.label} onChange={(e) => setEdit((p) => ({ ...p, label: e.target.value }))} placeholder="Label (हिंदी)" className="h-8 text-xs" />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 w-10">शुरू:</span>
                  <input type="time" value={edit.start} onChange={(e) => setEdit((p) => ({ ...p, start: e.target.value }))} className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 w-10">समाप्त:</span>
                  <input type="time" value={edit.end} onChange={(e) => setEdit((p) => ({ ...p, end: e.target.value }))} className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs" />
                </div>
                <Button size="sm" className="h-7 bg-green-600 hover:bg-green-700" onClick={confirmEdit}><Save className="mr-1 h-3.5 w-3.5" />सहेजें</Button>
                <Button size="sm" variant="ghost" className="h-7" onClick={() => setEditIdx(null)}><X className="mr-1 h-3.5 w-3.5" />रद्द करें</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-24 truncate">{item.key}</span>
                <span className="flex-1 text-sm font-medium text-gray-800">{item.label}</span>
                {(item.start || item.end) && (
                  <span className="text-xs text-gray-500">{item.start || "?"} – {item.end || "?"}</span>
                )}
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => startEdit(i)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-red-500 hover:text-red-700" onClick={() => remove(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </div>
        ))}

        {addOpen ? (
          <div className="rounded-md border border-dashed border-orange-300 px-3 py-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input value={add.key} onChange={(e) => setAdd((p) => ({ ...p, key: e.target.value }))} placeholder="Key (English)" className="h-8 text-xs" />
              <Input value={add.label} onChange={(e) => setAdd((p) => ({ ...p, label: e.target.value }))} placeholder="Label (हिंदी)" className="h-8 text-xs" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 w-10">शुरू:</span>
                <input type="time" value={add.start} onChange={(e) => setAdd((p) => ({ ...p, start: e.target.value }))} className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 w-10">समाप्त:</span>
                <input type="time" value={add.end} onChange={(e) => setAdd((p) => ({ ...p, end: e.target.value }))} className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="h-7 bg-orange-600 hover:bg-orange-700" onClick={addItem}><Plus className="mr-1 h-3.5 w-3.5" />जोड़ें</Button>
              <Button size="sm" variant="ghost" className="h-7" onClick={() => setAddOpen(false)}><X className="mr-1 h-3.5 w-3.5" />रद्द करें</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="h-8 w-full border-dashed text-orange-600" onClick={() => setAddOpen(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" />नई पाली जोड़ें
          </Button>
        )}

        {dirty && (
          <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700" disabled={saving} onClick={() => onSave(list)}>
            {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}सहेजें
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function DutySettingsView() {
  const { toast } = useToast()
  const { data, isLoading, error } = useDutySettings()
  const { mutate, isPending } = useUpdateDutySettings()

  const settings = data?.data

  const save = (field: keyof DutySettingsData, value: unknown) => {
    mutate(
      { [field]: value } as Partial<DutySettingsData>,
      {
        onSuccess: () => toast({ title: "सेटिंग्स सहेजी गईं", variant: "success" }),
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message, variant: "destructive" }),
      },
    )
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-7 w-7 animate-spin text-orange-600" />
    </div>
  )

  if (error) return (
    <p className="py-10 text-center text-red-600">सेटिंग्स लोड नहीं हो सकीं: {(error as Error).message}</p>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-orange-600" />
        <h2 className="text-lg font-semibold text-orange-700">ड्यूटी रजिस्टर सेटिंग्स</h2>
      </div>
      <p className="text-sm text-gray-500">यहाँ ड्यूटी रजिस्टर में उपयोग होने वाले प्रकार, पाली और स्थितियाँ कॉन्फ़िगर करें।</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {settings && (
          <>
            <SimpleList
              title="ड्यूटी प्रकार (Duty Types)"
              items={settings.dutyTypes as SimpleItem[]}
              onSave={(v) => save("dutyTypes", v)}
              saving={isPending}
            />
            <ShiftList
              items={settings.shifts}
              onSave={(v) => save("shifts", v)}
              saving={isPending}
            />
            <SimpleList
              title="उपस्थिति स्थिति (Attendance Status)"
              items={settings.attendanceStatuses as SimpleItem[]}
              onSave={(v) => save("attendanceStatuses", v)}
              saving={isPending}
            />
            <SimpleList
              title="ड्यूटी स्थिति (Duty Status)"
              items={settings.dutyStatuses as SimpleItem[]}
              onSave={(v) => save("dutyStatuses", v)}
              saving={isPending}
            />
          </>
        )}
      </div>
    </div>
  )
}

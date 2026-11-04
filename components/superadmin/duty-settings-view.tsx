"use client"

import { useEffect, useState } from "react"
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useConfirmDialog } from "@/hooks/use-confirm-dialog"
import { useDutySettings, useUpdateDutySettings } from "@/data-hooks/mutation-query/useDutySettings"
import type { DutySettingsData, ShiftItem, StatusItem, DutyTypeItem } from "@/data-hooks/requests/duty-settings"

type SimpleItem = { key: string; label: string }

// Overnight shifts (e.g. 22:00 -> 06:00) wrap past midnight, so a negative span rolls over by adding 24h.
function shiftHours(start: string, end: string): string {
  if (!start || !end) return ""
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return ""
  let minutes = eh * 60 + em - (sh * 60 + sm)
  if (minutes <= 0) minutes += 24 * 60
  const hours = minutes / 60
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} घंटे`
}

function SimpleListCard({
  title,
  items,
  fieldKey,
}: {
  title: string
  items: SimpleItem[]
  fieldKey: keyof DutySettingsData
}) {
  const [list, setList] = useState<SimpleItem[]>(items)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  const [editKey, setEditKey] = useState("")
  const [editLabel, setEditLabel] = useState("")
  const { mutate, isPending } = useUpdateDutySettings()
  const { toast } = useToast()
  const { confirm, ConfirmDialog } = useConfirmDialog()

  useEffect(() => setList(items), [items])

  const cancelEdit = () => {
    setEditIdx(null)
    setAdding(false)
    setEditKey("")
    setEditLabel("")
  }

  const startEdit = (idx: number) => {
    setAdding(false)
    setEditIdx(idx)
    setEditKey(list[idx].key)
    setEditLabel(list[idx].label)
  }

  const startAdd = () => {
    setEditIdx(null)
    setAdding(true)
    setEditKey("")
    setEditLabel("")
  }

  const applyEdit = () => {
    if (!editKey.trim() || !editLabel.trim()) return
    const item = { key: editKey.trim(), label: editLabel.trim() }
    if (adding) setList((l) => [...l, item])
    else if (editIdx !== null) setList((l) => l.map((it, i) => (i === editIdx ? item : it)))
    cancelEdit()
  }

  const removeItem = async (idx: number) => {
    if (!(await confirm("क्या आप वाकई इसे हटाना चाहते हैं?"))) return
    setList((l) => l.filter((_, i) => i !== idx))
  }

  const save = () => {
    mutate(
      { [fieldKey]: list } as Partial<DutySettingsData>,
      {
        onSuccess: () => toast({ title: "सहेजा गया" }),
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message || "सहेजने में त्रुटि", variant: "destructive" }),
      }
    )
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {editIdx === idx ? (
              <>
                <Input value={editKey} onChange={(e) => setEditKey(e.target.value)} placeholder="Key" className="w-28" />
                <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} placeholder="लेबल" className="flex-1" />
                <Button size="icon" variant="ghost" onClick={applyEdit}><Save className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={cancelEdit}><X className="w-4 h-4" /></Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">
                  {item.label} <span className="text-gray-400">({item.key})</span>
                </span>
                <Button size="icon" variant="ghost" onClick={() => startEdit(idx)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => removeItem(idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </>
            )}
          </div>
        ))}

        {adding && (
          <div className="flex items-center gap-2">
            <Input value={editKey} onChange={(e) => setEditKey(e.target.value)} placeholder="Key" className="w-28" />
            <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} placeholder="लेबल" className="flex-1" />
            <Button size="icon" variant="ghost" onClick={applyEdit}><Save className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost" onClick={cancelEdit}><X className="w-4 h-4" /></Button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t mt-2">
          <Button variant="outline" size="sm" onClick={startAdd}>
            <Plus className="w-4 h-4 mr-1" />
            नया जोड़ें
          </Button>
          <Button size="sm" onClick={save} disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            सहेजें
          </Button>
        </div>
      </CardContent>
    </Card>
    {ConfirmDialog}
    </>
  )
}

function ShiftListCard({ items }: { items: ShiftItem[] }) {
  const [list, setList] = useState<ShiftItem[]>(items)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  const [editKey, setEditKey] = useState("")
  const [editLabel, setEditLabel] = useState("")
  const [editStart, setEditStart] = useState("")
  const [editEnd, setEditEnd] = useState("")
  const { mutate, isPending } = useUpdateDutySettings()
  const { toast } = useToast()
  const { confirm, ConfirmDialog } = useConfirmDialog()

  useEffect(() => setList(items), [items])

  const cancelEdit = () => {
    setEditIdx(null)
    setAdding(false)
    setEditKey("")
    setEditLabel("")
    setEditStart("")
    setEditEnd("")
  }

  const startEdit = (idx: number) => {
    setAdding(false)
    setEditIdx(idx)
    setEditKey(list[idx].key)
    setEditLabel(list[idx].label)
    setEditStart(list[idx].start)
    setEditEnd(list[idx].end)
  }

  const startAdd = () => {
    setEditIdx(null)
    setAdding(true)
    setEditKey("")
    setEditLabel("")
    setEditStart("")
    setEditEnd("")
  }

  const applyEdit = () => {
    if (!editKey.trim() || !editLabel.trim() || !editStart || !editEnd) return
    const item = { key: editKey.trim(), label: editLabel.trim(), start: editStart, end: editEnd }
    if (adding) setList((l) => [...l, item])
    else if (editIdx !== null) setList((l) => l.map((it, i) => (i === editIdx ? item : it)))
    cancelEdit()
  }

  const removeItem = async (idx: number) => {
    if (!(await confirm("क्या आप वाकई इसे हटाना चाहते हैं?"))) return
    setList((l) => l.filter((_, i) => i !== idx))
  }

  const save = () => {
    mutate(
      { shifts: list },
      {
        onSuccess: () => toast({ title: "सहेजा गया" }),
        onError: (e: any) => toast({ title: "त्रुटि", description: e?.message || "सहेजने में त्रुटि", variant: "destructive" }),
      }
    )
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="text-base">पाली / Shifts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 flex-wrap">
            {editIdx === idx ? (
              <>
                <Input value={editKey} onChange={(e) => setEditKey(e.target.value)} placeholder="Key" className="w-24" />
                <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} placeholder="लेबल" className="w-28" />
                <Input type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} className="w-28" />
                <Input type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} className="w-28" />
                <span className="text-xs text-gray-500 whitespace-nowrap">{shiftHours(editStart, editEnd)}</span>
                <Button size="icon" variant="ghost" onClick={applyEdit}><Save className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={cancelEdit}><X className="w-4 h-4" /></Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">
                  {item.label} <span className="text-gray-400">({item.key})</span> — {item.start} - {item.end}
                  <span className="text-gray-400"> ({shiftHours(item.start, item.end)})</span>
                </span>
                <Button size="icon" variant="ghost" onClick={() => startEdit(idx)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => removeItem(idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </>
            )}
          </div>
        ))}

        {adding && (
          <div className="flex items-center gap-2 flex-wrap">
            <Input value={editKey} onChange={(e) => setEditKey(e.target.value)} placeholder="Key" className="w-24" />
            <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} placeholder="लेबल" className="w-28" />
            <Input type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} className="w-28" />
            <Input type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} className="w-28" />
            <span className="text-xs text-gray-500 whitespace-nowrap">{shiftHours(editStart, editEnd)}</span>
            <Button size="icon" variant="ghost" onClick={applyEdit}><Save className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost" onClick={cancelEdit}><X className="w-4 h-4" /></Button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t mt-2">
          <Button variant="outline" size="sm" onClick={startAdd}>
            <Plus className="w-4 h-4 mr-1" />
            नई पाली जोड़ें
          </Button>
          <Button size="sm" onClick={save} disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            सहेजें
          </Button>
        </div>
      </CardContent>
    </Card>
    {ConfirmDialog}
    </>
  )
}

export default function DutySettingsView() {
  const { data, isLoading, error } = useDutySettings()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        लोड हो रहा है...
      </div>
    )
  }

  if (error || !data) {
    return <div className="py-16 text-center text-red-500">डेटा लोड नहीं हो सका</div>
  }

  return (
    <div className="space-y-4">
      <SimpleListCard title="ड्यूटी स्थान (Duty Place)" items={data.dutyTypes} fieldKey="dutyTypes" />
      <ShiftListCard items={data.shifts} />
      <SimpleListCard title="उपस्थिति स्थिति (Attendance Status)" items={data.attendanceStatuses} fieldKey="attendanceStatuses" />
    </div>
  )
}

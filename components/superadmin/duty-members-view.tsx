"use client"

import { useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Plus, Pencil, Trash2, Loader2, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useConfirmDialog } from "@/hooks/use-confirm-dialog"
import { useDutySettings } from "@/data-hooks/mutation-query/useDutySettings"
import { statesAndDistricts } from "@/components/group-component/family-form/constants"
import {
  useDutyMembersList,
  useDutyMembersChokhlas,
  useDutyMembersVillages,
  useDutyMembersPersons,
  useCreateDutyMember,
  useUpdateDutyMember,
  useDeleteDutyMember,
} from "@/data-hooks/mutation-query/useDutyMembers"
import type { DutyMember, DutyMemberCategory } from "@/data-hooks/requests/duty-members"

const STATES = Object.keys(statesAndDistricts)

const EMPTY_FORM = {
  name: "",
  category: "permanent" as DutyMemberCategory,
  age: "",
  state: "",
  district: "",
  isSamajMember: true,
  govtId: "",
  chokhlaId: "",
  chokhlaName: "",
  villageId: "",
  villageName: "",
  phone: "",
  dutyTypes: [] as string[],
  shift: "",
  active: true,
}

// Single-select pill group — replaces bare radio circles with a clearer, touch-friendly toggle.
function PillSelect({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "border-transparent bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                : "border-gray-300 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-600"
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// Visual grouping for the add/edit dialog — a small uppercase heading over a bordered block.
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/60 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-orange-700">{title}</h4>
      {children}
    </div>
  )
}

export default function DutyMembersView() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { confirm, ConfirmDialog } = useConfirmDialog()

  const chokhlaId = searchParams.get("chokhlaId") || "all"
  const villageId = searchParams.get("villageId") || "all"
  const dutyType = searchParams.get("dutyType") || "all"
  const search = searchParams.get("search") || ""

  const hasFilters = chokhlaId !== "all" || villageId !== "all" || dutyType !== "all" || !!search

  const setParam = (key: string, value: string, resetKeys: string[] = []) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") params.delete(key)
    else params.set(key, value)
    resetKeys.forEach((k) => params.delete(k))
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const clearFilters = () => router.push(pathname, { scroll: false })

  const { data: settings } = useDutySettings()
  const { data: chokhlas } = useDutyMembersChokhlas()
  const { data: filterVillages } = useDutyMembersVillages(chokhlaId !== "all" ? chokhlaId : undefined)
  const { data: members, isLoading, error } = useDutyMembersList({
    chokhlaId: chokhlaId !== "all" ? chokhlaId : undefined,
    villageId: villageId !== "all" ? villageId : undefined,
    dutyType,
    search,
  })

  const dutyTypes = settings?.dutyTypes || []
  const shifts = settings?.shifts || []

  const createMutation = useCreateDutyMember()
  const updateMutation = useUpdateDutyMember()
  const deleteMutation = useDeleteDutyMember()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM)
  const [selectedPersonId, setSelectedPersonId] = useState("")
  const [manualEntry, setManualEntry] = useState(false)
  const [manualVillage, setManualVillage] = useState(false)

  const { data: formVillages } = useDutyMembersVillages(form.chokhlaId || undefined)
  const { data: formPersons } = useDutyMembersPersons(form.villageId || undefined)

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setSelectedPersonId("")
    setManualEntry(false)
    setManualVillage(false)
    setModalOpen(true)
  }

  const openEdit = (m: DutyMember) => {
    setEditingId(m.id)
    setForm({
      name: m.name,
      category: m.category || "permanent",
      age: m.age ? String(m.age) : "",
      state: m.state || "",
      district: m.district || "",
      isSamajMember: m.isSamajMember !== false,
      govtId: m.govtId || "",
      chokhlaId: m.chokhlaId || "",
      chokhlaName: m.chokhlaName || "",
      villageId: m.villageId || "",
      villageName: m.villageName || "",
      phone: m.phone || "",
      dutyTypes: m.dutyTypes || [],
      shift: m.shift || "",
      active: m.active,
    })
    setSelectedPersonId("")
    // editing an existing member always starts in free-text mode so their saved name/village are directly editable
    setManualEntry(true)
    setManualVillage(!m.villageId)
    setModalOpen(true)
  }

  const changeCategory = (category: DutyMemberCategory) => {
    setSelectedPersonId("")
    setManualEntry(false)
    setManualVillage(false)
    setForm({
      ...EMPTY_FORM,
      category,
      govtId: form.govtId,
      dutyTypes: form.dutyTypes,
      shift: form.shift,
      active: form.active,
    })
  }

  const changeIsSamajMember = (isSamajMember: boolean) => {
    setSelectedPersonId("")
    setManualEntry(false)
    setManualVillage(false)
    setForm({
      ...form,
      isSamajMember,
      name: "",
      chokhlaId: "",
      chokhlaName: "",
      villageId: "",
      villageName: "",
      phone: "",
    })
  }

  // A member has exactly one duty type, so dutyTypes is kept as a single-element array
  // (no schema change needed — the backend field stays an array).
  const selectDutyType = (key: string) => {
    setForm((f) => ({ ...f, dutyTypes: [key] }))
  }

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "सदस्य का नाम आवश्यक है", variant: "destructive" })
      return
    }
    const payload = { ...form, name: form.name.trim(), age: form.age ? Number(form.age) : null }
    const onSuccess = () => {
      toast({ title: "सहेजा गया" })
      setModalOpen(false)
    }
    const onError = (e: any) => toast({ title: "त्रुटि", description: e?.message || "सहेजने में त्रुटि", variant: "destructive" })
    if (editingId) updateMutation.mutate({ id: editingId, payload }, { onSuccess, onError })
    else createMutation.mutate(payload, { onSuccess, onError })
  }

  const handleDelete = async (id: string) => {
    if (!(await confirm("क्या आप वाकई इस सदस्य को हटाना चाहते हैं?"))) return
    deleteMutation.mutate(id, {
      onSuccess: () => toast({ title: "हटा दिया गया" }),
      onError: (e: any) => toast({ title: "त्रुटि", description: e?.message || "हटाने में त्रुटि", variant: "destructive" }),
    })
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-2">
          <Select value={chokhlaId} onValueChange={(v) => setParam("chokhlaId", v, ["villageId"])}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="सभी चोखरा" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी चोखरा</SelectItem>
              {(chokhlas || []).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={villageId} onValueChange={(v) => setParam("villageId", v)} disabled={chokhlaId === "all"}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="सभी गांव" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी गांव</SelectItem>
              {(filterVillages || []).map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dutyType} onValueChange={(v) => setParam("dutyType", v)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="सभी स्थान" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी स्थान</SelectItem>
              {dutyTypes.map((t) => (
                <SelectItem key={t.key} value={t.key}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={search}
            onChange={(e) => setParam("search", e.target.value)}
            placeholder="नाम से खोजें"
            className="w-48"
          />

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              साफ़ करें
            </Button>
          )}

          <div className="flex-1" />

          <Button size="sm" onClick={openAdd} className="bg-gradient-to-r from-orange-500 to-orange-600">
            <Plus className="w-4 h-4 mr-1" />
            सदस्य जोड़ें
          </Button>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-gray-500">
              <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
              लोड हो रहा है...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-500">डेटा लोड नहीं हो सका</div>
          ) : !members?.length ? (
            <div className="py-16 text-center text-gray-500">कोई सदस्य नहीं मिला</div>
          ) : (
            <div className="divide-y">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs rounded-full bg-gray-100 text-gray-600 px-2 py-0.5">
                        {m.category === "non_permanent" ? "अस्थायी" : "स्थायी"}
                      </span>
                      {!m.active && <span className="text-xs rounded-full bg-gray-100 text-gray-500 px-2 py-0.5">निष्क्रिय</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {m.category === "permanent"
                        ? [m.villageName, m.district, m.state].filter(Boolean).join(" / ") || "—"
                        : [m.chokhlaName, m.villageName].filter(Boolean).join(" / ") || "—"}
                      {m.age ? ` · ${m.age} वर्ष` : ""}
                      {m.phone && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {m.phone}
                        </span>
                      )}
                    </div>
                    {(m.dutyTypes?.length > 0 || m.shift) && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {m.dutyTypes?.map((key) => {
                          const label = dutyTypes.find((t) => t.key === key)?.label || key
                          return (
                            <span key={key} className="text-xs rounded-full bg-orange-100 text-orange-700 px-2 py-0.5">
                              {label}
                            </span>
                          )
                        })}
                        {m.shift && (
                          <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-0.5">
                            {shifts.find((s) => s.key === m.shift)?.label || m.shift}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(m)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "सदस्य संपादित करें" : "नया सदस्य जोड़ें"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">श्रेणी *</label>
              <PillSelect
                options={[
                  { value: "permanent", label: "स्थायी" },
                  { value: "non_permanent", label: "अस्थायी" },
                ]}
                value={form.category}
                onChange={(v) => changeCategory(v as DutyMemberCategory)}
              />
            </div>

            {form.category === "permanent" ? (
              <FormSection title="व्यक्तिगत विवरण">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">सदस्य का नाम *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">आयु</label>
                    <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">फ़ोन नंबर</label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">राज्य</label>
                    <Select
                      value={form.state || "none"}
                      onValueChange={(v) => setForm({ ...form, state: v === "none" ? "" : v, district: "" })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="चुनें" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— कोई नहीं —</SelectItem>
                        {STATES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">जिला</label>
                    <Select
                      value={form.district || "none"}
                      onValueChange={(v) => setForm({ ...form, district: v === "none" ? "" : v })}
                      disabled={!form.state}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder={form.state ? "चुनें" : "पहले राज्य चुनें"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— कोई नहीं —</SelectItem>
                        {(statesAndDistricts[form.state] || []).map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">गांव का नाम</label>
                  <Input value={form.villageName} onChange={(e) => setForm({ ...form, villageName: e.target.value })} />
                </div>
              </FormSection>
            ) : (
              <FormSection title="व्यक्तिगत विवरण">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">क्या यह पंचाल समाज सदस्य है? *</label>
                  <PillSelect
                    options={[
                      { value: "yes", label: "हाँ" },
                      { value: "no", label: "नहीं" },
                    ]}
                    value={form.isSamajMember ? "yes" : "no"}
                    onChange={(v) => changeIsSamajMember(v === "yes")}
                  />
                </div>

                {form.isSamajMember ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">चोखरा</label>
                        <Select
                          value={form.chokhlaId || "none"}
                          onValueChange={(v) => {
                            setSelectedPersonId("")
                            setManualEntry(false)
                            setManualVillage(false)
                            if (v === "none") {
                              setForm({ ...form, chokhlaId: "", chokhlaName: "", villageId: "", villageName: "" })
                              return
                            }
                            const c = (chokhlas || []).find((x) => x.id === v)
                            setForm({ ...form, chokhlaId: v, chokhlaName: c?.name || "", villageId: "", villageName: "" })
                          }}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="चुनें" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">— कोई नहीं —</SelectItem>
                            {(chokhlas || []).map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="mb-1 block text-sm font-medium text-gray-700">गांव</label>
                          {form.chokhlaId && (formVillages?.length ?? 0) > 0 && manualVillage && (
                            <button
                              type="button"
                              className="text-xs text-orange-600 hover:underline"
                              onClick={() => {
                                setManualVillage(false)
                                setSelectedPersonId("")
                                setManualEntry(false)
                                setForm({ ...form, villageId: "", villageName: "" })
                              }}
                            >
                              सूची से चुनें
                            </button>
                          )}
                        </div>

                        {form.chokhlaId && (formVillages?.length ?? 0) > 0 && !manualVillage ? (
                          <Select
                            value={form.villageId || "none"}
                            onValueChange={(v) => {
                              setSelectedPersonId("")
                              setManualEntry(false)
                              if (v === "none") {
                                setManualVillage(true)
                                setForm({ ...form, villageId: "", villageName: "" })
                                return
                              }
                              const vv = (formVillages || []).find((x) => x.id === v)
                              setForm({ ...form, villageId: v, villageName: vv?.name || "" })
                            }}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="चुनें" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">+ सूची में नहीं है — नाम खुद दर्ज करें</SelectItem>
                              {(formVillages || []).map((v) => (
                                <SelectItem key={v.id} value={v.id}>
                                  {v.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={form.villageName}
                            onChange={(e) => {
                              setSelectedPersonId("")
                              setManualEntry(false)
                              setForm({ ...form, villageId: "", villageName: e.target.value })
                            }}
                            placeholder={form.chokhlaId ? "गांव का नाम" : "पहले चोखरा चुनें"}
                            disabled={!form.chokhlaId}
                            className="bg-white"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="mb-1 block text-sm font-medium text-gray-700">सदस्य का नाम *</label>
                        {!!form.villageId && (formPersons?.length ?? 0) > 0 && manualEntry && (
                          <button
                            type="button"
                            className="text-xs text-orange-600 hover:underline"
                            onClick={() => {
                              setManualEntry(false)
                              setForm({ ...form, name: "", phone: "" })
                            }}
                          >
                            सूची से चुनें
                          </button>
                        )}
                      </div>

                      {!!form.villageId && (formPersons?.length ?? 0) > 0 && !manualEntry ? (
                        <Select
                          value={selectedPersonId || "none"}
                          onValueChange={(v) => {
                            if (v === "none") {
                              setSelectedPersonId("")
                              setManualEntry(true)
                              setForm({ ...form, name: "" })
                              return
                            }
                            const p = (formPersons || []).find((x) => x.id === v)
                            if (!p) return
                            setSelectedPersonId(v)
                            setForm({
                              ...form,
                              name: `${p.firstName} ${p.lastName}`.trim(),
                              phone: p.mobileNumber || form.phone,
                            })
                          }}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="गांव के पंजीकृत सदस्यों में से चुनें" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">+ सूची में नहीं है — नाम खुद दर्ज करें</SelectItem>
                            {(formPersons || []).map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.firstName} {p.lastName} {p.mobileNumber ? `— ${p.mobileNumber}` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <>
                          <Input className="bg-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                          {!!form.villageId && (formPersons?.length ?? 0) === 0 && (
                            <p className="mt-1 text-xs text-gray-400">इस गांव में कोई पंजीकृत सदस्य नहीं मिला।</p>
                          )}
                        </>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">फ़ोन नंबर</label>
                      <Input className="bg-white" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">सदस्य का नाम *</label>
                    <Input className="bg-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                )}
              </FormSection>
            )}

            <FormSection title="ड्यूटी विवरण">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">सरकारी पहचान पत्र (Govt ID)</label>
                <Input className="bg-white" value={form.govtId} onChange={(e) => setForm({ ...form, govtId: e.target.value })} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">ड्यूटी स्थान</label>
                <PillSelect
                  options={dutyTypes.map((t) => ({ value: t.key, label: t.label }))}
                  value={form.dutyTypes[0] || ""}
                  onChange={selectDutyType}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">पाली (Shift)</label>
                <Select value={form.shift || "none"} onValueChange={(v) => setForm({ ...form, shift: v === "none" ? "" : v })}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— कोई नहीं —</SelectItem>
                    {shifts.map((s) => (
                      <SelectItem key={s.key} value={s.key}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormSection>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <Checkbox checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: !!v })} />
              सक्रिय
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              रद्द करें
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-gradient-to-r from-orange-500 to-orange-600"
            >
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              सहेजें
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {ConfirmDialog}
    </div>
  )
}

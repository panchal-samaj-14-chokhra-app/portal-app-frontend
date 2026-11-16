"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Plus, Edit2, Trash2, BarChart2, Globe, EyeOff, Loader2,
  Download, ArrowLeft, Search, Filter, ChevronLeft, ChevronRight,
  Users, CalendarDays, TrendingUp, ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  fetchAdminForms, fetchAdminForm, createSurveyForm, updateSurveyForm,
  saveSurveyQuestions, deleteSurveyForm, fetchFormResponses,
  type SurveyForm, type SurveyQuestion,
} from "@/data-hooks/requests/survey"
import SurveyFormBuilder from "./survey-form-builder"

const PAGE_SIZE = 20

type View = "list" | "builder" | "responses"

export default function SurveyManagement() {
  const qc = useQueryClient()
  const [view, setView] = useState<View>("list")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [responsesFormId, setResponsesFormId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filterVillage, setFilterVillage] = useState("")
  const [filterDistrict, setFilterDistrict] = useState("")
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")
  const [page, setPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const { data: forms = [], isLoading } = useQuery({ queryKey: ["survey-forms"], queryFn: fetchAdminForms })

  const { data: editingForm } = useQuery({
    queryKey: ["survey-form", editingId],
    queryFn: () => fetchAdminForm(editingId!),
    enabled: !!editingId,
  })

  const { data: responses = [], isLoading: loadingResponses } = useQuery({
    queryKey: ["survey-responses", responsesFormId],
    queryFn: () => fetchFormResponses(responsesFormId!),
    enabled: !!responsesFormId,
  })

  const createMut = useMutation({
    mutationFn: async ({ meta, questions }: { meta: any; questions: SurveyQuestion[] }) => {
      const form = await createSurveyForm(meta)
      if (questions.length) await saveSurveyQuestions(form.id, questions)
      return form
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["survey-forms"] }); setView("list") },
  })

  const updateMut = useMutation({
    mutationFn: async ({ id, meta, questions }: { id: string; meta: any; questions: SurveyQuestion[] }) => {
      await updateSurveyForm(id, meta)
      await saveSurveyQuestions(id, questions)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["survey-forms"] }); qc.invalidateQueries({ queryKey: ["survey-form", editingId] }); setView("list"); setEditingId(null) },
  })

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateSurveyForm(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["survey-forms"] }),
  })

  const deleteMut = useMutation({
    mutationFn: deleteSurveyForm,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["survey-forms"] }); setDeleteId(null) },
  })

  const handleSave = (meta: any, questions: SurveyQuestion[]) => {
    if (editingId) updateMut.mutate({ id: editingId, meta, questions })
    else createMut.mutate({ meta, questions })
  }

  const exportCsv = () => {
    if (!responses.length) return
    const form = forms.find(f => f.id === responsesFormId)
    const questions = responses[0]?.answers?.map((a: any) => a.question?.label) || []
    const headers = ["नाम", "मोबाइल", "ईमेल", "गाँव", "जिला", "दिनांक", ...questions]
    const rows = responses.map((r: any) => [
      r.respondentName, r.mobileNumber, r.email || "", r.village?.name || "", r.district || "",
      new Date(r.submittedAt).toLocaleDateString("hi-IN"),
      ...r.answers.map((a: any) => a.value || a.fileUrl || ""),
    ])
    const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = `${form?.title || "responses"}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  // ── Responses view ────────────────────────────────────────────────────────────
  if (view === "responses" && responsesFormId) {
    const form = forms.find(f => f.id === responsesFormId)

    // Analytics
    const today = new Date().toLocaleDateString("en-CA")
    const todayCount = responses.filter((r: any) =>
      new Date(r.submittedAt).toLocaleDateString("en-CA") === today
    ).length
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    const weekCount = responses.filter((r: any) => new Date(r.submittedAt) >= weekAgo).length

    // Unique filter options
    const villages = [...new Set(responses.map((r: any) => r.village?.name).filter(Boolean))] as string[]
    const districts = [...new Set(responses.map((r: any) => r.district).filter(Boolean))] as string[]

    // Filter + search
    const filtered = responses.filter((r: any) => {
      const q = search.toLowerCase()
      if (q && !r.respondentName.toLowerCase().includes(q) && !r.mobileNumber.includes(q)) return false
      if (filterVillage && r.village?.name !== filterVillage) return false
      if (filterDistrict && r.district !== filterDistrict) return false
      if (filterDateFrom && new Date(r.submittedAt).toLocaleDateString("en-CA") < filterDateFrom) return false
      if (filterDateTo && new Date(r.submittedAt).toLocaleDateString("en-CA") > filterDateTo) return false
      return true
    })

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    // Question columns from first response
    const questionCols: { id: string; label: string }[] = responses[0]?.answers?.map((a: any) => ({
      id: a.questionId, label: a.question?.label || a.questionId
    })) || []

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => { setView("list"); setResponsesFormId(null); setSearch(""); setFilterVillage(""); setFilterDistrict(""); setFilterDateFrom(""); setFilterDateTo(""); setPage(1) }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> वापस
          </Button>
          <h2 className="text-base font-bold text-gray-800 flex-1 truncate">{form?.title}</h2>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!responses.length}>
            <Download className="w-4 h-4 mr-1" /> CSV
          </Button>
        </div>

        {loadingResponses ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : (
          <>
            {/* Analytics cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                <Users className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-orange-700">{responses.length}</p>
                <p className="text-xs text-gray-500">कुल प्रतिक्रियाएं</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                <CalendarDays className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-700">{todayCount}</p>
                <p className="text-xs text-gray-500">आज</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-700">{weekCount}</p>
                <p className="text-xs text-gray-500">इस सप्ताह</p>
              </div>
            </div>

            {/* Search + Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-600">फ़िल्टर करें</span>
                {(search || filterVillage || filterDistrict || filterDateFrom || filterDateTo) && (
                  <button onClick={() => { setSearch(""); setFilterVillage(""); setFilterDistrict(""); setFilterDateFrom(""); setFilterDateTo(""); setPage(1) }}
                    className="ml-auto text-xs text-orange-600 hover:underline">सभी हटाएं</button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="नाम या मोबाइल से खोजें..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <select value={filterVillage} onChange={e => { setFilterVillage(e.target.value); setPage(1) }}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  <option value="">सभी गाँव</option>
                  {villages.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <select value={filterDistrict} onChange={e => { setFilterDistrict(e.target.value); setPage(1) }}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  <option value="">सभी जिले</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setPage(1) }}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <input type="date" value={filterDateTo} onChange={e => { setFilterDateTo(e.target.value); setPage(1) }}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <p className="text-xs text-gray-400">{filtered.length} परिणाम मिले</p>
            </div>

            {/* Table */}
            {!filtered.length ? (
              <div className="text-center py-12 text-gray-400">कोई प्रतिक्रिया नहीं मिली</div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs w-8">#</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[120px]">नाम</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[100px]">मोबाइल</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[80px]">गाँव</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[80px]">जिला</th>
                        {questionCols.map(q => (
                          <th key={q.id} className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[120px] max-w-[180px]">
                            <span className="line-clamp-2">{q.label}</span>
                          </th>
                        ))}
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[90px]">दिनांक</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pageData.map((r: any, i: number) => {
                        const answerMap: Record<string, any> = {}
                        r.answers.forEach((a: any) => { answerMap[a.questionId] = a })
                        return (
                          <tr key={r.id} className="hover:bg-orange-50/40 cursor-pointer transition-colors"
                            onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                            <td className="px-3 py-2.5 text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                            <td className="px-3 py-2.5 font-medium text-gray-900">{r.respondentName}</td>
                            <td className="px-3 py-2.5 text-gray-600">{r.mobileNumber}</td>
                            <td className="px-3 py-2.5 text-gray-600">{r.village?.name || "—"}</td>
                            <td className="px-3 py-2.5 text-gray-600">{r.district || "—"}</td>
                            {questionCols.map(q => {
                              const a = answerMap[q.id]
                              return (
                                <td key={q.id} className="px-3 py-2.5 text-gray-700 max-w-[180px]">
                                  {a?.fileUrl ? (
                                    <a href={a.fileUrl} target="_blank" rel="noopener noreferrer"
                                      onClick={e => e.stopPropagation()}
                                      className="text-blue-600 underline flex items-center gap-1 text-xs">
                                      <ExternalLink className="w-3 h-3" /> फ़ाइल
                                    </a>
                                  ) : (
                                    <span className="line-clamp-2 text-xs">{a?.value || "—"}</span>
                                  )}
                                </td>
                              )
                            })}
                            <td className="px-3 py-2.5 text-gray-400 text-xs whitespace-nowrap">
                              {new Date(r.submittedAt).toLocaleDateString("hi-IN")}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <span className="text-xs text-gray-500">
                      {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                          if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...")
                          acc.push(p); return acc
                        }, [])
                        .map((p, i) => p === "..." ? (
                          <span key={i} className="px-1 text-gray-400 text-xs">…</span>
                        ) : (
                          <Button key={p} size="icon" variant={p === page ? "default" : "ghost"}
                            className={`h-7 w-7 text-xs ${p === page ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}`}
                            onClick={() => setPage(p as number)}>
                            {p}
                          </Button>
                        ))
                      }
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // ── Builder view ──────────────────────────────────────────────────────────────
  if (view === "builder") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => { setView("list"); setEditingId(null) }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> वापस
          </Button>
          <h2 className="text-lg font-bold text-gray-800">
            {editingId ? "फॉर्म संपादित करें" : "नया फॉर्म बनाएं"}
          </h2>
        </div>
        {editingId && !editingForm ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : (
          <SurveyFormBuilder
            initialTitle={editingForm?.title || ""}
            initialDescription={editingForm?.description || ""}
            initialEventName={editingForm?.eventName || ""}
            initialQuestions={editingForm?.questions || []}
            onSave={handleSave}
            onCancel={() => { setView("list"); setEditingId(null) }}
            saving={createMut.isPending || updateMut.isPending}
          />
        )}
      </div>
    )
  }

  // ── List view ─────────────────────────────────────────────────────────────────
  const statusColor: Record<string, string> = {
    draft:     "bg-gray-100 text-gray-700 border-gray-200",
    published: "bg-green-100 text-green-700 border-green-200",
    closed:    "bg-red-100 text-red-700 border-red-200",
  }
  const statusLabel: Record<string, string> = { draft: "ड्राफ्ट", published: "प्रकाशित", closed: "बंद" }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">सर्वे / पंजीकरण फॉर्म</h2>
          <p className="text-sm text-gray-500">Google Forms जैसा डायनामिक फॉर्म बिल्डर</p>
        </div>
        <Button onClick={() => { setEditingId(null); setView("builder") }} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> नया फॉर्म बनाएं
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
      ) : !forms.length ? (
        <div className="text-center py-16 border-2 border-dashed border-orange-200 rounded-2xl">
          <p className="text-gray-400 mb-4">अभी कोई फॉर्म नहीं बनाया गया</p>
          <Button onClick={() => { setEditingId(null); setView("builder") }} variant="outline" className="border-orange-300 text-orange-700">
            <Plus className="w-4 h-4 mr-2" /> पहला फॉर्म बनाएं
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map(form => (
            <div key={form.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{form.title}</h3>
                  {form.eventName && <p className="text-xs text-orange-600 truncate">{form.eventName}</p>}
                  {form.description && <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{form.description}</p>}
                </div>
                <Badge className={`text-xs flex-shrink-0 ${statusColor[form.status]}`}>{statusLabel[form.status]}</Badge>
              </div>

              <div className="flex gap-3 text-xs text-gray-500">
                <span>{form._count?.questions || 0} प्रश्न</span>
                <span>·</span>
                <span>{form._count?.responses || 0} प्रतिक्रियाएं</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100">
                <Button
                  size="sm" variant="ghost"
                  className="text-xs text-gray-600 h-7 px-2"
                  onClick={() => { setEditingId(form.id); setView("builder") }}
                >
                  <Edit2 className="w-3 h-3 mr-1" /> संपादित
                </Button>
                <Button
                  size="sm" variant="ghost"
                  className="text-xs text-blue-600 h-7 px-2"
                  onClick={() => { setResponsesFormId(form.id); setView("responses") }}
                >
                  <BarChart2 className="w-3 h-3 mr-1" /> प्रतिक्रियाएं
                </Button>
                {form.status !== "published" ? (
                  <Button
                    size="sm" variant="ghost"
                    className="text-xs text-green-600 h-7 px-2"
                    onClick={() => statusMut.mutate({ id: form.id, status: "published" })}
                  >
                    <Globe className="w-3 h-3 mr-1" /> प्रकाशित करें
                  </Button>
                ) : (
                  <Button
                    size="sm" variant="ghost"
                    className="text-xs text-gray-600 h-7 px-2"
                    onClick={() => statusMut.mutate({ id: form.id, status: "draft" })}
                  >
                    <EyeOff className="w-3 h-3 mr-1" /> अप्रकाशित
                  </Button>
                )}
                <Button
                  size="sm" variant="ghost"
                  className="text-xs text-red-500 h-7 px-2"
                  onClick={() => setDeleteId(form.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" /> हटाएं
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>फॉर्म हटाएं?</AlertDialogTitle>
            <AlertDialogDescription>सभी प्रतिक्रियाएं भी स्थायी रूप से हट जाएंगी।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMut.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              हां, हटाएं
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

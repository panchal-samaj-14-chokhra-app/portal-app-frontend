"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Plus, Edit2, Trash2, BarChart2, Globe, EyeOff, Loader2,
  Download, ArrowLeft, Search, Filter, ChevronLeft, ChevronRight,
  Users, CalendarDays, TrendingUp, ExternalLink, Eye, X, FileText,
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
  saveSurveyQuestions, deleteSurveyForm, fetchFormResponses, deleteFormResponse,
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
  const [filterQ, setFilterQ] = useState<Record<string, string>>({})
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")
  const [page, setPage] = useState(1)
  const [viewingResponse, setViewingResponse] = useState<any | null>(null)
  const [deleteResponseId, setDeleteResponseId] = useState<string | null>(null)

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

  const { data: responsesForm } = useQuery({
    queryKey: ["survey-form", responsesFormId],
    queryFn: () => fetchAdminForm(responsesFormId!),
    enabled: !!responsesFormId && view === "responses",
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

  const deleteResponseMut = useMutation({
    mutationFn: (responseId: string) => deleteFormResponse(responsesFormId!, responseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["survey-responses", responsesFormId] })
      qc.invalidateQueries({ queryKey: ["survey-forms"] })
      setDeleteResponseId(null)
      if (viewingResponse && viewingResponse.id === deleteResponseId) setViewingResponse(null)
    },
  })

  const exportCsv = () => {
    if (!responses.length) return
    const form = forms.find(f => f.id === responsesFormId)
    const qLabels = responses[0]?.answers?.map((a: any) => a.question?.label || a.questionId) || []
    const headers = ["नाम", "मोबाइल", "ईमेल", "चोखला", "गाँव", "जिला", "दिनांक", ...qLabels]
    const rows = responses.map((r: any) => [
      r.respondentName,
      r.mobileNumber,
      r.email || "",
      r.chokhlaName || r.village?.chakola?.name || "",
      r.village?.name || "",
      r.district || "",
      new Date(r.submittedAt).toLocaleDateString("hi-IN"),
      ...r.answers.map((a: any) => a.fileUrl ? a.fileUrl : (a.value || "")),
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

    // All question cols with type (from first response's answers, ordered by question.order)
    const allQuestionCols: { id: string; label: string; type: string }[] =
      responses[0]?.answers?.map((a: any) => ({
        id: a.questionId,
        label: a.question?.label || a.questionId,
        type: a.question?.type || "short_answer",
      })) || []

    // Key summary cols: first non-file text answer + first dropdown answer
    const keyTextCol  = allQuestionCols.find(q => q.type !== "file_upload")
    const keyDropCol  = allQuestionCols.find(q => q.type === "dropdown" || q.type === "multiple_choice")

    // Dynamic filterable questions (top-level dropdowns only)
    const filterableQs: { id: string; label: string; options: string[] }[] =
      (responsesForm?.questions || [])
        .filter((q: any) =>
          ["dropdown", "multiple_choice"].includes(q.type) &&
          Array.isArray(q.options) && q.options.length > 0 && !q.showIf
        )
        .map((q: any) => ({ id: q.id, label: q.label, options: q.options as string[] }))

    // Filter options from actual data — now using chakola (fixed!)
    const villages = [...new Set(responses.map((r: any) => r.village?.name).filter(Boolean))] as string[]
    const getChokhla = (r: any) => r.chokhlaName || r.village?.chakola?.name || ""
    const chokhlas = [...new Set(responses.map(getChokhla).filter(Boolean))] as string[]

    const hasFilters = search || filterDateFrom || filterDateTo || Object.values(filterQ).some(Boolean)
    const clearAll = () => { setSearch(""); setFilterDateFrom(""); setFilterDateTo(""); setFilterQ({}); setPage(1) }

    // Filter + search — chokhla now uses chakola.name
    const filtered = responses.filter((r: any) => {
      const q = search.toLowerCase()
      if (q && !r.respondentName.toLowerCase().includes(q) && !r.mobileNumber.includes(q)) return false
      if (filterQ["__village"] && r.village?.name !== filterQ["__village"]) return false
      if (filterQ["__chokhla"] && getChokhla(r) !== filterQ["__chokhla"]) return false
      if (filterDateFrom && new Date(r.submittedAt).toLocaleDateString("en-CA") < filterDateFrom) return false
      if (filterDateTo && new Date(r.submittedAt).toLocaleDateString("en-CA") > filterDateTo) return false
      for (const [qId, val] of Object.entries(filterQ)) {
        if (!val || qId.startsWith("__")) continue
        const ans = r.answers.find((a: any) => a.questionId === qId)
        if (!ans || ans.value !== val) return false
      }
      return true
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => {
            setView("list"); setResponsesFormId(null);
            setSearch(""); setFilterQ({}); setFilterDateFrom(""); setFilterDateTo(""); setPage(1)
          }}>
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
                {hasFilters && (
                  <button onClick={clearAll} className="ml-auto text-xs text-orange-600 hover:underline">सभी हटाएं</button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="नाम या मोबाइल से खोजें..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={filterQ["__village"] || ""}
                  onChange={e => { setFilterQ(prev => ({ ...prev, __village: e.target.value })); setPage(1) }}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  <option value="">सभी गाँव</option>
                  {villages.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <select value={filterQ["__chokhla"] || ""}
                  onChange={e => { setFilterQ(prev => ({ ...prev, __chokhla: e.target.value })); setPage(1) }}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  <option value="">सभी चोखरा</option>
                  {chokhlas.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {filterableQs.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filterableQs.map(fq => (
                    <select key={fq.id} value={filterQ[fq.id] || ""}
                      onChange={e => { setFilterQ(prev => ({ ...prev, [fq.id]: e.target.value })); setPage(1) }}
                      className="border border-orange-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/40">
                      <option value="">सभी — {fq.label}</option>
                      {fq.options.filter(Boolean).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
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
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[130px]">नाम</th>
                        {keyTextCol && (
                          <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[120px]">
                            <span className="line-clamp-1">{keyTextCol.label}</span>
                          </th>
                        )}
                        {keyDropCol && keyDropCol.id !== keyTextCol?.id && (
                          <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[140px]">
                            <span className="line-clamp-1">{keyDropCol.label}</span>
                          </th>
                        )}
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[80px]">गाँव</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[80px]">चोखरा</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs min-w-[85px]">दिनांक</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 text-xs w-20">क्रिया</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pageData.map((r: any, i: number) => {
                        const answerMap: Record<string, any> = {}
                        r.answers.forEach((a: any) => { answerMap[a.questionId] = a })
                        return (
                          <tr key={r.id} className="hover:bg-orange-50/30 transition-colors">
                            <td className="px-3 py-2.5 text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                            <td className="px-3 py-2.5">
                              <p className="font-medium text-gray-900 text-xs">{r.respondentName}</p>
                              <p className="text-gray-400 text-[11px]">{r.mobileNumber}</p>
                            </td>
                            {keyTextCol && (
                              <td className="px-3 py-2.5 text-gray-700 text-xs">
                                {answerMap[keyTextCol.id]?.value || "—"}
                              </td>
                            )}
                            {keyDropCol && keyDropCol.id !== keyTextCol?.id && (
                              <td className="px-3 py-2.5 text-xs">
                                {answerMap[keyDropCol.id]?.value
                                  ? <span className="inline-block bg-orange-100 text-orange-700 rounded-full px-2 py-0.5 text-[11px] font-medium line-clamp-1">
                                      {answerMap[keyDropCol.id].value}
                                    </span>
                                  : <span className="text-gray-400">—</span>
                                }
                              </td>
                            )}
                            <td className="px-3 py-2.5 text-gray-600 text-xs">{r.village?.name || "—"}</td>
                            <td className="px-3 py-2.5 text-gray-600 text-xs">{getChokhla(r) || "—"}</td>
                            <td className="px-3 py-2.5 text-gray-400 text-xs whitespace-nowrap">
                              {new Date(r.submittedAt).toLocaleDateString("hi-IN")}
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setViewingResponse(r)}
                                  className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors"
                                  title="विवरण देखें"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteResponseId(r.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                                  title="हटाएं"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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

            {/* View Response Modal */}
            {viewingResponse && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50"
                onClick={() => setViewingResponse(null)}>
                <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl"
                  onClick={e => e.stopPropagation()}>
                  {/* Modal header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900">{viewingResponse.respondentName}</p>
                      <p className="text-xs text-gray-500">{viewingResponse.mobileNumber} · {viewingResponse.village?.name || ""}{(viewingResponse.chokhlaName || viewingResponse.village?.chakola?.name) ? ` · ${viewingResponse.chokhlaName || viewingResponse.village?.chakola?.name}` : ""}</p>
                    </div>
                    <button onClick={() => setViewingResponse(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Modal body */}
                  <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
                    {viewingResponse.answers.map((a: any) => (
                      <div key={a.questionId} className="space-y-0.5">
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                          {a.question?.label || a.questionId}
                        </p>
                        {a.fileUrl ? (
                          <a href={a.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-600 text-sm hover:underline">
                            <FileText className="w-4 h-4" />
                            फ़ाइल देखें / डाउनलोड
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <p className="text-sm text-gray-800">{a.value || <span className="text-gray-400 italic">—</span>}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                    सबमिट: {new Date(viewingResponse.submittedAt).toLocaleString("hi-IN")}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Delete response confirmation */}
        <AlertDialog open={!!deleteResponseId} onOpenChange={o => !o && setDeleteResponseId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>प्रतिक्रिया हटाएं?</AlertDialogTitle>
              <AlertDialogDescription>यह प्रतिक्रिया स्थायी रूप से हट जाएगी।</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>रद्द करें</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteResponseId && deleteResponseMut.mutate(deleteResponseId)}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteResponseMut.isPending}
              >
                {deleteResponseMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "हां, हटाएं"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

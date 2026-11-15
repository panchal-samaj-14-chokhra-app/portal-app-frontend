"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Plus, Edit2, Trash2, Eye, BarChart2, Globe, EyeOff, Loader2,
  Download, ArrowLeft, CheckCircle, XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
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

type View = "list" | "builder" | "responses"

export default function SurveyManagement() {
  const qc = useQueryClient()
  const [view, setView] = useState<View>("list")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [responsesFormId, setResponsesFormId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

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
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => { setView("list"); setResponsesFormId(null) }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> वापस
          </Button>
          <h2 className="text-lg font-bold text-gray-800 flex-1">{form?.title} — प्रतिक्रियाएं ({responses.length})</h2>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!responses.length}>
            <Download className="w-4 h-4 mr-1" /> CSV
          </Button>
        </div>

        {loadingResponses ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : !responses.length ? (
          <div className="text-center py-16 text-gray-400">अभी कोई प्रतिक्रिया नहीं मिली</div>
        ) : (
          <div className="space-y-4">
            {responses.map((r: any, ri: number) => (
              <div key={r.id} className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{r.respondentName}</p>
                    <p className="text-sm text-gray-500">{r.mobileNumber} {r.email ? `· ${r.email}` : ""}</p>
                    <p className="text-sm text-gray-500">{r.village?.name || ""} {r.district ? `· ${r.district}` : ""}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(r.submittedAt).toLocaleString("hi-IN")}</span>
                </div>
                <div className="mt-2 space-y-1 border-t border-gray-100 pt-2">
                  {r.answers.map((a: any) => (
                    <div key={a.id} className="text-sm">
                      <span className="font-medium text-gray-600">{a.question?.label}: </span>
                      {a.fileUrl ? (
                        <a href={a.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">फ़ाइल देखें</a>
                      ) : (
                        <span className="text-gray-800">{a.value || "—"}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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

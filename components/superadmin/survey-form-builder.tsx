"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Eye, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import type { SurveyQuestion, QuestionType } from "@/data-hooks/requests/survey"

const QUESTION_TYPES: { value: QuestionType; label: string; hasOptions: boolean }[] = [
  { value: "short_answer",    label: "लघु उत्तर",        hasOptions: false },
  { value: "long_answer",     label: "दीर्घ उत्तर",       hasOptions: false },
  { value: "multiple_choice", label: "बहुविकल्पीय",       hasOptions: true  },
  { value: "checkboxes",      label: "चेकबॉक्स",          hasOptions: true  },
  { value: "dropdown",        label: "ड्रॉपडाउन",         hasOptions: true  },
  { value: "number",          label: "संख्या",             hasOptions: false },
  { value: "date",            label: "दिनांक",             hasOptions: false },
  { value: "file_upload",     label: "फ़ाइल अपलोड",        hasOptions: false },
  { value: "phone",           label: "मोबाइल नंबर",        hasOptions: false },
  { value: "email",           label: "ईमेल आईडी",          hasOptions: false },
]

interface BuilderProps {
  initialTitle?: string
  initialDescription?: string
  initialEventName?: string
  initialQuestions?: SurveyQuestion[]
  onSave: (meta: { title: string; description: string; eventName: string }, questions: SurveyQuestion[]) => void
  onCancel: () => void
  saving?: boolean
}

export default function SurveyFormBuilder({
  initialTitle = "",
  initialDescription = "",
  initialEventName = "",
  initialQuestions = [],
  onSave,
  onCancel,
  saving = false,
}: BuilderProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [eventName, setEventName] = useState(initialEventName)
  const [questions, setQuestions] = useState<SurveyQuestion[]>(
    initialQuestions.length ? initialQuestions : []
  )
  const [preview, setPreview] = useState(false)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  const addQuestion = () => {
    const q: SurveyQuestion = { label: "", type: "short_answer", required: false, options: null }
    setQuestions([...questions, q])
    setExpandedIdx(questions.length)
  }

  const updateQuestion = (idx: number, patch: Partial<SurveyQuestion>) => {
    setQuestions(questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)))
  }

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx))
    setExpandedIdx(null)
  }

  const moveQuestion = (from: number, to: number) => {
    if (to < 0 || to >= questions.length) return
    const qs = [...questions]
    const [q] = qs.splice(from, 1)
    qs.splice(to, 0, q)
    setQuestions(qs)
    setExpandedIdx(to)
  }

  const addOption = (idx: number) => {
    const opts = questions[idx].options || []
    updateQuestion(idx, { options: [...opts, ""] })
  }

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const opts = [...(questions[qIdx].options || [])]
    opts[oIdx] = value
    updateQuestion(qIdx, { options: opts })
  }

  const removeOption = (qIdx: number, oIdx: number) => {
    const opts = (questions[qIdx].options || []).filter((_, i) => i !== oIdx)
    updateQuestion(qIdx, { options: opts })
  }

  const handleSave = () => {
    if (!title.trim()) return alert("फॉर्म का शीर्षक दर्ज करें")
    onSave({ title, description, eventName }, questions)
  }

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">पूर्वावलोकन</h3>
          <Button variant="outline" size="sm" onClick={() => setPreview(false)}>
            <X className="w-4 h-4 mr-1" /> संपादन पर वापस जाएं
          </Button>
        </div>
        <FormPreview title={title} description={description} eventName={eventName} questions={questions} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Meta */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
        <div>
          <Label className="text-sm font-semibold text-gray-700">फॉर्म शीर्षक *</Label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="जैसे: वार्षिक सर्वे 2026"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold text-gray-700">विवरण</Label>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="फॉर्म का संक्षिप्त विवरण"
            rows={2}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold text-gray-700">कार्यक्रम / इवेंट नाम (वैकल्पिक)</Label>
          <Input
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            placeholder="जैसे: वार्षिक अधिवेशन 2026"
            className="mt-1"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">प्रश्न ({questions.length})</span>
          <Button size="sm" variant="outline" onClick={() => setPreview(true)} className="text-orange-700 border-orange-300">
            <Eye className="w-4 h-4 mr-1" /> पूर्वावलोकन
          </Button>
        </div>

        {questions.map((q, idx) => {
          const typeMeta = QUESTION_TYPES.find(t => t.value === q.type)!
          const isOpen = expandedIdx === idx
          return (
            <div key={idx} className="border border-gray-200 rounded-xl bg-white shadow-sm">
              {/* Header row */}
              <div
                className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-xl"
                onClick={() => setExpandedIdx(isOpen ? null : idx)}
              >
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-500 w-5 flex-shrink-0">{idx + 1}.</span>
                <span className="flex-1 text-sm text-gray-800 truncate">{q.label || <span className="text-gray-400 italic">प्रश्न का लेबल</span>}</span>
                <Badge variant="outline" className="text-xs flex-shrink-0">{typeMeta.label}</Badge>
                {q.required && <Badge className="text-xs bg-red-100 text-red-700 border-red-200 flex-shrink-0">अनिवार्य</Badge>}
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); moveQuestion(idx, idx - 1) }} className="p-1 hover:bg-gray-100 rounded" title="ऊपर">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); moveQuestion(idx, idx + 1) }} className="p-1 hover:bg-gray-100 rounded" title="नीचे">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); removeQuestion(idx) }} className="p-1 hover:bg-red-50 rounded text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded editor */}
              {isOpen && (
                <div className="border-t border-gray-100 px-4 py-3 space-y-3">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">प्रश्न का लेबल *</Label>
                    <Input
                      value={q.label}
                      onChange={e => updateQuestion(idx, { label: e.target.value })}
                      placeholder="प्रश्न लिखें..."
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">प्रश्न का प्रकार</Label>
                    <select
                      value={q.type}
                      onChange={e => updateQuestion(idx, { type: e.target.value as QuestionType, options: null })}
                      className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    >
                      {QUESTION_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  {typeMeta.hasOptions && (
                    <div>
                      <Label className="text-xs font-semibold text-gray-600">विकल्प</Label>
                      <div className="mt-1 space-y-1.5">
                        {(q.options || []).map((opt, oi) => (
                          <div key={oi} className="flex gap-2">
                            <Input
                              value={opt}
                              onChange={e => updateOption(idx, oi, e.target.value)}
                              placeholder={`विकल्प ${oi + 1}`}
                              className="text-sm"
                            />
                            <Button size="icon" variant="ghost" onClick={() => removeOption(idx, oi)} className="text-red-500 h-9 w-9">
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                        <Button size="sm" variant="outline" onClick={() => addOption(idx)} className="text-xs mt-1">
                          <Plus className="w-3 h-3 mr-1" /> विकल्प जोड़ें
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <Switch
                      checked={q.required}
                      onCheckedChange={v => updateQuestion(idx, { required: v })}
                      id={`req-${idx}`}
                    />
                    <Label htmlFor={`req-${idx}`} className="text-sm cursor-pointer">अनिवार्य प्रश्न</Label>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        <Button variant="outline" onClick={addQuestion} className="w-full border-dashed border-orange-300 text-orange-700 hover:bg-orange-50">
          <Plus className="w-4 h-4 mr-2" /> प्रश्न जोड़ें
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "सहेजा जा रहा है..." : "सहेजें"}
        </Button>
        <Button variant="outline" onClick={onCancel}>रद्द करें</Button>
      </div>
    </div>
  )
}

// ── Inline preview ─────────────────────────────────────────────────────────────

function FormPreview({ title, description, eventName, questions }: {
  title: string; description: string; eventName: string; questions: SurveyQuestion[]
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {eventName && <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{eventName}</p>}
      <h2 className="text-xl font-bold text-gray-900">{title || "फॉर्म शीर्षक"}</h2>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <hr />
      {/* Standard fields */}
      {["नाम", "मोबाइल नंबर", "ईमेल (वैकल्पिक)", "गाँव", "जिला"].map(f => (
        <div key={f}>
          <Label className="text-sm font-medium text-gray-700">{f}</Label>
          <div className="mt-1 h-9 rounded-md border border-gray-200 bg-gray-50" />
        </div>
      ))}
      {questions.map((q, i) => {
        const typeMeta = QUESTION_TYPES.find(t => t.value === q.type)!
        return (
          <div key={i} className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              {q.label || "प्रश्न"} {q.required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            {(q.type === "short_answer" || q.type === "phone" || q.type === "email" || q.type === "number") && (
              <div className="h-9 rounded-md border border-gray-200 bg-gray-50" />
            )}
            {q.type === "long_answer" && (
              <div className="h-20 rounded-md border border-gray-200 bg-gray-50" />
            )}
            {q.type === "date" && (
              <div className="h-9 w-40 rounded-md border border-gray-200 bg-gray-50" />
            )}
            {q.type === "file_upload" && (
              <div className="h-10 rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                फ़ाइल चुनें
              </div>
            )}
            {(q.type === "multiple_choice" || q.type === "checkboxes") && (
              <div className="space-y-1">
                {(q.options || []).map((opt, oi) => (
                  <label key={oi} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type={q.type === "multiple_choice" ? "radio" : "checkbox"} disabled />
                    {opt || `विकल्प ${oi + 1}`}
                  </label>
                ))}
              </div>
            )}
            {q.type === "dropdown" && (
              <div className="h-9 rounded-md border border-gray-200 bg-gray-50 flex items-center px-3 text-xs text-gray-400">
                {(q.options?.[0]) || "विकल्प चुनें"} ▾
              </div>
            )}
          </div>
        )
      })}
      <Button disabled className="bg-orange-600 text-white w-full mt-2">सबमिट करें</Button>
    </div>
  )
}

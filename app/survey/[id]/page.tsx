"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Paperclip, X } from "lucide-react"
import Link from "next/link"
import publicRequest from "@/config/public-request"
import type { SurveyForm, SurveyQuestion } from "@/data-hooks/requests/survey"

function isVisible(q: SurveyQuestion, answers: Record<string, string | string[]>): boolean {
  if (!q.showIf) return true
  const { questionId, value } = q.showIf
  const ans = answers[questionId]
  if (!ans) return false
  return Array.isArray(ans) ? ans.includes(value) : ans === value
}

interface Village { id: string; name: string; district?: string }
interface Chokhla { id: string; name: string; district?: string }

// cuid is 25 chars starting with 'c'; extract from end of slug URL param
function extractId(slug: string): string {
  const parts = slug.split("-")
  // find last segment that looks like a cuid (starts with 'c', length ~25)
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].length >= 20 && /^[a-z0-9]+$/.test(parts[i])) {
      return parts.slice(i).join("-")
    }
  }
  return slug
}

export default function FillFormPage() {
  const { id: slugParam } = useParams<{ id: string }>()
  const id = extractId(slugParam)
  const router = useRouter()

  const [form, setForm] = useState<SurveyForm | null>(null)
  const [chokhlas, setChokhlas] = useState<Chokhla[]>([])
  const [villages, setVillages] = useState<Village[]>([])
  const [loadingVillages, setLoadingVillages] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Standard fields
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [selectedChokhla, setSelectedChokhla] = useState("")
  const [selectedVillage, setSelectedVillage] = useState("")
  const [district, setDistrict] = useState("")

  // Dynamic answers: questionId → value
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  // File uploads: questionId → { url, name, uploading }
  const [fileUploads, setFileUploads] = useState<Record<string, { url: string; name: string; uploading: boolean }>>({})

  const uploadFile = async (questionId: string, file: File) => {
    setFileUploads(prev => ({ ...prev, [questionId]: { url: "", name: file.name, uploading: true } }))
    try {
      const formData = new FormData()
      formData.append("file", file)
      const { data } = await publicRequest.post("/surveys/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setFileUploads(prev => ({ ...prev, [questionId]: { url: data.url, name: file.name, uploading: false } }))
    } catch (e: any) {
      setFileUploads(prev => { const n = { ...prev }; delete n[questionId]; return n })
      setSubmitError(e?.response?.data?.error || "फ़ाइल अपलोड विफल हुई")
    }
  }

  const removeFile = (questionId: string) => {
    setFileUploads(prev => { const n = { ...prev }; delete n[questionId]; return n })
  }

  useEffect(() => {
    Promise.all([
      publicRequest.get(`/surveys/public/${id}`),
      publicRequest.get("/chokhla/public/summary"),
    ])
      .then(([fRes, cRes]) => {
        setForm(fRes.data)
        setChokhlas(cRes.data)
      })
      .catch(e => setError(e?.response?.data?.error || "फॉर्म लोड नहीं हो सका"))
      .finally(() => setLoading(false))
  }, [id])

  const handleChokhlaChange = async (chokhlaId: string) => {
    setSelectedChokhla(chokhlaId)
    setSelectedVillage("")
    setVillages([])
    if (!chokhlaId) return
    setLoadingVillages(true)
    try {
      const { data } = await publicRequest.get(`/surveys/villages-by-chokhla/${chokhlaId}`)
      setVillages(data)
    } finally {
      setLoadingVillages(false)
    }
  }

  const setAnswer = (qId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [qId]: value }))
  }

  const toggleCheckbox = (qId: string, opt: string) => {
    const cur = (answers[qId] as string[]) || []
    const next = cur.includes(opt) ? cur.filter(v => v !== opt) : [...cur, opt]
    setAnswer(qId, next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    if (!name.trim()) return setSubmitError("नाम दर्ज करें")
    if (!/^\d{10}$/.test(mobile)) return setSubmitError("सही 10 अंकों का मोबाइल नंबर दर्ज करें")

    // Required question check (skip hidden questions)
    for (const q of form?.questions || []) {
      if (!isVisible(q, answers)) continue
      if (!q.required) continue
      if (q.type === "file_upload") {
        if (!fileUploads[q.id!]?.url) return setSubmitError(`"${q.label}" अनिवार्य है — फ़ाइल अपलोड करें`)
        continue
      }
      const val = answers[q.id!]
      const isEmpty = !val || (Array.isArray(val) ? !val.length : !String(val).trim())
      if (isEmpty) return setSubmitError(`"${q.label}" अनिवार्य है`)
    }

    // Check if any file is still uploading
    if (Object.values(fileUploads).some(f => f.uploading)) {
      return setSubmitError("फ़ाइल अभी अपलोड हो रही है, कृपया प्रतीक्षा करें")
    }

    setSubmitting(true)
    try {
      await publicRequest.post("/surveys/responses", {
        formId: id,
        respondentName: name.trim(),
        mobileNumber: mobile.trim(),
        email: email.trim() || undefined,
        villageId: selectedVillage || undefined,
        district: district.trim() || undefined,
        answers: (form?.questions || [])
          .filter(q => isVisible(q, answers))
          .map(q => ({
            questionId: q.id!,
            value: q.type === "file_upload"
              ? undefined
              : Array.isArray(answers[q.id!])
                ? (answers[q.id!] as string[]).join(", ")
                : (answers[q.id!] as string) || "",
            fileUrl: q.type === "file_upload" ? (fileUploads[q.id!]?.url || undefined) : undefined,
          })),
      })
      setSubmitted(true)
    } catch (e: any) {
      setSubmitError(e?.response?.data?.error || "सबमिट करने में त्रुटि हुई")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-red-600">{error}</p>
        <Link href="/survey" className="text-orange-600 underline text-sm">वापस जाएं</Link>
      </div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">फॉर्म सफलतापूर्वक सबमिट हुआ!</h2>
        <p className="text-gray-500 text-sm">आपकी जानकारी सुरक्षित रूप से दर्ज कर ली गई है।</p>
        <Link href="/survey" className="inline-block mt-2 px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
          वापस जाएं
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/survey" className="inline-flex items-center gap-1 text-orange-100 text-sm mb-3 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> वापस
          </Link>
          {form?.eventName && <p className="text-orange-200 text-xs font-semibold uppercase tracking-wide">{form.eventName}</p>}
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">{form?.title}</h1>
          {form?.description && <p className="text-orange-100 text-sm mt-1">{form.description}</p>}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Standard fields */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 text-sm">व्यक्तिगत जानकारी</h3>

            <FieldRow label="नाम *">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="पूरा नाम"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </FieldRow>

            <FieldRow label="मोबाइल नंबर *">
              <input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="10 अंक" maxLength={10}
                inputMode="numeric"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </FieldRow>

            <FieldRow label="ईमेल (वैकल्पिक)">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </FieldRow>

            <FieldRow label="चोखरा">
              <select value={selectedChokhla} onChange={e => handleChokhlaChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                <option value="">— चोखरा चुनें —</option>
                {chokhlas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FieldRow>

            <FieldRow label="गाँव">
              <select value={selectedVillage} onChange={e => setSelectedVillage(e.target.value)} disabled={!selectedChokhla || loadingVillages}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50">
                <option value="">{loadingVillages ? "लोड हो रहा है..." : "— गाँव चुनें —"}</option>
                {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </FieldRow>

            <FieldRow label="जिला">
              <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="जिले का नाम"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </FieldRow>
          </div>

          {/* Dynamic questions */}
          {(form?.questions || []).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 text-sm">प्रश्नावली</h3>
              {form!.questions!.map((q, i) => {
                if (!isVisible(q, answers)) return null
                return (
                  <DynamicField
                    key={q.id} question={q} index={i}
                    value={answers[q.id!]}
                    onChange={val => setAnswer(q.id!, val)}
                    onToggle={opt => toggleCheckbox(q.id!, opt)}
                    fileState={fileUploads[q.id!]}
                    onFileChange={file => uploadFile(q.id!, file)}
                    onFileRemove={() => removeFile(q.id!)}
                  />
                )
              })}
            </div>
          )}

          {submitError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {submitError}
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> सबमिट हो रहा है...</> : "सबमिट करें"}
          </button>
        </form>
      </div>
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

function DynamicField({ question: q, index, value, onChange, onToggle, fileState, onFileChange, onFileRemove }: {
  question: SurveyQuestion; index: number
  value: string | string[] | undefined
  onChange: (v: string) => void
  onToggle: (opt: string) => void
  fileState?: { url: string; name: string; uploading: boolean }
  onFileChange: (file: File) => void
  onFileRemove: () => void
}) {
  const baseInput = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
  const label = (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {index + 1}. {q.label} {q.required && <span className="text-red-500">*</span>}
    </label>
  )

  if (q.type === "short_answer" || q.type === "phone" || q.type === "email" || q.type === "number") {
    return <div>{label}<input type={q.type === "email" ? "email" : q.type === "number" ? "number" : "text"} value={(value as string) || ""} onChange={e => onChange(e.target.value)} className={baseInput} inputMode={q.type === "phone" || q.type === "number" ? "numeric" : undefined} /></div>
  }
  if (q.type === "long_answer") {
    return <div>{label}<textarea value={(value as string) || ""} onChange={e => onChange(e.target.value)} rows={3} className={baseInput} /></div>
  }
  if (q.type === "date") {
    return <div>{label}<input type="date" value={(value as string) || ""} onChange={e => onChange(e.target.value)} className={baseInput} /></div>
  }
  if (q.type === "multiple_choice") {
    return (
      <div>{label}
        <div className="space-y-2">
          {(q.options || []).map(opt => (
            <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="radio" name={q.id} checked={value === opt} onChange={() => onChange(opt)} className="accent-orange-500" />
              {opt}
            </label>
          ))}
        </div>
      </div>
    )
  }
  if (q.type === "checkboxes") {
    return (
      <div>{label}
        <div className="space-y-2">
          {(q.options || []).map(opt => (
            <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={((value as string[]) || []).includes(opt)} onChange={() => onToggle(opt)} className="accent-orange-500" />
              {opt}
            </label>
          ))}
        </div>
      </div>
    )
  }
  if (q.type === "dropdown") {
    return (
      <div>{label}
        <select value={(value as string) || ""} onChange={e => onChange(e.target.value)} className={baseInput}>
          <option value="">— चुनें —</option>
          {(q.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    )
  }
  if (q.type === "file_upload") {
    return (
      <div>{label}
        <FileUploadField fileState={fileState} onFileChange={onFileChange} onFileRemove={onFileRemove} />
      </div>
    )
  }
  return null
}

function FileUploadField({ fileState, onFileChange, onFileRemove }: {
  fileState?: { url: string; name: string; uploading: boolean }
  onFileChange: (file: File) => void
  onFileRemove: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  return fileState ? (
    <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm ${fileState.uploading ? "border-orange-300 bg-orange-50" : "border-green-300 bg-green-50"}`}>
      {fileState.uploading ? (
        <><Loader2 className="w-4 h-4 animate-spin text-orange-500 flex-shrink-0" /><span className="text-orange-700 flex-1 truncate">अपलोड हो रहा है... {fileState.name}</span></>
      ) : (
        <><Paperclip className="w-4 h-4 text-green-600 flex-shrink-0" /><span className="text-green-700 flex-1 truncate">{fileState.name}</span></>
      )}
      {!fileState.uploading && (
        <button type="button" onClick={onFileRemove} className="text-red-400 hover:text-red-600 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  ) : (
    <>
      <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFileChange(f); e.target.value = "" }} />
      <button type="button" onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 w-full border border-dashed border-gray-300 rounded-lg px-3 py-3 text-sm text-gray-500 hover:border-orange-400 hover:bg-orange-50 transition-colors">
        <Paperclip className="w-4 h-4" />
        <span>फ़ाइल चुनें (PDF, Image, Word, Excel — max 10MB)</span>
      </button>
    </>
  )
}

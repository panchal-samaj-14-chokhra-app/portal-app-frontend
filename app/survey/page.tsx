"use client"

import { useEffect, useState } from "react"
import { ClipboardList, Loader2, Calendar, AlertCircle, ArrowRight, Share2, Check } from "lucide-react"
import Link from "next/link"
import publicRequest from "@/config/public-request"
import type { SurveyForm } from "@/data-hooks/requests/survey"

// Generate a readable URL slug from a title
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[ऀ-ॿ]+/g, (m) => {
      // transliterate common Hindi words to rough latin for URL readability
      const map: Record<string, string> = {
        "पंचाल": "panchal", "पंचल": "panchal", "समाज": "samaj", "चौदह": "choudah",
        "चोखरा": "chokhra", "प्रतिभा": "pratibha", "सम्मान": "samman",
        "समारोह": "samaroh", "सर्वे": "survey", "पंजीकरण": "panjikaran",
        "वार्षिक": "varshik", "अधिवेशन": "adhiveshan",
      }
      return map[m] || m.replace(/[^\w]/g, "")
    })
    .replace(/[^\w-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    || "form"
}

function formSlugUrl(form: SurveyForm): string {
  const slug = toSlug(form.title)
  return `/survey/${slug}-${form.id}`
}

export default function SurveyListPage() {
  const [forms, setForms] = useState<SurveyForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    publicRequest.get("/surveys/public")
      .then(r => setForms(r.data))
      .catch(() => setError("फॉर्म लोड करने में त्रुटि हुई"))
      .finally(() => setLoading(false))
  }, [])

  const handleShare = (form: SurveyForm) => {
    const url = `${window.location.origin}${formSlugUrl(form)}`
    if (navigator.share) {
      navigator.share({ title: form.title, url })
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(form.id)
        setTimeout(() => setCopiedId(null), 2000)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-10 px-4 text-center">
        <div className="flex justify-center mb-3">
          <ClipboardList className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">पंजीकरण / सर्वे</h1>
        <p className="text-orange-100 mt-1 text-sm">समाज के कार्यक्रमों में भाग लें</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        ) : !forms.length ? (
          <div className="text-center py-16 text-gray-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>अभी कोई सक्रिय फॉर्म उपलब्ध नहीं है</p>
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map(form => (
              <div key={form.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all">
                <div className="flex-1 min-w-0 mb-4">
                  {form.eventName && (
                    <p className="text-xs font-semibold text-orange-600 mb-1 line-clamp-1">{form.eventName}</p>
                  )}
                  <h2 className="text-base font-bold text-gray-900">{form.title}</h2>
                  {form.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{form.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(form.createdAt).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={formSlugUrl(form)}
                    className="flex items-center justify-center gap-1.5 flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm py-2 rounded-xl transition-colors"
                  >
                    फॉर्म भरें <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleShare(form)}
                    title="शेयर करें"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 border border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors text-sm font-medium"
                  >
                    {copiedId === form.id
                      ? <><Check className="w-4 h-4 text-green-600" /><span className="text-green-600 text-xs">कॉपी!</span></>
                      : <><Share2 className="w-4 h-4" /><span className="text-xs">शेयर</span></>
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

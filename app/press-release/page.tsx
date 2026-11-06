"use client"

import { useState } from "react"
import Image from "next/image"
import { CalendarDays, FileText, Download, Share2, Loader2, ExternalLink } from "lucide-react"
import { useSamajPress } from "@/data-hooks/mutation-query/useSamajContent"
import PageHeader from "@/components/ui/PageHeader"

const MONTHS_HI = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"]

function formatDate(d: string) {
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return `${dt.getDate()} ${MONTHS_HI[dt.getMonth()]} ${dt.getFullYear()}`
}

function PressCard({ item, index }: { item: any; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: item.title, text: item.summary || item.title, url: window.location.href })
    else navigator.clipboard.writeText(window.location.href)
  }

  return (
    <article className="bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Top accent */}
      <div className="h-1" style={{ background: index === 0 ? "linear-gradient(90deg,#c2410c,#f97316)" : "linear-gradient(90deg,#fed7aa,#fdba74)" }} />

      <div className="p-5 sm:p-6">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {index === 0 && (
            <span className="text-[11px] font-bold bg-orange-600 text-white px-3 py-0.5 rounded-full">ताज़ा</span>
          )}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            <CalendarDays className="w-3.5 h-3.5" />
            {formatDate(item.publishedAt)}
          </div>
          {item.publishedBy && (
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{item.publishedBy}</span>
          )}
        </div>

        {/* Image */}
        {item.imageUrl && (
          <div className="relative mb-4 w-full rounded-xl overflow-hidden bg-gray-50">
            <Image src={item.imageUrl} alt={item.title} width={900} height={500}
              className="w-full h-auto" unoptimized />
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug mb-3">{item.title}</h3>

        {/* Summary / Content */}
        {(item.summary || item.content) && (
          <p className={`text-gray-500 text-sm leading-relaxed mb-4 ${expanded ? "" : "line-clamp-3"}`}>
            {item.summary || item.content}
          </p>
        )}
        {(item.summary || item.content) && (item.summary || item.content).length > 200 && (
          <button onClick={() => setExpanded(v => !v)}
            className="text-xs text-orange-600 font-semibold hover:text-orange-800 mb-4 transition-colors">
            {expanded ? "कम दिखाएं ↑" : "पूरा पढ़ें ↓"}
          </button>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-50">
          {item.pdfUrl && (
            <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg,#c2410c,#ea580c)" }}>
              <Download className="w-4 h-4" />PDF डाउनलोड
            </a>
          )}
          <button onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
            <Share2 className="w-4 h-4" />शेयर
          </button>
        </div>
      </div>
    </article>
  )
}

export default function PressReleasePage() {
  const { data: items, isLoading } = useSamajPress()

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#f0fdf4 100%)", fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      <PageHeader title="प्रेस विज्ञप्ति" subtitle="पंचाल समाज चौदह चौखरा की आधिकारिक सूचनाएं" icon={FileText} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-orange-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm text-gray-400">लोड हो रहा है...</p>
          </div>
        )}
        {!isLoading && (!items || items.length === 0) && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mx-auto mb-5">
              <FileText className="w-10 h-10 text-orange-200" />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">कोई विज्ञप्ति नहीं</h3>
            <p className="text-gray-400 text-sm">अभी कोई प्रेस विज्ञप्ति उपलब्ध नहीं है।</p>
          </div>
        )}
        {items && items.length > 0 && (
          <div className="space-y-5">
            {items.map((item, i) => <PressCard key={item.id} item={item} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

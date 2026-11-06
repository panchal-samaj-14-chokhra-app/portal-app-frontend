"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, FileText, Download, Share2, ArrowLeft, Loader2 } from "lucide-react"
import { useSamajPress } from "@/data-hooks/mutation-query/useSamajContent"

const MONTHS_HI = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"]

function formatDate(d: string) {
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return `${dt.getDate()} ${MONTHS_HI[dt.getMonth()]} ${dt.getFullYear()}`
}

function PressCard({ item, isFirst }: { item: any; isFirst: boolean }) {
  const shareItem = () => {
    if (navigator.share) {
      navigator.share({ title: item.title, text: item.summary || item.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }
  return (
    <li className="relative">
      {/* Diamond marker */}
      <span className="absolute -left-[2.1rem] top-6 h-4 w-4 rotate-45 bg-orange-600 border-2 border-white shadow" aria-hidden="true" />
      <article className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
          {isFirst && (
            <span className="rounded-full bg-orange-600 px-3 py-0.5 text-xs font-semibold text-white">ताज़ा</span>
          )}
          <p className="flex items-center gap-1.5 text-xs font-semibold text-orange-600">
            <CalendarDays className="w-3.5 h-3.5" />
            {formatDate(item.publishedAt)}
          </p>
          {item.publishedBy && (
            <span className="text-xs text-gray-400">– {item.publishedBy}</span>
          )}
        </div>
        {item.imageUrl && (
          <div className="relative mb-4 aspect-video w-full rounded-xl overflow-hidden bg-gray-100">
            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-800 leading-snug mb-2">{item.title}</h3>
        {item.summary && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">{item.summary}</p>
        )}
        {item.content && !item.summary && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">{item.content}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {item.pdfUrl && (
            <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700 transition-colors">
              <Download className="w-4 h-4" />
              विज्ञप्ति डाउनलोड करें
            </a>
          )}
          <button onClick={shareItem}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
            शेयर करें
          </button>
        </div>
      </article>
    </li>
  )
}

export default function PressReleasePage() {
  const { data: items, isLoading } = useSamajPress()
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">प्रेस विज्ञप्ति</h1>
            <p className="text-xs text-gray-400">पंचाल समाज चौदह चौखरा की आधिकारिक सूचनाएं</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="text-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin inline" />
          </div>
        )}

        {!isLoading && (!items || items.length === 0) && (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400">अभी कोई प्रेस विज्ञप्ति उपलब्ध नहीं है।</p>
          </div>
        )}

        {items && items.length > 0 && (
          <ol className="relative mx-auto max-w-3xl space-y-6 border-l-2 border-dashed border-orange-300 pl-7 sm:pl-9">
            {items.map((item, i) => (
              <PressCard key={item.id} item={item} isFirst={i === 0} />
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

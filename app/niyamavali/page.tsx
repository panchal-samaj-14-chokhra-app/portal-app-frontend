"use client"

import Link from "next/link"
import { BookOpen, Loader2, ChevronRight } from "lucide-react"
import { useNiyamavaliPublications } from "@/data-hooks/mutation-query/useNiyamavali"

export default function NiyamavaliPage() {
  const { data: pubs, isLoading } = useNiyamavaliPublications()

  return (
    <div className="min-h-screen bg-amber-50/40" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">नियमावली</h1>
          <p className="text-orange-100 text-sm">पंचाल समाज चौदह चौखरा — सामाजिक नियम एवं विधान</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="text-center py-16 text-orange-500"><Loader2 className="w-7 h-7 animate-spin inline" /></div>
        )}
        {!isLoading && !pubs?.length && (
          <div className="text-center py-16 text-gray-400">अभी कोई नियमावली प्रकाशित नहीं है।</div>
        )}
        <div className="grid gap-6">
          {pubs?.map(pub => (
            <div key={pub.id} className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                {pub.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pub.coverImage} alt={pub.title} className="w-full sm:w-40 h-40 object-cover shrink-0" />
                ) : (
                  <div className="w-full sm:w-40 h-40 bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-14 h-14 text-white/70" />
                  </div>
                )}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    {pub.year && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold mb-2 inline-block">{pub.year}</span>
                    )}
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{pub.title}</h2>
                    {pub.subtitle && <p className="text-orange-700 font-medium text-sm mb-2">{pub.subtitle}</p>}
                    {pub.introduction && (
                      <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed whitespace-pre-line">{pub.introduction}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <Link href={`/niyamavali/${pub.id}`}
                      className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
                      पढ़ें <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

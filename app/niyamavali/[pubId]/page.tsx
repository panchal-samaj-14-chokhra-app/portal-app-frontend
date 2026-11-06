"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { BookOpen, Loader2, ChevronRight, ArrowLeft } from "lucide-react"
import { useNiyamavaliPublication } from "@/data-hooks/mutation-query/useNiyamavali"

export default function PublicationPage() {
  const { pubId } = useParams<{ pubId: string }>()
  const { data: pub, isLoading } = useNiyamavaliPublication(pubId)

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50/40">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  )

  if (!pub) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50/40 gap-4">
      <p className="text-gray-400">नियमावली नहीं मिली।</p>
      <Link href="/niyamavali" className="text-orange-600 hover:underline text-sm">← वापस जाएं</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-amber-50/40" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href="/niyamavali" className="inline-flex items-center gap-1.5 text-orange-100 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />नियमावली सूची
          </Link>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {pub.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pub.coverImage} alt={pub.title} className="w-32 h-44 object-cover rounded-xl shadow-lg shrink-0" />
            ) : (
              <div className="w-32 h-44 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen className="w-12 h-12 text-white/70" />
              </div>
            )}
            <div className="flex-1">
              {pub.year && (
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold mb-3 inline-block">{pub.year}</span>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">{pub.title}</h1>
              {pub.subtitle && <p className="text-orange-100 text-base mb-3">{pub.subtitle}</p>}
              {pub.introduction && (
                <p className="text-orange-50/90 text-sm leading-relaxed whitespace-pre-line">{pub.introduction}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {pub.categories?.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="bg-orange-50 border-b border-orange-100 px-6 py-4">
              <h2 className="font-bold text-orange-800 text-lg">{cat.title}</h2>
              {cat.description && <p className="text-orange-600 text-sm mt-0.5">{cat.description}</p>}
            </div>
            {cat.articles && cat.articles.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                {cat.articles.map((art, ai) => (
                  <li key={art.id}>
                    <Link href={`/niyamavali/${pubId}/article/${art.id}`}
                      className="flex items-center gap-3 px-6 py-3.5 hover:bg-orange-50/60 transition-colors group">
                      <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-orange-200 transition-colors">
                        {art.articleNumber || (ai + 1)}
                      </span>
                      <span className="flex-1 text-gray-800 text-sm font-medium group-hover:text-orange-700 transition-colors">{art.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-6 py-5 text-gray-400 text-sm">इस भाग में अभी कोई लेख नहीं है।</p>
            )}
          </div>
        ))}
        {!pub.categories?.length && (
          <div className="text-center py-16 text-gray-400">इस नियमावली में अभी कोई भाग नहीं है।</div>
        )}
      </div>
    </div>
  )
}

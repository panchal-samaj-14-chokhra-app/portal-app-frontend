"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight, Printer, Share2, Loader2, BookOpen } from "lucide-react"
import { useNiyamavaliArticle } from "@/data-hooks/mutation-query/useNiyamavali"

export default function ArticlePage() {
  const { pubId, articleId } = useParams<{ pubId: string; articleId: string }>()
  const { data: article, isLoading } = useNiyamavaliArticle(articleId)

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50/40">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  )

  if (!article) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50/40 gap-4">
      <p className="text-gray-400">लेख नहीं मिला।</p>
      <Link href={`/niyamavali/${pubId}`} className="text-orange-600 hover:underline text-sm">← वापस जाएं</Link>
    </div>
  )

  const pub = article.category?.publication
  const allArticles = article.category?.articles || []
  const idx = allArticles.findIndex(a => a.id === articleId)
  const prevArt = idx > 0 ? allArticles[idx - 1] : null
  const nextArt = idx < allArticles.length - 1 ? allArticles[idx + 1] : null

  const handlePrint = () => window.print()
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, text: article.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
  }

  return (
    <div className="min-h-screen bg-amber-50/40 print:bg-white" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      {/* Top nav */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/niyamavali/${pubId}`} className="p-2 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <nav className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
              <Link href="/niyamavali" className="hover:text-orange-600 transition-colors">नियमावली</Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
              {pub && (
                <Link href={`/niyamavali/${pubId}`} className="hover:text-orange-600 transition-colors truncate max-w-[100px]">{pub.title}</Link>
              )}
              <ChevronRight className="w-3 h-3 shrink-0" />
              {article.category && <span className="text-gray-500 truncate max-w-[120px]">{article.category.title}</span>}
            </nav>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={handleShare} className="p-2 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-700 transition-colors" title="शेयर करें">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={handlePrint} className="p-2 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-700 transition-colors" title="प्रिंट करें">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Article body — book style */}
      <div className="max-w-3xl mx-auto px-4 py-8 print:py-4">
        <article className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden print:shadow-none print:border-none">
          {/* Article header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-8 text-white print:bg-orange-50 print:text-orange-900">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-white/20 rounded-xl print:bg-orange-100 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                {article.articleNumber && (
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold mb-2 inline-block print:bg-orange-100 print:text-orange-800">
                    अनुच्छेद {article.articleNumber}
                  </span>
                )}
                <h1 className="text-xl sm:text-2xl font-extrabold leading-tight">{article.title}</h1>
                {article.category && (
                  <p className="text-orange-100 text-sm mt-1 print:text-orange-700">{article.category.title}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content rendered as HTML */}
          <div className="px-6 sm:px-10 py-8">
            <div
              className="text-gray-800 leading-loose text-base [&_h3]:text-orange-800 [&_h3]:font-bold [&_h3]:text-lg [&_h3]:mt-5 [&_h3]:mb-2 [&_h2]:text-orange-900 [&_h2]:font-extrabold [&_h2]:text-xl [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-gray-700 [&_strong]:text-gray-900 [&_strong]:font-semibold"
              style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif", lineHeight: "1.9" }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {/* Prev / Next navigation */}
        <div className="flex items-stretch gap-3 mt-6 print:hidden">
          {prevArt ? (
            <Link href={`/niyamavali/${pubId}/article/${prevArt.id}`}
              className="flex-1 flex items-center gap-3 bg-white border border-orange-100 rounded-xl px-5 py-4 hover:bg-orange-50 hover:border-orange-300 transition-colors group">
              <ChevronLeft className="w-5 h-5 text-orange-400 shrink-0 group-hover:text-orange-600" />
              <div className="text-left min-w-0">
                <div className="text-xs text-gray-400 mb-0.5">पिछला</div>
                <div className="text-sm font-semibold text-gray-700 truncate group-hover:text-orange-700">{prevArt.title}</div>
              </div>
            </Link>
          ) : <div className="flex-1" />}

          {nextArt ? (
            <Link href={`/niyamavali/${pubId}/article/${nextArt.id}`}
              className="flex-1 flex items-center gap-3 bg-white border border-orange-100 rounded-xl px-5 py-4 hover:bg-orange-50 hover:border-orange-300 transition-colors group justify-end">
              <div className="text-right min-w-0">
                <div className="text-xs text-gray-400 mb-0.5">अगला</div>
                <div className="text-sm font-semibold text-gray-700 truncate group-hover:text-orange-700">{nextArt.title}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-orange-400 shrink-0 group-hover:text-orange-600" />
            </Link>
          ) : <div className="flex-1" />}
        </div>

        <div className="mt-5 text-center print:hidden">
          <Link href={`/niyamavali/${pubId}`} className="text-sm text-orange-600 hover:text-orange-800 hover:underline inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />विषय-सूची पर जाएं
          </Link>
        </div>
      </div>
    </div>
  )
}

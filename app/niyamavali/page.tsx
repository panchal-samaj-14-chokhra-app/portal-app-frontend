"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { BookOpen, Menu, X, Share2, Printer, ChevronRight, Loader2, ScrollText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useNiyamavaliArticles, useNiyamavaliArticle } from "@/data-hooks/mutation-query/useNiyamavali"

// ── Decorative divider ────────────────────────────────────────────────────────
function OrnamentDivider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-orange-400" />
      <span className="text-orange-400 text-xs select-none">✦</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-orange-300 to-orange-400" />
    </div>
  )
}

// ── Section renderer ──────────────────────────────────────────────────────────
function SectionCard({ title, content, index }: { title: string; content: string; index: number }) {
  return (
    <div className="mb-6 rounded-xl border border-orange-100 bg-white shadow-sm overflow-hidden">
      {/* Section header with traditional left border */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
        <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
          {index + 1}
        </span>
        <h3 className="font-bold text-orange-900 text-base leading-snug">{title}</h3>
      </div>
      {/* Content */}
      <div
        className="px-5 py-5 text-gray-700 leading-loose text-[15px]
          [&_h2]:text-orange-900 [&_h2]:font-extrabold [&_h2]:text-xl [&_h2]:mt-5 [&_h2]:mb-2
          [&_h3]:text-orange-800 [&_h3]:font-bold [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-2
          [&_p]:mb-3 [&_p]:leading-loose
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-3
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-3
          [&_li]:leading-relaxed [&_li]:text-gray-700
          [&_strong]:text-orange-900 [&_strong]:font-semibold
          [&_em]:text-gray-600 [&_em]:italic
          [&_hr]:border-orange-100 [&_hr]:my-4"
        style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

// ── Article reader pane ───────────────────────────────────────────────────────
function ArticleReader({ articleId }: { articleId: string }) {
  const { data: article, isLoading } = useNiyamavaliArticle(articleId)

  if (isLoading) return (
    <div className="flex items-center justify-center py-24 text-orange-400">
      <Loader2 className="w-7 h-7 animate-spin mr-2" />लोड हो रहा है...
    </div>
  )
  if (!article) return (
    <div className="text-center py-24 text-gray-400">लेख नहीं मिला।</div>
  )

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) navigator.share({ title: article.title, url })
    else navigator.clipboard.writeText(url).catch(() => {})
  }

  return (
    <div>
      {/* Article header */}
      <div className="mb-6 rounded-2xl overflow-hidden shadow-sm"
        style={{ background: "linear-gradient(135deg, #c2410c 0%, #ea580c 60%, #f97316 100%)" }}>
        <div className="px-6 pt-6 pb-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 bg-white/20 rounded-lg shrink-0">
                <ScrollText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                {article.articleNumber && (
                  <span className="inline-block text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold mb-2">
                    अनुच्छेद {article.articleNumber}
                  </span>
                )}
                <h1 className="text-xl sm:text-2xl font-extrabold leading-snug">{article.title}</h1>
                {article.description && (
                  <p className="text-orange-100 text-sm mt-1.5 leading-relaxed">{article.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={handleShare}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/25 transition-colors print:hidden"
                title="शेयर करें">
                <Share2 className="w-4 h-4" />
              </button>
              <button onClick={() => window.print()}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/25 transition-colors print:hidden"
                title="प्रिंट">
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        {/* Decorative bottom wave */}
        <div className="h-3" style={{
          background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 20'%3E%3Cpath d='M0,10 C300,20 900,0 1200,10 L1200,20 L0,20 Z' fill='%23fffbf7'/%3E%3C/svg%3E\") center/cover no-repeat",
        }} />
      </div>

      {/* Sections */}
      {article.sections?.length ? (
        article.sections.map((sec, i) => (
          <SectionCard key={sec.id} title={sec.title} content={sec.content} index={i} />
        ))
      ) : (
        <div className="text-center py-16 text-gray-400 text-sm">इस लेख में अभी कोई अनुभाग नहीं है।</div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
function NiyamavaliInner() {
  const sp = useSearchParams()
  const router = useRouter()
  const { data: articles, isLoading } = useNiyamavaliArticles()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeId = sp.get("a") || ""
  const overlayRef = useRef<HTMLDivElement>(null)

  // Auto-select first article on load
  useEffect(() => {
    if (!activeId && articles?.length) {
      router.replace(`/niyamavali?a=${articles[0].id}`, { scroll: false })
    }
  }, [articles, activeId, router])

  // Close sidebar on overlay click
  const closeSidebar = () => setSidebarOpen(false)

  const selectArticle = (id: string) => {
    router.push(`/niyamavali?a=${id}`, { scroll: false })
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#fffbf5]" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>

      {/* ── Top header ── */}
      <header className="sticky top-0 z-30 print:hidden"
        style={{ background: "linear-gradient(90deg, #9a3412 0%, #c2410c 50%, #ea580c 100%)", boxShadow: "0 2px 8px rgba(154,52,18,0.25)" }}>
        {/* Decorative top strip */}
        <div className="h-1" style={{ background: "repeating-linear-gradient(90deg,#fbbf24 0,#fbbf24 8px,#c2410c 8px,#c2410c 16px)" }} />
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-1.5 bg-white/15 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-extrabold text-base sm:text-lg leading-tight">समाज नियमावली</h1>
              <p className="text-orange-200 text-xs hidden sm:block">पंचाल समाज चौदह चौखरा — सामाजिक संविधान</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex min-h-[calc(100vh-56px)]">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 print:hidden">
          <div className="sticky top-14 h-[calc(100vh-56px)] overflow-y-auto"
            style={{ background: "linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)", borderRight: "1px solid #fed7aa" }}>
            {/* Sidebar header */}
            <div className="px-4 pt-5 pb-3">
              <p className="text-xs font-bold text-orange-500 tracking-widest uppercase">अनुच्छेद सूची</p>
              <OrnamentDivider />
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>
            ) : (
              <nav className="pb-6 px-3 space-y-1">
                {articles?.map(art => (
                  <button key={art.id} onClick={() => selectArticle(art.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all group
                      ${activeId === art.id
                        ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                        : "text-orange-900 hover:bg-orange-100"}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                      ${activeId === art.id ? "bg-white/25 text-white" : "bg-orange-100 text-orange-600"}`}>
                      {art.articleNumber || "•"}
                    </span>
                    <span className="text-sm font-medium leading-snug flex-1">{art.title}</span>
                    {activeId === art.id && <ChevronRight className="w-3.5 h-3.5 opacity-70 shrink-0" />}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </aside>

        {/* ── Mobile sidebar overlay ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden print:hidden" onClick={closeSidebar} ref={overlayRef}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-72 max-w-[85vw] flex flex-col h-full overflow-y-auto"
              style={{ background: "linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)" }}
              onClick={e => e.stopPropagation()}>
              {/* Mobile sidebar header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-orange-200">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span className="font-bold text-orange-900">अनुच्छेद सूची</span>
                </div>
                <button onClick={closeSidebar} className="p-2 rounded-lg hover:bg-orange-100 text-orange-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <OrnamentDivider />
              <nav className="flex-1 pb-6 px-3 space-y-1">
                {isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-orange-400" /></div>
                ) : articles?.map(art => (
                  <button key={art.id} onClick={() => selectArticle(art.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-3 rounded-xl transition-all
                      ${activeId === art.id
                        ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                        : "text-orange-900 hover:bg-orange-100"}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                      ${activeId === art.id ? "bg-white/25 text-white" : "bg-orange-100 text-orange-600"}`}>
                      {art.articleNumber || "•"}
                    </span>
                    <span className="text-sm font-medium leading-snug">{art.title}</span>
                    {activeId === art.id && <ChevronRight className="w-3.5 h-3.5 opacity-70 shrink-0 ml-auto" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
          {!activeId ? (
            /* Welcome / landing */
            <div className="text-center py-16">
              <div className="inline-flex p-4 rounded-2xl mb-5"
                style={{ background: "linear-gradient(135deg, #fff7ed, #ffedd5)" }}>
                <BookOpen className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-orange-900 mb-2">पंचाल समाज नियमावली</h2>
              <p className="text-gray-500 text-sm mb-6">बाईं ओर से कोई भी अनुच्छेद चुनें</p>
              <OrnamentDivider />
              <div className="mt-6 grid gap-3 max-w-sm mx-auto">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-orange-400 mx-auto" /> :
                  articles?.map(art => (
                    <button key={art.id} onClick={() => selectArticle(art.id)}
                      className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl border border-orange-200 bg-white hover:bg-orange-50 hover:border-orange-400 transition-all text-left shadow-sm">
                      <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-bold shrink-0">
                        {art.articleNumber || "•"}
                      </span>
                      <span className="text-orange-900 font-medium text-sm">{art.title}</span>
                      <ChevronRight className="w-4 h-4 text-orange-300 ml-auto" />
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <ArticleReader articleId={activeId} />
          )}
        </main>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          header, aside, .print\\:hidden { display: none !important; }
          main { padding: 0 !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  )
}

export default function NiyamavaliPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fffbf5]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    }>
      <NiyamavaliInner />
    </Suspense>
  )
}

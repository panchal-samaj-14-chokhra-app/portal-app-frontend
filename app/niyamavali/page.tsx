"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { BookOpen, Menu, X, Share2, Download, ChevronRight, Loader2, ScrollText, ArrowLeft, List, AlertCircle, CheckCircle2, UserX, User, Printer } from "lucide-react"
import Link from "next/link"
import { useNiyamavaliArticles, useNiyamavaliArticle } from "@/data-hooks/mutation-query/useNiyamavali"
import { NIYAMAVALI_GROUPS } from "@/data-hooks/requests/niyamavali"


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
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/30 transition-colors text-white text-xs font-medium"
                title="शेयर करें">
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">शेयर</span>
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

// ── Grievance modal ───────────────────────────────────────────────────────────
const INPUT_CLS = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
const LABEL_CLS = "block text-sm font-bold text-gray-700 mb-1"

function GrievanceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [anonymous, setAnonymous] = useState(true)

  // Against-person fields
  const [againstName,    setAgainstName]    = useState("")
  const [againstVillage, setAgainstVillage] = useState("")
  const [againstChokhla, setAgainstChokhla] = useState("")

  // Complainant fields (named only)
  const [myName,  setMyName]  = useState("")
  const [myVillage, setMyVillage] = useState("")
  const [phone,   setPhone]   = useState("")
  const [email,   setEmail]   = useState("")

  // Complaint
  const [message, setMessage] = useState("")
  const [photos,  setPhotos]  = useState<File[]>([])

  const [busy,  setBusy]  = useState(false)
  const [refNo, setRefNo] = useState<string | null>(null)
  const [error, setError] = useState("")

  const reset = () => {
    setAnonymous(true); setAgainstName(""); setAgainstVillage(""); setAgainstChokhla("")
    setMyName(""); setMyVillage(""); setPhone(""); setEmail("")
    setMessage(""); setPhotos([]); setBusy(false); setRefNo(null); setError("")
  }
  const handleClose = () => { reset(); onClose() }

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3)
    setPhotos(files)
    e.target.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!againstName.trim()) { setError("जिसके खिलाफ शिकायत है उनका नाम लिखें"); return }
    if (!anonymous) {
      if (!myName.trim())  { setError("आपका नाम लिखें"); return }
      if (!phone.trim() || phone.replace(/\D/g, "").length !== 10) {
        setError("सही 10 अंकों का मोबाइल नंबर लिखें"); return
      }
    }
    if (message.trim().length < 10) { setError("शिकायत का विवरण कम से कम 10 अक्षरों में लिखें"); return }

    try {
      setBusy(true)
      const form = new FormData()
      form.append("source",         "samaj_niyamavali")
      form.append("name",           anonymous ? "" : myName.trim())
      form.append("againstName",    againstName.trim())
      form.append("againstVillage", againstVillage.trim())
      form.append("againstChokhla", againstChokhla.trim())
      form.append("message",        message.trim())
      if (!anonymous) {
        form.append("phone", phone.replace(/\D/g, ""))
        if (email.trim())     form.append("email", email.trim())
        if (myVillage.trim()) form.append("place", myVillage.trim())
      }
      photos.forEach(f => form.append("images", f))

      const { data } = await (await import("@/config/request")).default.post(
        "/submissions/grievance", form, { headers: { "Content-Type": "multipart/form-data" } }
      )
      setRefNo(data?.data?.ref ?? "—")
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "कुछ गड़बड़ हुई, दोबारा कोशिश करें")
    } finally {
      setBusy(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl flex flex-col max-h-[95dvh]">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between shrink-0"
          style={{ background: "linear-gradient(90deg,#9a3412,#c2410c)" }}>
          <div>
            <h2 className="text-white font-extrabold text-base">शिकायत दर्ज करें</h2>
            <p className="text-orange-200 text-xs mt-0.5">पंचाल समाज चौदह चौखरा</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success */}
        {refNo ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-1">शिकायत दर्ज हो गई!</h3>
              <p className="text-gray-500 text-sm mb-4">आपकी शिकायत समाज कार्यकारिणी को भेज दी गई है।</p>
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 inline-block">
                <p className="text-xs text-orange-500 font-semibold mb-0.5">शिकायत संख्या</p>
                <p className="text-orange-800 font-extrabold text-2xl tracking-widest">{refNo}</p>
                <p className="text-xs text-gray-400 mt-1">इसे नोट कर लें</p>
              </div>
            </div>
            <button onClick={handleClose}
              className="px-8 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-colors">
              बंद करें
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto">
            <div className="px-5 pt-5 pb-6 space-y-5">

              {/* ── Anonymous toggle ── */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer select-none transition-all"
                style={{ borderColor: anonymous ? "#c2410c" : "#e5e7eb", background: anonymous ? "#fff7ed" : "#f9fafb" }}
                onClick={() => setAnonymous(v => !v)}>
                <div className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${anonymous ? "bg-orange-600" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${anonymous ? "left-5" : "left-0.5"}`} />
                </div>
                <div className="flex items-center gap-2">
                  {anonymous ? <UserX className="w-4 h-4 text-orange-600 shrink-0" /> : <User className="w-4 h-4 text-gray-400 shrink-0" />}
                  <div>
                    <p className={`text-sm font-bold ${anonymous ? "text-orange-800" : "text-gray-700"}`}>
                      {anonymous ? "बिना नाम के शिकायत दर्ज करें" : "नाम के साथ शिकायत दर्ज करें"}
                    </p>
                    <p className="text-xs text-gray-400">{anonymous ? "आपकी पहचान गुप्त रहेगी" : "आपकी जानकारी दर्ज होगी"}</p>
                  </div>
                </div>
              </div>

              {/* ── Against person section ── */}
              <div className="rounded-xl border border-red-100 bg-red-50/40 p-4 space-y-3">
                <p className="text-xs font-bold text-red-700 uppercase tracking-wide">जिसके खिलाफ शिकायत है</p>
                <div>
                  <label className={LABEL_CLS}>नाम <span className="text-red-500">*</span></label>
                  <input value={againstName} onChange={e => setAgainstName(e.target.value)}
                    placeholder="व्यक्ति का पूरा नाम" className={INPUT_CLS} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL_CLS}>गांव</label>
                    <input value={againstVillage} onChange={e => setAgainstVillage(e.target.value)}
                      placeholder="गांव का नाम" className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>चोखला</label>
                    <input value={againstChokhla} onChange={e => setAgainstChokhla(e.target.value)}
                      placeholder="चोखला का नाम" className={INPUT_CLS} />
                  </div>
                </div>
              </div>

              {/* ── Complainant info (named only) ── */}
              {!anonymous && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">आपकी जानकारी</p>
                  <div>
                    <label className={LABEL_CLS}>आपका नाम <span className="text-red-500">*</span></label>
                    <input value={myName} onChange={e => setMyName(e.target.value)}
                      placeholder="आपका पूरा नाम" className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>आपका गांव</label>
                    <input value={myVillage} onChange={e => setMyVillage(e.target.value)}
                      placeholder="आपका गांव" className={INPUT_CLS} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL_CLS}>मोबाइल नंबर <span className="text-red-500">*</span></label>
                      <input value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="10 अंक" inputMode="numeric" maxLength={10} className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>ईमेल <span className="text-gray-400 font-normal">(वैकल्पिक)</span></label>
                      <input value={email} onChange={e => setEmail(e.target.value)}
                        type="email" placeholder="email@example.com" className={INPUT_CLS} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Complaint details ── */}
              <div>
                <label className={LABEL_CLS}>शिकायत का विवरण <span className="text-red-500">*</span></label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                  placeholder="अपनी शिकायत विस्तार से लिखें..."
                  className={`${INPUT_CLS} resize-none`} />
                <p className="text-xs text-gray-400 text-right mt-1">{message.length} / 3000</p>
              </div>

              {/* ── Photo upload ── */}
              <div>
                <label className={LABEL_CLS}>फ़ोटो जोड़ें <span className="text-gray-400 font-normal">(अधिकतम 3, JPG/PNG, 2MB प्रत्येक)</span></label>
                <label className="flex items-center gap-3 w-full border-2 border-dashed border-orange-200 rounded-xl px-4 py-3 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
                  <span className="text-2xl">📷</span>
                  <div className="flex-1 min-w-0">
                    {photos.length === 0
                      ? <span className="text-sm text-gray-400">फ़ोटो चुनें...</span>
                      : <span className="text-sm text-orange-700 font-semibold">{photos.map(f => f.name).join(", ")}</span>
                    }
                  </div>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button type="submit" disabled={busy}
                className="w-full py-3 rounded-xl text-white font-extrabold text-sm transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#9a3412,#c2410c)" }}>
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy ? "भेज रहे हैं..." : "शिकायत दर्ज करें"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
function NiyamavaliInner() {
  const sp = useSearchParams()
  const router = useRouter()
  const { data: articles, isLoading } = useNiyamavaliArticles()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [grievanceOpen, setGrievanceOpen] = useState(false)

  const handlePrint = () => window.print()
  const aParam = sp.get("a") || ""
  const overlayRef = useRef<HTMLDivElement>(null)

  // Resolve active article: wait for articles to load before resolving
  // so we never send a raw order-number like "2" to the backend as an ID
  const activeId = (() => {
    if (isLoading || !articles) return ""
    if (!articles.length) return aParam
    const byOrder = articles.find(a => String(a.order + 1) === aParam)
    if (byOrder) return byOrder.id
    return aParam // fallback to raw cuid (legacy links)
  })()

  // Auto-select first article on load
  useEffect(() => {
    if (!aParam && articles?.length) {
      router.replace(`/niyamavali?a=1`, { scroll: false })
    }
  }, [articles, aParam, router])

  // Close sidebar on overlay click
  const closeSidebar = () => setSidebarOpen(false)

  const selectArticle = (id: string) => {
    const article = articles?.find(a => a.id === id)
    const param = article ? String(article.order + 1) : id
    router.push(`/niyamavali?a=${param}`, { scroll: false })
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#fffbf5]" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>

      {/* ── Top header ── */}
      <header className="sticky top-0 z-30 print:hidden"
        style={{ background: "linear-gradient(90deg, #9a3412 0%, #c2410c 50%, #ea580c 100%)", boxShadow: "0 2px 8px rgba(154,52,18,0.25)" }}>
        {/* Decorative top strip */}
        <div className="h-1" style={{ background: "repeating-linear-gradient(90deg,#fbbf24 0,#fbbf24 8px,#c2410c 8px,#c2410c 16px)" }} />
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3">
          {/* Back button — hidden on mobile (shown as fixed bottom button) */}
          <Link href="/" className="hidden sm:flex p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white shrink-0"
            onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="min-w-0">
              <h1 className="text-white font-extrabold text-sm sm:text-base lg:text-lg leading-tight truncate">समाज नियमावली</h1>
              <p className="text-orange-200 text-xs hidden md:block">पंचाल समाज चौदह चौखरा — सामाजिक संविधान</p>
            </div>
          </div>
          {/* Print / Download PDF button */}
          <button onClick={handlePrint}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-white font-bold text-xs sm:text-sm">
            <Download className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">PDF डाउनलोड</span>
          </button>
          {/* Grievance button */}
          <button onClick={() => setGrievanceOpen(true)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-orange-700 hover:bg-orange-50 transition-colors shadow-sm font-bold text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline sm:inline">शिकायत दर्ज करें</span>
            <span className="xs:hidden sm:hidden">शिकायत</span>
          </button>
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
                {NIYAMAVALI_GROUPS.map(grp => {
                  const grpArticles = (articles ?? []).filter(a => (a.group || "shubh") === grp.value)
                  if (!grpArticles.length) return null
                  return (
                    <div key={grp.value}>
                      <div className={`px-2 py-1 mt-3 mb-1 text-xs font-bold uppercase tracking-wider rounded ${grp.bg} ${grp.color}`}>
                        {grp.label}
                      </div>
                      {grpArticles.map(art => (
                        <button key={art.id} onClick={() => selectArticle(art.id)}
                          className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all group
                            ${activeId === art.id
                              ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                              : "text-orange-900 hover:bg-orange-100"}`}>
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                            ${activeId === art.id ? "bg-white/25 text-white" : `${grp.bg} ${grp.color}`}`}>
                            {art.articleNumber || "•"}
                          </span>
                          <span className="text-sm font-medium leading-snug flex-1">{art.title}</span>
                          {activeId === art.id && <ChevronRight className="w-3.5 h-3.5 opacity-70 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )
                })}
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
                ) : NIYAMAVALI_GROUPS.map(grp => {
                  const grpArticles = (articles ?? []).filter(a => (a.group || "shubh") === grp.value)
                  if (!grpArticles.length) return null
                  return (
                    <div key={grp.value}>
                      <div className={`px-2 py-1 mt-3 mb-1 text-xs font-bold uppercase tracking-wider rounded ${grp.bg} ${grp.color}`}>
                        {grp.label}
                      </div>
                      {grpArticles.map(art => (
                        <button key={art.id} onClick={() => selectArticle(art.id)}
                          className={`w-full text-left flex items-center gap-2.5 px-3 py-3 rounded-xl transition-all
                            ${activeId === art.id
                              ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                              : "text-orange-900 hover:bg-orange-100"}`}>
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                            ${activeId === art.id ? "bg-white/25 text-white" : `${grp.bg} ${grp.color}`}`}>
                            {art.articleNumber || "•"}
                          </span>
                          <span className="text-sm font-medium leading-snug">{art.title}</span>
                          {activeId === art.id && <ChevronRight className="w-3.5 h-3.5 opacity-70 shrink-0 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  )
                })}
              </nav>
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
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
              <div className="mt-6 max-w-sm mx-auto space-y-4">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-orange-400 mx-auto" /> :
                  NIYAMAVALI_GROUPS.map(grp => {
                    const grpArticles = (articles ?? []).filter(a => (a.group || "shubh") === grp.value)
                    if (!grpArticles.length) return null
                    return (
                      <div key={grp.value}>
                        <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg mb-2 ${grp.bg} ${grp.color}`}>
                          {grp.label}
                        </div>
                        <div className="grid gap-2">
                          {grpArticles.map(art => (
                            <button key={art.id} onClick={() => selectArticle(art.id)}
                              className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-xl border bg-white hover:bg-orange-50 transition-all text-left shadow-sm ${grp.border}`}>
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${grp.bg} ${grp.color}`}>
                                {art.articleNumber || "•"}
                              </span>
                              <span className="text-orange-900 font-medium text-sm">{art.title}</span>
                              <ChevronRight className="w-4 h-4 text-orange-300 ml-auto" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          ) : (
            <ArticleReader articleId={activeId} />
          )}
        </main>
      </div>

      {/* ── Mobile floating bottom bar ── */}
      <div className="fixed bottom-5 left-0 right-0 flex items-center justify-between px-5 lg:hidden print:hidden z-40 pointer-events-none">
        {/* Back button */}
        <Link href="/"
          className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #9a3412, #c2410c)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        {/* Open article list */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-white font-bold text-sm transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #9a3412, #c2410c)" }}>
          <List className="w-4 h-4" />
          अनुच्छेद सूची
        </button>
      </div>

      {/* Grievance modal */}
      <GrievanceModal open={grievanceOpen} onClose={() => setGrievanceOpen(false)} />

      <style>{`
        @media (max-width: 400px) {
          .xs\\:inline { display: inline !important; }
        }

        @media print {
          @page {
            size: A4;
            margin: 18mm 20mm;
          }

          /* hide everything except the article content */
          header, aside, footer,
          .print\\:hidden,
          [class*="print:hidden"] { display: none !important; }

          body {
            background: #fff !important;
            font-family: 'Noto Sans Devanagari', 'Hind', sans-serif !important;
            font-size: 11pt !important;
            color: #111 !important;
            line-height: 1.9 !important;
          }

          /* make main full-width */
          main {
            padding: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }

          /* article header banner */
          [style*="linear-gradient"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* section cards */
          .rounded-xl { border: 1px solid #ddd !important; break-inside: avoid; }

          /* images */
          img { max-width: 100% !important; height: auto !important; border-radius: 4px !important; }

          /* page break before each section card if near page end */
          .mb-6 { break-inside: avoid; }

          h1, h2, h3 { break-after: avoid; }

          /* print cover line at top */
          main::before {
            content: "पंचाल समाज नियमावली — चौदह चौखरा";
            display: block;
            font-size: 9pt;
            color: #888;
            border-bottom: 1px solid #ddd;
            padding-bottom: 4pt;
            margin-bottom: 12pt;
          }
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

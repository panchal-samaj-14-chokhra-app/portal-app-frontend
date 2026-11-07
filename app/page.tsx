"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Menu, X, ChevronRight, Heart, Newspaper,
  BookOpen, FileText, Stethoscope,
  Handshake, Vote, Award,
  Phone, Mail, Facebook, Twitter, Youtube, Instagram,
  Home, GraduationCap, Database, UserCircle,
  Briefcase, Gift, Download,
  ChevronDown, Share2, MessageCircle,
  ChevronLeft, ChevronRight as ChevRight,
  Calendar, Loader2, MapPin, Send,
} from "lucide-react"
import {
  useSamajNews, useSamajPress, useLikeSamajNews,
} from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajNews } from "@/data-hooks/requests/samaj-content"
import { useFeatureFlags } from "@/data-hooks/mutation-query/useFeatureFlags"
import { usePortalConfigValue } from "@/data-hooks/mutation-query/usePortalConfig"
import { useAllChokhlas } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { useHeroFeed, useLikeHeroFeed, useHeroFeedComments, useAddHeroFeedComment } from "@/data-hooks/mutation-query/useHeroFeed"
import type { HeroFeed } from "@/data-hooks/requests/hero-feed"
import { FEED_TYPES } from "@/data-hooks/requests/hero-feed"

// ─── NAV ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "होम",           href: "/",              icon: Home,      flagKey: null },
  { label: "समाचार",        href: "/news",          icon: Newspaper, flagKey: "news_feed" },
  { label: "प्रेस विज्ञप्ति", href: "/press-release", icon: FileText,  flagKey: "press_release" },
  { label: "कार्यक्रम",    href: "/events",        icon: Calendar,  flagKey: "events" },
  { label: "नियमावली",     href: "/niyamavali",    icon: BookOpen,  flagKey: "niyamavali" },
]

// ─── SERVICES ───────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: GraduationCap, color: "bg-green-100 text-green-700",    title: "शिक्षा पोर्टल",          href: "#education" },
  { icon: Database,      color: "bg-orange-100 text-orange-700",  title: "डिजिटल जनगणना",         href: "/community-hub" },
  { icon: Handshake,     color: "bg-red-100 text-red-700",        title: "वैवाहिक परिचय",         href: "/admin/matrimonial" },
  { icon: Briefcase,     color: "bg-yellow-100 text-yellow-700",  title: "व्यवसाय निर्देशिका",     href: "#business" },
  { icon: Stethoscope,   color: "bg-cyan-100 text-cyan-700",      title: "स्वास्थ्य एवं चिकित्सा", href: "#health" },
  { icon: Vote,          color: "bg-violet-100 text-violet-700",  title: "समाज की योजनाएं",        href: "#schemes" },
  { icon: Award,         color: "bg-amber-100 text-amber-700",    title: "उपलब्धियां",             href: "#highlights" },
  { icon: FileText,      color: "bg-teal-100 text-teal-700",      title: "प्रेस विज्ञप्ति",        href: "/press-release" },
  { icon: Gift,          color: "bg-pink-100 text-pink-700",      title: "बधाई एवं शुभकामनाएं",   href: "#greetings" },
  { icon: Heart,         color: "bg-slate-100 text-slate-700",    title: "शोक समाचार",            href: "#condolence" },
  { icon: Newspaper,     color: "bg-blue-100 text-blue-700",      title: "समाज समाचार",           href: "#feed" },
  { icon: Calendar,      color: "bg-indigo-100 text-indigo-700",  title: "कार्यक्रम",             href: "/events" },
]

// ═══════════════════════════════════════════════════════════════════════════
// HERO FEED CARD + SLIDER
// ═══════════════════════════════════════════════════════════════════════════

function HeroFeedSlider() {
  const [current, setCurrent] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [commentName, setCommentName] = useState("")
  const [commentText, setCommentText] = useState("")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { data: feeds = [], isLoading } = useHeroFeed("10")
  const total = feeds.length
  const go = (idx: number) => { setCurrent((idx + total) % total); setShowComments(false) }

  const pause = () => { if (timerRef.current) clearInterval(timerRef.current) }
  const resume = () => { timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 5000) }

  useEffect(() => {
    if (total === 0) return
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [total])

  const feed = feeds[current] as HeroFeed | undefined
  const feedType = feed ? FEED_TYPES.find(t => t.value === feed.type) : null
  const like = useLikeHeroFeed(feed?.id ?? "")
  const { data: comments = [] } = useHeroFeedComments(showComments ? (feed?.id ?? "") : "")
  const addComment = useAddHeroFeedComment(feed?.id ?? "")

  const [liked, setLiked] = useState(false)
  const [localLikes, setLocalLikes] = useState(0)

  useEffect(() => {
    if (!feed) return
    setLocalLikes(feed.likesCount)
    try { setLiked(JSON.parse(localStorage.getItem("liked-feed") || "[]").includes(feed.id)) } catch { setLiked(false) }
  }, [feed?.id])

  const handleLike = () => {
    if (liked || !feed) return
    setLiked(true)
    setLocalLikes(n => n + 1)
    like.mutate()
    try {
      const arr = JSON.parse(localStorage.getItem("liked-feed") || "[]")
      localStorage.setItem("liked-feed", JSON.stringify([...arr, feed.id]))
    } catch {}
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !feed) return
    addComment.mutate({ authorName: commentName.trim() || "अज्ञात", content: commentText.trim() }, {
      onSuccess: () => { setCommentText(""); setCommentName("") }
    })
  }

  if (isLoading) return (
    <div className="w-full rounded-3xl bg-orange-50 flex items-center justify-center" style={{ aspectRatio: "1/1" }}>
      <Loader2 className="w-8 h-8 text-orange-300 animate-spin" />
    </div>
  )

  if (total === 0) return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ aspectRatio: "1/1" }}>
      <Gift className="w-10 h-10 text-orange-300" />
      <p className="text-orange-500 font-medium text-sm">समाज की सूचनाएं यहाँ दिखेंगी</p>
      <p className="text-gray-400 text-xs">बधाई · जन्मदिवस · शोक संदेश</p>
    </div>
  )

  return (
    <div className="w-full select-none" onMouseEnter={pause} onMouseLeave={resume}>
      {/* Card: square image (4:4) + fixed details bar below */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col">
        {/* IMAGE — square 1:1 */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
          {feeds.map((f, i) => (
            <div key={f.id} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <Image src={f.imageUrl} alt={f.heading} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized priority={i === 0} />
            </div>
          ))}
          {/* Type badge */}
          {feedType && (
            <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 ${feedType.bg} ${feedType.color} text-xs font-bold px-3 py-1.5 rounded-full shadow-sm`}>
              {feedType.label}
            </div>
          )}
          {/* Nav arrows */}
          {total > 1 && (<>
            <button onClick={() => go(current - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all">
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button onClick={() => go(current + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all">
              <ChevRight className="w-4 h-4 text-gray-700" />
            </button>
          </>)}
          {/* Dots */}
          {total > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
              {feeds.map((_, i) => (
                <button key={i} onClick={() => go(i)} className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`} />
              ))}
            </div>
          )}
        </div>

        {/* DETAILS bar — fixed height below image */}
        <div className="px-4 pt-3 pb-3 bg-white">
          {feed && (<>
            <p className="font-extrabold text-gray-900 text-sm leading-snug line-clamp-1">{feed.heading}</p>
            <p className="text-orange-600 font-semibold text-xs mt-0.5">{feed.personName}</p>
            {feed.details && <p className="text-gray-400 text-[11px] mt-0.5 line-clamp-1">{feed.details}</p>}

            {/* Like + Comment */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
              <button onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl font-semibold transition-all ${liked ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-400"}`}>
                <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500" : ""}`} />
                {localLikes > 0 ? localLikes : "पसंद"}
              </button>
              <button onClick={() => setShowComments(v => !v)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl font-semibold transition-all ${showComments ? "bg-orange-50 text-orange-500" : "bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-orange-400"}`}>
                <MessageCircle className="w-3.5 h-3.5" />
                {feed._count?.comments || "टिप्पणी"}
              </button>
              <span className="ml-auto text-[10px] text-gray-300">{current + 1}/{total}</span>
            </div>
          </>)}
        </div>
      </div>

      {/* Comments panel — outside card so not clipped */}
      {showComments && feed && (
        <div className="mt-2 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-4 py-2.5 border-b border-gray-50 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">टिप्पणियाँ</span>
            <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-4 h-4" /></button>
          </div>
          <div className="max-h-28 overflow-y-auto px-4 py-2 space-y-2">
            {comments.length === 0 && <p className="text-xs text-gray-400 text-center py-2">पहली टिप्पणी करें</p>}
            {comments.map(c => (
              <div key={c.id} className="text-xs">
                <span className="font-semibold text-gray-700">{c.authorName}: </span>
                <span className="text-gray-500">{c.content}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleComment} className="px-4 py-3 border-t border-gray-50 flex gap-2">
            <div className="flex-1 space-y-1.5">
              <input value={commentName} onChange={e => setCommentName(e.target.value)} placeholder="आपका नाम (वैकल्पिक)"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-orange-300" />
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="टिप्पणी लिखें..." required
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-orange-300" />
            </div>
            <button type="submit" disabled={addComment.isPending}
              className="self-end bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NEWS CARD
// ═══════════════════════════════════════════════════════════════════════════

function NewsCard({ item }: { item: SamajNews }) {
  const [liked, setLiked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("liked-news") || "[]").includes(item.id) } catch { return false }
  })
  const [localLikes, setLocalLikes] = useState(item.likesCount || 0)
  const like = useLikeSamajNews(item.id)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    if (liked) return
    setLiked(true)
    setLocalLikes(n => n + 1)
    like.mutate()
    try {
      const arr = JSON.parse(localStorage.getItem("liked-news") || "[]")
      localStorage.setItem("liked-news", JSON.stringify([...arr, item.id]))
    } catch {}
  }
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    const url = `${window.location.origin}/news/${item.id}`
    if (navigator.share) navigator.share({ title: item.title, url })
    else navigator.clipboard.writeText(url).then(() => alert("लिंक कॉपी हो गया!"))
  }

  const date = new Date(item.publishedAt).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" })
  return (
    <Link href={`/news/${item.id}`} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group block overflow-hidden">
      {item.imageUrl && (
        <div className="overflow-hidden bg-gray-50">
          <Image src={item.imageUrl} alt={item.title} width={600} height={300}
            className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300" unoptimized />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-orange-100 text-orange-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{item.tag}</span>
          <span className="text-gray-400 text-xs">{date}</span>
        </div>
        <h4 className="font-bold text-gray-800 text-sm mb-1.5 group-hover:text-orange-700 transition-colors leading-snug line-clamp-2">{item.title}</h4>
        {item.summary && <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">{item.summary}</p>}
        <div className="flex items-center gap-1 pt-2 border-t border-gray-50">
          <button onClick={handleLike}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}>
            <Heart className={`w-3 h-3 ${liked ? "fill-red-500" : ""}`} />
            {localLikes > 0 && localLikes}
          </button>
          <span className="flex items-center gap-1 text-xs text-gray-400 px-2 py-1">
            <MessageCircle className="w-3 h-3" />{item._count?.comments || 0}
          </span>
          <button onClick={handleShare} className="text-gray-400 hover:text-green-600 p-1 rounded-lg ml-auto">
            <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Link>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function CommunityPortal() {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [activeNav, setActiveNav] = useState("/")
  const [showSvc,   setShowSvc]   = useState(false)

  const { data: flags } = useFeatureFlags()
  const portalName     = usePortalConfigValue("portal_name",     "पंचाल समाज")
  const portalSubtitle = usePortalConfigValue("portal_subtitle", "चौदह चौखरा")
  const portalLocation = usePortalConfigValue("portal_location", "बांसवाड़ा · डूंगरपुर · प्रतापगढ़ · साबरकांठा — राजस्थान")
  const portalTagline  = usePortalConfigValue("portal_tagline",  "पंचाल समाज पोर्टल")

  const isEnabled = (key: string) => {
    if (!flags) return true
    const f = flags.find(f => f.key === key)
    return f ? f.enabled : true
  }

  const { data: newsFeed,  isLoading: newsLoading }  = useSamajNews({ take: "5" })
  const { data: pressFeed } = useSamajPress({ take: "3" })
  const { data: chokhlasData } = useAllChokhlas()
  const chokhlaNames: string[] = chokhlasData?.map((c: any) => c.name).filter(Boolean) ?? []

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
        style={{ background: scrolled ? "linear-gradient(90deg,#7c2d12 0%,#9a3412 40%,#c2410c 100%)" : "linear-gradient(90deg,#92400e 0%,#b45309 40%,#d97706 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2.5">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image src="/images/main-logo.png" alt="लोगो" width={38} height={38} className="w-9 h-9 rounded-full border-2 border-white/40 shadow-sm" />
              <div className="leading-tight">
                <div className="font-bold text-white text-sm">{portalName}</div>
                <div className="text-orange-200 text-[11px]">{portalSubtitle}</div>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.filter(item => !item.flagKey || isEnabled(item.flagKey)).map(item => (
                <Link key={item.href} href={item.href} onClick={() => setActiveNav(item.href)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${activeNav === item.href ? "bg-white/20 text-white" : "text-orange-100 hover:text-white hover:bg-white/15"}`}>
                  {item.label}
                </Link>
              ))}
              <Link href="/login" title="कार्यकारिणी लॉगिन"
                className="ml-2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all hover:scale-105 shadow-sm">
                <UserCircle className="w-5 h-5" />
              </Link>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <Link href="/login" title="लॉगिन"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
                <UserCircle className="w-4 h-4" />
              </Link>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-lg text-white hover:bg-white/20">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t border-white/20 px-4 py-3 space-y-1"
            style={{ background: "linear-gradient(180deg,#9a3412 0%,#7c2d12 100%)" }}>
            {NAV_ITEMS.filter(item => !item.flagKey || isEnabled(item.flagKey)).map(item => (
              <Link key={item.href} href={item.href} onClick={() => { setActiveNav(item.href); setMenuOpen(false) }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-orange-100 hover:bg-white/15 hover:text-white">
                <item.icon className="w-4 h-4 text-orange-300" />{item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section id="home" className="relative pt-[60px] min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fffbf5 40%, #fef3c7 100%)" }} />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #fb923c, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }} />
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c2410c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-7 order-2 lg:order-1">
              {/* Top label */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-orange-400 to-transparent" />
                <span className="text-orange-600 text-xs font-bold tracking-widest uppercase">{portalTagline}</span>
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-tight text-gray-900">
                  {portalName}
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-tight"
                  style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg,#c2410c,#ea580c,#f97316)", WebkitBackgroundClip: "text" }}>
                  {portalSubtitle}
                </h1>
              </div>
              <p className="text-orange-600/80 font-medium text-sm tracking-wide">{portalLocation}</p>

              {/* Chokhla pills — from admin-managed list */}
              <div className="flex flex-wrap gap-1.5">
                {chokhlaNames.map((name, i) => (
                  <span key={name}
                    className="px-2.5 py-1 text-xs font-semibold rounded-full border transition-all hover:scale-105 cursor-default"
                    style={{
                      background: i % 3 === 0 ? "rgba(234,88,12,0.08)" : i % 3 === 1 ? "rgba(251,191,36,0.1)" : "rgba(194,65,12,0.06)",
                      borderColor: i % 3 === 0 ? "rgba(234,88,12,0.25)" : i % 3 === 1 ? "rgba(217,119,6,0.3)" : "rgba(194,65,12,0.2)",
                      color: i % 3 === 0 ? "#c2410c" : i % 3 === 1 ? "#92400e" : "#9a3412",
                    }}>
                    {name}
                  </span>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setShowSvc(v => !v)
                    setTimeout(() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #c2410c 0%, #ea580c 60%, #f97316 100%)" }}>
                  डिजिटल सेवाएं
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSvc ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* Hero Feed Slider */}
            <div className="order-1 lg:order-2 w-full max-w-xs mx-auto lg:mx-0 lg:ml-auto">
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl opacity-20 blur-xl" style={{ background: "linear-gradient(135deg,#f97316,#c2410c)" }} />
                <div className="relative">
                  <HeroFeedSlider />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-3 -right-3 bg-white rounded-2xl px-3 py-2 shadow-lg border border-orange-100 flex items-center gap-2 z-10">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-700">समाज संदेश</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-6 animate-bounce">
          <ChevronDown className="w-5 h-5 text-orange-300" />
        </div>
      </section>

      {/* ── EXPLORE SERVICES ───────────────────────────────────────────── */}
      <div id="services"
        className={`overflow-hidden transition-all duration-500 border-b border-orange-100 ${showSvc ? "max-h-[900px] py-10" : "max-h-0 py-0"}`}
        style={{ background: "linear-gradient(180deg, #fff7ed 0%, #fffbf5 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-extrabold text-gray-800">समाज की डिजिटल सेवाएं</h2>
            <p className="text-xs text-gray-400 mt-1">पंचाल समाज चौदह चौखरा के सभी डिजिटल माध्यम</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {SERVICES.map(svc => (
              <Link key={svc.title} href={svc.href}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-orange-50 hover:border-orange-200 hover:shadow-md transition-all group text-center">
                <div className={`w-10 h-10 rounded-xl ${svc.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <svc.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-orange-700 leading-tight">{svc.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEWS FEED ──────────────────────────────────────────────────── */}
      {isEnabled("news_feed") && <section id="feed" className="py-12 sm:py-16 px-4"
        style={{ background: "linear-gradient(180deg, #fffbf5 0%, #ffffff 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">समाज समाचार</h2>
              <p className="text-xs text-gray-400 mt-0.5">पंचाल समाज की ताज़ा खबरें</p>
            </div>
            <Link href="/news"
              className="flex items-center gap-1.5 text-orange-600 text-sm font-semibold hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors">
              सभी देखें <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {newsLoading && (
            <div className="text-center py-10 text-orange-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
          )}
          {!newsLoading && (!newsFeed || newsFeed.length === 0) && (
            <div className="text-center py-10 text-gray-400 text-sm">अभी कोई समाचार नहीं है।</div>
          )}
          {newsFeed && newsFeed.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {newsFeed.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </section>}

      {/* ── PRESS RELEASES ─────────────────────────────────────────────── */}
      {isEnabled("press_release") && <section id="press" className="py-14 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-800">प्रेस विज्ञप्ति</h2>
            <Link href="/press-release" className="text-teal-600 text-sm font-semibold hover:text-teal-800 inline-flex items-center gap-1">
              सभी देखें <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {pressFeed && pressFeed.length > 0 ? pressFeed.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm group-hover:text-teal-700 leading-snug">{p.title}</h4>
                  <div className="text-gray-400 text-xs mt-0.5">
                    {p.publishedBy && `${p.publishedBy} · `}
                    {new Date(p.publishedAt).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                {p.pdfUrl && (
                  <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg" title="डाउनलोड">
                    <Download className="w-4 h-4 text-teal-600" />
                  </a>
                )}
              </div>
            )) : (
              <div className="text-center py-8 text-gray-400 text-sm">अभी कोई प्रेस विज्ञप्ति नहीं है।</div>
            )}
          </div>
        </div>
      </section>}

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/images/main-logo.png" alt="लोगो" width={44} height={44} className="w-11 h-11 rounded-full border-2 border-orange-500/30" />
                <div>
                  <div className="font-bold text-white text-sm">पंचाल समाज</div>
                  <div className="text-gray-400 text-xs">चौदह चौखरा</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">बांसवाड़ा – डूंगरपुर – प्रतापगढ़ – उदयपुर, राजस्थान</p>
              <div className="flex gap-2">
                {[Facebook, Twitter, Youtube, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">समाज पोर्टल</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "समाज समाचार", href: "#feed" },
                  { label: "समाज पोस्ट", href: "#feed" },
                  { label: "प्रेस विज्ञप्ति", href: "/press-release" },
                  { label: "कार्यक्रम", href: "/events" },
                ].map(l => (
                  <li key={l.label}><Link href={l.href} className="text-gray-400 text-xs hover:text-orange-400 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">सेवाएं</h4>
              <ul className="space-y-2.5">
                {["शिक्षा पोर्टल","डिजिटल जनगणना","वैवाहिक परिचय","व्यवसाय निर्देशिका","समाज की योजनाएं","संपर्क करें"].map(l => (
                  <li key={l}><a href="#" className="text-gray-400 text-xs hover:text-orange-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">संपर्क करें</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-400 text-xs"><MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />बांसवाड़ा, राजस्थान – 327001</li>
                <li className="flex items-center gap-2 text-gray-400 text-xs"><Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />+91 XXXXX XXXXX</li>
                <li className="flex items-center gap-2 text-gray-400 text-xs"><Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />info@panchalsamaj.org</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
              <span>© {new Date().getFullYear()} पंचाल समाज चौदह चौखरा। सर्वाधिकार सुरक्षित।</span>
              <span className="hidden sm:inline text-gray-700">·</span>
              <span>Designed &amp; Developed by <a href="https://placego.online/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors">placego.online</a></span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-400 transition-colors">गोपनीयता नीति</a>
              <a href="#" className="hover:text-orange-400 transition-colors">नियम एवं शर्तें</a>
              <Link href="/help" className="hover:text-orange-400 transition-colors">सहायता</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

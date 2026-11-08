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
  Share2, MessageCircle,
  ChevronLeft, ChevronRight as ChevRight,
  Calendar, Loader2, MapPin, Send,
} from "lucide-react"
import {
  useSamajNews, useSamajPress, useLikeSamajNews,
} from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajNews } from "@/data-hooks/requests/samaj-content"
import { useFeatureFlags } from "@/data-hooks/mutation-query/useFeatureFlags"
import { usePortalConfigValue } from "@/data-hooks/mutation-query/usePortalConfig"
import { usePublicChokhlas } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { useHeroFeed, useLikeHeroFeed, useHeroFeedComments, useAddHeroFeedComment } from "@/data-hooks/mutation-query/useHeroFeed"
import type { HeroFeed } from "@/data-hooks/requests/hero-feed"
import { FEED_TYPES } from "@/data-hooks/requests/hero-feed"

// ─── NAV ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "होम",              href: "/",                                             icon: Home,          flagKey: null,            external: false },
  { label: "समाचार",           href: "/news",                                         icon: Newspaper,     flagKey: "news_feed",      external: false },
  { label: "प्रेस विज्ञप्ति",  href: "/press-release",                                icon: FileText,      flagKey: "press_release",  external: false },
  { label: "कार्यक्रम",       href: "/events",                                        icon: Calendar,      flagKey: "events",         external: false },
  { label: "नियमावली",        href: "/niyamavali",                                    icon: BookOpen,      flagKey: "niyamavali",     external: false },
  { label: "शिक्षा",           href: "/education",                                    icon: GraduationCap, flagKey: null,             external: false },
  { label: "व्यापार",          href: "https://business-directory.panchalsamaj.online/", icon: Briefcase,   flagKey: null,             external: true  },
]

// ─── SERVICES ───────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: GraduationCap, color: "bg-green-100 text-green-700",    title: "शिक्षा पोर्टल",          href: "/education" },
  { icon: Database,      color: "bg-orange-100 text-orange-700",  title: "डिजिटल जनगणना",         href: "/community-hub" },
  { icon: Handshake,     color: "bg-red-100 text-red-700",        title: "वैवाहिक परिचय",         href: "/admin/matrimonial" },
  { icon: Briefcase,     color: "bg-yellow-100 text-yellow-700",  title: "व्यवसाय निर्देशिका",     href: "https://business-directory.panchalsamaj.online/", external: true },
  { icon: Stethoscope,   color: "bg-cyan-100 text-cyan-700",      title: "स्वास्थ्य एवं चिकित्सा", href: "#health" },
  { icon: Vote,          color: "bg-violet-100 text-violet-700",  title: "समाज की योजनाएं",        href: "#schemes" },
  { icon: FileText,      color: "bg-teal-100 text-teal-700",      title: "प्रेस विज्ञप्ति",        href: "/press-release" },
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

  const date = new Date(item.publishedAt).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })
  return (
    <article className="group bg-white rounded-2xl border border-orange-100 ring-1 ring-orange-50 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col">
      {item.imageUrl && (
        <Link href={`/news/${item.id}`} className="block overflow-hidden bg-gray-100 aspect-[16/9]">
          <Image src={item.imageUrl} alt={item.title} width={800} height={450}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" unoptimized />
        </Link>
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          {item.tag && <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">{item.tag}</span>}
          <span className="text-gray-500 text-xs font-medium">{date}</span>
        </div>
        <Link href={`/news/${item.id}`} className="flex-1 mb-2">
          <h2 className="font-extrabold text-orange-700 text-base sm:text-lg leading-snug group-hover:text-orange-900 transition-colors line-clamp-2">
            {item.title}
          </h2>
        </Link>
        {item.summary && (
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4">{item.summary}</p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-orange-50 mt-auto">
          <div className="flex items-center gap-1">
            <button onClick={handleLike} disabled={liked}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${liked ? "text-red-500 bg-red-50" : "text-gray-500 hover:text-red-500 hover:bg-red-50"}`}>
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500" : ""}`} />
              {localLikes > 0 && <span>{localLikes}</span>}
            </button>
            <span className="flex items-center gap-1.5 text-gray-500 text-xs px-2.5 py-1.5">
              <MessageCircle className="w-3.5 h-3.5" />{item._count?.comments || 0}
            </span>
            <button onClick={handleShare}
              className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 text-xs px-2.5 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <Link href={`/news/${item.id}`}
            className="flex items-center gap-1 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 px-4 py-1.5 rounded-lg transition-colors">
            पढ़ें <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function CommunityPortal() {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [activeNav, setActiveNav] = useState("/")

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
  const { data: chokhlasData } = usePublicChokhlas()
  const chokhlaNames: string[] = chokhlasData?.map((c) => c.name).filter(Boolean) ?? []

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
        style={{ background: scrolled ? "linear-gradient(90deg,#6b0000 0%,#8B0000 50%,#a30000 100%)" : "linear-gradient(90deg,#8B0000 0%,#a30000 50%,#c2410c 100%)" }}>
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
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
            style={{ background: "linear-gradient(180deg,#8B0000 0%,#6b0000 100%)" }}>
            {NAV_ITEMS.filter(item => !item.flagKey || isEnabled(item.flagKey)).map(item => (
              <Link key={item.href} href={item.href} onClick={() => { setActiveNav(item.href); setMenuOpen(false) }}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-orange-100 hover:bg-white/15 hover:text-white">
                <item.icon className="w-4 h-4 text-orange-300" />{item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section id="home" className="relative pt-[56px] overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FFFAF4 0%, #FFF3E2 60%, #fff7e6 100%)" }}>

        {/* Mandala decoration — top left */}
        <div className="absolute top-0 left-0 w-72 h-72 opacity-[0.07] pointer-events-none select-none -translate-x-1/4 -translate-y-1/4">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="98" stroke="#8B0000" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="80" stroke="#8B0000" strokeWidth="1"/>
            <circle cx="100" cy="100" r="60" stroke="#D9A441" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="40" stroke="#8B0000" strokeWidth="1"/>
            <circle cx="100" cy="100" r="20" stroke="#D9A441" strokeWidth="1.5"/>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
              <g key={a} transform={`rotate(${a} 100 100)`}>
                <line x1="100" y1="2" x2="100" y2="40" stroke="#8B0000" strokeWidth="0.8"/>
                <ellipse cx="100" cy="50" rx="4" ry="10" fill="#D9A441" opacity="0.6"/>
                <line x1="100" y1="60" x2="100" y2="80" stroke="#8B0000" strokeWidth="0.8"/>
              </g>
            ))}
          </svg>
        </div>

        {/* Mandala — bottom right */}
        <div className="absolute bottom-16 right-0 w-56 h-56 opacity-[0.05] pointer-events-none select-none translate-x-1/4 translate-y-1/4">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="98" stroke="#F47700" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="70" stroke="#8B0000" strokeWidth="1"/>
            <circle cx="100" cy="100" r="45" stroke="#D9A441" strokeWidth="1.5"/>
            {[0,45,90,135,180,225,270,315].map(a => (
              <g key={a} transform={`rotate(${a} 100 100)`}>
                <ellipse cx="100" cy="30" rx="6" ry="12" fill="#8B0000" opacity="0.5"/>
              </g>
            ))}
          </svg>
        </div>


        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 pt-5 pb-4 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">

            {/* ── Left: Text + Services ── */}
            <div className="space-y-4 order-2 lg:order-1">

              {/* Gold divider + tagline */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-px" style={{ background: "#D9A441" }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D9A441" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B0000" }}>{portalTagline}</span>
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D9A441" }} />
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, #D9A441, transparent)" }} />
              </div>

              {/* Heading */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-extrabold leading-tight"
                  style={{ color: "#8B0000" }}>
                  {portalName}
                </h1>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-extrabold leading-tight"
                  style={{ background: "linear-gradient(90deg,#F47700,#D9A441)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {portalSubtitle}
                </h1>
              </div>

              {/* Location — gold line */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-px" style={{ background: "#D9A441" }} />
                <p className="text-sm font-medium" style={{ color: "#8B0000", opacity: 0.75 }}>{portalLocation}</p>
              </div>

              {/* Chokhla pills */}
              <div className="flex flex-wrap gap-1.5">
                {chokhlaNames.map((name, i) => (
                  <span key={name}
                    className="px-2.5 py-1 text-xs font-semibold rounded-full border transition-all hover:scale-105 cursor-default"
                    style={{
                      background: i % 2 === 0 ? "rgba(139,0,0,0.06)" : "rgba(217,164,65,0.1)",
                      borderColor: i % 2 === 0 ? "rgba(139,0,0,0.2)" : "rgba(217,164,65,0.35)",
                      color: i % 2 === 0 ? "#8B0000" : "#92400e",
                    }}>
                    {name}
                  </span>
                ))}
              </div>

              {/* Digital Services Chips */}
              <div className="pt-1">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2.5" style={{ color: "#8B0000", opacity: 0.5 }}>डिजिटल सेवाएं</p>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((svc, i) => (
                    <Link key={svc.title} href={svc.href}
                      {...((svc as any).external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all hover:scale-105 hover:shadow-sm active:scale-[0.98]"
                      style={{
                        background: i % 2 === 0 ? "rgba(139,0,0,0.05)" : "rgba(217,164,65,0.08)",
                        borderColor: i % 2 === 0 ? "rgba(139,0,0,0.25)" : "rgba(217,164,65,0.45)",
                      }}>
                      <svc.icon className="w-3 h-3 shrink-0" style={{ color: i % 2 === 0 ? "#8B0000" : "#92400e" }} />
                      <span className="text-xs font-bold tracking-wide" style={{ color: i % 2 === 0 ? "#8B0000" : "#92400e" }}>{svc.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Hero Feed Slider ── */}
            <div className="order-1 lg:order-2 w-full max-w-[300px] sm:max-w-xs mx-auto lg:mx-0 lg:ml-auto">
              <div className="relative">
                {/* Glow ring behind card */}
                <div className="absolute -inset-4 rounded-3xl opacity-25 blur-2xl pointer-events-none"
                  style={{ background: "radial-gradient(circle, #F47700, #8B0000)" }} />
                {/* Gold border frame */}
                <div className="relative rounded-3xl p-[2px]"
                  style={{ background: "linear-gradient(135deg, #D9A441, #F47700, #8B0000, #D9A441)" }}>
                  <div className="rounded-3xl overflow-hidden bg-white">
                    <HeroFeedSlider />
                  </div>
                </div>
                {/* Badge */}
                <div className="absolute -bottom-3 -right-3 rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2 z-10 border"
                  style={{ background: "#FFF3E2", borderColor: "#D9A441" }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#F47700" }} />
                  <span className="text-xs font-semibold" style={{ color: "#8B0000" }}>समाज संदेश</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Om + gold divider row */}
        <div className="relative z-10 flex items-center justify-center gap-4 py-2">
          <div className="flex-1 max-w-[120px] h-px ml-auto" style={{ background: "linear-gradient(to right, transparent, #D9A441)" }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D9A441" }} />
          <span className="text-2xl font-bold select-none" style={{ color: "#8B0000", opacity: 0.5 }}>ॐ</span>
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D9A441" }} />
          <div className="flex-1 max-w-[120px] h-px mr-auto" style={{ background: "linear-gradient(to left, transparent, #D9A441)" }} />
        </div>

        {/* Curved wave bottom border */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full" style={{ height: "60px" }}>
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,40 L1440,80 L0,80 Z" fill="#8B0000" opacity="0.12"/>
            <path d="M0,55 C240,20 480,70 720,50 C960,30 1200,65 1440,50 L1440,80 L0,80 Z" fill="#8B0000" opacity="0.08"/>
            <path d="M0,65 C360,45 720,75 1080,55 C1260,45 1380,60 1440,65 L1440,80 L0,80 Z" fill="#D9A441" opacity="0.15"/>
          </svg>
        </div>
      </section>

      {/* ── NEWS FEED ──────────────────────────────────────────────────── */}
      {isEnabled("news_feed") && <section id="feed" className="py-12 sm:py-16 px-4"
        style={{ background: "linear-gradient(180deg, #fffbf5 0%, #fff7ed 60%, #ffffff 100%)" }}>
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">समाज समाचार</h2>
                <p className="text-xs text-gray-400 mt-0.5">पंचाल समाज की ताज़ा खबरें</p>
              </div>
            </div>
            <Link href="/news"
              className="hidden sm:flex items-center gap-1.5 text-orange-600 text-sm font-semibold hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors">
              सभी देखें <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {newsLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-orange-400">
              <Loader2 className="w-7 h-7 animate-spin" />
              <p className="text-sm text-gray-500">समाचार लोड हो रहे हैं...</p>
            </div>
          )}
          {!newsLoading && (!newsFeed || newsFeed.length === 0) && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-8 h-8 text-orange-300" />
              </div>
              <p className="text-gray-500 text-sm">अभी कोई समाचार नहीं है।</p>
            </div>
          )}
          {newsFeed && newsFeed.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsFeed.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
          )}

          {/* View All Button */}
          {!newsLoading && newsFeed && newsFeed.length > 0 && (
            <div className="text-center mt-10">
              <Link href="/news"
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 px-7 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <Newspaper className="w-4 h-4" />
                सभी समाचार पढ़ें
                <ChevronRight className="w-4 h-4" />
              </Link>
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

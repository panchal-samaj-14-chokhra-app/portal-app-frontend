"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Menu, X, ChevronRight, Users, MapPin, Heart, Star, Newspaper,
  BookOpen, Stethoscope, FileText,
  Handshake, Vote, Award,
  Phone, Mail, Facebook, Twitter, Youtube, Instagram,
  Home, GraduationCap, Database, UserCheck,
  Briefcase, Gift, Flame, Download,
  ChevronDown,
  ChevronLeft, ChevronRight as ChevRight,
  Calendar, Loader2,
} from "lucide-react"
import {
  useSamajNews, useSamajPress,
} from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajNews, SamajPressRelease } from "@/data-hooks/requests/samaj-content"
import { useFeatureFlags } from "@/data-hooks/mutation-query/useFeatureFlags"

// ─── NAV ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "होम",           href: "#home",          icon: Home,      flagKey: null },
  { label: "समाचार",        href: "#feed",          icon: Newspaper, flagKey: "news_feed" },
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

// ─── HERO SLIDER ─────────────────────────────────────────────────────────────

const FALLBACK_SLIDES = [
  { src: "/placeholder.jpg", label: "सामाजिक सभा",     desc: "समाज की एकता का उत्सव" },
  { src: "/placeholder.jpg", label: "धार्मिक आयोजन",   desc: "आस्था और परंपरा" },
  { src: "/placeholder.jpg", label: "सामूहिक विवाह",   desc: "समाज की पावन परंपरा" },
]

// ═══════════════════════════════════════════════════════════════════════════
// HERO IMAGE SLIDER
// ═══════════════════════════════════════════════════════════════════════════

function HeroSlider({ darshanEnabled = true }: { darshanEnabled?: boolean }) {
  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState(FALLBACK_SLIDES as { src: string; label: string; desc: string }[])
  const [isDarshan, setIsDarshan] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = slides.length
  const go = (idx: number) => setCurrent((idx + total) % total)

  useEffect(() => {
    if (!darshanEnabled) return
    // Fetch today's darshan images from the mandir content API
    const fetchDarshan = async () => {
      try {
        const { default: req } = await import("@/config/request")
        const { data } = await req.get("/content/aaj-ke-darshan")
        const items = data?.data?.items
        const images: string[] = Array.isArray(items?.images)
          ? items.images.filter((u: unknown): u is string => typeof u === "string").slice(0, 5)
          : []
        if (images.length > 0) {
          setSlides(images.map((src, i) => ({
            src,
            label: "आज के दर्शन",
            desc: items?.caption || "श्री राजराजेश्वरी माँ त्रिपुरा सुंदरी के आज के दर्शन",
          })))
          setIsDarshan(true)
        }
      } catch {
        // keep fallback slides
      }
    }
    fetchDarshan()
  }, [darshanEnabled])

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 4000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [total])

  const pause = () => { if (timerRef.current) clearInterval(timerRef.current) }
  const resume = () => { timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 4000) }

  return (
    <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl select-none" onMouseEnter={pause} onMouseLeave={resume}>
      {isDarshan && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-orange-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          <Flame className="w-3.5 h-3.5" />
          आज के दर्शन
        </div>
      )}
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <Image src={slide.src} alt={slide.label} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority={i === 0} unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {!isDarshan && (
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              <div className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">{slide.label}</div>
              <p className="text-white text-sm font-medium leading-tight">{slide.desc}</p>
            </div>
          )}
          {isDarshan && i === current && (
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <p className="text-white text-xs font-medium leading-snug line-clamp-2 drop-shadow">{slide.desc}</p>
            </div>
          )}
        </div>
      ))}
      <button onClick={() => go(current - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all">
        <ChevronLeft className="w-4 h-4 text-gray-700" />
      </button>
      <button onClick={() => go(current + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all">
        <ChevRight className="w-4 h-4 text-gray-700" />
      </button>
      <div className="absolute bottom-14 right-4 z-20 flex gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i)} className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-2 bg-orange-400" : "w-2 h-2 bg-white/60 hover:bg-white"}`} />
        ))}
      </div>
      <div className="absolute top-4 right-4 z-20 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full">{current + 1} / {total}</div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NEWS CARD
// ═══════════════════════════════════════════════════════════════════════════

function NewsCard({ item }: { item: SamajNews }) {
  const date = new Date(item.publishedAt).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" })
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group p-5">
      {item.imageUrl && (
        <div className="relative rounded-xl overflow-hidden mb-3 bg-gray-100">
          <Image src={item.imageUrl} alt={item.title} width={600} height={300} className="w-full object-cover max-h-44" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-orange-100 text-orange-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{item.tag}</span>
        <span className="text-gray-400 text-xs">{date}</span>
      </div>
      <h4 className="font-bold text-gray-800 text-base mb-1.5 group-hover:text-orange-700 transition-colors leading-snug">{item.title}</h4>
      {item.summary && <p className="text-gray-500 text-sm leading-relaxed">{item.summary}</p>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function CommunityPortal() {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [activeNav, setActiveNav] = useState("#home")
  const [showSvc,   setShowSvc]   = useState(false)

  const { data: flags } = useFeatureFlags()
  const isEnabled = (key: string) => {
    if (!flags) return true
    const f = flags.find(f => f.key === key)
    return f ? f.enabled : true
  }

  const { data: newsFeed,  isLoading: newsLoading }  = useSamajNews({ take: "5" })
  const { data: pressFeed } = useSamajPress({ take: "3" })

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image src="/images/main-logo.png" alt="लोगो" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-orange-200" />
              <div className="hidden sm:block leading-tight">
                <div className="font-bold text-orange-700 text-sm">पंचाल समाज</div>
                <div className="text-gray-400 text-[11px]">चौदह चौखरा</div>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.filter(item => !item.flagKey || isEnabled(item.flagKey)).map(item => (
                <Link key={item.href} href={item.href} onClick={() => setActiveNav(item.href)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeNav === item.href ? "bg-orange-100 text-orange-700" : "text-gray-500 hover:text-orange-700 hover:bg-orange-50"}`}>
                  {item.label}
                </Link>
              ))}
              <Link href="/login"
                className="ml-3 px-4 py-1.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-sm">
                कार्यकारिणी लॉगिन
              </Link>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-orange-50">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t bg-white px-4 py-3 space-y-1 shadow-lg">
            {NAV_ITEMS.filter(item => !item.flagKey || isEnabled(item.flagKey)).map(item => (
              <Link key={item.href} href={item.href} onClick={() => { setActiveNav(item.href); setMenuOpen(false) }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                <item.icon className="w-4 h-4 text-orange-400" />{item.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 w-full py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg">
              <UserCheck className="w-4 h-4" />कार्यकारिणी लॉगिन
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section id="home" className="pt-[60px] min-h-screen flex flex-col justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-4 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                डिजिटल सामाजिक मंच · राजस्थान
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                पंचाल समाज<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">चौदह चौखरा</span>
              </h1>
              <p className="text-orange-600 font-semibold text-sm">बांसवाड़ा – डूंगरपुर – प्रतापगढ़ – उदयपुर, राजस्थान</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-700 italic border-l-4 border-orange-400 pl-4 leading-snug">
                "एक समाज, एक पहचान,<br className="hidden sm:block" />एक डिजिटल मंच।"
              </p>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-lg">
                पंचाल समाज के सभी परिवारों और सदस्यों को एक डिजिटल मंच पर जोड़ने का प्रयास।
                समाज की गतिविधियों, समाचारों, उपलब्धियों, शिक्षा, रोजगार और सामाजिक सहयोग की
                जानकारी अब एक ही स्थान पर।
              </p>
              <button
                onClick={() => {
                  setShowSvc(v => !v)
                  setTimeout(() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all text-sm sm:text-base"
              >
                Explore Digital Panchal Samaj
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSvc ? "rotate-180" : ""}`} />
              </button>
            </div>
            <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <HeroSlider darshanEnabled={isEnabled("darshan_slider")} />
            </div>
          </div>
        </div>
        <div className="flex justify-center pb-6 animate-bounce">
          <ChevronDown className="w-6 h-6 text-orange-400" />
        </div>
      </section>

      {/* ── EXPLORE SERVICES ───────────────────────────────────────────── */}
      <div id="services"
        className={`overflow-hidden transition-all duration-500 bg-gray-50 border-b border-gray-100 ${showSvc ? "max-h-[800px] py-10" : "max-h-0 py-0"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-700 mb-6 text-center">समाज की डिजिटल सेवाएं</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {SERVICES.map(svc => (
              <Link key={svc.title} href={svc.href}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group text-center">
                <div className={`w-10 h-10 rounded-xl ${svc.color} flex items-center justify-center`}>
                  <svc.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-orange-700 leading-tight">{svc.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEWS FEED ──────────────────────────────────────────────────── */}
      {isEnabled("news_feed") && <section id="feed" className="py-10 sm:py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-gray-800">
              <Newspaper className="w-5 h-5 text-orange-500" />समाज समाचार
            </h2>
          </div>
          <div className="space-y-4">
            {newsLoading && (
              <div className="text-center py-10 text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
            )}
            {!newsLoading && (!newsFeed || newsFeed.length === 0) && (
              <div className="text-center py-10 text-gray-400 text-sm">अभी कोई समाचार नहीं है।</div>
            )}
            {newsFeed?.map(item => <NewsCard key={item.id} item={item} />)}
            {newsFeed && newsFeed.length > 0 && (
              <div className="text-center pt-2">
                <Link href="/news" className="text-orange-600 text-sm font-semibold hover:text-orange-800 inline-flex items-center gap-1">
                  सभी समाचार देखें <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
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

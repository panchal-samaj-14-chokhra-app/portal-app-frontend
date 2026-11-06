"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Menu, X, ChevronRight, Users, MapPin, Heart, Star, Newspaper,
  MessageSquare, BookOpen, Building2, Stethoscope, FileText,
  Handshake, Vote, Camera, ArrowRight, Award,
  Phone, Mail, Facebook, Twitter, Youtube, Instagram,
  Home, Info, GraduationCap, Database, UserCheck,
  Briefcase, Gift, Flame, TrendingUp, ExternalLink, Download,
  ThumbsUp, MessageCircle, Share2, PlusCircle, ChevronDown,
  ChevronLeft, ChevronRight as ChevRight,
} from "lucide-react"

// ─── NAV ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "होम",           href: "#home",  icon: Home },
  { label: "समाचार",        href: "#feed",  icon: Newspaper },
  { label: "प्रेस विज्ञप्ति", href: "#press", icon: FileText },
]

// ─── STATS ──────────────────────────────────────────────────────────────────

const STATS = [
  { target: 14000, suffix: "+", label: "पंजीकृत परिवार",  icon: Users },
  { target: 75000, suffix: "+", label: "समाज के सदस्य",   icon: UserCheck },
  { target: 200,   suffix: "+", label: "समाज के गांव",    icon: MapPin },
  { target: 50,    suffix: "+", label: "वार्षिक कार्यक्रम", icon: GraduationCap },
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
  { icon: FileText,      color: "bg-teal-100 text-teal-700",      title: "प्रेस विज्ञप्ति",        href: "#press" },
  { icon: Gift,          color: "bg-pink-100 text-pink-700",      title: "बधाई एवं शुभकामनाएं",   href: "#greetings" },
  { icon: Heart,         color: "bg-slate-100 text-slate-700",    title: "शोक समाचार",            href: "#condolence" },
  { icon: Newspaper,     color: "bg-blue-100 text-blue-700",      title: "समाज समाचार",           href: "#feed" },
  { icon: MessageSquare, color: "bg-indigo-100 text-indigo-700",  title: "समाज पोस्ट",            href: "#feed" },
]

// ─── HERO SLIDER ─────────────────────────────────────────────────────────────
// Drop real community images into /public/images/ and update src here.

const SLIDES = [
  { src: "/placeholder.jpg", label: "सामाजिक सभा",     desc: "समाज की एकता का उत्सव" },
  { src: "/placeholder.jpg", label: "धार्मिक आयोजन",   desc: "आस्था और परंपरा" },
  { src: "/placeholder.jpg", label: "सामूहिक विवाह",   desc: "समाज की पावन परंपरा" },
  { src: "/placeholder.jpg", label: "प्रतिभा सम्मान",  desc: "मेधावी सदस्यों का सम्मान" },
  { src: "/placeholder.jpg", label: "शिक्षा",          desc: "ज्ञान की रोशनी" },
  { src: "/placeholder.jpg", label: "सांस्कृतिक",      desc: "हमारी विरासत, हमारी पहचान" },
]

// ─── FEED DATA ───────────────────────────────────────────────────────────────

const NEWS_FEED = [
  { tag: "घोषणा",   date: "5 Nov 2026",  title: "समाज की वार्षिक महासभा का आयोजन बांसवाड़ा में", desc: "समस्त समाजबंधुओं को सूचित किया जाता है कि इस वर्ष की महासभा दिसम्बर माह में आयोजित की जाएगी। सभी की उपस्थिति अपेक्षित है।" },
  { tag: "शिक्षा",   date: "3 Nov 2026",  title: "मेधावी छात्रों को छात्रवृत्ति वितरण समारोह", desc: "10वीं एवं 12वीं में उत्कृष्ट प्रदर्शन करने वाले छात्रों को छात्रवृत्ति प्रदान की जाएगी।" },
  { tag: "स्वास्थ्य", date: "1 Nov 2026",  title: "निशुल्क स्वास्थ्य शिविर — डूंगरपुर", desc: "समाज के सभी सदस्यों के लिए निशुल्क चिकित्सा परीक्षण एवं दवा वितरण का आयोजन किया गया।" },
  { tag: "आयोजन",   date: "28 Oct 2026", title: "सामूहिक विवाह सम्मेलन — पंजीकरण प्रारंभ", desc: "समाज के युवक-युवतियों के लिए सामूहिक विवाह सम्मेलन का आयोजन। पंजीकरण की अंतिम तिथि 30 नवम्बर।" },
]

const POSTS_FEED = [
  { name: "राजेश पंचाल",  loc: "बांसवाड़ा",   time: "2 घंटे पहले",  text: "समाज की एकता ही हमारी सबसे बड़ी ताकत है। आइए, मिलकर समाज को और सशक्त बनाएं। 🙏", likes: 124, comments: 23, avatar: "रा" },
  { name: "सुनीता पंचाल", loc: "उदयपुर",      time: "5 घंटे पहले",  text: "बच्चों की शिक्षा के लिए समाज का योगदान सराहनीय है। छात्रवृत्ति योजना से कई छात्र लाभान्वित हो रहे हैं।", likes: 89, comments: 15, avatar: "सु" },
  { name: "महेश पंचाल",   loc: "डूंगरपुर",    time: "1 दिन पहले",   text: "आगामी महासभा में सभी समाजबंधुओं से अनुरोध है कि अधिक से अधिक संख्या में उपस्थित हों।", likes: 201, comments: 45, avatar: "म" },
  { name: "अनीता पंचाल",  loc: "प्रतापगढ़",   time: "2 दिन पहले",   text: "RAS परीक्षा में सफलता पाकर बहुत खुशी हो रही है। समाज के सभी बड़ों का आशीर्वाद और प्रोत्साहन मिला। 🎉", likes: 342, comments: 78, avatar: "अ" },
]

// ═══════════════════════════════════════════════════════════════════════════
// HERO IMAGE SLIDER
// ═══════════════════════════════════════════════════════════════════════════

function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const total = SLIDES.length
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = (idx: number) => setCurrent((idx + total) % total)

  // Auto-advance every 4 s
  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 4000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [total])

  const pause = () => { if (timerRef.current) clearInterval(timerRef.current) }
  const resume = () => { timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 4000) }

  return (
    <div
      className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl select-none"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image
            src={slide.src}
            alt={slide.label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={i === 0}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <div className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
              {slide.label}
            </div>
            <p className="text-white text-sm font-medium leading-tight">{slide.desc}</p>
          </div>
        </div>
      ))}

      {/* Prev / Next arrows */}
      <button
        onClick={() => go(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all"
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4 text-gray-700" />
      </button>
      <button
        onClick={() => go(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all"
        aria-label="Next"
      >
        <ChevRight className="w-4 h-4 text-gray-700" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-14 right-4 z-20 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-2 bg-orange-400" : "w-2 h-2 bg-white/60 hover:bg-white"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 z-20 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full">
        {current + 1} / {total}
      </div>
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
  const [feedTab,   setFeedTab]   = useState<"news" | "posts">("news")
  const [counts,    setCounts]    = useState([0, 0, 0, 0])
  const [counted,   setCounted]   = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  // Animated counters — left → right stagger
  useEffect(() => {
    if (counted) return
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setCounted(true)
      STATS.forEach((stat, i) => {
        const delay = i * 220
        const dur   = 1400
        const steps = 60
        setTimeout(() => {
          let step = 0
          const id = setInterval(() => {
            step++
            const eased = Math.round(stat.target * (1 - Math.pow(1 - step / steps, 3)))
            setCounts(prev => { const n = [...prev]; n[i] = eased; return n })
            if (step >= steps) {
              clearInterval(id)
              setCounts(prev => { const n = [...prev]; n[i] = stat.target; return n })
            }
          }, dur / steps)
        }, delay)
      })
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [counted])

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
              {NAV_ITEMS.map(item => (
                <a key={item.href} href={item.href} onClick={() => setActiveNav(item.href)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeNav === item.href ? "bg-orange-100 text-orange-700" : "text-gray-500 hover:text-orange-700 hover:bg-orange-50"}`}>
                  {item.label}
                </a>
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
            {NAV_ITEMS.map(item => (
              <a key={item.href} href={item.href} onClick={() => { setActiveNav(item.href); setMenuOpen(false) }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                <item.icon className="w-4 h-4 text-orange-400" />{item.label}
              </a>
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

            {/* Left */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-4 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                डिजिटल सामाजिक मंच · राजस्थान
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                पंचाल समाज<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">
                  चौदह चौखरा
                </span>
              </h1>

              <p className="text-orange-600 font-semibold text-sm">
                बांसवाड़ा – डूंगरपुर – प्रतापगढ़ – उदयपुर, राजस्थान
              </p>

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

            {/* Right – Image slider */}
            <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <HeroSlider />
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-6 animate-bounce">
          <ChevronDown className="w-6 h-6 text-orange-400" />
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <div ref={statsRef} className="bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
            {STATS.map((s, i) => (
              <div key={s.label} className="text-center">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-2">
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                  {counts[i].toLocaleString("en-IN")}{s.suffix}
                </div>
                <div className="text-orange-100 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXPLORE SERVICES (expand on CTA click) ─────────────────────── */}
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

      {/* ── SOCIAL FEED ────────────────────────────────────────────────── */}
      <section id="feed" className="py-10 sm:py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
              <button onClick={() => setFeedTab("news")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${feedTab === "news" ? "bg-white text-orange-700 shadow" : "text-gray-500 hover:text-gray-700"}`}>
                <Newspaper className="w-4 h-4" />समाचार
              </button>
              <button onClick={() => setFeedTab("posts")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${feedTab === "posts" ? "bg-white text-orange-700 shadow" : "text-gray-500 hover:text-gray-700"}`}>
                <MessageSquare className="w-4 h-4" />पोस्ट
              </button>
            </div>
            {feedTab === "posts" && (
              <button className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors">
                <PlusCircle className="w-4 h-4" />पोस्ट करें
              </button>
            )}
          </div>

          {feedTab === "news" && (
            <div className="space-y-4">
              {NEWS_FEED.map((n, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{n.tag}</span>
                    <span className="text-gray-400 text-xs">{n.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-base mb-1.5 group-hover:text-orange-700 transition-colors leading-snug">{n.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{n.desc}</p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-orange-600 text-xs transition-colors"><ThumbsUp className="w-3.5 h-3.5" />पसंद</button>
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 text-xs transition-colors"><MessageCircle className="w-3.5 h-3.5" />टिप्पणी</button>
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-600 text-xs transition-colors ml-auto"><Share2 className="w-3.5 h-3.5" />शेयर</button>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <button className="text-orange-600 text-sm font-semibold hover:text-orange-800 inline-flex items-center gap-1">
                  सभी समाचार देखें <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {feedTab === "posts" && (
            <div className="space-y-4">
              {POSTS_FEED.map((p, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {p.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{p.name}</div>
                      <div className="text-gray-400 text-xs">{p.loc} · {p.time}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">{p.text}</p>
                  <div className="flex items-center gap-1 pt-3 border-t border-gray-50">
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-orange-600 text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50"><ThumbsUp className="w-3.5 h-3.5" />{p.likes}</button>
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"><MessageCircle className="w-3.5 h-3.5" />{p.comments}</button>
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-600 text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-green-50 ml-auto"><Share2 className="w-3.5 h-3.5" />शेयर</button>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <button className="text-orange-600 text-sm font-semibold hover:text-orange-800 inline-flex items-center gap-1">
                  सभी पोस्ट देखें <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── PRESS RELEASES ─────────────────────────────────────────────── */}
      <section id="press" className="py-14 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-6">प्रेस विज्ञप्ति</h2>
          <div className="space-y-3">
            {[
              { title: "समाज की वार्षिक महासभा आयोजन की आधिकारिक घोषणा", by: "समाज अध्यक्ष", date: "1 Nov 2026" },
              { title: "समाज के शिक्षा कोष में 5 लाख रुपए की वृद्धि का निर्णय", by: "कार्यकारिणी समिति", date: "25 Oct 2026" },
              { title: "सामूहिक विवाह सम्मेलन — पंजीकरण प्रारंभ", by: "विवाह समिति", date: "20 Oct 2026" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm group-hover:text-teal-700 leading-snug">{p.title}</h4>
                  <div className="text-gray-400 text-xs mt-0.5">{p.by} · {p.date}</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="डाउनलोड"><Download className="w-4 h-4 text-teal-600" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="शेयर"><Share2 className="w-4 h-4 text-teal-600" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                {["हमारे बारे में","कार्यक्रम","समाज समाचार","समाज पोस्ट","प्रेस विज्ञप्ति"].map(l => (
                  <li key={l}><a href="#" className="text-gray-400 text-xs hover:text-orange-400 transition-colors">{l}</a></li>
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
            <span>© {new Date().getFullYear()} पंचाल समाज चौदह चौखरा। सर्वाधिकार सुरक्षित।</span>
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

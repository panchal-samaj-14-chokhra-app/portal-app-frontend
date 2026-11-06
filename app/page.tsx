"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Menu, X, ChevronRight, Users, MapPin, Heart, Star, Newspaper,
  MessageSquare, BookOpen, Building2, Stethoscope, Calendar,
  Award, Bell, FileText, Handshake, Vote, Camera, ArrowRight,
  Phone, Mail, Facebook, Twitter, Youtube, Instagram,
  Home, Info, Megaphone, GraduationCap, Database, UserCheck,
  Briefcase, Gift, Flame, TrendingUp, ExternalLink, Download,
  ThumbsUp, MessageCircle, Share2, PlusCircle, ChevronDown,
} from "lucide-react"

// ─── NAV ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "होम", href: "#home", icon: Home },
  { label: "पंचाल समाज परिचय", href: "#about", icon: Info },
  { label: "कार्यक्रम", href: "#events", icon: Calendar },
  { label: "समाचार", href: "#feed", icon: Newspaper },
  { label: "प्रेस विज्ञप्ति", href: "#press", icon: FileText },
]

// ─── STATS ──────────────────────────────────────────────────────────────────

const STATS = [
  { target: 14000, suffix: "+", label: "पंजीकृत परिवार", icon: Users },
  { target: 75000, suffix: "+", label: "समाज के सदस्य", icon: UserCheck },
  { target: 200,   suffix: "+", label: "समाज के गांव",  icon: MapPin },
  { target: 50,    suffix: "+", label: "वार्षिक कार्यक्रम", icon: Calendar },
]

// ─── SERVICES ───────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: GraduationCap, color: "bg-green-100 text-green-700",    title: "शिक्षा पोर्टल",          href: "#education" },
  { icon: Database,      color: "bg-orange-100 text-orange-700",  title: "डिजिटल जनगणना",         href: "/community-hub" },
  { icon: Handshake,     color: "bg-red-100 text-red-700",        title: "वैवाहिक परिचय",         href: "/admin/matrimonial" },
  { icon: Briefcase,     color: "bg-yellow-100 text-yellow-700",  title: "व्यवसाय निर्देशिका",     href: "#business" },
  { icon: Stethoscope,   color: "bg-cyan-100 text-cyan-700",      title: "स्वास्थ्य एवं चिकित्सा", href: "#health" },
  { icon: Vote,          color: "bg-violet-100 text-violet-700",  title: "समाज की योजनाएं",        href: "#schemes" },
  { icon: Calendar,      color: "bg-fuchsia-100 text-fuchsia-700",title: "कार्यक्रम एवं आयोजन",   href: "#events" },
  { icon: Award,         color: "bg-amber-100 text-amber-700",    title: "उपलब्धियां",             href: "#highlights" },
  { icon: FileText,      color: "bg-teal-100 text-teal-700",      title: "प्रेस विज्ञप्ति",        href: "#press" },
  { icon: Gift,          color: "bg-pink-100 text-pink-700",      title: "बधाई एवं शुभकामनाएं",   href: "#greetings" },
  { icon: Heart,         color: "bg-slate-100 text-slate-700",    title: "शोक समाचार",            href: "#condolence" },
  { icon: Camera,        color: "bg-indigo-100 text-indigo-700",  title: "समाज दीर्घा",           href: "#gallery" },
]

// ─── HERO GRID ──────────────────────────────────────────────────────────────

const GRID_TILES = [
  { bg: "from-orange-300 to-orange-500", icon: Users,        label: "सामाजिक सभा" },
  { bg: "from-amber-300 to-amber-500",   icon: Flame,        label: "धार्मिक आयोजन" },
  { bg: "from-rose-300 to-rose-500",     icon: Heart,        label: "सामूहिक विवाह" },
  { bg: "from-purple-300 to-purple-500", icon: Award,        label: "सम्मान समारोह" },
  { bg: "from-blue-300 to-blue-500",     icon: GraduationCap,label: "शिक्षा" },
  { bg: "from-green-300 to-green-500",   icon: Briefcase,    label: "व्यवसाय" },
  { bg: "from-teal-300 to-teal-500",     icon: Stethoscope,  label: "स्वास्थ्य" },
  { bg: "from-indigo-300 to-indigo-500", icon: MapPin,       label: "गांव" },
  { bg: "from-pink-300 to-pink-500",     icon: Gift,         label: "त्योहार" },
  { bg: "from-yellow-300 to-yellow-500", icon: Star,         label: "प्रतिभा" },
  { bg: "from-cyan-300 to-cyan-500",     icon: Camera,       label: "दीर्घा" },
  { bg: "from-fuchsia-300 to-fuchsia-500",icon: Megaphone,   label: "समाचार" },
  { bg: "from-orange-400 to-red-500",    icon: Handshake,    label: "एकता" },
  { bg: "from-lime-300 to-green-500",    icon: TrendingUp,   label: "प्रगति" },
  { bg: "from-sky-300 to-blue-500",      icon: BookOpen,     label: "ज्ञान" },
  { bg: "from-violet-300 to-purple-500", icon: Building2,    label: "संगठन" },
]

// ─── NEWS ───────────────────────────────────────────────────────────────────

const NEWS_FEED = [
  { tag: "घोषणा", date: "5 Nov 2026",  title: "समाज की वार्षिक महासभा का आयोजन बांसवाड़ा में", desc: "समस्त समाजबंधुओं को सूचित किया जाता है कि इस वर्ष की महासभा दिसम्बर माह में आयोजित की जाएगी। सभी की उपस्थिति अपेक्षित है।", img: null },
  { tag: "शिक्षा", date: "3 Nov 2026",  title: "मेधावी छात्रों को छात्रवृत्ति वितरण समारोह", desc: "10वीं एवं 12वीं में उत्कृष्ट प्रदर्शन करने वाले छात्रों को छात्रवृत्ति प्रदान की जाएगी।", img: null },
  { tag: "स्वास्थ्य", date: "1 Nov 2026", title: "निशुल्क स्वास्थ्य शिविर — डूंगरपुर", desc: "समाज के सभी सदस्यों के लिए निशुल्क चिकित्सा परीक्षण एवं दवा वितरण का आयोजन किया गया।", img: null },
  { tag: "आयोजन", date: "28 Oct 2026", title: "सामूहिक विवाह सम्मेलन — पंजीकरण प्रारंभ", desc: "समाज के युवक-युवतियों के लिए सामूहिक विवाह सम्मेलन का आयोजन। पंजीकरण की अंतिम तिथि 30 नवम्बर।", img: null },
]

const POSTS_FEED = [
  { name: "राजेश पंचाल", loc: "बांसवाड़ा", time: "2 घंटे पहले", text: "समाज की एकता ही हमारी सबसे बड़ी ताकत है। आइए, मिलकर समाज को और सशक्त बनाएं। 🙏", likes: 124, comments: 23, avatar: "रा" },
  { name: "सुनीता पंचाल", loc: "उदयपुर",   time: "5 घंटे पहले", text: "बच्चों की शिक्षा के लिए समाज का योगदान सराहनीय है। छात्रवृत्ति योजना से कई छात्र लाभान्वित हो रहे हैं।", likes: 89, comments: 15, avatar: "सु" },
  { name: "महेश पंचाल",  loc: "डूंगरपुर",  time: "1 दिन पहले", text: "आगामी महासभा में सभी समाजबंधुओं से अनुरोध है कि अधिक से अधिक संख्या में उपस्थित हों। यह हम सबके लिए एक महत्वपूर्ण अवसर है।", likes: 201, comments: 45, avatar: "म" },
  { name: "अनीता पंचाल", loc: "प्रतापगढ़", time: "2 दिन पहले", text: "RAS परीक्षा में सफलता पाकर बहुत खुशी हो रही है। समाज के सभी बड़ों का आशीर्वाद और प्रोत्साहन मिला। 🎉", likes: 342, comments: 78, avatar: "अ" },
]

const DUMMY_EVENTS = [
  { date: "15", month: "दिसम्बर", title: "वार्षिक महासभा",         location: "बांसवाड़ा",   time: "सुबह 10 बजे", color: "bg-orange-500" },
  { date: "25", month: "नवम्बर",  title: "प्रतिभा सम्मान समारोह", location: "उदयपुर",    time: "शाम 5 बजे",   color: "bg-purple-500" },
  { date: "10", month: "दिसम्बर", title: "सामूहिक विवाह सम्मेलन", location: "डूंगरपुर",   time: "सुबह 9 बजे",  color: "bg-rose-500" },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(/\.0$/, "") + "K"
  return String(n)
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function CommunityPortal() {
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [scrolled,   setScrolled]    = useState(false)
  const [activeNav,  setActiveNav]   = useState("#home")
  const [showSvc,    setShowSvc]     = useState(false)
  const [feedTab,    setFeedTab]     = useState<"news" | "posts">("news")
  const [counts,     setCounts]      = useState([0, 0, 0, 0])
  const [counted,    setCounted]     = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  // Scroll shadow on navbar
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  // Stats counting animation — left to right, triggered once on viewport entry
  useEffect(() => {
    if (counted) return
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setCounted(true)
      STATS.forEach((stat, i) => {
        const delay   = i * 220          // stagger left→right
        const dur     = 1400
        const steps   = 60
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

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-white ${scrolled ? "shadow-md" : ""}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-15 py-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image src="/images/main-logo.png" alt="लोगो" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-orange-200" />
              <div className="hidden sm:block leading-tight">
                <div className="font-bold text-orange-700 text-sm">पंचाल समाज</div>
                <div className="text-gray-400 text-[11px]">चौदह चौखरा</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
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

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="home" className="pt-[60px] min-h-screen flex flex-col justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-hidden">
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

              {/* Single CTA */}
              <button
                onClick={() => { setShowSvc(v => !v); setTimeout(() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50) }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all text-sm sm:text-base group"
              >
                Explore Digital Panchal Samaj
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSvc ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Right – 4×4 animated grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
              {GRID_TILES.map((tile, i) => (
                <div key={i}
                  className={`bg-gradient-to-br ${tile.bg} rounded-xl sm:rounded-2xl aspect-square flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-200 shadow-sm`}>
                  <tile.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 mb-0.5" />
                  <span className="text-white/80 text-[8px] sm:text-[10px] font-medium text-center leading-tight px-1">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="flex justify-center pb-6 animate-bounce">
          <ChevronDown className="w-6 h-6 text-orange-400" />
        </div>
      </section>

      {/* ── STATS (animated counters, left → right) ──────────────────────── */}
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

      {/* ── EXPLORE SERVICES (expandable on CTA click) ───────────────────── */}
      <div id="services"
        className={`overflow-hidden transition-all duration-500 bg-gray-50 border-b border-gray-100 ${showSvc ? "max-h-[1000px] py-10" : "max-h-0 py-0"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-700 mb-6 text-center">समाज की डिजिटल सेवाएं</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {SERVICES.map((svc) => (
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

      {/* ── SOCIAL FEED (News / Posts toggle) ───────────────────────────── */}
      <section id="feed" className="py-10 sm:py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">

          {/* Toggle */}
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

          {/* News feed */}
          {feedTab === "news" && (
            <div className="space-y-4">
              {NEWS_FEED.map((n, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-100 text-orange-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{n.tag}</span>
                      <span className="text-gray-400 text-xs">{n.date}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-base mb-1.5 group-hover:text-orange-700 transition-colors leading-snug">{n.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{n.desc}</p>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
                      <button className="flex items-center gap-1.5 text-gray-400 hover:text-orange-600 text-xs transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />पसंद
                      </button>
                      <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 text-xs transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />टिप्पणी
                      </button>
                      <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-600 text-xs transition-colors ml-auto">
                        <Share2 className="w-3.5 h-3.5" />शेयर
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <button className="text-orange-600 text-sm font-semibold hover:text-orange-800 transition-colors inline-flex items-center gap-1">
                  सभी समाचार देखें <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Posts feed */}
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
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-orange-600 text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50">
                      <ThumbsUp className="w-3.5 h-3.5" />{p.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50">
                      <MessageCircle className="w-3.5 h-3.5" />{p.comments}
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-600 text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-green-50 ml-auto">
                      <Share2 className="w-3.5 h-3.5" />शेयर
                    </button>
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

      {/* ── EVENTS ───────────────────────────────────────────────────────── */}
      <section id="events" className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-gray-800">कार्यक्रम एवं आयोजन</h2>
            <a href="#events" className="text-orange-600 text-sm font-semibold hidden sm:flex items-center gap-1 hover:gap-2 transition-all">
              सभी देखें <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {DUMMY_EVENTS.map((e, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`${e.color} px-5 py-5 text-white flex items-center gap-4`}>
                  <div className="text-center min-w-[52px]">
                    <div className="text-4xl font-extrabold leading-none">{e.date}</div>
                    <div className="text-sm font-medium opacity-90">{e.month}</div>
                  </div>
                  <h4 className="font-bold text-base leading-tight">{e.title}</h4>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-xs"><MapPin className="w-3.5 h-3.5 text-orange-500" />{e.location}</div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs"><Bell className="w-3.5 h-3.5 text-orange-500" />{e.time}</div>
                  <button className="mt-1 w-full py-2 border border-orange-200 text-orange-600 text-xs font-semibold rounded-lg hover:bg-orange-50 transition-colors">अधिक जानें</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESS RELEASES ───────────────────────────────────────────────── */}
      <section id="press" className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-6">प्रेस विज्ञप्ति</h2>
          <div className="space-y-3">
            {[
              { title: "समाज की वार्षिक महासभा आयोजन की आधिकारिक घोषणा", by: "समाज अध्यक्ष", date: "1 Nov 2026" },
              { title: "समाज के शिक्षा कोष में 5 लाख रुपए की वृद्धि का निर्णय", by: "कार्यकारिणी समिति", date: "25 Oct 2026" },
              { title: "सामूहिक विवाह सम्मेलन — पंजीकरण प्रारंभ", by: "विवाह समिति", date: "20 Oct 2026" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl border border-teal-100 hover:shadow-sm transition-shadow group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm group-hover:text-teal-700 leading-snug">{p.title}</h4>
                  <div className="text-gray-400 text-xs mt-0.5">{p.by} · {p.date}</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="p-2 hover:bg-teal-100 rounded-lg" title="डाउनलोड"><Download className="w-4 h-4 text-teal-600" /></button>
                  <button className="p-2 hover:bg-teal-100 rounded-lg" title="शेयर"><Share2 className="w-4 h-4 text-teal-600" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-14 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">परिचय</span>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">हमारा समाज, <span className="text-orange-600">हमारी पहचान</span></h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>पंचाल समाज चौदह चौखरा राजस्थान के बांसवाड़ा, डूंगरपुर, प्रतापगढ़ और उदयपुर जिलों में फैला एक सुसंगठित और एकजुट समाज है।</p>
              <p>हमारा समाज सदियों से अपनी सांस्कृतिक विरासत, परंपराओं और मूल्यों को संजोता आया है। समाज का उद्देश्य अपने सभी सदस्यों के शैक्षणिक, सामाजिक, आर्थिक और सांस्कृतिक विकास में योगदान देना है।</p>
            </div>
            <a href="#about" className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 bg-orange-600 text-white font-semibold rounded-xl shadow text-sm hover:bg-orange-700 transition-colors">
              विस्तार से जानें <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: "14 चौखरे", sub: "सुसंगठित क्षेत्र", bg: "bg-orange-100 text-orange-700" },
              { icon: MapPin, label: "4 जिले", sub: "राजस्थान", bg: "bg-blue-100 text-blue-700" },
              { icon: Home, label: "परिवार पंजीकरण", sub: "डिजिटल जनगणना", bg: "bg-green-100 text-green-700" },
              { icon: Star, label: "सांस्कृतिक विरासत", sub: "परंपरा एवं मूल्य", bg: "bg-purple-100 text-purple-700" },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 text-center hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-2xl ${card.bg} flex items-center justify-center mx-auto mb-3`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-gray-800 text-sm">{card.label}</div>
                <div className="text-gray-400 text-xs mt-0.5">{card.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────────── */}
      <section id="gallery" className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-800">समाज दीर्घा</h2>
            <a href="#gallery" className="text-orange-600 text-sm font-semibold hidden sm:flex items-center gap-1">
              सभी देखें <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["from-orange-200 to-orange-400","from-amber-200 to-amber-400","from-rose-200 to-rose-400","from-purple-200 to-purple-400",
              "from-blue-200 to-blue-400","from-green-200 to-green-400","from-teal-200 to-teal-400","from-pink-200 to-pink-400"].map((g, i) => (
              <div key={i} className={`bg-gradient-to-br ${g} rounded-2xl aspect-video flex items-center justify-center group cursor-pointer hover:scale-[1.03] transition-transform relative overflow-hidden`}>
                <Camera className="w-7 h-7 text-white/60" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
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

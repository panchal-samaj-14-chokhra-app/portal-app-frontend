"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Menu, X, ChevronRight, Users, MapPin, Heart, Star, Newspaper,
  MessageSquare, BookOpen, Building2, Stethoscope, Calendar,
  Award, Bell, FileText, Handshake, Vote, Camera, ArrowRight,
  Phone, Mail, Facebook, Twitter, Youtube, Instagram,
  Home, Info, Megaphone, GraduationCap, Database, UserCheck,
  Briefcase, Gift, Flame, TrendingUp, ExternalLink, Download,
  ThumbsUp, MessageCircle, Share2, PlusCircle,
} from "lucide-react"

// ─── NAV ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "होम", href: "#home", icon: Home },
  { label: "पंचाल समाज परिचय", href: "#about", icon: Info },
  { label: "कार्यक्रम एवं आयोजन", href: "#events", icon: Calendar },
  { label: "समाज समाचार", href: "#news", icon: Newspaper },
  { label: "समाज पोस्ट", href: "#posts", icon: MessageSquare },
  { label: "प्रेस विज्ञप्ति", href: "#press", icon: FileText },
]

// ─── STATS ──────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Users, value: "१४,०००+", label: "पंजीकृत परिवार", color: "from-orange-400 to-orange-600" },
  { icon: UserCheck, value: "७५,०००+", label: "समाज के सदस्य", color: "from-amber-400 to-amber-600" },
  { icon: MapPin, value: "२०० +", label: "समाज के गांव", color: "from-rose-400 to-rose-600" },
  { icon: Calendar, value: "५०+", label: "वार्षिक कार्यक्रम", color: "from-purple-400 to-purple-600" },
]

// ─── MODULES ────────────────────────────────────────────────────────────────

const MODULES = [
  {
    id: "news", icon: Newspaper, color: "from-blue-500 to-blue-600",
    title: "समाज समाचार", desc: "नवीनतम सामाजिक समाचार, महत्वपूर्ण सूचनाएं और गांव-स्तरीय अपडेट।",
    href: "#news", cta: "समाचार देखें",
  },
  {
    id: "posts", icon: MessageSquare, color: "from-indigo-500 to-indigo-600",
    title: "समाज पोस्ट", desc: "सदस्यों द्वारा साझा की गई पोस्ट, विचार, चित्र एवं वीडियो।",
    href: "#posts", cta: "पोस्ट देखें",
  },
  {
    id: "condolence", icon: Heart, color: "from-slate-500 to-slate-700",
    title: "शोक समाचार", desc: "दिवंगत समाजजनों की जानकारी और श्रद्धांजलि संदेश।",
    href: "#condolence", cta: "देखें",
  },
  {
    id: "greetings", icon: Gift, color: "from-pink-500 to-rose-500",
    title: "बधाई एवं शुभकामनाएं", desc: "विवाह, जन्मदिन, वर्षगांठ एवं शैक्षणिक उपलब्धियों की बधाई।",
    href: "#greetings", cta: "देखें",
  },
  {
    id: "press", icon: FileText, color: "from-teal-500 to-teal-600",
    title: "प्रेस विज्ञप्ति", desc: "समाज की आधिकारिक घोषणाएं, निर्णय एवं विज्ञप्तियां।",
    href: "#press", cta: "देखें",
  },
  {
    id: "education", icon: GraduationCap, color: "from-green-500 to-emerald-600",
    title: "शिक्षा पोर्टल", desc: "छात्रवृत्ति, परीक्षा सूचनाएं, करियर मार्गदर्शन और छात्र उपलब्धियां।",
    href: "#education", cta: "शिक्षा पोर्टल",
  },
  {
    id: "census", icon: Database, color: "from-orange-500 to-orange-600",
    title: "डिजिटल जनगणना", desc: "परिवार पंजीकरण, सदस्य जानकारी और गांव-वार समाज डेटा।",
    href: "/community-hub", cta: "जनगणना पोर्टल",
  },
  {
    id: "matrimonial", icon: Handshake, color: "from-red-500 to-rose-600",
    title: "वैवाहिक परिचय", desc: "समाज के युवक-युवतियों का वैवाहिक परिचय और पंजीकरण।",
    href: "/admin/matrimonial", cta: "प्रोफाइल देखें",
  },
  {
    id: "business", icon: Briefcase, color: "from-yellow-500 to-amber-600",
    title: "व्यवसाय निर्देशिका", desc: "समाज के व्यापारियों, उद्यमियों और पेशेवरों की निर्देशिका।",
    href: "#business", cta: "निर्देशिका देखें",
  },
  {
    id: "health", icon: Stethoscope, color: "from-cyan-500 to-cyan-600",
    title: "स्वास्थ्य एवं चिकित्सा", desc: "स्वास्थ्य शिविर, चिकित्सक निर्देशिका और रक्तदान सहायता।",
    href: "#health", cta: "देखें",
  },
  {
    id: "schemes", icon: Vote, color: "from-violet-500 to-purple-600",
    title: "समाज की योजनाएं", desc: "सामाजिक योजनाओं की सूची, पात्रता मानदंड और आवेदन प्रक्रिया।",
    href: "#schemes", cta: "योजनाएं देखें",
  },
  {
    id: "events", icon: Calendar, color: "from-fuchsia-500 to-pink-600",
    title: "कार्यक्रम एवं आयोजन", desc: "आगामी और पूर्व कार्यक्रम, कार्यक्रम दीर्घा और पंजीकरण।",
    href: "#events", cta: "कार्यक्रम देखें",
  },
]

// ─── HERO IMAGE GRID tiles ──────────────────────────────────────────────────

const GRID_TILES = [
  { bg: "from-orange-300 to-orange-500", icon: Users, label: "सामाजिक सभा" },
  { bg: "from-amber-300 to-amber-500", icon: Flame, label: "धार्मिक आयोजन" },
  { bg: "from-rose-300 to-rose-500", icon: Heart, label: "सामूहिक विवाह" },
  { bg: "from-purple-300 to-purple-500", icon: Award, label: "सम्मान समारोह" },
  { bg: "from-blue-300 to-blue-500", icon: GraduationCap, label: "शिक्षा" },
  { bg: "from-green-300 to-green-500", icon: Briefcase, label: "व्यवसाय" },
  { bg: "from-teal-300 to-teal-500", icon: Stethoscope, label: "स्वास्थ्य" },
  { bg: "from-indigo-300 to-indigo-500", icon: MapPin, label: "गांव" },
  { bg: "from-pink-300 to-pink-500", icon: Gift, label: "त्योहार" },
  { bg: "from-yellow-300 to-yellow-500", icon: Star, label: "प्रतिभा" },
  { bg: "from-cyan-300 to-cyan-500", icon: Camera, label: "दीर्घा" },
  { bg: "from-fuchsia-300 to-fuchsia-500", icon: Megaphone, label: "समाचार" },
  { bg: "from-orange-400 to-red-500", icon: Handshake, label: "एकता" },
  { bg: "from-lime-300 to-green-500", icon: TrendingUp, label: "प्रगति" },
  { bg: "from-sky-300 to-blue-500", icon: BookOpen, label: "ज्ञान" },
  { bg: "from-violet-300 to-purple-500", icon: Building2, label: "संगठन" },
]

// ─── HIGHLIGHTS ─────────────────────────────────────────────────────────────

const HIGHLIGHTS = [
  { icon: GraduationCap, color: "bg-green-100 text-green-700", cat: "शैक्षणिक उपलब्धि", name: "कु. अनीता पंचाल", detail: "राजस्थान लोक सेवा आयोग में चयन, बांसवाड़ा" },
  { icon: Briefcase, color: "bg-blue-100 text-blue-700", cat: "सरकारी सेवा", name: "श्री राजेश पंचाल", detail: "भारतीय प्रशासनिक सेवा में चयन, उदयपुर" },
  { icon: Award, color: "bg-orange-100 text-orange-700", cat: "सामाजिक योगदान", name: "श्री महेश पंचाल", detail: "समाज सेवा पुरस्कार २०२४ से सम्मानित" },
  { icon: TrendingUp, color: "bg-purple-100 text-purple-700", cat: "व्यवसाय", name: "श्री सुरेश पंचाल", detail: "राष्ट्रीय स्तर पर सर्वश्रेष्ठ उद्यमी पुरस्कार" },
]

// ─── GALLERY categories ──────────────────────────────────────────────────────

const GALLERY_CATS = ["सामाजिक कार्यक्रम", "धार्मिक आयोजन", "सामूहिक विवाह", "प्रतिभा सम्मान", "समाज बैठक", "सांस्कृतिक"]

const GALLERY_COLORS = [
  "from-orange-300 to-orange-500", "from-amber-300 to-amber-500", "from-rose-300 to-rose-500",
  "from-purple-300 to-purple-500", "from-blue-300 to-blue-500", "from-teal-300 to-teal-500",
  "from-green-300 to-green-500", "from-pink-300 to-pink-500",
]

// ─── DUMMY NEWS ──────────────────────────────────────────────────────────────

const DUMMY_NEWS = [
  { tag: "घोषणा", date: "०५ नवम्बर २०२६", title: "समाज की वार्षिक महासभा का आयोजन बांसवाड़ा में होगा", desc: "समस्त समाजबंधुओं को सूचित किया जाता है कि इस वर्ष की महासभा दिसम्बर माह में आयोजित की जाएगी।" },
  { tag: "शिक्षा", date: "०३ नवम्बर २०२६", title: "समाज के मेधावी छात्रों को छात्रवृत्ति वितरण समारोह", desc: "१०वीं एवं १२वीं में उत्कृष्ट प्रदर्शन करने वाले छात्रों को छात्रवृत्ति प्रदान की जाएगी।" },
  { tag: "स्वास्थ्य", date: "०१ नवम्बर २०२६", title: "निशुल्क स्वास्थ्य शिविर का आयोजन डूंगरपुर में", desc: "समाज के सभी सदस्यों के लिए निशुल्क चिकित्सा परीक्षण एवं दवा वितरण का आयोजन।" },
]

const DUMMY_EVENTS = [
  { date: "१५", month: "दिसम्बर", title: "वार्षिक महासभा", location: "बांसवाड़ा", time: "सुबह १० बजे", color: "bg-orange-500" },
  { date: "२५", month: "नवम्बर", title: "प्रतिभा सम्मान समारोह", location: "उदयपुर", time: "शाम ५ बजे", color: "bg-purple-500" },
  { date: "१०", month: "दिसम्बर", title: "सामूहिक विवाह सम्मेलन", location: "डूंगरपुर", time: "सुबह ९ बजे", color: "bg-rose-500" },
]

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function CommunityPortal() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeNav, setActiveNav] = useState("#home")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Noto Sans Devanagari', 'Hind', sans-serif" }}>

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image src="/images/main-logo.png" alt="लोगो" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-orange-200" />
              <div className="hidden sm:block">
                <div className="font-bold text-orange-700 text-sm leading-tight">पंचाल समाज</div>
                <div className="text-gray-500 text-xs leading-tight">चौदह चौखरा</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href}
                  onClick={() => setActiveNav(item.href)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeNav === item.href ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:text-orange-700 hover:bg-orange-50"}`}>
                  {item.label}
                </a>
              ))}
              <Link href="/login"
                className="ml-2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg shadow hover:shadow-md hover:from-orange-600 hover:to-orange-700 transition-all">
                कार्यकारिणी लॉगिन
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-orange-50">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t bg-white px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href}
                onClick={() => { setActiveNav(item.href); setMenuOpen(false) }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                <item.icon className="w-4 h-4 text-orange-500" />
                {item.label}
              </a>
            ))}
            <Link href="/login" onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg">
              <UserCheck className="w-4 h-4" />कार्यकारिणी लॉगिन
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="home" className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-4 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                डिजिटल सामाजिक मंच
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                पंचाल समाज<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">
                  चौदह चौखरा
                </span>
              </h1>

              <p className="text-orange-600 font-semibold text-sm sm:text-base">
                बांसवाड़ा – डूंगरपुर – प्रतापगढ़ – उदयपुर, राजस्थान
              </p>

              <p className="text-2xl sm:text-3xl font-bold text-gray-700 italic border-l-4 border-orange-400 pl-4">
                "एक समाज, एक पहचान, एक डिजिटल मंच।"
              </p>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg">
                पंचाल समाज के सभी परिवारों और सदस्यों को एक डिजिटल मंच पर जोड़ने का प्रयास। समाज की गतिविधियों,
                समाचारों, उपलब्धियों, शिक्षा, रोजगार और सामाजिक सहयोग की जानकारी अब एक ही स्थान पर।
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href="#about"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all text-sm sm:text-base">
                  समाज से जुड़ें <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#about"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 border-2 border-orange-300 text-orange-700 font-semibold rounded-xl hover:bg-orange-50 transition-all text-sm sm:text-base">
                  समाज के बारे में जानें
                </a>
              </div>

              <div className="flex items-center gap-6 pt-2">
                {[{ v: "१४,०००+", l: "परिवार" }, { v: "७५,०००+", l: "सदस्य" }, { v: "२००+", l: "गांव" }].map((s) => (
                  <div key={s.l} className="text-center">
                    <div className="text-xl font-extrabold text-orange-600">{s.v}</div>
                    <div className="text-xs text-gray-500">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – 4×4 image grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {GRID_TILES.map((tile, i) => (
                <div
                  key={i}
                  className={`relative bg-gradient-to-br ${tile.bg} rounded-xl sm:rounded-2xl aspect-square flex flex-col items-center justify-center overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-105`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <tile.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white/90 mb-1" />
                  <span className="text-white/80 text-[8px] sm:text-[10px] font-medium text-center leading-tight px-1">{tile.label}</span>
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl sm:rounded-2xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-10 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className={`w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</div>
                <div className="text-orange-100 text-xs sm:text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">हमारी सेवाएं</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">समाज की डिजिटल सेवाएं</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">समाज के सभी महत्वपूर्ण विभागों तक एक ही स्थान से पहुंचें।</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {MODULES.map((m) => (
              <Link key={m.id} href={m.href}
                className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all flex flex-col gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shadow`}>
                  <m.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-base mb-1.5">{m.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold group-hover:gap-2 transition-all">
                  {m.cta} <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS SECTION ─────────────────────────────────────────────────── */}
      <section id="news" className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">ताज़ा समाचार</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">समाज समाचार</h2>
            </div>
            <a href="#news" className="hidden sm:flex items-center gap-1 text-orange-600 text-sm font-semibold hover:gap-2 transition-all">
              सभी समाचार <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {DUMMY_NEWS.map((n, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer">
                <div className="h-36 bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
                  <Newspaper className="w-12 h-12 text-orange-400" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded">{n.tag}</span>
                    <span className="text-gray-400 text-xs">{n.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-orange-700 transition-colors">{n.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="#news" className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-orange-300 text-orange-700 font-semibold rounded-xl hover:bg-orange-50 transition-colors text-sm">
              सभी समाचार देखें <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── POSTS SECTION ────────────────────────────────────────────────── */}
      <section id="posts" className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">सदस्यों के विचार</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">समाज पोस्ट</h2>
            </div>
            <a href="#posts" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg">
              <PlusCircle className="w-4 h-4" /> पोस्ट करें
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "राजेश पंचाल", loc: "बांसवाड़ा", time: "२ घंटे पहले", text: "समाज की एकता ही हमारी सबसे बड़ी ताकत है। आइए, मिलकर समाज को और सशक्त बनाएं।", likes: "१२४", comments: "२३" },
              { name: "सुनीता पंचाल", loc: "उदयपुर", time: "५ घंटे पहले", text: "बच्चों की शिक्षा के लिए समाज का योगदान सराहनीय है। छात्रवृत्ति योजना से कई छात्र लाभान्वित हो रहे हैं।", likes: "८९", comments: "१५" },
              { name: "महेश पंचाल", loc: "डूंगरपुर", time: "१ दिन पहले", text: "आगामी महासभा में सभी समाजबंधुओं से अनुरोध है कि अधिक से अधिक संख्या में उपस्थित हों।", likes: "२०१", comments: "४५" },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    {p.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{p.name}</div>
                    <div className="text-gray-400 text-xs">{p.loc} · {p.time}</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{p.text}</p>
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-orange-600 text-xs transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />{p.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-xs transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />{p.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 text-xs transition-colors ml-auto">
                    <Share2 className="w-3.5 h-3.5" />शेयर
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONDOLENCE & GREETINGS row ──────────────────────────────────────── */}
      <section id="condolence" className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Condolence */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">श्रद्धांजलि</span>
                <h2 className="text-xl font-extrabold text-gray-800">शोक समाचार</h2>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { name: "स्व. रामलाल पंचाल", detail: "ग्राम — गणेशपुरा, बांसवाड़ा", date: "०४ नवम्बर २०२६" },
                { name: "स्व. कमला देवी पंचाल", detail: "ग्राम — तलवाड़ा, डूंगरपुर", date: "०२ नवम्बर २०२६" },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-700 text-sm">{c.name}</div>
                    <div className="text-slate-500 text-xs">{c.detail}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{c.date}</div>
                  </div>
                </div>
              ))}
              <a href="#condolence" className="flex items-center gap-1 text-slate-600 text-xs font-medium mt-2 hover:text-slate-800">
                सभी शोक समाचार देखें <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Greetings */}
          <div id="greetings">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                <Gift className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">उत्सव एवं अवसर</span>
                <h2 className="text-xl font-extrabold text-gray-800">बधाई एवं शुभकामनाएं</h2>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { type: "🎊 विवाह", name: "अनीता पंचाल × विकास पंचाल", detail: "ग्राम — कलोड़ा, बांसवाड़ा", date: "०५ नवम्बर २०२६" },
                { type: "🎓 शैक्षणिक", name: "कु. सपना पंचाल", detail: "RAS परीक्षा में सफलता", date: "०३ नवम्बर २०२६" },
                { type: "🎂 जन्मदिन", name: "श्री धर्मेन्द्र पंचाल", detail: "ग्राम — रतनपुरा, उदयपुर", date: "०५ नवम्बर २०२६" },
              ].map((g, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <div className="text-xl shrink-0 mt-0.5">{g.type.split(" ")[0]}</div>
                  <div>
                    <div className="text-xs text-pink-600 font-semibold">{g.type.slice(2)}</div>
                    <div className="font-bold text-gray-800 text-sm">{g.name}</div>
                    <div className="text-gray-500 text-xs">{g.detail} · {g.date}</div>
                  </div>
                </div>
              ))}
              <a href="#greetings" className="flex items-center gap-1 text-pink-600 text-xs font-medium mt-2 hover:text-pink-800">
                सभी शुभकामनाएं देखें <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENTS ───────────────────────────────────────────────────────── */}
      <section id="events" className="py-16 sm:py-20 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-fuchsia-100 text-fuchsia-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">आगामी</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">कार्यक्रम एवं आयोजन</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {DUMMY_EVENTS.map((e, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`${e.color} px-5 py-6 text-white flex items-center gap-4`}>
                  <div className="text-center">
                    <div className="text-4xl font-extrabold leading-none">{e.date}</div>
                    <div className="text-sm font-medium opacity-90">{e.month}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight">{e.title}</h4>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />{e.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Bell className="w-3.5 h-3.5 text-orange-500" />{e.time}
                  </div>
                  <button className="mt-2 w-full py-2 border border-orange-300 text-orange-700 text-sm font-semibold rounded-lg hover:bg-orange-50 transition-colors">
                    अधिक जानें
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESS RELEASES ───────────────────────────────────────────────── */}
      <section id="press" className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">आधिकारिक</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">प्रेस विज्ञप्ति</h2>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { title: "समाज की वार्षिक महासभा आयोजन की आधिकारिक घोषणा", by: "समाज अध्यक्ष", date: "०१ नवम्बर २०२६" },
              { title: "समाज के शिक्षा कोष में ५ लाख रुपए की वृद्धि का निर्णय", by: "कार्यकारिणी समिति", date: "२५ अक्टूबर २०२६" },
              { title: "सामूहिक विवाह सम्मेलन — पंजीकरण प्रारंभ", by: "विवाह समिति", date: "२० अक्टूबर २०२६" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-teal-50 rounded-xl border border-teal-100 hover:shadow-sm transition-shadow group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-teal-500 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm group-hover:text-teal-700 transition-colors leading-tight">{p.title}</h4>
                  <div className="text-gray-500 text-xs mt-1">{p.by} · {p.date}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="p-2 hover:bg-teal-100 rounded-lg transition-colors" title="डाउनलोड">
                    <Download className="w-4 h-4 text-teal-600" />
                  </button>
                  <button className="p-2 hover:bg-teal-100 rounded-lg transition-colors" title="शेयर">
                    <Share2 className="w-4 h-4 text-teal-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHEMES ──────────────────────────────────────────────────────── */}
      <section id="schemes" className="py-16 sm:py-20 px-4 bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">कल्याण</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">समाज की योजनाएं</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">अपनी फैमिली आईडी और पासवर्ड से लॉगिन करें और उपलब्ध योजनाओं में आवेदन करें।</p>
          </div>

          {/* Family ID login placeholder */}
          <div className="max-w-sm mx-auto bg-white rounded-2xl p-6 shadow border border-violet-100 mb-10">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-6 h-6 text-violet-600" />
              </div>
              <h4 className="font-bold text-gray-800 text-sm">फैमिली आईडी से लॉगिन</h4>
              <p className="text-gray-400 text-xs mt-1">योजनाओं में आवेदन के लिए लॉगिन आवश्यक है</p>
            </div>
            <div className="space-y-3">
              <input disabled placeholder="फैमिली आईडी (जैसे: PS-00123)" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 cursor-not-allowed" />
              <input disabled type="password" placeholder="पासवर्ड" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 cursor-not-allowed" />
              <button disabled className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl text-sm opacity-70 cursor-not-allowed">
                लॉगिन करें (जल्द उपलब्ध)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "शिक्षा सहायता योजना", cat: "शिक्षा", icon: GraduationCap, color: "from-green-400 to-green-600", elig: "१०वीं/१२वीं/स्नातक छात्र", status: "सक्रिय" },
              { title: "विवाह सहायता योजना", cat: "सामाजिक", icon: Handshake, color: "from-pink-400 to-rose-600", elig: "समाज के परिवार", status: "सक्रिय" },
              { title: "चिकित्सा सहायता योजना", cat: "स्वास्थ्य", icon: Stethoscope, color: "from-cyan-400 to-cyan-600", elig: "सभी समाज सदस्य", status: "सक्रिय" },
              { title: "व्यवसाय प्रोत्साहन योजना", cat: "व्यवसाय", icon: Briefcase, color: "from-amber-400 to-amber-600", elig: "नए उद्यमी", status: "शीघ्र" },
              { title: "वृद्धजन सहायता योजना", cat: "कल्याण", icon: Heart, color: "from-rose-400 to-rose-600", elig: "६०+ आयु के सदस्य", status: "सक्रिय" },
              { title: "प्रतिभा पुरस्कार योजना", cat: "शिक्षा", icon: Award, color: "from-orange-400 to-orange-600", elig: "मेधावी छात्र", status: "शीघ्र" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-violet-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.status === "सक्रिय" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {s.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mt-1">{s.title}</h4>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-3">पात्रता: {s.elig}</div>
                <button disabled className="w-full py-2 border border-violet-200 text-violet-600 text-xs font-semibold rounded-lg hover:bg-violet-50 transition-colors cursor-not-allowed opacity-60">
                  आवेदन करें (लॉगिन आवश्यक)
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ───────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">गौरव</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">समाज की गौरवशाली उपलब्धियां</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 hover:shadow-md transition-shadow text-center">
                <div className={`w-12 h-12 rounded-2xl ${h.color} flex items-center justify-center mx-auto mb-4`}>
                  <h.icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-orange-600 mb-1">{h.cat}</div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{h.name}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{h.detail}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="#" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl shadow hover:shadow-md transition-all">
              सभी उपलब्धियां देखें <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-16 sm:py-20 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">परिचय</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 leading-tight mb-4">
                हमारा समाज,<br />
                <span className="text-orange-600">हमारी पहचान</span>
              </h2>
              <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                <p>पंचाल समाज चौदह चौखरा राजस्थान के बांसवाड़ा, डूंगरपुर, प्रतापगढ़ और उदयपुर जिलों में फैला एक सुसंगठित और एकजुट समाज है।</p>
                <p>हमारा समाज सदियों से अपनी सांस्कृतिक विरासत, परंपराओं और मूल्यों को संजोता आया है। चौदह चौखरों के माध्यम से यह समाज एकता के सूत्र में बंधा है।</p>
                <p>समाज का उद्देश्य अपने सभी सदस्यों के शैक्षणिक, सामाजिक, आर्थिक और सांस्कृतिक विकास में योगदान देना है।</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {["समाज की एकता", "चौदह चौखरा", "कार्यकारिणी", "सामाजिक उद्देश्य"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />{item}
                  </div>
                ))}
              </div>
              <a href="#about" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all text-sm">
                समाज के बारे में विस्तार से जानें <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "१४ चौखरे", sub: "सुसंगठित क्षेत्र", bg: "bg-orange-100 text-orange-700" },
                { icon: MapPin, label: "४ जिले", sub: "राजस्थान", bg: "bg-blue-100 text-blue-700" },
                { icon: Home, label: "परिवार पंजीकरण", sub: "डिजिटल जनगणना", bg: "bg-green-100 text-green-700" },
                { icon: Star, label: "सांस्कृतिक विरासत", sub: "परंपरा एवं मूल्य", bg: "bg-purple-100 text-purple-700" },
              ].map((card) => (
                <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow text-center">
                  <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mx-auto mb-3`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-gray-800 text-sm">{card.label}</div>
                  <div className="text-gray-400 text-xs mt-1">{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────────── */}
      <section id="gallery" className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-3">फोटो दीर्घा</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">समाज की दीर्घा</h2>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {GALLERY_CATS.map((cat, i) => (
              <button key={cat} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${i === 0 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700"}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {GALLERY_COLORS.map((color, i) => (
              <div key={i} className={`bg-gradient-to-br ${color} rounded-2xl aspect-video flex items-center justify-center group cursor-pointer hover:scale-[1.03] transition-transform overflow-hidden relative`}>
                <Camera className="w-8 h-8 text-white/60" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a href="#gallery" className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-orange-300 text-orange-700 font-semibold rounded-xl hover:bg-orange-50 transition-colors text-sm">
              <Camera className="w-4 h-4" /> सभी फोटो देखें
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/images/main-logo.png" alt="लोगो" width={44} height={44} className="w-11 h-11 rounded-full border-2 border-orange-500/40" />
                <div>
                  <div className="font-bold text-white text-sm">पंचाल समाज</div>
                  <div className="text-gray-400 text-xs">चौदह चौखरा</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                बांसवाड़ा – डूंगरपुर – प्रतापगढ़ – उदयपुर, राजस्थान
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Youtube, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links 1 */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">समाज पोर्टल</h4>
              <ul className="space-y-2.5">
                {["हमारे बारे में", "कार्यक्रम", "समाज समाचार", "समाज पोस्ट", "प्रेस विज्ञप्ति"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-400 text-xs hover:text-orange-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Links 2 */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">सेवाएं</h4>
              <ul className="space-y-2.5">
                {["शिक्षा पोर्टल", "डिजिटल जनगणना", "वैवाहिक परिचय", "व्यवसाय निर्देशिका", "समाज की योजनाएं", "संपर्क करें"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-400 text-xs hover:text-orange-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white text-sm mb-4">संपर्क करें</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                  बांसवाड़ा, राजस्थान – ३२७००१
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-xs">
                  <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>+९१ XXXXX XXXXX</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-xs">
                  <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>info@panchalsamaj.org</span>
                </li>
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

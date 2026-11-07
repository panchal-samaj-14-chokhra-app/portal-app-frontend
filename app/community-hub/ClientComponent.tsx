"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Menu, X, Home, Newspaper, FileText, BookOpen, Calendar,
  UserCircle, Users, MapPin, MapPinCheck, Contact, FileUser,
  MapPinPlus, Phone, Mail, Facebook, Twitter, Youtube, Instagram,
} from "lucide-react"
import ChokhlaClientComponent from "./ChokhlaCardComponent"
import ReloadButton from "./ReloadClientButtonComponent"
import { ChokhlaSummary } from "@/lib/server-api/getChokhlas"

const NAV_ITEMS = [
  { label: "होम",           href: "/",              icon: Home },
  { label: "समाचार",        href: "/news",          icon: Newspaper },
  { label: "प्रेस विज्ञप्ति", href: "/press-release", icon: FileText },
  { label: "कार्यक्रम",    href: "/events",        icon: Calendar },
  { label: "नियमावली",     href: "/niyamavali",    icon: BookOpen },
]

const STAT_CARDS = (totalVillages: number, totalFamilies: number, totalMembers: number) => [
  { icon: MapPinPlus,  color: "bg-[rgba(139,0,0,0.08)] text-[#8B0000]", border: "border-[rgba(139,0,0,0.15)]", label: "कुल चोखरे",           value: "14" },
  { icon: MapPinCheck, color: "bg-[rgba(217,164,65,0.12)] text-[#92400e]", border: "border-[rgba(217,164,65,0.3)]", label: "कुल गांव",            value: totalVillages },
  { icon: Contact,     color: "bg-[rgba(139,0,0,0.08)] text-[#8B0000]", border: "border-[rgba(139,0,0,0.15)]", label: "कुल परिवार",          value: totalFamilies },
  { icon: FileUser,    color: "bg-[rgba(217,164,65,0.12)] text-[#92400e]", border: "border-[rgba(217,164,65,0.3)]", label: "कुल परिवारों के सदस्य", value: totalMembers },
]

export default function ClientComponent({ chokhlas }: { chokhlas: ChokhlaSummary[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const totalFamilies = chokhlas.reduce((acc, c) => acc + c.familyCount, 0)
  const totalMembers  = chokhlas.reduce((acc, c) => acc + c.memberCount, 0)
  const totalVillages = chokhlas.reduce((acc, c) => acc + c.villageCount, 0)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
        style={{ background: scrolled ? "linear-gradient(90deg,#6b0000,#8B0000,#a30000)" : "linear-gradient(90deg,#8B0000,#a30000,#c2410c)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2.5">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image src="/images/main-logo.png" alt="लोगो" width={38} height={38} className="w-9 h-9 rounded-full border-2 border-white/40 shadow-sm" />
              <div className="leading-tight">
                <div className="font-bold text-white text-sm">पंचाल समाज</div>
                <div className="text-orange-200 text-[11px]">चौदह चौखरा</div>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.map(item => (
                <Link key={item.href} href={item.href}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-orange-100 hover:text-white hover:bg-white/15 transition-all">
                  {item.label}
                </Link>
              ))}
              <Link href="/login" title="कार्यकारिणी लॉगिन"
                className="ml-2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all hover:scale-105 shadow-sm">
                <UserCircle className="w-5 h-5" />
              </Link>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <Link href="/login" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
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
            style={{ background: "linear-gradient(180deg,#8B0000,#6b0000)" }}>
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-orange-100 hover:bg-white/15 hover:text-white">
                <item.icon className="w-4 h-4 text-orange-300" />{item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative pt-[60px] pb-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#FFFAF4 0%,#FFF3E2 60%,#fff7e6 100%)" }}>

        {/* Mandala — top left */}
        <div className="absolute top-0 left-0 w-72 h-72 opacity-[0.07] pointer-events-none -translate-x-1/4 -translate-y-1/4">
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
              </g>
            ))}
          </svg>
        </div>

        {/* Mandala — bottom right */}
        <div className="absolute bottom-0 right-0 w-56 h-56 opacity-[0.05] pointer-events-none translate-x-1/4 translate-y-1/4">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="98" stroke="#F47700" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="70" stroke="#8B0000" strokeWidth="1"/>
            {[0,45,90,135,180,225,270,315].map(a => (
              <g key={a} transform={`rotate(${a} 100 100)`}>
                <ellipse cx="100" cy="30" rx="6" ry="12" fill="#8B0000" opacity="0.5"/>
              </g>
            ))}
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-14 pb-6 relative z-10 text-center">

          {/* Gold divider + tagline */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: "#D9A441" }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D9A441" }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8B0000" }}>
              डिजिटल जनगणना पोर्टल
            </span>
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D9A441" }} />
            <div className="w-8 h-px" style={{ background: "#D9A441" }} />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2" style={{ color: "#8B0000" }}>
            पंचाल समाज
          </h1>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
            style={{ background: "linear-gradient(90deg,#F47700,#D9A441)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            चौदह चौखरा
          </h1>

          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-px" style={{ background: "#D9A441" }} />
            <p className="text-sm font-medium" style={{ color: "#8B0000", opacity: 0.75 }}>
              डिजिटल जनगणना 2025 — हमारी डिजिटल रूप से जुड़ी जनसंख्या की जानकारी
            </p>
            <div className="w-8 h-px" style={{ background: "#D9A441" }} />
          </div>
        </div>

        {/* Om divider */}
        <div className="relative z-10 flex items-center justify-center gap-4 mt-4">
          <div className="flex-1 max-w-[80px] h-px ml-auto" style={{ background: "linear-gradient(to right,transparent,#D9A441)" }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D9A441" }} />
          <span className="text-2xl font-bold select-none" style={{ color: "#8B0000", opacity: 0.5 }}>ॐ</span>
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: "#D9A441" }} />
          <div className="flex-1 max-w-[80px] h-px mr-auto" style={{ background: "linear-gradient(to left,transparent,#D9A441)" }} />
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full" style={{ height: "50px" }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,10 1440,30 L1440,60 L0,60 Z" fill="#8B0000" opacity="0.1"/>
            <path d="M0,45 C360,20 720,55 1080,40 C1260,33 1380,45 1440,45 L1440,60 L0,60 Z" fill="#D9A441" opacity="0.12"/>
          </svg>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section className="py-10 px-4" style={{ background: "linear-gradient(180deg,#fff7ed,#fffbf5)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS(totalVillages, totalFamilies, totalMembers).map((s, i) => (
            <div key={i} className={`bg-white rounded-2xl border p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all ${s.border}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-extrabold mb-1" style={{ color: "#8B0000" }}>{s.value}</div>
              <div className="text-xs font-medium text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHOKHLA GRID ────────────────────────────────────────────────── */}
      <section className="py-12 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">

          {/* Section heading */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg,#8B0000,#F47700)" }} />
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: "#8B0000" }}>चोखरों की सूची</h2>
              <p className="text-xs text-gray-400 mt-0.5">चोखरे पर क्लिक करके विस्तृत जानकारी देखें</p>
            </div>
            <div className="ml-auto">
              <ReloadButton />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ChokhlaClientComponent chokhlas={chokhlas} />
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/images/main-logo.png" alt="लोगो" width={44} height={44} className="w-11 h-11 rounded-full border-2 border-orange-500/30" />
                <div>
                  <div className="font-bold text-white text-sm">पंचाल समाज</div>
                  <div className="text-gray-400 text-xs">चौदह चौखरा</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">बांसवाड़ा – डूंगरपुर – प्रतापगढ़, राजस्थान</p>
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
                  { label: "होमपेज", href: "/" },
                  { label: "समाज समाचार", href: "/news" },
                  { label: "प्रेस विज्ञप्ति", href: "/press-release" },
                  { label: "कार्यक्रम", href: "/events" },
                  { label: "नियमावली", href: "/niyamavali" },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-gray-400 text-xs hover:text-orange-400 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">संपर्क करें</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />बांसवाड़ा, राजस्थान – 327001
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-xs">
                  <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />+91 XXXXX XXXXX
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-xs">
                  <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />info@panchalsamaj.org
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <span>© {new Date().getFullYear()} पंचाल समाज चौदह चौखरा। सर्वाधिकार सुरक्षित।</span>
            <span>Designed by <a href="https://placego.online/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">placego.online</a></span>
          </div>
        </div>
      </footer>
    </div>
  )
}

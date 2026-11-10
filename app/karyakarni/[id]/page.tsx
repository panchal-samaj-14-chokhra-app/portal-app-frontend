"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Phone } from "lucide-react"
import { useSessions, useKaryakarni } from "@/data-hooks/mutation-query/useKaryakarni"
import type { KaryakarniMember, KaryakarniSession } from "@/data-hooks/requests/karyakarni"

// ── Member card ───────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: KaryakarniMember }) {
  const initial = member.name?.trim()?.[0]?.toUpperCase() || "?"
  return (
    <div className="flex flex-col items-center text-center bg-white border border-[#8B0000]/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative mb-3">
        {member.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.imageUrl} alt={member.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            style={{ boxShadow: "0 0 0 3px rgba(139,0,0,0.15)" }} />
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md"
            style={{ background: "linear-gradient(135deg, #ea580c, #8B0000)", boxShadow: "0 0 0 3px rgba(139,0,0,0.15)" }}>
            {initial}
          </div>
        )}
      </div>
      <h3 className="font-bold text-gray-800 text-sm leading-tight">
        {member.name}{member.location ? `, ${member.location}` : ""}
      </h3>
      {(member.designation || member.organization) && (
        <div className="mt-2 px-3 py-1.5 rounded-lg text-xs leading-snug"
          style={{ background: "rgba(139,0,0,0.06)", color: "#8B0000" }}>
          <span className="font-bold">{member.designation}</span>
          {member.organization ? <><br /><span className="font-normal text-gray-600">{member.organization}</span></> : null}
        </div>
      )}
      {member.phone && (
        <a href={`tel:${member.phone}`}
          className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#8B0000] transition-colors">
          <Phone className="w-3 h-3" />{member.phone}
        </a>
      )}
    </div>
  )
}

// ── Session card ──────────────────────────────────────────────────────────────

function SessionCard({ session }: { session: KaryakarniSession }) {
  const { data: members, isLoading } = useKaryakarni(session.type, session.id)

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-7 rounded-full shrink-0" style={{ background: "#D9A441" }} />
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-bold text-[#8B0000]">{session.name}</h3>
          {session.isActive && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
              सक्रिय सत्र
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-8 text-gray-400 text-sm">
          <div className="w-5 h-5 rounded-full border-2 border-[#8B0000] border-t-transparent animate-spin" />
          लोड हो रहा है...
        </div>
      ) : !members?.length ? (
        <p className="text-gray-400 text-sm py-6 text-center">इस सत्र में अभी कोई सदस्य नहीं है।</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {members.map(m => <MemberCard key={m.id} member={m} />)}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChokhraKaryakarniPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { data: sessions, isLoading } = useSessions("chokhara")

  // Filter sessions belonging to this chokhla
  const chokhaSessions = (sessions ?? []).filter(s => s.chokhlaId === id)
  const chokhlaName = chokhaSessions[0]?.chokhlaName || null

  return (
    <div className="min-h-screen" style={{ background: "#FDF8F0" }}>
      {/* Header */}
      <header style={{ background: "#8B0000" }} className="shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/karyakarni" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Image src="/images/main-logo.png" alt="Logo" width={40} height={40}
              className="w-10 h-10 rounded-full border-2 border-white/30 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-white font-bold text-base sm:text-lg leading-none">
                {chokhlaName || "चोखरा कार्यकारिणी"}
              </h1>
              <p className="text-white/80 text-xs font-medium">चोखरा कार्यकारिणी</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 rounded-full" style={{ background: "#D9A441" }} />
            <span className="text-xs font-bold tracking-widest uppercase text-[#D9A441]">समिति</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#8B0000]">कार्यकारिणी</h2>
          {chokhlaName && (
            <p className="text-gray-500 text-sm mt-1">{chokhlaName} चोखरा कार्यकारिणी समिति के सदस्य</p>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="w-6 h-6 rounded-full border-2 border-[#8B0000] border-t-transparent animate-spin mr-2" />
            लोड हो रहा है...
          </div>
        ) : !chokhaSessions.length ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            इस चोखरे की कार्यकारिणी अभी उपलब्ध नहीं है।
          </div>
        ) : (
          // Sort: active session first
          [...chokhaSessions]
            .sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0))
            .map(s => <SessionCard key={s.id} session={s} />)
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center border-t border-[#8B0000]/10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Image src="/images/main-logo.png" alt="Logo" width={24} height={24} className="w-6 h-6 rounded-full" />
          <span className="text-xs font-semibold text-[#8B0000]">पंचाल समाज · चौदह चोखरा</span>
        </div>
        <p className="text-xs text-gray-400">© 2025 · सभी अधिकार सुरक्षित</p>
      </footer>
    </div>
  )
}

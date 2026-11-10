"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Phone } from "lucide-react"
import { useKaryakarni } from "@/data-hooks/mutation-query/useKaryakarni"
import type { KaryakarniMember } from "@/data-hooks/requests/karyakarni"

const SECTIONS = [
  { id: "choudah_chokhara", label: "चौदह चोखरा कार्यकारिणी" },
  { id: "chokhara",         label: "चोखरा कार्यकारिणी" },
]

function MemberCard({ member }: { member: KaryakarniMember }) {
  const initial = member.name?.trim()?.[0]?.toUpperCase() || "?"

  return (
    <div className="flex flex-col items-center text-center bg-white border border-[#8B0000]/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Avatar */}
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

      {/* Name + location */}
      <h3 className="font-bold text-gray-800 text-sm leading-tight">
        {member.name}{member.location ? `, ${member.location}` : ""}
      </h3>

      {/* Designation + org */}
      {(member.designation || member.organization) && (
        <div className="mt-2 px-3 py-1.5 rounded-lg text-xs leading-snug"
          style={{ background: "rgba(139,0,0,0.06)", color: "#8B0000" }}>
          <span className="font-bold">{member.designation}</span>
          {member.organization ? (
            <><br /><span className="font-normal text-gray-600">{member.organization}</span></>
          ) : null}
        </div>
      )}

      {/* Phone */}
      {member.phone && (
        <a href={`tel:${member.phone}`}
          className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#8B0000] transition-colors">
          <Phone className="w-3 h-3" />
          {member.phone}
        </a>
      )}
    </div>
  )
}

function SectionView({ type }: { type: string }) {
  const { data: members, isLoading } = useKaryakarni(type)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <div className="w-6 h-6 rounded-full border-2 border-[#8B0000] border-t-transparent animate-spin mr-2" />
        लोड हो रहा है...
      </div>
    )
  }

  if (!members?.length) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        अभी कोई सदस्य उपलब्ध नहीं है।
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {members.map(m => <MemberCard key={m.id} member={m} />)}
    </div>
  )
}

export default function KaryakarniPage() {
  const [active, setActive] = useState("choudah_chokhara")

  return (
    <div className="min-h-screen" style={{ background: "#FDF8F0" }}>
      {/* Header */}
      <header style={{ background: "#8B0000" }} className="shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Image src="/images/main-logo.png" alt="Logo" width={40} height={40}
              className="w-10 h-10 rounded-full border-2 border-white/30 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-white font-bold text-base sm:text-lg leading-none">पंचाल समाज</h1>
              <p className="text-white/80 text-xs font-medium">चौदह चोखरा</p>
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
          <p className="text-gray-500 text-sm mt-1">पंचाल समाज चौदह चोखरा की कार्यकारिणी समिति के सदस्य</p>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 bg-white border border-[#8B0000]/10 rounded-xl p-1 mb-8 shadow-sm">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={active === s.id
                ? { background: "#8B0000", color: "#fff" }
                : { color: "#6b7280" }}>
              {s.label}
            </button>
          ))}
        </div>

        <SectionView key={active} type={active} />
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

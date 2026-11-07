"use client"

import { useRouter } from "next/navigation"
import { MapPin, Users, Home, ChevronRight } from "lucide-react"

interface Chokhla {
  chokhlaName: string
  state: string
  district: string
  villageCount: number
  familyCount: number
  memberCount: number
  ChokhraID: string
}

export default function ChokhlaClientComponent({ chokhlas }: { chokhlas: Chokhla[] }) {
  const router = useRouter()

  return (
    <>
      {[...chokhlas]
        .sort((a, b) => b.memberCount - a.memberCount)
        .map((c, idx) => (
          <div
            key={c.ChokhraID || idx}
            role="button"
            tabIndex={0}
            aria-label={`${c.chokhlaName} की जानकारी`}
            onClick={() => router.push(`/community-hub/${c.chokhlaName}/${c.ChokhraID}`)}
            onKeyDown={e => e.key === "Enter" && router.push(`/community-hub/${c.chokhlaName}/${c.ChokhraID}`)}
            className="group relative bg-white rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
            style={{ borderColor: idx % 2 === 0 ? "rgba(139,0,0,0.15)" : "rgba(217,164,65,0.3)" }}
          >
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{ background: idx % 2 === 0 ? "linear-gradient(180deg,#8B0000,#F47700)" : "linear-gradient(180deg,#D9A441,#F47700)" }} />

            <div className="pl-5 pr-4 py-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-base leading-snug mb-0.5" style={{ color: "#8B0000" }}>
                  {c.chokhlaName}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                  <span>{c.district}, {c.state}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,0,0,0.08)" }}>
                      <MapPin className="w-3 h-3" style={{ color: "#8B0000" }} />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 leading-none">गांव</div>
                      <div className="text-sm font-bold" style={{ color: "#8B0000" }}>{c.villageCount}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(217,164,65,0.12)" }}>
                      <Home className="w-3 h-3 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 leading-none">परिवार</div>
                      <div className="text-sm font-bold text-amber-700">{c.familyCount}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(244,119,0,0.1)" }}>
                      <Users className="w-3 h-3 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 leading-none">सदस्य</div>
                      <div className="text-sm font-bold text-orange-600">{c.memberCount}</div>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors mt-1 shrink-0" />
            </div>
          </div>
        ))}
    </>
  )
}

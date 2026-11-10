'use client'

import Image from "next/image"
import Link from "next/link"
import { Users, MapPin, Home, Building2, ArrowLeft, GraduationCap, HeartPulse } from "lucide-react"
import { VillageDetails } from '@/lib/server-api/getVillageDetails'

type Props = {
    villageData: VillageDetails[]
    chokhlaName: string
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
    return (
        <div className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-[#8B0000]/10 shadow-sm px-6 py-5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#8B0000]">{value.toLocaleString('hi-IN')}</span>
            <span className="text-xs font-semibold text-gray-500 text-center leading-tight">{label}</span>
        </div>
    )
}

function VillageCard({ village, index }: { village: VillageDetails, index: number }) {
    const facilities = [
        { label: "स्कूल", value: village.isVillageHaveSchool, icon: GraduationCap },
        { label: "स्वास्थ्य केंद्र", value: village.isVillageHavePrimaryHealthCare, icon: HeartPulse },
        { label: "सामुदायिक भवन", value: village.isVillageHaveCommunityHall, icon: Building2 },
    ]

    return (
        <div className="bg-white rounded-2xl border border-[#8B0000]/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5">
            {/* Village name + location */}
            <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 rounded-full bg-[#8B0000] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {index + 1}
                        </span>
                        <h3 className="text-base font-bold text-[#8B0000] leading-tight">{village.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 ml-8">
                        <MapPin className="w-3 h-3 text-[#D9A441] shrink-0" />
                        <span className="text-xs text-gray-500">{village.tehsil}, {village.district}, {village.state}</span>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-[#FDF8F0] rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-[#8B0000]">{village.familyCount}</div>
                    <div className="text-[10px] text-gray-500 font-medium">परिवार</div>
                </div>
                <div className="flex-1 bg-[#FDF8F0] rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-[#8B0000]">{village.personCount}</div>
                    <div className="text-[10px] text-gray-500 font-medium">सदस्य</div>
                </div>
            </div>

            {/* Facilities */}
            <div className="flex gap-2 flex-wrap">
                {facilities.map(({ label, value, icon: FacIcon }) => (
                    <span key={label}
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                            value
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-400 border-gray-200"
                        }`}>
                        <FacIcon className="w-3 h-3" />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default function ClientComponent({ villageData, chokhlaName }: Props) {
    const totalFamilies = villageData?.reduce((acc, v) => acc + v.familyCount, 0) ?? 0
    const totalMembers = villageData?.reduce((acc, v) => acc + v.personCount, 0) ?? 0
    const totalVillages = villageData?.length ?? 0
    const sorted = [...(villageData ?? [])].sort((a, b) => b.personCount - a.personCount)

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
                            <h1 className="text-white font-bold text-base sm:text-lg leading-none">
                                पंचाल समाज
                            </h1>
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
                        <span className="text-xs font-bold tracking-widest uppercase text-[#D9A441]">चोखरा विवरण</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#8B0000] leading-tight">
                        {chokhlaName} चोखरा
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {totalVillages} गांव · डिजिटल जनगणना 2025 के आंकड़े
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                    <StatCard icon={MapPin}  label="कुल गांव"    value={totalVillages} color="bg-[#8B0000]" />
                    <StatCard icon={Home}    label="कुल परिवार"  value={totalFamilies} color="bg-[#D9A441]" />
                    <StatCard icon={Users}   label="कुल सदस्य"   value={totalMembers}  color="bg-[#8B0000]" />
                </div>

                {/* Village list */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-[#8B0000] text-base">गांवों की सूची</h3>
                    <span className="text-xs text-gray-400">सदस्य संख्या के अनुसार</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sorted.map((village, i) => (
                        <VillageCard key={i} village={village} index={i} />
                    ))}
                </div>
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

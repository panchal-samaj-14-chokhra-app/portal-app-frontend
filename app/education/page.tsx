"use client"

import { GraduationCap, BookOpen, Laptop, Trophy, Users, BriefcaseBusiness, ChevronRight, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import PageHeader from "@/components/ui/PageHeader"

const PLATFORM_FEATURES = [
  {
    icon: Laptop,
    title: "ऑनलाइन लर्निंग",
    desc: "कक्षा 5 से कॉलेज तक के सभी विषयों के कोर्स — कहीं भी, कभी भी पढ़ें।",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: GraduationCap,
    title: "कॉम्पिटिशन टेस्ट सीरीज",
    desc: "SSC, IBPS, Railway जैसी सरकारी परीक्षाओं के लिए प्रैक्टिस टेस्ट और मॉक।",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: BookOpen,
    title: "स्किल कोर्सेज",
    desc: "Tally, Computer, Digital Marketing जैसे प्रोफेशनल स्किल कोर्स।",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Users,
    title: "एलुमनाई ग्रुप",
    desc: "कॉलेज और जॉब करने वालों का नेटवर्क — जॉब सपोर्ट और मेंटरशिप के लिए।",
    color: "bg-orange-100 text-orange-600",
  },
]

const COMING_SOON = [
  {
    icon: BriefcaseBusiness,
    title: "Panchal Pragati Student Loan",
    desc: "पढ़ाई के लिए आसान लोन — पंचाल समाज की ओर से।",
    badge: "Coming Soon",
  },
  {
    icon: Trophy,
    title: "Panchal Pragati Scholarship Yojna",
    desc: "मेधावी छात्रों को छात्रवृत्ति — आपकी मेहनत का इनाम।",
    badge: "Coming Soon",
  },
]

const PORTAL_URL = "https://panchalpragati.panchalsamaj.online"

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/40 to-white">
      <PageHeader
        title="शिक्षा पोर्टल"
        subtitle="Education Portal"
        icon={GraduationCap}
        backHref="/"
      />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* Hero Section */}
        <div className="rounded-2xl bg-gradient-to-br from-[#6633CC] to-[#9933FF] p-8 sm:p-12 text-white text-center shadow-lg">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Pragati"
                width={72}
                height={72}
                className="object-contain rounded-xl"
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            पंचाल समाज की एक पहल
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Panchal Pragati
          </h1>
          <p className="mt-3 text-purple-100 text-sm sm:text-base max-w-xl mx-auto">
            पंचाल समाज के युवाओं को शिक्षा और कौशल में आगे बढ़ाने की पहल।
            ऑनलाइन लर्निंग, कॉम्पिटिशन प्रेप और स्किल डेवलपमेंट — सब एक जगह।
          </p>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`${PORTAL_URL}/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#6633CC] font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm"
            >
              <LogIn className="w-4 h-4" />
              Login करें
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href={`${PORTAL_URL}/register`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/40 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/25 transition-colors text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Register करें
            </Link>
          </div>
        </div>

        {/* Platform Features */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">क्या मिलेगा Panchal Pragati पर?</h2>
          <p className="text-sm text-gray-500 mb-5">समाज के युवाओं के लिए बनाया गया एक पूर्ण शिक्षा मंच</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {PLATFORM_FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{f.title}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Yojnas */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">जल्द आ रही योजनाएं</h2>
          <p className="text-sm text-gray-500 mb-5">पंचाल समाज की आने वाली कल्याण योजनाएं</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {COMING_SOON.map((item) => (
              <div
                key={item.title}
                className="relative flex items-start gap-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-orange-200 shadow-sm overflow-hidden"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="pr-16">
                  <div className="font-semibold text-gray-800 text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl bg-white border border-purple-100 p-7 text-center shadow-sm">
          <p className="text-sm text-gray-600 font-medium">
            अभी Panchal Pragati से जुड़ें और अपनी शिक्षा की नई शुरुआत करें
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`${PORTAL_URL}/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#6633CC] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#5522BB] transition-colors text-sm"
            >
              <LogIn className="w-4 h-4" />
              Login करें
            </Link>
            <Link
              href={`${PORTAL_URL}/register`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#6633CC] text-[#6633CC] font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Register करें
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            panchalpragati.panchalsamaj.online
          </p>
        </div>

      </main>
    </div>
  )
}

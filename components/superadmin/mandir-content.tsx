"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ArrowLeft } from "lucide-react"
import { MANDIR_SECTIONS, SECTION_CATEGORIES, type SectionDef } from "@/lib/mandir-sections"
import ContentSectionEditor from "./content-section-editor"
import BlogsTab from "./mandir-management"
import MandirSubscribers from "./mandir-subscribers"
import ShringarBookings from "./shringar-bookings"
import SubmissionsList from "./submissions-list"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

type SpecialKey = "blogs" | "subscribers" | "shringar" | "grievances" | "testimonials"

const SPECIAL_SECTIONS: { key: SpecialKey; title: string; note: string }[] = [
  { key: "blogs", title: "ब्लॉग", note: "सूची" },
  { key: "subscribers", title: "सदस्य एवं ईमेल", note: "सूची" },
  { key: "shringar", title: "श्रृंगार बुकिंग", note: "कैलेंडर व सूची" },
  { key: "grievances", title: "शिकायत निवारण", note: "वेबसाइट से आई शिकायतें" },
  { key: "testimonials", title: "भक्तों के अनुभव", note: "वेबसाइट से आए प्रशंसा-पत्र / फ़ोटो" },
]

const BLOG_CATEGORY = "ब्लॉग, सदस्य एवं बुकिंग"

function SpecialSectionView({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-orange-700">{title}</h3>
        <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1.5" />वापस</Button>
      </div>
      {children}
    </div>
  )
}

export default function MandirContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const sectionKey = searchParams.get("section")
  const activeCms: SectionDef | null = sectionKey ? MANDIR_SECTIONS.find((s) => s.key === sectionKey) || null : null
  const activeSpecial = !activeCms && sectionKey ? SPECIAL_SECTIONS.find((s) => s.key === sectionKey) || null : null

  const openSection = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("section", key)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const closeSection = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("section")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (activeCms) return <ContentSectionEditor section={activeCms} onBack={closeSection} />
  if (activeSpecial?.key === "blogs") {
    return (
      <SpecialSectionView title="ब्लॉग" onBack={closeSection}>
        <BlogsTab />
      </SpecialSectionView>
    )
  }
  if (activeSpecial?.key === "subscribers") {
    return (
      <SpecialSectionView title="सदस्य एवं ईमेल" onBack={closeSection}>
        <MandirSubscribers />
      </SpecialSectionView>
    )
  }

  if (activeSpecial?.key === "shringar") {
    return (
      <SpecialSectionView title="श्रृंगार बुकिंग" onBack={closeSection}>
        <ShringarBookings />
      </SpecialSectionView>
    )
  }

  if (activeSpecial?.key === "grievances") {
    return (
      <SpecialSectionView title="शिकायत निवारण — दर्ज शिकायतें" onBack={closeSection}>
        <SubmissionsList kind="grievance" />
      </SpecialSectionView>
    )
  }
  if (activeSpecial?.key === "testimonials") {
    return (
      <SpecialSectionView title="भक्तों के अनुभव (Testimonials)" onBack={closeSection}>
        <SubmissionsList kind="testimonial" />
      </SpecialSectionView>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">किसी अनुभाग को संपादित करने के लिए उस पर क्लिक करें। यह सामग्री मंदिर वेबसाइट पर दिखेगी।</p>

      {SECTION_CATEGORIES.map((category) => {
        const sections = MANDIR_SECTIONS.filter((s) => s.category === category)
        if (sections.length === 0) return null
        return (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sections.map((s) => (
                <Card key={s.key} className="hover:shadow-md transition-shadow cursor-pointer border-orange-200/60" onClick={() => openSection(s.key)}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{s.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {s.type === "html" ? "रिच-टेक्स्ट" : s.type === "items" ? "सूची" : "विवरण"}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-orange-400" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide">{BLOG_CATEGORY}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SPECIAL_SECTIONS.map((s) => (
            <Card key={s.key} className="hover:shadow-md transition-shadow cursor-pointer border-orange-200/60" onClick={() => openSection(s.key)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.note}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-orange-400" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

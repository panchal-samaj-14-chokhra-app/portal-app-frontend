"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { MANDIR_SECTIONS, type SectionDef } from "@/lib/mandir-sections"
import ContentSectionEditor from "./content-section-editor"

export default function MandirContent() {
  const [active, setActive] = useState<SectionDef | null>(null)
  if (active) return <ContentSectionEditor section={active} onBack={() => setActive(null)} />

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">किसी अनुभाग को संपादित करने के लिए उस पर क्लिक करें। यह सामग्री मंदिर वेबसाइट पर दिखेगी।</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MANDIR_SECTIONS.map((s) => (
          <Card key={s.key} className="hover:shadow-md transition-shadow cursor-pointer border-orange-200/60" onClick={() => setActive(s)}>
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
}

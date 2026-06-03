"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Loader2, Users, GraduationCap, HeartHandshake, BarChart3, BookOpenCheck, Briefcase, Store } from "lucide-react"
import { useAllChokhlas, useDownloadReport } from "@/data-hooks/mutation-query/useQueryAndMutation"

interface ReportDef {
  key: string
  title: string
  description: string
  icon: any
  color: string
  genderSelect?: boolean
}

const REPORTS: ReportDef[] = [
  { key: "age-sex", title: "आयु वर्ग एवं लिंग अनुपात", description: "आयु वर्ग (1-11, 11-21, 21-35, 35-50, 50-60, 60-80, 80-100) के अनुसार पुरुष/महिला संख्या एवं लिंग अनुपात।", icon: BarChart3, color: "blue" },
  { key: "unmarried", title: "अविवाहित सदस्यों की सूची", description: "अविवाहित सदस्यों की सूची (नाम, गांव, मुखिया, गोत्र, मोबाइल)। लिंग चुनें।", icon: Users, color: "orange", genderSelect: true },
  { key: "job", title: "नौकरीपेशा व्यक्ति", description: "नौकरी (निजी एवं सरकारी) करने वाले व्यक्तियों की सूची — नाम, मोबाइल, पता, उद्योग/क्षेत्र।", icon: Briefcase, color: "blue" },
  { key: "business", title: "व्यापारी व्यक्ति", description: "व्यापार करने वाले व्यक्तियों की सूची — नाम, मोबाइल, पता, उद्योग/क्षेत्र।", icon: Store, color: "green" },
  { key: "marriageable", title: "विवाह योग्य अविवाहित", description: "18 वर्ष से अधिक अविवाहित कन्याएं एवं 21 वर्ष से अधिक अविवाहित युवकों की सूची।", icon: HeartHandshake, color: "pink" },
  { key: "students", title: "विद्यार्थी (कक्षावार)", description: "वर्तमान में अध्ययनरत विद्यार्थियों की कक्षावार सूची (0-5, 6, 7, 8, 9, 10, 11, 12, कॉलेज)।", icon: GraduationCap, color: "green" },
  { key: "education", title: "शिक्षा रिपोर्ट", description: "शिक्षा में लिंग अनुपात तथा शिक्षा छोड़ने वाली कन्याओं एवं युवकों की सूची।", icon: BookOpenCheck, color: "purple" },
]

const colorClasses: Record<string, string> = {
  blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
  orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
  pink: "from-pink-50 to-pink-100 border-pink-200 text-pink-700",
  green: "from-green-50 to-green-100 border-green-200 text-green-700",
  purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
}

interface ReportDownloadCardsProps {
  // village mode: when provided, the scope selector lists villages within this chokhla.
  chokhlaId?: string
  villages?: { id: string; name: string; displayId?: number }[]
}

export default function ReportDownloadCards({ chokhlaId, villages }: ReportDownloadCardsProps) {
  const villageMode = Array.isArray(villages)
  const { data: chokhlas, isLoading: chokhlasLoading } = useAllChokhlas()
  const { download, loadingReport } = useDownloadReport()
  // super-admin: "all" or chokhlaId | village mode: "__all__" (whole chokhla) or villageId
  const [selected, setSelected] = useState<string>(villageMode ? "__all__" : "all")
  const [unmarriedGender, setUnmarriedGender] = useState<string>("all")

  const scopeName = villageMode
    ? selected === "__all__"
      ? "chokhla"
      : villages!.find((v) => v.id === selected)?.name || "village"
    : selected === "all"
      ? "all-chokhras"
      : Array.isArray(chokhlas)
        ? chokhlas.find((c: any) => c.id === selected)?.name || ""
        : ""

  const handleDownload = (report: ReportDef) => {
    const safeName = (scopeName || "report").replace(/\s+/g, "_")
    // path segment + optional villageId query
    const pathId = villageMode ? chokhlaId || "all" : selected
    const parts: string[] = []
    if (villageMode && selected !== "__all__") parts.push(`villageId=${selected}`)
    if (report.genderSelect) parts.push(`gender=${unmarriedGender}`)
    const query = parts.length ? parts.join("&") : undefined
    if (!pathId) return
    download(report.key, pathId, `${report.key}-${safeName}.pdf`, query)
  }

  return (
    <div className="w-full space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700">
            <FileText className="w-5 h-5 mr-2" />
            रिपोर्ट डाउनलोड करें
          </CardTitle>
          <CardDescription>
            {villageMode
              ? "गांव चुनें (या पूरा चोखरा) और आवश्यक रिपोर्ट PDF प्रारूप में डाउनलोड करें।"
              : "चोखरा चुनें और आवश्यक रिपोर्ट PDF प्रारूप में डाउनलोड करें।"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">{villageMode ? "गांव चुनें" : "चोखरा चुनें"}</label>
            <Select value={selected} onValueChange={setSelected} disabled={!villageMode && chokhlasLoading}>
              <SelectTrigger>
                <SelectValue placeholder={chokhlasLoading ? "लोड हो रहा है..." : "चुनें"} />
              </SelectTrigger>
              <SelectContent>
                {villageMode ? (
                  <>
                    <SelectItem value="__all__">पूरा चोखरा (All Villages)</SelectItem>
                    {villages!.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                        {v.displayId != null ? ` (ID: ${v.displayId})` : ""}
                      </SelectItem>
                    ))}
                  </>
                ) : (
                  <>
                    <SelectItem value="all">सभी चोखरा (All Chokhras)</SelectItem>
                    {Array.isArray(chokhlas) &&
                      chokhlas.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                          {c.displayId != null ? ` (ID: ${c.displayId})` : ""}
                        </SelectItem>
                      ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {REPORTS.map((r) => {
          const Icon = r.icon
          const isLoading = loadingReport === r.key
          return (
            <Card key={r.key} className={`bg-gradient-to-br ${colorClasses[r.color]} flex flex-col`}>
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/70 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-base leading-tight">{r.title}</h3>
                </div>
                <p className="text-sm text-gray-700 flex-1">{r.description}</p>
                {r.genderSelect && (
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">लिंग चुनें</label>
                    <Select value={unmarriedGender} onValueChange={setUnmarriedGender}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">दोनों (पुरुष + महिला)</SelectItem>
                        <SelectItem value="male">केवल पुरुष</SelectItem>
                        <SelectItem value="female">केवल महिला</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button
                  onClick={() => handleDownload(r)}
                  disabled={isLoading}
                  className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      तैयार हो रहा है...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      PDF डाउनलोड करें
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Users, GraduationCap, IndianRupee, Building2, TrendingDown, TrendingUp } from "lucide-react"
import { useReportDashboard } from "@/data-hooks/mutation-query/useQueryAndMutation"

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

const fmtINR = (n: number) => "₹" + (n || 0).toLocaleString("en-IN")

export default function KpiDashboard() {
  const { data, isLoading, isError } = useReportDashboard()

  if (isLoading) {
    return (
      <Card className="bg-white/90 border-orange-200/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <span className="ml-3 text-gray-600">उच्च-स्तरीय आँकड़े लोड हो रहे हैं...</span>
        </CardContent>
      </Card>
    )
  }
  if (isError || !data?.data) {
    return (
      <Card className="bg-white/90 border-red-200/50">
        <CardContent className="py-8 text-center text-red-600">आँकड़े लोड करने में त्रुटि हुई।</CardContent>
      </Card>
    )
  }

  const d = data.data
  const t = d.totals

  const kpis = [
    { label: "कुल व्यक्ति", value: (t.persons || 0).toLocaleString("en-IN"), icon: Users, color: "blue" },
    { label: "कुल विद्यार्थी", value: (t.students || 0).toLocaleString("en-IN"), icon: GraduationCap, color: "green" },
    { label: "औसत मासिक आय", value: fmtINR(t.avgIncome), sub: `माध्यिका: ${fmtINR(t.medianIncome)}`, icon: IndianRupee, color: "orange" },
    { label: "निम्न आय व्यक्ति (≤ ₹15k)", value: (t.lowerIncome || 0).toLocaleString("en-IN"), icon: TrendingDown, color: "red" },
    { label: "उच्च आय व्यक्ति (> ₹50k)", value: (t.higherIncome || 0).toLocaleString("en-IN"), icon: TrendingUp, color: "purple" },
    { label: "कुल चोखरा", value: (t.chokhlas || 0).toLocaleString("en-IN"), icon: Building2, color: "pink" },
  ]
  const colorBg: Record<string, string> = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    pink: "from-pink-50 to-pink-100 border-pink-200 text-pink-700",
  }

  // Gender by chokhra (grouped bar)
  const genderCats = d.genderByChokhla.map((c: any) => c.name)
  const genderSeries = [
    { name: "पुरुष", data: d.genderByChokhla.map((c: any) => c.male) },
    { name: "महिला", data: d.genderByChokhla.map((c: any) => c.female) },
  ]
  const genderOptions: any = {
    chart: { type: "bar", toolbar: { show: false }, stacked: false },
    plotOptions: { bar: { horizontal: false, columnWidth: "60%" } },
    colors: ["#2563eb", "#db2777"],
    dataLabels: { enabled: false },
    xaxis: { categories: genderCats, labels: { rotate: -45, style: { fontSize: "10px" } } },
    legend: { position: "top" },
    grid: { borderColor: "#eee" },
  }

  // Births by year — male / female / combined line chart
  const birthOptions: any = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth", width: [2, 2, 3], dashArray: [0, 0, 4] },
    colors: ["#2563eb", "#db2777", "#16a34a"],
    dataLabels: { enabled: false },
    xaxis: { categories: d.birthsByYear.map((b: any) => b.year), tickAmount: 12, labels: { style: { fontSize: "10px" } } },
    legend: { position: "top" },
    grid: { borderColor: "#eee" },
    markers: { size: 0 },
  }
  const birthSeries = [
    { name: "पुरुष (Male)", data: d.birthsByYear.map((b: any) => b.male ?? 0) },
    { name: "महिला (Female)", data: d.birthsByYear.map((b: any) => b.female ?? 0) },
    { name: "कुल (Total)", data: d.birthsByYear.map((b: any) => b.total ?? b.count ?? 0) },
  ]

  // Income brackets (donut)
  const incomeLabels = d.incomeBrackets.map((b: any) => b.label)
  const incomeSeries = d.incomeBrackets.map((b: any) => b.count)
  const incomeOptions: any = {
    chart: { type: "donut" },
    labels: incomeLabels,
    colors: ["#ef4444", "#f59e0b", "#22c55e"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
  }

  return (
    <div className="w-full space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <Card key={k.label} className={`bg-gradient-to-br ${colorBg[k.color]}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium leading-tight">{k.label}</p>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                <p className="text-xl sm:text-2xl font-bold">{k.value}</p>
                {k.sub && <p className="text-[11px] text-gray-600 mt-0.5">{k.sub}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Gender by chokhra */}
      <Card className="bg-white/90 border-orange-200/50">
        <CardHeader>
          <CardTitle className="text-orange-700 text-lg">चोखरा अनुसार लिंग वितरण</CardTitle>
          <CardDescription>प्रत्येक चोखरा में पुरुष एवं महिला सदस्यों की संख्या</CardDescription>
        </CardHeader>
        <CardContent>
          <ApexChart options={genderOptions} series={genderSeries} type="bar" height={340} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Births by year */}
        <Card className="bg-white/90 border-orange-200/50">
          <CardHeader>
            <CardTitle className="text-orange-700 text-lg">वर्ष अनुसार जन्म दर</CardTitle>
            <CardDescription>जन्म वर्ष के अनुसार व्यक्तियों की संख्या</CardDescription>
          </CardHeader>
          <CardContent>
            <ApexChart options={birthOptions} series={birthSeries} type="line" height={300} />
          </CardContent>
        </Card>

        {/* Income distribution */}
        <Card className="bg-white/90 border-orange-200/50">
          <CardHeader>
            <CardTitle className="text-orange-700 text-lg">आय वितरण</CardTitle>
            <CardDescription>कमाने वाले व्यक्तियों का आय वर्ग अनुसार वितरण</CardDescription>
          </CardHeader>
          <CardContent>
            <ApexChart options={incomeOptions} series={incomeSeries} type="donut" height={300} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

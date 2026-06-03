"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Users, GraduationCap, IndianRupee, Home, HeartPulse } from "lucide-react"
import { useAllChokhlas, useReportAnalytics } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { MapPin } from "lucide-react"
import VillageMap from "./village-map"

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

const fmtINR = (n: number) => "₹" + (n || 0).toLocaleString("en-IN")
const num = (n: number) => (n || 0).toLocaleString("en-IN")

// English slug -> Hindi label
const LABELS: Record<string, string> = {
  self_employed: "स्वरोज़गार", private_job: "निजी नौकरी", business: "व्यापार", housewife: "गृहिणी",
  government_job: "सरकारी नौकरी", laborer: "मज़दूर", vendor: "विक्रेता", retired: "सेवानिवृत्त",
  domestic_worker: "घरेलू कामगार", professional: "पेशेवर", other: "अन्य",
  pucca: "पक्का", semi_pucca: "अर्ध-पक्का", kutcha: "कच्चा", apartment: "अपार्टमेंट", slum: "झुग्गी",
  owned: "स्वयं का", pita_ka: "पिता का", pati_ka: "पति का", mata_ka: "माता का", rented: "किराये का", government: "सरकारी",
  borewell: "बोरवेल", tap: "नल", handpump: "हैंडपंप", well: "कुआँ", river_pond: "नदी/तालाब",
  married: "विवाहित", single: "अविवाहित", widowed: "विधवा/विधुर", divorced: "तलाकशुदा", separated: "अलग",
  graduate: "स्नातक", high_school: "हाई स्कूल", intermediate: "इंटरमीडिएट", primary: "प्राथमिक", middle: "मिडिल",
  post_graduate: "स्नातकोत्तर", illiterate: "निरक्षर", diploma: "डिप्लोमा", doctorate: "पीएचडी", "अज्ञात": "अज्ञात",
}
const lbl = (s: string) => LABELS[s] || s

const StatCard = ({ label, value, sub, color = "orange" }: any) => {
  const c: Record<string, string> = {
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    pink: "from-pink-50 to-pink-100 border-pink-200 text-pink-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
  }
  return (
    <Card className={`bg-gradient-to-br ${c[color]}`}>
      <CardContent className="p-3.5">
        <p className="text-[11px] font-medium leading-tight">{label}</p>
        <p className="text-lg sm:text-xl font-bold mt-1">{value}</p>
        {sub != null && <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  )
}

const SectionCard = ({ icon: Icon, title, desc, children }: any) => (
  <Card className="bg-white/90 border-orange-200/50">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center text-orange-700 text-lg">
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        {title}
      </CardTitle>
      {desc && <CardDescription>{desc}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
)

function BarChart({ categories, series, colors, height = 280, horizontal = false }: any) {
  const options: any = {
    chart: { type: "bar", toolbar: { show: false }, stacked: series.length > 1 },
    plotOptions: { bar: { horizontal, columnWidth: "60%", borderRadius: 3 } },
    colors: colors || ["#ea580c"],
    dataLabels: { enabled: false },
    xaxis: { categories, labels: { rotate: horizontal ? 0 : -45, style: { fontSize: "10px" } } },
    legend: { position: "top", show: series.length > 1 },
    grid: { borderColor: "#eee" },
  }
  return <ApexChart options={options} series={series} type="bar" height={height} />
}

function DonutChart({ labels, series, colors, height = 280 }: any) {
  const options: any = {
    chart: { type: "donut" },
    labels,
    colors,
    legend: { position: "bottom", fontSize: "11px" },
    dataLabels: { enabled: true, formatter: (v: number) => Math.round(v) + "%" },
  }
  return <ApexChart options={options} series={series} type="donut" height={height} />
}

interface AnalyticsSectionProps {
  // When provided => "village mode": filter by villages within this chokhla.
  chokhlaId?: string
  villages?: { id: string; name: string }[]
}

export default function AnalyticsSection({ chokhlaId: scopeChokhlaId, villages }: AnalyticsSectionProps) {
  const villageMode = Array.isArray(villages)
  const { data: chokhlas } = useAllChokhlas()
  // In village mode "__all__" = whole chokhla; otherwise it's a villageId.
  // In super-admin mode "all" = all chokhras; otherwise a chokhlaId.
  const [selected, setSelected] = useState<string>(villageMode ? "__all__" : "all")

  const params = villageMode
    ? selected === "__all__"
      ? { chokhlaId: scopeChokhlaId }
      : { villageId: selected }
    : { chokhlaId: selected }
  const { data, isLoading, isError } = useReportAnalytics(params)

  const d = data?.data

  return (
    <div className="w-full space-y-6">
      {/* Filter bar */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center text-orange-700">
                <Users className="w-5 h-5 mr-2" />
                समग्र विश्लेषण (Analytics)
              </CardTitle>
              <CardDescription>
                {villageMode
                  ? "पहले पूरे चोखरा का डेटा दिखाया गया है। किसी एक गांव का डेटा देखने के लिए नीचे फ़िल्टर चुनें।"
                  : "पहले सभी चोखरा का सम्मिलित डेटा दिखाया गया है। किसी एक चोखरा का डेटा देखने के लिए नीचे फ़िल्टर चुनें।"}
              </CardDescription>
            </div>
            <div className="w-full sm:w-64">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {villageMode ? "गांव फ़िल्टर" : "चोखरा फ़िल्टर"}
              </label>
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {villageMode ? (
                    <>
                      <SelectItem value="__all__">पूरा चोखरा (All Villages)</SelectItem>
                      {villages!.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <>
                      <SelectItem value="all">सभी चोखरा (All)</SelectItem>
                      {Array.isArray(chokhlas) &&
                        chokhlas.map((c: any) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        {d && (
          <CardContent>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
              <span><b className="text-orange-700">{d.scope.chokhlaName}</b></span>
              <span>कुल व्यक्ति: <b>{num(d.scope.persons)}</b></span>
              <span>कुल परिवार: <b>{num(d.scope.families)}</b></span>
              <span>कुल गांव: <b>{num(d.scope.villages)}</b></span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Village location map (follows the scope filter) */}
      <Card className="bg-white/90 border-orange-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-orange-700 text-lg">
            <MapPin className="w-5 h-5 mr-2" />
            गांव मानचित्र (Village Map)
          </CardTitle>
          <CardDescription>
            {villageMode
              ? "चयनित गांव/चोखरा के गांवों की स्थिति मानचित्र पर"
              : "चयनित चोखरा (या सभी) के गांवों की स्थिति मानचित्र पर"}
            {d ? ` — ${num((d.villageLocations || []).length)} स्थान दर्शाए गए` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VillageMap locations={(d?.villageLocations as any) || []} loading={isLoading} />
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="bg-white/90 border-orange-200/50">
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <span className="ml-3 text-gray-600">डेटा लोड हो रहा है...</span>
          </CardContent>
        </Card>
      )}
      {isError && (
        <Card className="bg-white/90 border-red-200/50">
          <CardContent className="py-8 text-center text-red-600">डेटा लोड करने में त्रुटि हुई।</CardContent>
        </Card>
      )}

      {d && !isLoading && (
        <>
          {/* 1. Basic Demographics */}
          <SectionCard icon={Users} title="मूल जनसांख्यिकी (Basic Demographics)" desc="परिवार का आकार, आयु, लिंग, वैवाहिक स्थिति, शिक्षा एवं व्यवसाय">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard label="औसत परिवार आकार" value={d.demographics.avgFamilySize} color="orange" />
              <StatCard label="पुरुष" value={num(d.demographics.male)} color="blue" />
              <StatCard label="महिला" value={num(d.demographics.female)} color="pink" />
              <StatCard label="कुल व्यक्ति" value={num(d.scope.persons)} color="green" />
              <StatCard label="कुल परिवार" value={num(d.scope.families)} color="purple" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">आयु एवं लिंग (Age & Gender)</p>
                <BarChart
                  categories={d.demographics.ageGender.map((a: any) => a.range)}
                  series={[
                    { name: "पुरुष", data: d.demographics.ageGender.map((a: any) => a.male) },
                    { name: "महिला", data: d.demographics.ageGender.map((a: any) => a.female) },
                  ]}
                  colors={["#2563eb", "#db2777"]}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">वैवाहिक स्थिति (Marital Status)</p>
                <DonutChart
                  labels={d.demographics.maritalStatus.map((m: any) => lbl(m.label))}
                  series={d.demographics.maritalStatus.map((m: any) => m.count)}
                  colors={["#22c55e", "#f59e0b", "#6366f1", "#ef4444", "#94a3b8"]}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">शिक्षा स्तर (Education Level)</p>
                <BarChart
                  horizontal
                  categories={d.demographics.educationLevel.slice(0, 8).map((e: any) => lbl(e.label))}
                  series={[{ name: "व्यक्ति", data: d.demographics.educationLevel.slice(0, 8).map((e: any) => e.count) }]}
                  colors={["#0ea5e9"]}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">व्यवसाय (Occupation)</p>
                <BarChart
                  horizontal
                  categories={d.demographics.occupation.slice(0, 8).map((o: any) => lbl(o.label))}
                  series={[{ name: "व्यक्ति", data: d.demographics.occupation.slice(0, 8).map((o: any) => o.count) }]}
                  colors={["#8b5cf6"]}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">राज्य अनुसार (By State)</p>
                <DonutChart
                  labels={(d.demographics.state || []).slice(0, 6).map((s: any) => s.label)}
                  series={(d.demographics.state || []).slice(0, 6).map((s: any) => s.count)}
                  colors={["#ea580c", "#16a34a", "#2563eb", "#db2777", "#f59e0b", "#94a3b8"]}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">जिला अनुसार (By District)</p>
                <BarChart
                  horizontal
                  categories={(d.demographics.district || []).slice(0, 10).map((s: any) => s.label)}
                  series={[{ name: "व्यक्ति", data: (d.demographics.district || []).slice(0, 10).map((s: any) => s.count) }]}
                  colors={["#0d9488"]}
                  height={320}
                />
              </div>
            </div>
          </SectionCard>

          {/* 2. Education */}
          <SectionCard icon={GraduationCap} title="शिक्षा (Education)" desc="विद्यार्थी, नामांकन, साक्षरता एवं ड्रॉपआउट">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard label="कुल विद्यार्थी" value={num(d.education.totalStudents)} color="green" />
              <StatCard label="उच्च शिक्षा (कॉलेज)" value={num(d.education.higherEducationStudents)} color="purple" />
              <StatCard label="स्कूल में विद्यार्थी" value={num(d.education.schoolStudents)} color="blue" />
              <StatCard label="प्राथमिक विद्यार्थी" value={num(d.education.primaryStudents)} color="orange" />
              <StatCard label="छात्र (पु./म.)" value={`${num(d.education.maleStudents)} / ${num(d.education.femaleStudents)}`} color="pink" />
              <StatCard label="बाल नामांकन दर (6-14)" value={`${d.education.childEnrollmentRate}%`} sub={`${num(d.education.childrenEnrolled)}/${num(d.education.children)}`} color="blue" />
              <StatCard label="ड्रॉपआउट दर" value={`${d.education.dropoutRate}%`} sub={`${num(d.education.dropouts)} व्यक्ति`} color="red" />
              <StatCard label="साक्षरता दर" value={`${d.education.literacyRate}%`} sub={`निरक्षर: ${num(d.education.illiterate)}`} color="green" />
              <StatCard label="उच्च शिक्षा प्राप्त" value={num(d.education.higherEducationAttained)} color="purple" />
            </div>
          </SectionCard>

          {/* 3. Income & Occupation */}
          <SectionCard icon={IndianRupee} title="आय एवं रोज़गार (Income)" desc="आय, रोज़गार, व्यापार एवं बैंकिंग">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard label="औसत आय/कमाने वाला" value={fmtINR(d.income.avgIncomePerEarner)} sub={`माध्यिका: ${fmtINR(d.income.medianIncome)}`} color="orange" />
              <StatCard label="औसत मासिक घरेलू आय" value={fmtINR(d.income.avgHouseholdMonthly)} sub={`वार्षिक: ${fmtINR(d.income.avgHouseholdAnnual)}`} color="green" />
              <StatCard label="प्रति परिवार कमाने वाले" value={d.income.avgEarningMembersPerFamily} color="blue" />
              <StatCard label="व्यापार (Businesses)" value={num(d.income.businesses)} color="purple" />
              <StatCard label="नौकरीपेशा" value={num(d.income.inJob)} sub={`निजी ${num(d.income.privateJob)} / सरकारी ${num(d.income.govtJob)}`} color="blue" />
              <StatCard label="स्वरोज़गार" value={num(d.income.selfEmployed)} color="orange" />
              <StatCard label="महिला (नौकरी)" value={num(d.income.femalesInJob)} color="pink" />
              <StatCard label="महिला (व्यापार)" value={num(d.income.femalesInBusiness)} color="pink" />
              <StatCard
                label="बेरोज़गारी दर (15-59)"
                value={`${d.income.unemploymentRate ?? 0}%`}
                sub={`${num(d.income.unemployedLF ?? 0)}/${num(d.income.laborForce ?? 0)} कार्यबल`}
                color="red"
              />
              <StatCard label="बैंक खाता" value={`${d.income.bankAccountPct}%`} sub={`${num(d.income.bankAccountCount)} व्यक्ति`} color="green" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">आय का प्रमुख स्रोत (Primary Source of Income)</p>
              <BarChart
                horizontal
                categories={d.income.primarySource.map((s: any) => lbl(s.label))}
                series={[{ name: "व्यक्ति", data: d.income.primarySource.map((s: any) => s.count) }]}
                colors={["#16a34a"]}
              />
            </div>
          </SectionCard>

          {/* 4. Housing & Infrastructure */}
          <SectionCard icon={Home} title="आवास एवं अवसंरचना (Housing & Infrastructure)" desc="मकान, स्वामित्व, बिजली, पानी, शौचालय एवं इंटरनेट">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="बिजली उपलब्धता" value={`${d.housing.electricityPct}%`} sub={`${num(d.housing.electricityCount)} व्यक्ति`} color="orange" />
              <StatCard label="शौचालय उपलब्धता" value={`${d.housing.toiletPct}%`} sub={`${num(d.housing.toiletCount)} व्यक्ति`} color="blue" />
              <StatCard label="इंटरनेट" value={`${d.housing.internetPct}%`} sub={`${num(d.housing.internetCount)} व्यक्ति`} color="purple" />
              <StatCard label="स्मार्टफोन" value={`${d.housing.smartphonePct}%`} sub={`${num(d.housing.smartphoneCount)} व्यक्ति`} color="green" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">मकान का प्रकार</p>
                <DonutChart
                  labels={d.housing.houseType.map((h: any) => lbl(h.label))}
                  series={d.housing.houseType.map((h: any) => h.count)}
                  colors={["#16a34a", "#f59e0b", "#ef4444", "#6366f1", "#94a3b8"]}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">स्वामित्व स्थिति</p>
                <BarChart
                  horizontal
                  categories={d.housing.ownership.slice(0, 6).map((o: any) => lbl(o.label))}
                  series={[{ name: "व्यक्ति", data: d.housing.ownership.slice(0, 6).map((o: any) => o.count) }]}
                  colors={["#0ea5e9"]}
                  height={240}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">पेयजल स्रोत</p>
                <BarChart
                  horizontal
                  categories={d.housing.waterSource.slice(0, 6).map((w: any) => lbl(w.label))}
                  series={[{ name: "व्यक्ति", data: d.housing.waterSource.slice(0, 6).map((w: any) => w.count) }]}
                  colors={["#06b6d4"]}
                  height={240}
                />
              </div>
            </div>
          </SectionCard>

          {/* 5. Health */}
          <SectionCard icon={HeartPulse} title="स्वास्थ्य (Health)" desc="स्वास्थ्य सुविधा, बीमा एवं टीकाकरण">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="स्वास्थ्य केंद्र वाले गांव" value={`${d.health.phcAccessPct}%`} sub={`${num(d.health.villagesWithPHC)}/${num(d.health.totalVillages)} गांव`} color="green" />
              <StatCard label="स्वास्थ्य बीमा" value={`${d.health.healthInsurancePct}%`} sub={`${num(d.health.healthInsuranceCount)} व्यक्ति`} color="blue" />
              <StatCard label="टीकाकरण" value={`${d.health.vaccinatedPct}%`} sub={`${num(d.health.vaccinatedCount)} व्यक्ति`} color="orange" />
              <StatCard label="स्वास्थ्य समस्या" value={num(d.health.healthIssuesCount)} color="red" />
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts"

const familyData = [
  { name: "लोहारिया", families: 245, members: 1024, verified: 198 },
  { name: "चौरासी", families: 189, members: 876, verified: 156 },
  { name: "बाँसवाड़ा", families: 312, members: 1456, verified: 267 },
  { name: "तरपोत", families: 156, members: 678, verified: 134 },
  { name: "खमेरा", families: 203, members: 945, verified: 178 },
]

const educationData = [
  { name: "निरक्षर", value: 20, count: 2510, color: "#ef4444" },
  { name: "प्राथमिक", value: 26, count: 3234, color: "#f59e0b" },
  { name: "माध्यमिक", value: 37, count: 4567, color: "#3b82f6" },
  { name: "स्नातक+", value: 17, count: 2145, color: "#10b981" },
]

const employmentData = [
  { name: "किसान", value: 43, count: 3567, color: "#10b981" },
  { name: "निजी नौकरी", value: 30, count: 2456, color: "#8b5cf6" },
  { name: "सरकारी नौकरी", value: 15, count: 1234, color: "#3b82f6" },
  { name: "व्यापारी", value: 12, count: 987, color: "#f59e0b" },
]

const monthlyData = [
  { month: "जन", registrations: 145, donations: 85000, insurance: 67 },
  { month: "फर", registrations: 189, donations: 92000, insurance: 72 },
  { month: "मार", registrations: 234, donations: 108000, insurance: 78 },
  { month: "अप्र", registrations: 278, donations: 125000, insurance: 81 },
  { month: "मई", registrations: 312, donations: 134000, insurance: 85 },
  { month: "जून", registrations: 289, donations: 142000, insurance: 88 },
]

const healthInsuranceData = [
  { name: "स्वास्थ्य बीमा", value: 72, count: 8945, color: "#ec4899" },
  { name: "जीवन बीमा", value: 50, count: 6234, color: "#06b6d4" },
  { name: "दुर्घटना बीमा", value: 33, count: 4123, color: "#f97316" },
  { name: "सरकारी योजना", value: 79, count: 9876, color: "#10b981" },
]

const ageGroupData = [
  { ageGroup: "0-18", male: 2234, female: 2125, total: 4359 },
  { ageGroup: "19-35", male: 1876, female: 1654, total: 3530 },
  { ageGroup: "36-50", male: 1543, female: 1432, total: 2975 },
  { ageGroup: "51-65", male: 876, female: 798, total: 1674 },
  { ageGroup: "65+", male: 654, female: 592, total: 1246 },
]

const migrationTrendData = [
  { month: "जन", migrated: 145, returned: 67 },
  { month: "फर", migrated: 167, returned: 78 },
  { month: "मार", migrated: 189, returned: 89 },
  { month: "अप्र", migrated: 234, returned: 123 },
  { month: "मई", migrated: 278, returned: 156 },
  { month: "जून", migrated: 298, returned: 178 },
]

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Family Distribution */}
      <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-700">छोकरा-वार परिवार वितरण</CardTitle>
          <CardDescription>परिवार, सदस्य और सत्यापन स्थिति</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              families: { label: "परिवार", color: "#f97316" },
              verified: { label: "सत्यापित", color: "#10b981" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={familyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="families" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="verified" fill="#10b981" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Education Distribution */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">शिक्षा स्तर वितरण</CardTitle>
          <CardDescription>सदस्यों की शैक्षणिक योग्यता</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: "प्रतिशत", color: "#3b82f6" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={educationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {educationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Employment Distribution */}
      <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-700">रोजगार वितरण</CardTitle>
          <CardDescription>व्यवसाय के अनुसार सदस्य</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: "प्रतिशत", color: "#8b5cf6" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {employmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Health Insurance Coverage */}
      <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-700">बीमा कवरेज</CardTitle>
          <CardDescription>विभिन्न बीमा योजनाओं में नामांकन</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: "प्रतिशत", color: "#ec4899" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthInsuranceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {healthInsuranceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Age Group Distribution */}
      <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">आयु समूह और लिंग वितरण</CardTitle>
          <CardDescription>पुरुष और महिला सदस्यों का वितरण</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              male: { label: "पुरुष", color: "#3b82f6" },
              female: { label: "महिला", color: "#ec4899" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="male" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="female" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-700">मासिक ट्रेंड</CardTitle>
          <CardDescription>पंजीकरण, दान और बीमा नामांकन</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              registrations: { label: "पंजीकरण", color: "#6366f1" },
              donations: { label: "दान (₹)", color: "#10b981" },
              insurance: { label: "बीमा %", color: "#f59e0b" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="registrations" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="insurance"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Migration Trends */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-white to-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-700">प्रवास पैटर्न</CardTitle>
          <CardDescription>मासिक प्रवास और वापसी की प्रवृत्ति</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              migrated: { label: "प्रवासित", color: "#ef4444" },
              returned: { label: "वापस आए", color: "#10b981" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={migrationTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="migrated"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="returned"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

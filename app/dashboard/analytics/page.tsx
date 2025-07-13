"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Users, Home, GraduationCap, Heart, Download, Filter, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

interface CensusData {
  village: string
  totalFamilies: number
  totalMembers: number
  maleMembers: number
  femaleMembers: number
  literateMembers: number
  farmers: number
  govtEmployees: number
  privateEmployees: number
  business: number
  jointFamilies: number
  nuclearFamilies: number
  chandaCollected: number
  chandaPending: number
}

const mockCensusData: CensusData[] = [
  {
    village: "गांव 1",
    totalFamilies: 45,
    totalMembers: 189,
    maleMembers: 98,
    femaleMembers: 91,
    literateMembers: 156,
    farmers: 67,
    govtEmployees: 23,
    privateEmployees: 45,
    business: 12,
    jointFamilies: 28,
    nuclearFamilies: 17,
    chandaCollected: 35000,
    chandaPending: 15000,
  },
  {
    village: "गांव 2",
    totalFamilies: 38,
    totalMembers: 156,
    maleMembers: 82,
    femaleMembers: 74,
    literateMembers: 134,
    farmers: 54,
    govtEmployees: 18,
    privateEmployees: 38,
    business: 9,
    jointFamilies: 22,
    nuclearFamilies: 16,
    chandaCollected: 28000,
    chandaPending: 14000,
  },
  {
    village: "गांव 3",
    totalFamilies: 52,
    totalMembers: 218,
    maleMembers: 112,
    femaleMembers: 106,
    literateMembers: 187,
    farmers: 78,
    govtEmployees: 28,
    privateEmployees: 56,
    business: 15,
    jointFamilies: 31,
    nuclearFamilies: 21,
    chandaCollected: 42000,
    chandaPending: 18000,
  },
]

export default function CensusAnalyticsDashboard() {
  const [selectedVillage, setSelectedVillage] = useState<string>("all")
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("all")
  const [selectedContributionStatus, setSelectedContributionStatus] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    const userType = sessionStorage.getItem("userType")
    if (userType !== "chokhra") {
      router.push("/login")
      return
    }
  }, [router])

  const filteredData = mockCensusData.filter((data) => {
    if (selectedVillage !== "all" && data.village !== selectedVillage) return false
    return true
  })

  const totalStats = filteredData.reduce(
    (acc, curr) => ({
      totalFamilies: acc.totalFamilies + curr.totalFamilies,
      totalMembers: acc.totalMembers + curr.totalMembers,
      maleMembers: acc.maleMembers + curr.maleMembers,
      femaleMembers: acc.femaleMembers + curr.femaleMembers,
      literateMembers: acc.literateMembers + curr.literateMembers,
      farmers: acc.farmers + curr.farmers,
      govtEmployees: acc.govtEmployees + curr.govtEmployees,
      privateEmployees: acc.privateEmployees + curr.privateEmployees,
      business: acc.business + curr.business,
      jointFamilies: acc.jointFamilies + curr.jointFamilies,
      nuclearFamilies: acc.nuclearFamilies + curr.nuclearFamilies,
      chandaCollected: acc.chandaCollected + curr.chandaCollected,
      chandaPending: acc.chandaPending + curr.chandaPending,
    }),
    {
      totalFamilies: 0,
      totalMembers: 0,
      maleMembers: 0,
      femaleMembers: 0,
      literateMembers: 0,
      farmers: 0,
      govtEmployees: 0,
      privateEmployees: 0,
      business: 0,
      jointFamilies: 0,
      nuclearFamilies: 0,
      chandaCollected: 0,
      chandaPending: 0,
    },
  )

  const genderData = [
    { name: "पुरुष", value: totalStats.maleMembers, color: "#3b82f6" },
    { name: "महिला", value: totalStats.femaleMembers, color: "#ec4899" },
  ]

  const professionData = [
    { name: "किसान", value: totalStats.farmers, color: "#10b981" },
    { name: "सरकारी नौकरी", value: totalStats.govtEmployees, color: "#3b82f6" },
    { name: "निजी नौकरी", value: totalStats.privateEmployees, color: "#8b5cf6" },
    { name: "व्यापार", value: totalStats.business, color: "#f59e0b" },
  ]

  const familyStructureData = [
    { name: "संयुक्त परिवार", value: totalStats.jointFamilies, color: "#06b6d4" },
    { name: "एकल परिवार", value: totalStats.nuclearFamilies, color: "#f97316" },
  ]

  const handleLogout = () => {
    sessionStorage.clear()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/images/main-logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-white">जनगणना एनालिटिक्स डैशबोर्ड</h1>
                <p className="text-orange-100">पंचाल समाज 14 चोखरा - संपूर्ण विश्लेषण</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/chokhra")}
                className="border-orange-300 text-white hover:bg-orange-400 bg-orange-500/20"
              >
                मुख्य डैशबोर्ड
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-orange-300 text-white hover:bg-orange-400 bg-orange-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                लॉगआउट
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="p-6 bg-white border-b border-orange-200">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-orange-600" />
          <span className="font-medium text-orange-700">फिल्टर:</span>

          <Select value={selectedVillage} onValueChange={setSelectedVillage}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="गांव चुनें" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी गांव</SelectItem>
              {mockCensusData.map((data) => (
                <SelectItem key={data.village} value={data.village}>
                  {data.village}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="आयु समूह" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी आयु समूह</SelectItem>
              <SelectItem value="0-18">0-18 वर्ष</SelectItem>
              <SelectItem value="19-60">19-60 वर्ष</SelectItem>
              <SelectItem value="60+">60+ वर्ष</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedContributionStatus} onValueChange={setSelectedContributionStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="योगदान स्थिति" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी</SelectItem>
              <SelectItem value="contributed">योगदान दिया</SelectItem>
              <SelectItem value="pending">योगदान लंबित</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-gradient-to-r from-green-500 to-green-600">
            <Download className="w-4 h-4 mr-2" />
            रिपोर्ट डाउनलोड
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">कुल परिवार</CardTitle>
              <Home className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{totalStats.totalFamilies}</div>
              <p className="text-xs text-blue-600">
                संयुक्त: {totalStats.jointFamilies} | एकल: {totalStats.nuclearFamilies}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">कुल सदस्य</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{totalStats.totalMembers}</div>
              <p className="text-xs text-green-600">
                पुरुष: {totalStats.maleMembers} | महिला: {totalStats.femaleMembers}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">साक्षरता दर</CardTitle>
              <GraduationCap className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round((totalStats.literateMembers / totalStats.totalMembers) * 100)}%
              </div>
              <p className="text-xs text-purple-600">{totalStats.literateMembers} साक्षर सदस्य</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-yellow-50 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">चंदा संग्रह</CardTitle>
              <Heart className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(
                  (totalStats.chandaCollected / (totalStats.chandaCollected + totalStats.chandaPending)) * 100,
                )}
                %
              </div>
              <p className="text-xs text-yellow-600">₹{totalStats.chandaCollected.toLocaleString()} संग्रहित</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gender Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>लिंग वितरण</CardTitle>
              <CardDescription>पुरुष और महिला सदस्यों का अनुपात</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "संख्या", color: "#3b82f6" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Profession Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>व्यवसाय वितरण</CardTitle>
              <CardDescription>विभिन्न व्यवसायों में सदस्यों की संख्या</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "संख्या", color: "#10b981" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={professionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {professionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Family Structure */}
          <Card>
            <CardHeader>
              <CardTitle>पारिवारिक संरचना</CardTitle>
              <CardDescription>संयुक्त और एकल परिवारों का वितरण</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "संख्या", color: "#06b6d4" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={familyStructureData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {familyStructureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Village-wise Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>गांव-वार तुलना</CardTitle>
              <CardDescription>परिवार और सदस्य संख्या की तुलना</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  families: { label: "परिवार", color: "#f97316" },
                  members: { label: "सदस्य", color: "#3b82f6" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="village" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="totalFamilies" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="totalMembers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Add a new comprehensive census breakdown section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>आयु समूह वितरण</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>0-18 वर्ष</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={35} className="w-24" />
                    <span className="text-sm font-medium">4,359</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>19-35 वर्ष</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={28} className="w-24" />
                    <span className="text-sm font-medium">3,530</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>36-60 वर्ष</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={27} className="w-24" />
                    <span className="text-sm font-medium">3,321</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>60+ वर्ष</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={10} className="w-24" />
                    <span className="text-sm font-medium">1,246</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>डिजिटल साक्षरता</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>स्मार्टफोन उपयोगकर्ता</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={78} className="w-24" />
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>इंटरनेट उपयोग</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={65} className="w-24" />
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>कंप्यूटर ज्ञान</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={42} className="w-24" />
                    <span className="text-sm font-medium">42%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>सरकारी योजनाएं</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>आयुष्मान भारत</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={79} className="w-24" />
                    <span className="text-sm font-medium">79%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>PM किसान</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={43} className="w-24" />
                    <span className="text-sm font-medium">43%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>जन धन खाता</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={85} className="w-24" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>उज्ज्वला योजना</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={67} className="w-24" />
                    <span className="text-sm font-medium">67%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property and Asset Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>संपत्ति और संपदा वितरण</CardTitle>
            <CardDescription>भूमि स्वामित्व, घर के प्रकार और वाहन स्वामित्व</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">भूमि स्वामित्व</h4>
                <div className="flex items-center justify-between">
                  <span>भूमि मालिक</span>
                  <span className="font-bold">1,234 (43%)</span>
                </div>
                <Progress value={43} />
                <div className="text-sm text-gray-600">औसत भूमि: 2.5 एकड़</div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">घर के प्रकार</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>पक्का घर</span>
                    <span>65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>अर्ध-पक्का</span>
                    <span>25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>कच्चा घर</span>
                    <span>10%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">वाहन स्वामित्व</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>दोपहिया</span>
                    <span>1,876 (67%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>चार पहिया</span>
                    <span>456 (16%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ट्रैक्टर</span>
                    <span>234 (8%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Village Table */}
        <Card>
          <CardHeader>
            <CardTitle>गांव-वार विस्तृत विवरण</CardTitle>
            <CardDescription>सभी गांवों का संपूर्ण डेटा</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>गांव</TableHead>
                  <TableHead>परिवार</TableHead>
                  <TableHead>सदस्य</TableHead>
                  <TableHead>साक्षरता %</TableHead>
                  <TableHead>मुख्य व्यवसाय</TableHead>
                  <TableHead>चंदा संग्रह %</TableHead>
                  <TableHead>पारिवारिक संरचना</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((data) => (
                  <TableRow key={data.village}>
                    <TableCell className="font-medium">{data.village}</TableCell>
                    <TableCell>{data.totalFamilies}</TableCell>
                    <TableCell>{data.totalMembers}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={Math.round((data.literateMembers / data.totalMembers) * 100)}
                          className="w-16 h-2"
                        />
                        <span className="text-sm">{Math.round((data.literateMembers / data.totalMembers) * 100)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">किसान ({data.farmers})</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={Math.round((data.chandaCollected / (data.chandaCollected + data.chandaPending)) * 100)}
                          className="w-16 h-2"
                        />
                        <span className="text-sm">
                          {Math.round((data.chandaCollected / (data.chandaCollected + data.chandaPending)) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div>संयुक्त: {data.jointFamilies}</div>
                        <div>एकल: {data.nuclearFamilies}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

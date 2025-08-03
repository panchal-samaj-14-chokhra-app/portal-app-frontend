"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Users,
  MapPin,
  UserCheck,
  Home,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Droplets,
  GraduationCap,
  Heart,
  Car,
} from "lucide-react"
import type { Statistics } from "./types"

interface StatisticsManagementProps {
  statistics: Statistics | null
  isLoading: boolean
}

export function StatisticsManagement({ statistics, isLoading }: StatisticsManagementProps) {
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Activity className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">आंकड़े लोड नहीं हो सके</h3>
          <p className="text-gray-500 text-center">कृपया पेज रीफ्रेश करें</p>
        </CardContent>
      </Card>
    )
  }

  const facilityData = [
    { name: "बिजली", value: statistics.facilityStats.electricity, icon: Zap, color: "#F59E0B" },
    { name: "पानी", value: statistics.facilityStats.waterSupply, icon: Droplets, color: "#3B82F6" },
    { name: "स्कूल", value: statistics.facilityStats.school, icon: GraduationCap, color: "#10B981" },
    { name: "स्वास्थ्य केंद्र", value: statistics.facilityStats.healthCenter, icon: Heart, color: "#EF4444" },
    { name: "सड़क", value: statistics.facilityStats.roadAccess, icon: Car, color: "#8B5CF6" },
  ]

  const stateChartData = statistics.stateDistribution.map((state) => ({
    name: state.state,
    villages: state.villages,
    families: state.families,
    population: state.population,
  }))

  const growthData = [
    { name: "गांव", value: statistics.monthlyGrowth.villages, color: "#3B82F6" },
    { name: "चोखला", value: statistics.monthlyGrowth.choklas, color: "#10B981" },
    { name: "उपयोगकर्ता", value: statistics.monthlyGrowth.users, color: "#F59E0B" },
    { name: "परिवार", value: statistics.monthlyGrowth.families, color: "#EF4444" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">डैशबोर्ड आंकड़े</h2>
        <p className="text-gray-600">पंचाल समाज जनगणना का संपूर्ण विवरण</p>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium opacity-90">कुल गांव</CardTitle>
              <MapPin className="w-4 h-4 opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalVillages}</div>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <span>सक्रिय: {statistics.activeVillages}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium opacity-90">कुल चोखला</CardTitle>
              <Users className="w-4 h-4 opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalChoklas}</div>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <span>सक्रिय: {statistics.activeChoklas}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium opacity-90">कुल उपयोगकर्ता</CardTitle>
              <UserCheck className="w-4 h-4 opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalUsers}</div>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <span>सक्रिय: {statistics.activeUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium opacity-90">कुल परिवार</CardTitle>
              <Home className="w-4 h-4 opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalFamilies}</div>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <span>जनसंख्या: {statistics.totalPopulation}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            मासिक वृद्धि दर (%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {growthData.map((item) => (
              <div key={item.name} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>
                  {item.value > 0 ? "+" : ""}
                  {item.value}%
                </div>
                <div className="text-sm text-gray-600">{item.name}</div>
                <div className="flex items-center justify-center mt-2">
                  {item.value > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>राज्यवार वितरण</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stateChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="villages" fill="#3B82F6" name="गांव" />
                <Bar dataKey="families" fill="#10B981" name="परिवार" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Facility Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>सुविधा उपलब्धता (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facilityData.map((facility) => {
                const Icon = facility.icon
                return (
                  <div key={facility.name} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-24">
                      <Icon className="w-4 h-4" style={{ color: facility.color }} />
                      <span className="text-sm font-medium">{facility.name}</span>
                    </div>
                    <div className="flex-1">
                      <Progress value={facility.value} className="h-2" />
                    </div>
                    <div className="w-12 text-right">
                      <span className="text-sm font-bold">{facility.value}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            हाल की गतिविधि
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.recentRegistrations}</div>
              <div className="text-sm text-blue-800">नए पंजीकरण</div>
              <div className="text-xs text-blue-600 mt-1">पिछले 30 दिनों में</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round((statistics.activeVillages / statistics.totalVillages) * 100)}%
              </div>
              <div className="text-sm text-green-800">सक्रिय गांव</div>
              <div className="text-xs text-green-600 mt-1">कुल गांवों में से</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {Math.round(statistics.totalPopulation / statistics.totalFamilies)}
              </div>
              <div className="text-sm text-yellow-800">औसत परिवार आकार</div>
              <div className="text-xs text-yellow-600 mt-1">व्यक्ति प्रति परिवार</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  MapPin,
  Users,
  UserCheck,
  Home,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Zap,
  Droplets,
  GraduationCap,
  Heart,
  RouteIcon as Road,
} from "lucide-react"
import type { Statistics } from "./types"

interface StatisticsManagementProps {
  statistics: Statistics | null
  isLoading: boolean
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

export function StatisticsManagement({ statistics, isLoading }: StatisticsManagementProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
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
          <p className="text-gray-500 text-center">डैशबोर्ड के आंकड़े लोड करने में समस्या हुई है।</p>
        </CardContent>
      </Card>
    )
  }

  const facilityData = [
    { name: "बिजली", value: statistics.facilityStats.electricity, icon: Zap, color: "#F59E0B" },
    { name: "पानी", value: statistics.facilityStats.waterSupply, icon: Droplets, color: "#3B82F6" },
    { name: "स्कूल", value: statistics.facilityStats.school, icon: GraduationCap, color: "#10B981" },
    { name: "स्वास्थ्य", value: statistics.facilityStats.healthCenter, icon: Heart, color: "#EF4444" },
    { name: "सड़क", value: statistics.facilityStats.roadAccess, icon: Road, color: "#6B7280" },
  ]

  const growthData = [
    { name: "गांव", current: statistics.totalVillages, growth: statistics.monthlyGrowth.villages },
    { name: "चोखला", current: statistics.totalChoklas, growth: statistics.monthlyGrowth.choklas },
    { name: "उपयोगकर्ता", current: statistics.totalUsers, growth: statistics.monthlyGrowth.users },
    { name: "परिवार", current: statistics.totalFamilies, growth: statistics.monthlyGrowth.families },
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
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">कुल गांव</p>
                <p className="text-3xl font-bold">{statistics.totalVillages.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {statistics.monthlyGrowth.villages >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-sm">
                    {statistics.monthlyGrowth.villages >= 0 ? "+" : ""}
                    {statistics.monthlyGrowth.villages}% इस महीने
                  </span>
                </div>
              </div>
              <MapPin className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">कुल चोखला</p>
                <p className="text-3xl font-bold">{statistics.totalChoklas.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {statistics.monthlyGrowth.choklas >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-sm">
                    {statistics.monthlyGrowth.choklas >= 0 ? "+" : ""}
                    {statistics.monthlyGrowth.choklas}% इस महीने
                  </span>
                </div>
              </div>
              <UserCheck className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">कुल उपयोगकर्ता</p>
                <p className="text-3xl font-bold">{statistics.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {statistics.monthlyGrowth.users >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-sm">
                    {statistics.monthlyGrowth.users >= 0 ? "+" : ""}
                    {statistics.monthlyGrowth.users}% इस महीने
                  </span>
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">कुल परिवार</p>
                <p className="text-3xl font-bold">{statistics.totalFamilies.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {statistics.monthlyGrowth.families >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-sm">
                    {statistics.monthlyGrowth.families >= 0 ? "+" : ""}
                    {statistics.monthlyGrowth.families}% इस महीने
                  </span>
                </div>
              </div>
              <Home className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">कुल जनसंख्या</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalPopulation.toLocaleString()}</p>
              </div>
              <Users className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">सक्रिय गांव</p>
                <p className="text-2xl font-bold text-green-600">{statistics.activeVillages}</p>
                <Progress value={(statistics.activeVillages / statistics.totalVillages) * 100} className="mt-2" />
              </div>
              <MapPin className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">सक्रिय चोखला</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.activeChoklas}</p>
                <Progress value={(statistics.activeChoklas / statistics.totalChoklas) * 100} className="mt-2" />
              </div>
              <UserCheck className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">हाल की पंजीकरण</p>
                <p className="text-2xl font-bold text-purple-600">{statistics.recentRegistrations}</p>
                <p className="text-xs text-gray-500 mt-1">पिछले 30 दिनों में</p>
              </div>
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>राज्यवार वितरण</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.stateDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
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
            <CardTitle>सुविधा आंकड़े</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facilityData.map((facility, index) => {
                const Icon = facility.icon
                const percentage = (facility.value / statistics.totalVillages) * 100

                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${facility.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: facility.color }} />
                      </div>
                      <span className="font-medium">{facility.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{facility.value}</div>
                      <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Trends */}
      <Card>
        <CardHeader>
          <CardTitle>विकास रुझान</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={2} name="वर्तमान संख्या" />
              <Line type="monotone" dataKey="growth" stroke="#10B981" strokeWidth={2} name="मासिक वृद्धि %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Population Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>जनसंख्या वितरण</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statistics.stateDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ state, population }) => `${state}: ${population}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="population"
              >
                {statistics.stateDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

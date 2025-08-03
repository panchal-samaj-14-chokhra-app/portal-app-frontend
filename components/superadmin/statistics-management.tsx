"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart3,
  Users,
  MapPin,
  Home,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Target,
  Award,
} from "lucide-react"
import type { Statistics } from "./types"

interface StatisticsManagementProps {
  statistics: Statistics | null
  isLoading: boolean
}

export function StatisticsManagement({ statistics, isLoading }: StatisticsManagementProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">आंकड़े लोड नहीं हो सके</h3>
          <p className="text-gray-500 text-center">कृपया पेज रीफ्रेश करें</p>
        </CardContent>
      </Card>
    )
  }

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (rate < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Activity className="w-4 h-4 text-gray-600" />
  }

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return "text-green-600"
    if (rate < 0) return "text-red-600"
    return "text-gray-600"
  }

  const statsCards = [
    {
      title: "कुल गांव",
      value: statistics.totalVillages,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "पंजीकृत गांवों की संख्या",
    },
    {
      title: "कुल चोखला",
      value: statistics.totalChoklas,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "सक्रिय चोखला खाते",
    },
    {
      title: "कुल परिवार",
      value: statistics.totalFamilies,
      icon: Home,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "पंजीकृत परिवारों की संख्या",
    },
    {
      title: "कुल जनसंख्या",
      value: statistics.totalPopulation,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "कुल व्यक्तियों की संख्या",
    },
    {
      title: "सक्रिय उपयोगकर्ता",
      value: statistics.activeUsers,
      icon: Activity,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      description: "वर्तमान में सक्रिय",
    },
    {
      title: "नए पंजीकरण",
      value: statistics.recentRegistrations,
      icon: Calendar,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "इस महीने नए",
    },
    {
      title: "पूर्णता दर",
      value: `${statistics.completionRate}%`,
      icon: Target,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "डेटा पूर्णता",
    },
    {
      title: "वृद्धि दर",
      value: `${statistics.growthRate > 0 ? "+" : ""}${statistics.growthRate}%`,
      icon: Award,
      color: getGrowthColor(statistics.growthRate),
      bgColor: statistics.growthRate > 0 ? "bg-green-50" : statistics.growthRate < 0 ? "bg-red-50" : "bg-gray-50",
      description: "मासिक वृद्धि",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">डैशबोर्ड और आंकड़े</h2>
          <p className="text-gray-600">पंचाल समाज जनगणना की संपूर्ण रिपोर्ट</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          लाइव डेटा
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {typeof stat.value === "number" ? stat.value.toLocaleString("hi-IN") : stat.value}
                  </span>
                  {stat.title === "वृद्धि दर" && getGrowthIcon(statistics.growthRate)}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Progress and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              डेटा पूर्णता प्रगति
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">गांव पंजीकरण</span>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">परिवार डेटा</span>
                <span className="text-sm text-gray-600">{statistics.completionRate}%</span>
              </div>
              <Progress value={statistics.completionRate} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">चोखला सत्यापन</span>
                <span className="text-sm text-gray-600">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">डेटा गुणवत्ता</span>
                <span className="text-sm text-gray-600">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              क्षेत्रीय वितरण
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">गुजरात</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {Math.floor(statistics.totalVillages * 0.65)} गांव
                  </div>
                  <div className="text-xs text-gray-500">65%</div>
                </div>
              </div>
              <Progress value={65} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">राजस्थान</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {Math.floor(statistics.totalVillages * 0.35)} गांव
                  </div>
                  <div className="text-xs text-gray-500">35%</div>
                </div>
              </div>
              <Progress value={35} className="h-2" />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{Math.floor(statistics.totalFamilies * 0.68)}</div>
                  <div className="text-xs text-gray-500">गुजरात परिवार</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{Math.floor(statistics.totalFamilies * 0.32)}</div>
                  <div className="text-xs text-gray-500">राजस्थान परिवार</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            हाल की गतिविधि सारांश
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">{statistics.recentRegistrations}</div>
              <div className="text-sm text-blue-800 font-medium">नए पंजीकरण</div>
              <div className="text-xs text-blue-600 mt-1">इस महीने</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">{statistics.activeUsers}</div>
              <div className="text-sm text-green-800 font-medium">सक्रिय उपयोगकर्ता</div>
              <div className="text-xs text-green-600 mt-1">आज</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">{statistics.completionRate}%</div>
              <div className="text-sm text-purple-800 font-medium">पूर्णता दर</div>
              <div className="text-xs text-purple-600 mt-1">औसत</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

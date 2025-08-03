"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, MapPin, Users, Home, UserCheck, TrendingUp } from "lucide-react"
import type { Statistics } from "./types"

interface StatisticsManagementProps {
  isLoading?: boolean
}

export function StatisticsManagement({ isLoading = false }: StatisticsManagementProps) {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockStatistics: Statistics = {
          totalVillages: 25,
          totalChokhlas: 8,
          totalFamilies: 1250,
          totalMembers: 5000,
          activeUsers: 15,
          recentRegistrations: 12,
        }

        setStatistics(mockStatistics)
      } catch (error) {
        console.error("Error fetching statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  const statsCards = [
    {
      title: "कुल गांव",
      value: statistics?.totalVillages || 0,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "कुल चोखला",
      value: statistics?.totalChokhlas || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "कुल परिवार",
      value: statistics?.totalFamilies || 0,
      icon: Home,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "कुल सदस्य",
      value: statistics?.totalMembers || 0,
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "सक्रिय उपयोगकर्ता",
      value: statistics?.activeUsers || 0,
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "हाल के पंजीकरण",
      value: statistics?.recentRegistrations || 0,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">आंकड़े और रिपोर्ट</h2>
        <p className="text-gray-600">सिस्टम के सभी आंकड़ों का विस्तृत विवरण</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString("hi-IN")}</div>
                <p className="text-xs text-gray-500 mt-1">कुल पंजीकृत संख्या</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              मासिक पंजीकरण ट्रेंड
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">चार्ट जल्द ही उपलब्ध होगा</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              राज्यवार वितरण
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">मैप व्यू जल्द ही उपलब्ध होगा</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

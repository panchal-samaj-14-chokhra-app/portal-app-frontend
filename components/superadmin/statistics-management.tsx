"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, MapPin, Home, TrendingUp, Activity } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

export function StatisticsManagement() {
  const { stats, isLoadingStats } = useSuperAdmin()

  if (isLoadingStats) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">आंकड़े और रिपोर्ट</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">आंकड़े उपलब्ध नहीं</h3>
        <p className="text-gray-600">कृपया बाद में पुनः प्रयास करें।</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">आंकड़े और रिपोर्ट</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल गांव</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalVillages}</div>
            <p className="text-xs text-gray-600">सक्रिय: {stats.activeVillages}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल चोखला</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalChokhlas}</div>
            <p className="text-xs text-gray-600">सक्रिय: {stats.activeChokhlas}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल परिवार</CardTitle>
            <Home className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalFamilies}</div>
            <p className="text-xs text-gray-600">पंजीकृत परिवार</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल जनसंख्या</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalPopulation}</div>
            <p className="text-xs text-gray-600">कुल सदस्य</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            मासिक वृद्धि दर
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">गांव</span>
                <span className="text-sm text-green-600">+{stats.monthlyGrowth.villages}%</span>
              </div>
              <Progress value={stats.monthlyGrowth.villages} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">चोखला</span>
                <span className="text-sm text-green-600">+{stats.monthlyGrowth.chokhlas}%</span>
              </div>
              <Progress value={stats.monthlyGrowth.chokhlas} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">उपयोगकर्ता</span>
                <span className="text-sm text-green-600">+{stats.monthlyGrowth.users}%</span>
              </div>
              <Progress value={stats.monthlyGrowth.users} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">परिवार</span>
                <span className="text-sm text-green-600">+{stats.monthlyGrowth.families}%</span>
              </div>
              <Progress value={stats.monthlyGrowth.families} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* State Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>राज्यवार वितरण</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.stateDistribution.map((state, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{state.state}</h4>
                  <p className="text-sm text-gray-600">
                    {state.villages} गांव • {state.families} परिवार
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">{state.population}</p>
                  <p className="text-xs text-gray-600">जनसंख्या</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Facility Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>सुविधाओं की उपलब्धता</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">बिजली</span>
                <span className="text-sm">{stats.facilityStats.electricity}%</span>
              </div>
              <Progress value={stats.facilityStats.electricity} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">पानी की आपूर्ति</span>
                <span className="text-sm">{stats.facilityStats.waterSupply}%</span>
              </div>
              <Progress value={stats.facilityStats.waterSupply} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">स्कूल</span>
                <span className="text-sm">{stats.facilityStats.school}%</span>
              </div>
              <Progress value={stats.facilityStats.school} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">स्वास्थ्य केंद्र</span>
                <span className="text-sm">{stats.facilityStats.healthCenter}%</span>
              </div>
              <Progress value={stats.facilityStats.healthCenter} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">सड़क पहुंच</span>
                <span className="text-sm">{stats.facilityStats.roadAccess}%</span>
              </div>
              <Progress value={stats.facilityStats.roadAccess} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

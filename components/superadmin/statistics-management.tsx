"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, MapPin, Building2, Activity } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

export function StatisticsManagement() {
  const { stats, isLoadingStats } = useSuperAdmin()

  if (isLoadingStats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">आंकड़े उपलब्ध नहीं</h3>
          <p className="text-gray-500">आंकड़े लोड करने में समस्या हुई है।</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">सिस्टम आंकड़े</h1>
        <p className="text-gray-600 mt-1">संपूर्ण सिस्टम की जानकारी और विश्लेषण</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल गांव</CardTitle>
            <MapPin className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVillages}</div>
            <p className="text-xs text-blue-100">
              सक्रिय: {stats.activeVillages} ({Math.round((stats.activeVillages / stats.totalVillages) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल चोखला</CardTitle>
            <Building2 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChokhlas}</div>
            <p className="text-xs text-green-100">
              सक्रिय: {stats.activeChokhlas} ({Math.round((stats.activeChokhlas / stats.totalChokhlas) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल उपयोगकर्ता</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-purple-100">
              सक्रिय: {stats.activeUsers} ({Math.round((stats.activeUsers / stats.totalUsers) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल जनसंख्या</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPopulation.toLocaleString()}</div>
            <p className="text-xs text-orange-100">परिवार: {stats.totalFamilies.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              मासिक वृद्धि
            </CardTitle>
            <CardDescription>पिछले महीने की तुलना में प्रतिशत वृद्धि</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>गांव</span>
                  <span className="font-medium text-green-600">+{stats.monthlyGrowth.villages}%</span>
                </div>
                <Progress value={stats.monthlyGrowth.villages} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>चोखला</span>
                  <span className="font-medium text-blue-600">+{stats.monthlyGrowth.choklas}%</span>
                </div>
                <Progress value={stats.monthlyGrowth.choklas} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>उपयोगकर्ता</span>
                  <span className="font-medium text-purple-600">+{stats.monthlyGrowth.users}%</span>
                </div>
                <Progress value={stats.monthlyGrowth.users} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>परिवार</span>
                  <span className="font-medium text-orange-600">+{stats.monthlyGrowth.families}%</span>
                </div>
                <Progress value={stats.monthlyGrowth.families} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              सुविधाओं की उपलब्धता
            </CardTitle>
            <CardDescription>गांवों में उपलब्ध सुविधाओं का प्रतिशत</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>बिजली</span>
                  <span className="font-medium">{stats.facilityStats.electricity}%</span>
                </div>
                <Progress value={stats.facilityStats.electricity} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>पानी की आपूर्ति</span>
                  <span className="font-medium">{stats.facilityStats.waterSupply}%</span>
                </div>
                <Progress value={stats.facilityStats.waterSupply} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>स्कूल</span>
                  <span className="font-medium">{stats.facilityStats.school}%</span>
                </div>
                <Progress value={stats.facilityStats.school} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>स्वास्थ्य केंद्र</span>
                  <span className="font-medium">{stats.facilityStats.healthCenter}%</span>
                </div>
                <Progress value={stats.facilityStats.healthCenter} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>सड़क पहुंच</span>
                  <span className="font-medium">{stats.facilityStats.roadAccess}%</span>
                </div>
                <Progress value={stats.facilityStats.roadAccess} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* State Distribution */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>राज्यवार वितरण</CardTitle>
          <CardDescription>विभिन्न राज्यों में गांवों और जनसंख्या का वितरण</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.stateDistribution.map((state, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{state.state}</h4>
                  <p className="text-sm text-gray-600">
                    {state.villages} गांव • {state.families} परिवार
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{state.population.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">जनसंख्या</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

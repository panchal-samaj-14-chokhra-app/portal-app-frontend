"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Building2, MapPin, TrendingUp } from "lucide-react"

interface StatisticsManagementProps {
  villageCount?: number
  chokhlaCount?: number
  userCount?: number
}

export function StatisticsManagement({ villageCount = 0, chokhlaCount = 0, userCount = 0 }: StatisticsManagementProps) {
  const stats = [
    {
      title: "कुल गांव",
      value: villageCount,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "कुल चौकला",
      value: chokhlaCount,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "कुल यूज़र",
      value: userCount,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "वृद्धि दर",
      value: "+12%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ]

  return (
    <Card className="mb-8 shadow-lg border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          आँकड़े और रिपोर्ट
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className={`${stat.borderColor} border-2 hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {typeof stat.value === "number" ? stat.value.toLocaleString("hi-IN") : stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Placeholder for future charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700 text-lg">मासिक वृद्धि</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">चार्ट जल्द ही उपलब्ध होगा</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-700 text-lg">क्षेत्रीय वितरण</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">मैप व्यू जल्द ही उपलब्ध होगा</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

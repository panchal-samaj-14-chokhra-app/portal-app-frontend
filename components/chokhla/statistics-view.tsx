"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, School, Heart, Building, TrendingUp, BarChart3, PieChart, Activity } from "lucide-react"

interface Chokhla {
  id: string
  name: string
  adhyaksh: string
  contactNumber: string
  state: string
  district: string
  villageName: string
  villages?: Array<{
    id: string
    name: string
    isVillageHaveSchool: boolean
    isVillageHavePrimaryHealthCare: boolean
    isVillageHaveCommunityHall: boolean
    _count?: {
      families: number
    }
  }>
}

interface StatisticsViewProps {
  chokhla: Chokhla
}

export function StatisticsView({ chokhla }: StatisticsViewProps) {
  const villages = chokhla?.villages || []
  const totalVillages = villages.length
  const totalFamilies = villages.reduce((acc, village) => acc + (village._count?.families || 0), 0)
  const villagesWithSchool = villages.filter((v) => v.isVillageHaveSchool).length
  const villagesWithHealthcare = villages.filter((v) => v.isVillageHavePrimaryHealthCare).length
  const villagesWithCommunityHall = villages.filter((v) => v.isVillageHaveCommunityHall).length

  const schoolPercentage = totalVillages > 0 ? Math.round((villagesWithSchool / totalVillages) * 100) : 0
  const healthcarePercentage = totalVillages > 0 ? Math.round((villagesWithHealthcare / totalVillages) * 100) : 0
  const communityHallPercentage = totalVillages > 0 ? Math.round((villagesWithCommunityHall / totalVillages) * 100) : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">आँकड़े और रिपोर्ट</h2>
        <p className="text-sm text-gray-600">{chokhla?.name} के लिए विस्तृत आंकड़े</p>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">कुल गांव</p>
                <p className="text-3xl font-bold text-blue-700">{totalVillages}</p>
                <p className="text-xs text-blue-500 mt-1">सक्रिय गांव</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">कुल परिवार</p>
                <p className="text-3xl font-bold text-green-700">{totalFamilies}</p>
                <p className="text-xs text-green-500 mt-1">पंजीकृत परिवार</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">औसत परिवार/गांव</p>
                <p className="text-3xl font-bold text-purple-700">
                  {totalVillages > 0 ? Math.round(totalFamilies / totalVillages) : 0}
                </p>
                <p className="text-xs text-purple-500 mt-1">प्रति गांव</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">कवरेज दर</p>
                <p className="text-3xl font-bold text-orange-700">
                  {totalVillages > 0 ? Math.round((totalFamilies / (totalVillages * 50)) * 100) : 0}%
                </p>
                <p className="text-xs text-orange-500 mt-1">अनुमानित</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facilities Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
              सुविधाओं का विवरण
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <School className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">स्कूल</p>
                    <p className="text-sm text-green-600">{villagesWithSchool} गांवों में</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {schoolPercentage}%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">स्वास्थ्य केंद्र</p>
                    <p className="text-sm text-red-600">{villagesWithHealthcare} गांवों में</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  {healthcarePercentage}%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-800">सामुदायिक हॉल</p>
                    <p className="text-sm text-blue-600">{villagesWithCommunityHall} गांवों में</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {communityHallPercentage}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <PieChart className="w-5 h-5 mr-2 text-orange-500" />
              चोखरा की जानकारी
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">अध्यक्ष</p>
                    <p className="text-lg font-semibold text-gray-900">{chokhla?.adhyaksh || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">संपर्क नंबर</p>
                    <p className="text-lg font-semibold text-gray-900">{chokhla?.contactNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">राज्य</p>
                    <p className="text-lg font-semibold text-gray-900">{chokhla?.state || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">जिला</p>
                    <p className="text-lg font-semibold text-gray-900">{chokhla?.district || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Village Summary */}
      {totalVillages > 0 && (
        <Card className="border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <MapPin className="w-5 h-5 mr-2 text-orange-500" />
              गांवों का सारांश
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {villages.map((village) => (
                <div key={village.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{village.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{village._count?.families || 0} परिवार</p>
                  <div className="flex flex-wrap gap-1">
                    {village.isVillageHaveSchool && (
                      <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                        स्कूल
                      </Badge>
                    )}
                    {village.isVillageHavePrimaryHealthCare && (
                      <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                        स्वास्थ्य
                      </Badge>
                    )}
                    {village.isVillageHaveCommunityHall && (
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                        हॉल
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

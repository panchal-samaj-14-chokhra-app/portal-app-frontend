"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, MapPin, Activity, PieChart, Calendar } from "lucide-react"

export interface ChokhlaStats {
  genders: {
    MALE: number
    FEMALE: number
    OTHER: number
  }
  villageCount: number
  familyCount: number
  userCount: number
}

export interface Chokhla {
  id: string
  name: string
  adhyaksh: string
  contactNumber: string
  state: string
  district: string
  villageName: string
  createdDate: string
  updatedDate: string
  stats: ChokhlaStats
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
  const stats = chokhla?.stats || {}
  const villages = chokhla?.villages || []

  const totalMembers = (stats.genders?.MALE || 0) + (stats.genders?.FEMALE || 0) + (stats.genders?.OTHER || 0)
  const totalVillages = chokhla?.stats?.villageCount || villages.length
  const totalFamilies = chokhla?.stats?.familyCount || villages.reduce((sum, village) => sum + (village._count?.families || 0), 0)
  const villagesWithSchool = villages.filter((v) => v.isVillageHaveSchool).length
  const villagesWithHealthcare = villages.filter((v) => v.isVillageHavePrimaryHealthCare).length
  const villagesWithCommunityHall = villages.filter((v) => v.isVillageHaveCommunityHall).length

  const schoolPercentage = totalVillages > 0 ? Math.round((villagesWithSchool / totalVillages) * 100) : 0
  const healthcarePercentage = totalVillages > 0 ? Math.round((villagesWithHealthcare / totalVillages) * 100) : 0
  const communityHallPercentage = totalVillages > 0 ? Math.round((villagesWithCommunityHall / totalVillages) * 100) : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">कुल गांव</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-700">{totalVillages}</p>
                <p className="text-xs text-blue-500 mt-1">सक्रिय गांव</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">कुल परिवार</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-700">{totalFamilies}</p>
                <p className="text-xs text-green-500 mt-1">पंजीकृत परिवार</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">कुल सदस्य</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-700">{totalMembers}</p>
                <p className="text-xs text-purple-500 mt-1">पंजीकृत सदस्य</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">औसत परिवार/गांव</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-700">
                  {totalVillages > 0 ? Math.round(totalFamilies / totalVillages) : 0}
                </p>
                <p className="text-xs text-orange-500 mt-1">प्रति गांव</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gender Distribution and Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Gender Breakdown */}
        <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 sm:w-6 sm:h-6" />
              लिंग वितरण
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-blue-800">पुरुष</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-700 text-xl">{stats.genders?.MALE || 0}</div>
                  <div className="text-sm text-blue-600">
                    {totalMembers > 0 ? Math.round(((stats.genders?.MALE || 0) / totalMembers) * 100) : 0}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                  <span className="font-medium text-pink-800">महिला</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-pink-700 text-xl">{stats.genders?.FEMALE || 0}</div>
                  <div className="text-sm text-pink-600">
                    {totalMembers > 0 ? Math.round(((stats.genders?.FEMALE || 0) / totalMembers) * 100) : 0}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                  <span className="font-medium text-gray-800">अन्य</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-700 text-xl">{stats.genders?.OTHER || 0}</div>
                  <div className="text-sm text-gray-600">
                    {totalMembers > 0 ? Math.round(((stats.genders?.OTHER || 0) / totalMembers) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facilities Statistics */}
        <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              सुविधाओं का विवरण
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">स्कूल</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-700 text-xl">{villagesWithSchool}</div>
                  <div className="text-sm text-green-600">{schoolPercentage}% गांवों में</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-red-800">स्वास्थ्य केंद्र</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-700 text-xl">{villagesWithHealthcare}</div>
                  <div className="text-sm text-red-600">{healthcarePercentage}% गांवों में</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-blue-800">सामुदायिक हॉल</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-700 text-xl">{villagesWithCommunityHall}</div>
                  <div className="text-sm text-blue-600">{communityHallPercentage}% गांवों में</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chokhla Information */}
      <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            चोखरा की जानकारी
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">अध्यक्ष</span>
              </div>
              <p className="text-lg font-semibold text-orange-900">{chokhla?.adhyaksh || "N/A"}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">स्थान</span>
              </div>
              <p className="text-lg font-semibold text-blue-900">
                {chokhla?.district}, {chokhla?.state}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">निर्माण तिथि</span>
              </div>
              <p className="text-lg font-semibold text-green-900">
                {chokhla?.createdDate ? new Date(chokhla.createdDate).toLocaleDateString("hi-IN") : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Village Summary */}
      {totalVillages > 0 && (
        <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              गांवों का सारांश
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {villages.map((village) => (
                <div
                  key={village.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
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

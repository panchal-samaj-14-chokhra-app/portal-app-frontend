"use client"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Building2, Home, TrendingUp, Calendar, MapPin, UserCheck } from "lucide-react"

const StatisticsView: React.FC = () => {
  // Mock data - replace with actual data from your API
  const stats = {
    totalVillages: 45,
    totalChokhlas: 8,
    totalFamilies: 1250,
    totalMembers: 4800,
    activeUsers: 52,
    maleMembers: 2400,
    femaleMembers: 2300,
    otherMembers: 100,
    recentRegistrations: 25,
    completedProfiles: 1180,
    pendingVerifications: 70,
  }

  const recentActivity = [
    { id: 1, action: "नया गांव पंजीकृत", details: "राजपुरा गांव", time: "2 घंटे पहले" },
    { id: 2, action: "परिवार जोड़ा गया", details: "शर्मा परिवार", time: "4 घंटे पहले" },
    { id: 3, action: "प्रोफाइल अपडेट", details: "गुप्ता परिवार", time: "6 घंटे पहले" },
    { id: 4, action: "नया यूज़र", details: "राम कुमार", time: "1 दिन पहले" },
    { id: 5, action: "चोखरा अपडेट", details: "मध्य चोखरा", time: "2 दिन पहले" },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">कुल गांव</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-700">{stats.totalVillages}</p>
                <p className="text-xs text-blue-500 mt-1">+3 इस महीने</p>
              </div>
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">कुल परिवार</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-700">{stats.totalFamilies}</p>
                <p className="text-xs text-green-500 mt-1">+15 इस सप्ताह</p>
              </div>
              <Home className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">कुल सदस्य</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-700">{stats.totalMembers}</p>
                <p className="text-xs text-purple-500 mt-1">+42 इस महीने</p>
              </div>
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">सक्रिय यूज़र</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-700">{stats.activeUsers}</p>
                <p className="text-xs text-orange-500 mt-1">+5 इस सप्ताह</p>
              </div>
              <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <BarChart3 className="w-5 h-5 mr-2" />
              लिंग वितरण
            </CardTitle>
            <CardDescription>सदस्यों का लिंग के आधार पर वितरण</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">पुरुष</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-700">{stats.maleMembers}</div>
                  <div className="text-sm text-blue-600">50%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                  <span className="font-medium">महिला</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-pink-700">{stats.femaleMembers}</div>
                  <div className="text-sm text-pink-600">48%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                  <span className="font-medium">अन्य</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-700">{stats.otherMembers}</div>
                  <div className="text-sm text-gray-600">2%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Calendar className="w-5 h-5 mr-2" />
              हाल की गतिविधि
            </CardTitle>
            <CardDescription>सिस्टम में हाल की गतिविधियां</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{activity.action}</div>
                    <div className="text-sm text-gray-600 truncate">{activity.details}</div>
                    <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-medium">चोखरा</p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-700">{stats.totalChokhlas}</p>
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mt-2">सभी सक्रिय</Badge>
              </div>
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-600 text-sm font-medium">पूर्ण प्रोफाइल</p>
                <p className="text-xl sm:text-2xl font-bold text-teal-700">{stats.completedProfiles}</p>
                <Badge className="bg-teal-100 text-teal-700 border-teal-200 mt-2">94% पूर्ण</Badge>
              </div>
              <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">लंबित सत्यापन</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-700">{stats.pendingVerifications}</p>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 mt-2">कार्रवाई आवश्यक</Badge>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <BarChart3 className="w-5 h-5 mr-2" />
            सिस्टम सारांश
          </CardTitle>
          <CardDescription className="text-orange-100">पंचाल समाज 14 चोखरा प्रबंधन सिस्टम का समग्र विवरण</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.totalVillages}</div>
              <div className="text-orange-100 text-sm">गांव</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalFamilies}</div>
              <div className="text-orange-100 text-sm">परिवार</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <div className="text-orange-100 text-sm">सदस्य</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <div className="text-orange-100 text-sm">यूज़र</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatisticsView

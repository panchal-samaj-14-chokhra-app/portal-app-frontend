"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Building2, TrendingUp, Calendar, Activity } from "lucide-react"

export default function StatisticsView() {
  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 1234,
    totalChokhlas: 45,
    totalVillages: 567,
    totalFamilies: 8901,
    totalMembers: 23456,
    activeUsers: 1100,
    recentRegistrations: 89,
    monthlyGrowth: 12.5,
  }

  const recentActivity = [
    { id: 1, action: "नया उपयोगकर्ता पंजीकृत", user: "राम शर्मा", time: "2 मिनट पहले", type: "user" },
    { id: 2, action: "गांव की जानकारी अपडेट", user: "सीता देवी", time: "15 मिनट पहले", type: "village" },
    { id: 3, action: "नया चोखला बनाया गया", user: "गीता पटेल", time: "1 घंटा पहले", type: "chokhla" },
    { id: 4, action: "परिवार की जानकारी जोड़ी गई", user: "मोहन गुप्ता", time: "2 घंटे पहले", type: "family" },
    { id: 5, action: "उपयोगकर्ता प्रोफाइल अपडेट", user: "रीता सिंह", time: "3 घंटे पहले", type: "user" },
  ]

  const monthlyData = [
    { month: "जनवरी", users: 950, families: 7800, members: 20100 },
    { month: "फरवरी", users: 1020, families: 8200, members: 21500 },
    { month: "मार्च", users: 1150, families: 8600, members: 22800 },
    { month: "अप्रैल", users: 1234, families: 8901, members: 23456 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">आंकड़े और रिपोर्ट</h1>
        <p className="text-gray-600">सिस्टम के सभी आंकड़े और विश्लेषण देखें</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल उपयोगकर्ता</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString("hi-IN")}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.recentRegistrations}</span> इस महीने
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल चोखला</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChokhlas}</div>
            <p className="text-xs text-muted-foreground">पंजीकृत चोखला</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल गांव</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVillages.toLocaleString("hi-IN")}</div>
            <p className="text-xs text-muted-foreground">सभी चोखलों में</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल सदस्य</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers.toLocaleString("hi-IN")}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.monthlyGrowth}%</span> पिछले महीने से
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल परिवार</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFamilies.toLocaleString("hi-IN")}</div>
            <p className="text-xs text-muted-foreground">पंजीकृत परिवार</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">सक्रिय उपयोगकर्ता</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString("hi-IN")}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% कुल में से
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">मासिक वृद्धि</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">पिछले महीने की तुलना में</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              हाल की गतिविधि
            </CardTitle>
            <CardDescription>सिस्टम में हाल के बदलाव</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "user"
                        ? "bg-blue-500"
                        : activity.type === "village"
                          ? "bg-green-500"
                          : activity.type === "chokhla"
                            ? "bg-orange-500"
                            : "bg-purple-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type === "user" && "उपयोगकर्ता"}
                    {activity.type === "village" && "गांव"}
                    {activity.type === "chokhla" && "चोखला"}
                    {activity.type === "family" && "परिवार"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              मासिक रुझान
            </CardTitle>
            <CardDescription>पिछले 4 महीनों का डेटा</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{data.month}</div>
                  <div className="flex space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{data.users}</div>
                      <div className="text-xs text-gray-500">उपयोगकर्ता</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{data.families.toLocaleString("hi-IN")}</div>
                      <div className="text-xs text-gray-500">परिवार</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">{data.members.toLocaleString("hi-IN")}</div>
                      <div className="text-xs text-gray-500">सदस्य</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>प्रदर्शन मेट्रिक्स</CardTitle>
          <CardDescription>सिस्टम के मुख्य प्रदर्शन संकेतक</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-gray-600">डेटा पूर्णता दर</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">उपयोगकर्ता संतुष्टि</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2.3s</div>
              <div className="text-sm text-gray-600">औसत लोड समय</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-gray-600">सिस्टम अपटाइम</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

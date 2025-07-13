"use client"

import {
  Users,
  Home,
  MapPin,
  CreditCard,
  UserCheck,
  TrendingUp,
  GraduationCap,
  Heart,
  Briefcase,
  DollarSign,
  Shield,
  Building,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const statsData = [
  {
    title: "कुल परिवार",
    value: "2,847",
    change: "+12%",
    icon: Home,
    color: "from-orange-500 to-orange-600",
    description: "पंजीकृत परिवार",
  },
  {
    title: "कुल सदस्य",
    value: "12,456",
    change: "+8%",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    description: "सभी आयु समूह",
  },
  {
    title: "सक्रिय गांव",
    value: "24",
    change: "+2",
    icon: MapPin,
    color: "from-green-500 to-green-600",
    description: "पंजीकृत गांव",
  },
  {
    title: "जारी पारिवारिक कार्ड",
    value: "2,234",
    change: "78%",
    icon: CreditCard,
    color: "from-purple-500 to-purple-600",
    description: "कुल परिवारों का 78%",
  },
  {
    title: "प्रवासी सदस्य",
    value: "1,876",
    change: "+15%",
    icon: UserCheck,
    color: "from-red-500 to-red-600",
    description: "काम के लिए बाहर",
  },
  {
    title: "सत्यापित डेटा",
    value: "89%",
    change: "+5%",
    icon: TrendingUp,
    color: "from-indigo-500 to-indigo-600",
    description: "पूर्ण सत्यापन",
  },
]

const educationStats = [
  {
    title: "स्नातक और उससे ऊपर",
    value: "2,145",
    percentage: "17%",
    icon: GraduationCap,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "माध्यमिक शिक्षा",
    value: "4,567",
    percentage: "37%",
    icon: GraduationCap,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "प्राथमिक शिक्षा",
    value: "3,234",
    percentage: "26%",
    icon: GraduationCap,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "निरक्षर",
    value: "2,510",
    percentage: "20%",
    icon: GraduationCap,
    color: "from-red-500 to-red-600",
  },
]

const healthInsuranceStats = [
  {
    title: "स्वास्थ्य बीमा",
    value: "8,945",
    percentage: "72%",
    icon: Heart,
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "जीवन बीमा",
    value: "6,234",
    percentage: "50%",
    icon: Shield,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    title: "दुर्घटना बीमा",
    value: "4,123",
    percentage: "33%",
    icon: Shield,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "सरकारी योजनाएं",
    value: "9,876",
    percentage: "79%",
    icon: Building,
    color: "from-green-500 to-green-600",
  },
]

const employmentStats = [
  {
    title: "सरकारी नौकरी",
    value: "1,234",
    percentage: "15%",
    icon: Building,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "निजी नौकरी",
    value: "2,456",
    percentage: "30%",
    icon: Briefcase,
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "किसान",
    value: "3,567",
    percentage: "43%",
    icon: Home,
    color: "from-green-500 to-green-600",
  },
  {
    title: "व्यापारी",
    value: "987",
    percentage: "12%",
    icon: DollarSign,
    color: "from-yellow-500 to-yellow-600",
  },
]

const donationStats = [
  {
    title: "कुल दान संग्रह",
    value: "₹12,45,000",
    change: "+25%",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
    description: "इस वर्ष",
  },
  {
    title: "दानदाता परिवार",
    value: "1,876",
    percentage: "66%",
    icon: Heart,
    color: "from-pink-500 to-pink-600",
    description: "कुल परिवारों का",
  },
]

export function StatsCards() {
  return (
    <div className="space-y-8">
      {/* Main Statistics */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">मुख्य आंकड़े</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="bg-gradient-to-br from-white to-orange-50 border-orange-200 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-green-600 font-medium">{stat.change} पिछले महीने से</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  {stat.title === "सत्यापित डेटा" && <Progress value={89} className="mt-2" />}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Education Statistics */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">शिक्षा स्तर वितरण</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {educationStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-600 font-medium">{stat.percentage}</p>
                    <p className="text-xs text-gray-500">कुल सदस्यों का</p>
                  </div>
                  <Progress value={Number.parseInt(stat.percentage)} className="mt-2" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Health Insurance Statistics */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">स्वास्थ्य और बीमा कवरेज</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthInsuranceStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="bg-gradient-to-br from-white to-pink-50 border-pink-200 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-pink-600 font-medium">{stat.percentage}</p>
                    <p className="text-xs text-gray-500">कवरेज</p>
                  </div>
                  <Progress value={Number.parseInt(stat.percentage)} className="mt-2" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Employment Statistics */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">रोजगार वितरण</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {employmentStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-purple-600 font-medium">{stat.percentage}</p>
                    <p className="text-xs text-gray-500">कार्यबल का</p>
                  </div>
                  <Progress value={Number.parseInt(stat.percentage)} className="mt-2" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Donation Statistics */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">दान और योगदान</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {donationStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="bg-gradient-to-br from-white to-green-50 border-green-200 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-green-600 font-medium">
                      {stat.change || stat.percentage} {stat.description}
                    </p>
                  </div>
                  {stat.percentage && <Progress value={Number.parseInt(stat.percentage)} className="mt-2" />}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Additional Insights */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">विशेष जानकारी</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-white to-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-700 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                आयु समूह
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">0-18 वर्ष</span>
                  <span className="font-bold">4,359 (35%)</span>
                </div>
                <Progress value={35} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">19-60 वर्ष</span>
                  <span className="font-bold">6,851 (55%)</span>
                </div>
                <Progress value={55} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">60+ वर्ष</span>
                  <span className="font-bold">1,246 (10%)</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-cyan-50 border-cyan-200">
            <CardHeader>
              <CardTitle className="text-cyan-700 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                स्वास्थ्य स्थिति
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">स्वस्थ</span>
                  <span className="font-bold">10,567 (85%)</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">दीर्घकालिक बीमार</span>
                  <span className="font-bold">1,245 (10%)</span>
                </div>
                <Progress value={10} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">दिव्यांग</span>
                  <span className="font-bold">644 (5%)</span>
                </div>
                <Progress value={5} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-indigo-700 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                प्रवास पैटर्न
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">राजस्थान में</span>
                  <span className="font-bold">567 (30%)</span>
                </div>
                <Progress value={30} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">गुजरात में</span>
                  <span className="font-bold">654 (35%)</span>
                </div>
                <Progress value={35} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">अन्य राज्यों में</span>
                  <span className="font-bold">655 (35%)</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

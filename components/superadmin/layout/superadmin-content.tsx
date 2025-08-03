"use client"

import { SuperAdminHeader } from "../superadmin-header"
import { SuperAdminSidebar } from "../superadmin-sidebar"
import { VillageManagement } from "../village-management"
import { ChokhlaManagement } from "../chokhla-management"
import { UserManagement } from "../user-management"
import { StatisticsManagement } from "../statistics-management"
import { ProfileManagement } from "../profile-management"
import { useSuperAdmin } from "../providers/superadmin-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, MapPin, Home } from "lucide-react"

function DashboardOverview() {
  const { stats, isLoadingStats } = useSuperAdmin()

  if (isLoadingStats) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">डैशबोर्ड</h2>
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">डैशबोर्ड</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल गांव</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.totalVillages || 0}</div>
            <p className="text-xs text-gray-600">सक्रिय: {stats?.activeVillages || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल चोखला</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.totalChokhlas || 0}</div>
            <p className="text-xs text-gray-600">सक्रिय: {stats?.activeChokhlas || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल परिवार</CardTitle>
            <Home className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.totalFamilies || 0}</div>
            <p className="text-xs text-gray-600">पंजीकृत परिवार</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल उपयोगकर्ता</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-gray-600">सक्रिय: {stats?.activeUsers || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>स्वागत है सुपर एडमिन पैनल में</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">यहाँ आप पूरे सिस्टम का प्रबंधन कर सकते हैं। साइडबार से विभिन्न सेक्शन्स में जा सकते हैं।</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function SuperAdminContent() {
  const { activeView } = useSuperAdmin()

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview />
      case "villages":
        return <VillageManagement />
      case "chokhlas":
        return <ChokhlaManagement />
      case "users":
        return <UserManagement />
      case "statistics":
        return <StatisticsManagement />
      case "profile":
        return <ProfileManagement />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

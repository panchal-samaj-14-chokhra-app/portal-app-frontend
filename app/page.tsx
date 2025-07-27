"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Users, Home, Settings, HelpCircle, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  const getRoleBasedContent = () => {
    switch (session.user.role) {
      case "superadmin":
        return {
          title: "Super Admin Dashboard",
          description: "Manage the entire system, chokhlas, villages, and users",
          dashboardLink: "/admin/superadmin",
          features: [
            { icon: Building, title: "Manage Chokhlas", description: "Add, edit, and manage chokhlas" },
            { icon: MapPin, title: "Manage Villages", description: "Oversee all villages across chokhlas" },
            { icon: Users, title: "User Management", description: "Manage system users and permissions" },
            { icon: Home, title: "Family Records", description: "Access all family records" },
          ],
        }
      case "admin":
        return {
          title: "Admin Dashboard",
          description: "Manage your assigned chokhla and villages",
          dashboardLink: `/admin/chokhla/${session.user.chokhlaId}`,
          features: [
            { icon: MapPin, title: "Manage Villages", description: "Manage villages in your chokhla" },
            { icon: Home, title: "Family Records", description: "Manage family records" },
            { icon: Users, title: "Member Data", description: "View and update member information" },
          ],
        }
      case "user":
        return {
          title: "User Dashboard",
          description: "Manage families in your village",
          dashboardLink: `/admin/village/${session.user.villageId}`,
          features: [
            { icon: Home, title: "Family Records", description: "Manage families in your village" },
            { icon: Users, title: "Member Data", description: "Add and update member information" },
          ],
        }
      default:
        return {
          title: "Dashboard",
          description: "Welcome to the system",
          dashboardLink: "/",
          features: [],
        }
    }
  }

  const content = getRoleBasedContent()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Panchal Samaj Census Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant={session.user.role === "superadmin" ? "default" : "secondary"}>
                    {session.user.role}
                  </Badge>
                  <p className="text-xs text-gray-500">{session.user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h2>
            <p className="text-gray-600">{content.description}</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <Link href={content.dashboardLink}>
                <Button size="lg">
                  <Settings className="h-5 w-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="outline" size="lg">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Help & Support
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <feature.icon className="h-5 w-5 mr-2 text-blue-600" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Info */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">Version</p>
                    <p>1.0.0</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Last Updated</p>
                    <p>January 2024</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Support</p>
                    <Link href="/help" className="text-blue-600 hover:text-blue-800">
                      Get Help
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

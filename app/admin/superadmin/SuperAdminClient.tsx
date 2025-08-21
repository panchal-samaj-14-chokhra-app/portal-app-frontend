"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { Session } from "next-auth"
import { Users, MapPin, BarChart3, Settings, LogOut, Menu, Home, UserPlus, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Import components
import UserManagement from "@/components/superadmin/user-management"
import ChokhlaManagement from "@/components/superadmin/chokhla-management"
import VillageManagement from "@/components/superadmin/village-management"
import StatisticsView from "@/components/superadmin/statistics-view"
import ProfileView from "@/components/superadmin/profile-view"

interface SuperAdminClientProps {
  session: Session
}

export default function SuperAdminClient({ session }: SuperAdminClientProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      })
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/login")
    }
  }

  const menuItems = [
    { id: "dashboard", label: "डैशबोर्ड", icon: Home },
    { id: "users", label: "उपयोगकर्ता प्रबंधन", icon: Users },
    { id: "chokhla", label: "चोखला प्रबंधन", icon: Building2 },
    { id: "villages", label: "गांव प्रबंधन", icon: MapPin },
    { id: "statistics", label: "आंकड़े", icon: BarChart3 },
    { id: "profile", label: "प्रोफाइल", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />
      case "chokhla":
        return <ChokhlaManagement />
      case "villages":
        return <VillageManagement />
      case "statistics":
        return <StatisticsView />
      case "profile":
        return <ProfileView />
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">सुपर एडमिन डैशबोर्ड</h1>
              <p className="text-gray-600 mt-2">पंचाल समाज जनगणना प्रबंधन प्रणाली में आपका स्वागत है</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">कुल उपयोगकर्ता</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+20.1% पिछले महीने से</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">कुल चोखला</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">+2 नए इस महीने</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">कुल गांव</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">567</div>
                  <p className="text-xs text-muted-foreground">+12 नए इस महीने</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">कुल परिवार</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,901</div>
                  <p className="text-xs text-muted-foreground">+180 नए इस महीने</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>हाल की गतिविधि</CardTitle>
                  <CardDescription>सिस्टम में हाल के बदलाव</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">नया उपयोगकर्ता जोड़ा गया</p>
                        <p className="text-xs text-gray-500">2 मिनट पहले</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">गांव की जानकारी अपडेट की गई</p>
                        <p className="text-xs text-gray-500">15 मिनट पहले</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">नया चोखला बनाया गया</p>
                        <p className="text-xs text-gray-500">1 घंटा पहले</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>त्वरित कार्य</CardTitle>
                  <CardDescription>सामान्य प्रबंधन कार्य</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => setActiveTab("users")} className="w-full justify-start" variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    नया उपयोगकर्ता जोड़ें
                  </Button>
                  <Button onClick={() => setActiveTab("chokhla")} className="w-full justify-start" variant="outline">
                    <Building2 className="mr-2 h-4 w-4" />
                    नया चोखला जोड़ें
                  </Button>
                  <Button onClick={() => setActiveTab("villages")} className="w-full justify-start" variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    नया गांव जोड़ें
                  </Button>
                  <Button onClick={() => setActiveTab("statistics")} className="w-full justify-start" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    रिपोर्ट देखें
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? "w-full" : "w-64"} bg-white shadow-lg h-full flex flex-col`}>
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">सुपर एडमिन</h2>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                if (mobile) setSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              लॉग आउट
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>लॉग आउट की पुष्टि करें</AlertDialogTitle>
              <AlertDialogDescription>
                क्या आप वाकई लॉग आउट करना चाहते हैं? आपको दोबारा लॉगिन करना होगा।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>रद्द करें</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                लॉग आउट करें
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                  <Sidebar mobile />
                </SheetContent>
              </Sheet>
              <h1 className="text-xl font-semibold text-gray-900">
                {menuItems.find((item) => item.id === activeTab)?.label || "डैशबोर्ड"}
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

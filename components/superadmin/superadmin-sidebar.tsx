"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MapPin, Users, User, BarChart3, Settings } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

const sidebarItems = [
  {
    id: "dashboard",
    label: "डैशबोर्ड",
    icon: LayoutDashboard,
  },
  {
    id: "villages",
    label: "गांव प्रबंधन",
    icon: MapPin,
  },
  {
    id: "chokhlas",
    label: "चोखला प्रबंधन",
    icon: Users,
  },
  {
    id: "users",
    label: "उपयोगकर्ता प्रबंधन",
    icon: User,
  },
  {
    id: "statistics",
    label: "आंकड़े",
    icon: BarChart3,
  },
  {
    id: "profile",
    label: "प्रोफाइल",
    icon: Settings,
  },
]

export function SuperAdminSidebar() {
  const { activeView, setActiveView } = useSuperAdmin()

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">सुपर एडमिन</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  activeView === item.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                )}
                onClick={() => setActiveView(item.id as any)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

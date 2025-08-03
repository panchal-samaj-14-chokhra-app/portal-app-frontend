"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { BarChart3, MapPin, Building2, Users, User, PlusCircle, Activity, TrendingUp } from "lucide-react"
import { useSuperAdmin, type ActiveView } from "./providers/superadmin-provider"

interface SidebarItem {
  id: ActiveView
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  description?: string
}

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "डैशबोर्ड",
    icon: BarChart3,
    description: "Overview and analytics",
  },
  {
    id: "statistics",
    label: "आंकड़े",
    icon: TrendingUp,
    description: "System statistics",
  },
  {
    id: "villages",
    label: "गांव प्रबंधन",
    icon: MapPin,
    badge: "24",
    description: "Manage villages",
  },
  {
    id: "chokhlas",
    label: "चोखला प्रबंधन",
    icon: Building2,
    badge: "12",
    description: "Manage chokhlas",
  },
  {
    id: "users",
    label: "उपयोगकर्ता",
    icon: Users,
    badge: "156",
    description: "User management",
  },
  {
    id: "profile",
    label: "प्रोफाइल",
    icon: User,
    description: "Your profile settings",
  },
]

export function SuperAdminSidebar() {
  const { activeView, setActiveView } = useSuperAdmin()

  return (
    <aside className="w-64 bg-white/70 backdrop-blur-sm border-r border-white/20 h-[calc(100vh-4rem)]">
      <div className="p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>

          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3 text-left",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "hover:bg-blue-50 text-gray-700",
                )}
                onClick={() => setActiveView(item.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "outline"}
                          className={cn(
                            "ml-2 text-xs",
                            isActive
                              ? "bg-white/20 text-white border-white/30"
                              : "bg-blue-100 text-blue-700 border-blue-200",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className={cn("text-xs mt-1 truncate", isActive ? "text-white/80" : "text-gray-500")}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </Button>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs bg-transparent"
              onClick={() => setActiveView("chokhlas")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Chokhla
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs bg-transparent"
              onClick={() => setActiveView("villages")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Village
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Activity className="h-4 w-4 text-green-500" />
            <span>System Online</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </aside>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MapPin, Users, BarChart3, UserCog, User } from "lucide-react"

interface SuperAdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigationItems = [
  { id: "villages", label: "गांव प्रबंधन", icon: MapPin },
  { id: "chokhlas", label: "चोखला प्रबंधन", icon: Users },
  { id: "statistics", label: "आंकड़े", icon: BarChart3 },
  { id: "users", label: "उपयोगकर्ता प्रबंधन", icon: UserCog },
  { id: "profile", label: "प्रोफाइल", icon: User },
]

export function SuperAdminSidebar({ activeTab, onTabChange }: SuperAdminSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                activeTab === item.id ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100",
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}

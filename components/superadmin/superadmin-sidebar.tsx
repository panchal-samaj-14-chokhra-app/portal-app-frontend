"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart3, MapPin, Users, UserCheck, User, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuperAdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  {
    id: "statistics",
    label: "डैशबोर्ड",
    icon: BarChart3,
    badge: null,
  },
  {
    id: "villages",
    label: "गांव प्रबंधन",
    icon: MapPin,
    badge: "125",
  },
  {
    id: "choklas",
    label: "चोखला प्रबंधन",
    icon: Users,
    badge: "15",
  },
  {
    id: "users",
    label: "उपयोगकर्ता प्रबंधन",
    icon: UserCheck,
    badge: "450",
  },
  {
    id: "profile",
    label: "प्रोफाइल",
    icon: User,
    badge: null,
  },
]

export function SuperAdminSidebar({ activeTab, onTabChange }: SuperAdminSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* System Status */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900">सिस्टम स्थिति</span>
          <Badge variant="default" className="bg-green-100 text-green-800">
            ऑनलाइन
          </Badge>
        </div>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>सर्वर:</span>
            <span className="text-green-600">चालू</span>
          </div>
          <div className="flex justify-between">
            <span>डेटाबेस:</span>
            <span className="text-green-600">कनेक्टेड</span>
          </div>
          <div className="flex justify-between">
            <span>अपटाइम:</span>
            <span>99.9%</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-11 px-3",
                  isActive
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : "outline"}
                    className={cn(
                      "ml-2 text-xs",
                      isActive ? "bg-white/20 text-white border-white/30" : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">संस्करण 1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">© 2024 पंचाल समाज</p>
      </div>
    </div>
  )
}

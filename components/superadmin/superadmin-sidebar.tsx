"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart3, MapPin, Users, UserCheck, User, Activity } from "lucide-react"

interface SuperAdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  {
    id: "statistics",
    label: "डैशबोर्ड",
    icon: BarChart3,
    description: "आंकड़े और रिपोर्ट",
  },
  {
    id: "villages",
    label: "गांव प्रबंधन",
    icon: MapPin,
    description: "गांवों की सूची",
  },
  {
    id: "choklas",
    label: "चोखला प्रबंधन",
    icon: UserCheck,
    description: "चोखला खाते",
  },
  {
    id: "users",
    label: "उपयोगकर्ता",
    icon: Users,
    description: "सभी उपयोगकर्ता",
  },
  {
    id: "profile",
    label: "प्रोफाइल",
    icon: User,
    description: "व्यक्तिगत जानकारी",
  },
]

export function SuperAdminSidebar({ activeTab, onTabChange }: SuperAdminSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Navigation Menu */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${
                  isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${isActive ? "text-blue-100" : "text-gray-500"}`}>{item.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* System Status */}
      <div className="p-4">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">सिस्टम स्थिति</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-700">सर्वर</span>
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">
                ऑनलाइन
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-700">डेटाबेस</span>
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">
                कनेक्टेड
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-700">बैकअप</span>
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-300">
                अपडेटेड
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

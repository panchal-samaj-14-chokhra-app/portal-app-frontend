"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, MapPin, Users, UserCheck, Settings, Activity, CheckCircle } from "lucide-react"

interface SuperAdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  {
    id: "statistics",
    label: "डैशबोर्ड",
    icon: LayoutDashboard,
    description: "सांख्यिकी और रिपोर्ट",
  },
  {
    id: "villages",
    label: "गांव प्रबंधन",
    icon: MapPin,
    description: "गांवों की जानकारी",
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
    icon: Settings,
    description: "खाता सेटिंग्स",
  },
]

export function SuperAdminSidebar({ activeTab, onTabChange }: SuperAdminSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        {/* System Status */}
        <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">सिस्टम स्थिति</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700">सभी सेवाएं चालू हैं</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3 text-left",
                  isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => onTabChange(item.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className={cn("text-xs truncate", isActive ? "text-blue-100" : "text-gray-500")}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800 mb-3">त्वरित आंकड़े</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">कुल गांव</span>
              <Badge variant="secondary" className="text-xs">
                156
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">सक्रिय चोखला</span>
              <Badge variant="secondary" className="text-xs">
                23
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">कुल परिवार</span>
              <Badge variant="secondary" className="text-xs">
                2,847
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

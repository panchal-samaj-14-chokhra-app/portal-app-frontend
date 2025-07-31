"use client"

import { LayoutDashboard, MapPin, Home, Users, UserCheck, Shield, Award, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeModule: string
  setActiveModule: (module: string) => void
}

const menuItems = [
  { id: "dashboard", label: "डैशबोर्ड", icon: LayoutDashboard },
  { id: "chokhras", label: "चोखरा प्रबंधन", icon: MapPin },
  { id: "villages", label: "गांव प्रबंधन", icon: Home },
  { id: "families", label: "परिवार प्रबंधन", icon: Users },
  { id: "members", label: "सदस्य प्रबंधन", icon: UserCheck },
  { id: "admins", label: "एडमिन प्रबंधन", icon: Shield },
  { id: "schemes", label: "योजना प्रबंधन", icon: Award },
]

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-orange-600 to-orange-700 text-white shadow-xl z-10">
      <div className="p-6">
        <h2 className="text-xl font-bold text-orange-100 mb-6">नेवीगेशन मेन्यू</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left hover:bg-orange-500/50 transition-colors",
                  activeModule === item.id && "bg-orange-500 text-white",
                )}
                onClick={() => setActiveModule(item.id)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-orange-500">
          <Button
            variant="ghost"
            className="w-full justify-start text-left hover:bg-orange-500/50 text-orange-200 mb-2"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="w-5 h-5 mr-3" />
            मुख्य पेज
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left hover:bg-orange-500/50 text-orange-200">
            <Settings className="w-5 h-5 mr-3" />
            सेटिंग्स
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left hover:bg-orange-500/50 text-orange-200">
            <LogOut className="w-5 h-5 mr-3" />
            लॉगआउट
          </Button>
        </div>
      </div>
    </div>
  )
}

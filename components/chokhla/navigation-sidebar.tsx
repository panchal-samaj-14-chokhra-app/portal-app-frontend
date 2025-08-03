"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, BarChart3, FileText, User } from "lucide-react"

const TABS = [
  { key: "village", label: "गांव प्रबंधन", icon: Home },
  { key: "statics", label: "आँकड़े", icon: BarChart3 },
  { key: "reports", label: "रिपोर्ट्स", icon: FileText },
  { key: "profile", label: "चौकला प्रोफ़ाइल", icon: User },
]

interface NavigationSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationSidebar({ activeTab, onTabChange }: NavigationSidebarProps) {
  return (
    <aside className="w-full lg:w-64 mb-6 lg:mb-0">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-orange-200 p-4">
        <nav className="flex lg:flex-col gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                onClick={() => onTabChange(tab.key)}
                className={`w-full justify-start text-base font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {tab.label}
              </Button>
            )
          })}
        </nav>
      </Card>
    </aside>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, BarChart3, FileText, User } from "lucide-react"

const TABS = [
  { key: "village", label: "गांव प्रबंधन", icon: Home, shortLabel: "गांव" },
  { key: "statics", label: "आँकड़े", icon: BarChart3, shortLabel: "आँकड़े" },
  { key: "reports", label: "रिपोर्ट्स", icon: FileText, shortLabel: "रिपोर्ट" },
  { key: "profile", label: "चोखरा प्रोफ़ाइल", icon: User, shortLabel: "प्रोफ़ाइल" },
]

interface NavigationSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationSidebar({ activeTab, onTabChange }: NavigationSidebarProps) {
  return (
    <aside className="w-full lg:w-64 mb-4 lg:mb-0">
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50 p-2 lg:p-4">
        <nav className="flex overflow-x-auto lg:flex-col gap-1 lg:gap-2 pb-2 lg:pb-0 scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                onClick={() => onTabChange(tab.key)}
                className={`flex-shrink-0 min-w-[80px] sm:min-w-[100px] lg:w-full justify-center lg:justify-start text-xs sm:text-sm lg:text-base font-semibold transition-all duration-200 px-2 sm:px-3 lg:px-4 py-2 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 lg:mr-3 flex-shrink-0" />
                <span className="truncate text-xs sm:text-sm lg:text-base">
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline lg:hidden">{tab.shortLabel}</span>
                  <span className="hidden lg:inline">{tab.label}</span>
                </span>
              </Button>
            )
          })}
        </nav>
      </Card>
    </aside>
  )
}

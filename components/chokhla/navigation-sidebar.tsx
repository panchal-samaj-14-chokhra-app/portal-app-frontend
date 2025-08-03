"use client"

import { Button } from "@/components/ui/button"

interface NavigationSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TABS = [
  { key: "village", label: "गांव प्रबंधन", icon: "🏘️" },
  { key: "statics", label: "आँकड़े", icon: "📊" },
  { key: "reports", label: "रिपोर्ट्स", icon: "📋" },
  { key: "profile", label: "चौकला प्रोफ़ाइल", icon: "👤" },
]

export function NavigationSidebar({ activeTab, onTabChange }: NavigationSidebarProps) {
  return (
    <aside className="w-full md:w-64 mb-6 md:mb-0">
      <nav className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-4">मेनू</h3>
        <div className="flex md:flex-col gap-3">
          {TABS.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              onClick={() => onTabChange(tab.key)}
              className={`w-full justify-start text-base font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:from-orange-600 hover:to-orange-700"
                  : "text-orange-700 hover:bg-orange-50 hover:text-orange-800"
              }`}
            >
              <span className="mr-3 text-lg">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>
      </nav>
    </aside>
  )
}

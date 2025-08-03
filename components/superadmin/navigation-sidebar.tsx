"use client"

import { Button } from "@/components/ui/button"

interface Tab {
  key: string
  label: string
  icon?: string
}

interface NavigationSidebarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabKey: string) => void
}

export default function NavigationSidebar({ tabs, activeTab, onTabChange }: NavigationSidebarProps) {
  return (
    <aside className="w-full md:w-64 mb-6 md:mb-0">
      <nav className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-200/50 p-4 flex md:flex-col gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            onClick={() => onTabChange(tab.key)}
            className={`w-full justify-start text-sm md:text-base font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                : "text-orange-700 hover:bg-orange-50 hover:text-orange-800"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
}

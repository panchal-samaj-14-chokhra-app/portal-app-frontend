"use client"

import { Button } from "@/components/ui/button"

interface Tab {
  key: string
  label: string
  shortLabel?: string
}

interface NavigationSidebarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabKey: string) => void
}

export default function NavigationSidebar({ tabs, activeTab, onTabChange }: NavigationSidebarProps) {
  return (
    <aside className="w-full lg:w-64 mb-4 lg:mb-0">
      <nav className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-orange-200/50 p-2 lg:p-4">
        <div className="flex overflow-x-auto lg:flex-col gap-1 lg:gap-2 pb-2 lg:pb-0 scrollbar-hide">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              onClick={() => onTabChange(tab.key)}
              className={`flex-shrink-0 min-w-[80px] sm:min-w-[120px] lg:w-full justify-center lg:justify-start text-xs sm:text-sm lg:text-base font-semibold transition-all duration-200 px-2 sm:px-3 lg:px-4 py-2 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-orange-700 hover:bg-orange-50 hover:text-orange-800"
              }`}
            >
              <span className="truncate">
                <span className="sm:hidden">{tab.shortLabel || tab.label}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </Button>
          ))}
        </div>
      </nav>
    </aside>
  )
}

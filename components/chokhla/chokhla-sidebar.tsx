"use client"

import { Button } from "@/components/ui/button"
import type { TabItem } from "./types"

interface CokhlaSidebarProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function CokhlaSidebar({ tabs, activeTab, onTabChange }: CokhlaSidebarProps) {
  return (
    <aside className="w-full md:w-64 mb-6 md:mb-0">
      <nav className="bg-white rounded-lg shadow border border-orange-200 p-4 flex md:flex-col gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            onClick={() => onTabChange(tab.key)}
            className={`w-full justify-start text-base font-semibold ${
              activeTab === tab.key ? "bg-orange-500 text-white" : "text-orange-700 hover:bg-orange-50"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
}

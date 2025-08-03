"use client"
import { Button } from "@/components/ui/button"
import { TABS } from "./constants"
import type { TabKey } from "./types"

interface SuperAdminSidebarProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

export function SuperAdminSidebar({ activeTab, onTabChange }: SuperAdminSidebarProps) {
  return (
    <aside className="w-full md:w-64 mb-6 md:mb-0">
      <nav className="bg-white rounded-lg shadow border border-orange-200 p-4 flex md:flex-col gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            onClick={() => onTabChange(tab.key)}
            className={`w-full justify-start text-base font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-orange-500 text-white shadow-md"
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

"use client"

import { cn } from "@/lib/utils"
import { Users, Settings, Plus } from "lucide-react"

interface CokhlaSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  {
    id: "villages",
    label: "गांव प्रबंधन",
    icon: Users,
    description: "गांवों की सूची और जानकारी",
  },
  {
    id: "add-village",
    label: "नया गांव जोड़ें",
    icon: Plus,
    description: "नया गांव पंजीकृत करें",
  },
  {
    id: "profile",
    label: "प्रोफाइल सेटिंग्स",
    icon: Settings,
    description: "अपनी जानकारी अपडेट करें",
  },
]

export function CokhlaSidebar({ activeTab, onTabChange }: CokhlaSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">मेनू</h2>
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs text-gray-500">{tab.description}</div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

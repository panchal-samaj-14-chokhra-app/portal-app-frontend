"use client"

import { ChevronRight, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationBreadcrumbProps {
  currentModule: string
  onNavigate: (module: string) => void
  onHome: () => void
}

const moduleNames: Record<string, string> = {
  dashboard: "डैशबोर्ड",
  chokhras: "चोखरा प्रबंधन",
  villages: "गांव प्रबंधन",
  families: "परिवार प्रबंधन",
  members: "सदस्य प्रबंधन",
  admins: "एडमिन प्रबंधन",
  schemes: "योजना प्रबंधन",
}

export function NavigationBreadcrumb({ currentModule, onNavigate, onHome }: NavigationBreadcrumbProps) {
  return (
    <div className="bg-white shadow-sm border-b border-orange-200 mb-6">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("dashboard")}
              className="text-orange-600 hover:bg-orange-50 p-1"
            >
              <Home className="w-4 h-4" />
            </Button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 font-medium">{moduleNames[currentModule]}</span>
          </div>

          <div className="flex items-center space-x-2">
            {currentModule !== "dashboard" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("dashboard")}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                डैशबोर्ड
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onHome}
              className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              <Home className="w-4 h-4 mr-2" />
              मुख्य पेज
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

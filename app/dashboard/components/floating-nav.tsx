"use client"

import { useState } from "react"
import { Home, Menu, X, ArrowLeft, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingNavProps {
  onHome: () => void
  onDashboard: () => void
  onRefresh: () => void
}

export function FloatingNav({ onHome, onDashboard, onRefresh }: FloatingNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={cn(
          "flex flex-col items-end space-y-3 transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <Button
          size="sm"
          onClick={onHome}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
        >
          <Home className="w-4 h-4 mr-2" />
          होम
        </Button>
        <Button
          size="sm"
          onClick={onDashboard}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          डैशबोर्ड
        </Button>
        <Button
          size="sm"
          onClick={onRefresh}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          रिफ्रेश
        </Button>
      </div>

      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>
    </div>
  )
}

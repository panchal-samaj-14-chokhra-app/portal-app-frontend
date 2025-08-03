"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut } from "lucide-react"
import Image from "next/image"

interface ChokhlaHeaderProps {
  userType: string
  onBack: () => void
  onLogout: () => void
}

export function ChokhlaHeader({ userType, onBack, onLogout }: ChokhlaHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/images/main-logo.png"
            alt="Panchal Samaj Logo"
            width={44}
            height={44}
            className="rounded-full shadow-lg"
          />
          <span className="text-xl md:text-2xl font-bold text-white">पंचाल समाज 14 चोखरा</span>
        </div>
        <div className="flex items-center gap-2">
          {userType === "SUPER_ADMIN" && (
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              वापस
            </Button>
          )}
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            लॉगआउट
          </Button>
        </div>
      </div>
    </header>
  )
}

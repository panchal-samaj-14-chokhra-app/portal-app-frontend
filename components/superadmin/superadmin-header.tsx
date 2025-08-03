"use client"
import Image from "next/image"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function SuperAdminHeader() {
  const handleLogout = () => signOut({ callbackUrl: "/login" })

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
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            लॉगआउट
          </Button>
        </div>
      </div>
    </header>
  )
}

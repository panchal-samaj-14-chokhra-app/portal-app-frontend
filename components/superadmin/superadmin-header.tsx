"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Shield } from "lucide-react"
import { signOut } from "next-auth/react"

interface SuperAdminHeaderProps {
  userEmail?: string
  userName?: string
}

export function SuperAdminHeader({ userEmail, userName }: SuperAdminHeaderProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">सुपर एडमिन पैनल</h1>
              <p className="text-sm text-gray-500">पंचाल समाज जनगणना प्रबंधन</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" alt={userName || "User"} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {userName ? userName.charAt(0).toUpperCase() : "SA"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{userName || "सुपर एडमिन"}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">लॉग आउट</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

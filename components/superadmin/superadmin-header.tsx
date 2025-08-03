"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Bell } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

export function SuperAdminHeader() {
  const { profile } = useSuperAdmin()

  const handleLogout = () => {
    // Handle logout logic
    window.location.href = "/login"
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">पंचाल समाज जनगणना - सुपर एडमिन पैनल</h1>
          <p className="text-sm text-gray-600">सिस्टम प्रबंधन और निगरानी</p>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {profile?.firstName?.[0]}
                {profile?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-gray-600">सुपर एडमिन</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            लॉग आउट
          </Button>
        </div>
      </div>
    </header>
  )
}

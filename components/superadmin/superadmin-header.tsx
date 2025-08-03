"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shield, User, LogOut, Settings, Bell, ChevronDown } from "lucide-react"
import type { SuperAdminProfile } from "./types"

interface SuperAdminHeaderProps {
  profile: SuperAdminProfile | null
  isLoading: boolean
  onLogout: () => void
}

export function SuperAdminHeader({ profile, isLoading, onLogout }: SuperAdminHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await onLogout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">पंचाल समाज जनगणना</h1>
              <p className="text-sm text-gray-600">सुपर एडमिन पैनल</p>
            </div>
          </div>
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          {/* User Menu */}
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ) : profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={profile.firstName} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {profile.firstName.charAt(0)}
                      {profile.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs px-1 py-0">
                        <Shield className="w-3 h-3 mr-1" />
                        सुपर एडमिन
                      </Badge>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{profile.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  प्रोफाइल देखें
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  सेटिंग्स
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoggingOut ? "लॉग आउट हो रहे हैं..." : "लॉग आउट"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <span className="text-sm text-gray-500">लोड हो रहा है...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

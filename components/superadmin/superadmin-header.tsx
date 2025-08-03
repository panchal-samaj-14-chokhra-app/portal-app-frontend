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
import { Shield, User, LogOut, Settings, Bell, ChevronDown, Activity } from "lucide-react"
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
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                पंचाल समाज जनगणना
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                सुपर एडमिन पैनल
              </p>
            </div>
          </div>
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-blue-50">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs animate-pulse"></span>
          </Button>

          {/* User Menu */}
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ) : profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-blue-50 rounded-xl"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                    <AvatarImage src="/placeholder.svg" alt={profile.firstName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {profile.firstName.charAt(0)}
                      {profile.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="destructive"
                        className="text-xs px-2 py-0 bg-gradient-to-r from-red-500 to-pink-600"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        सुपर एडमिन
                      </Badge>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <DropdownMenuLabel className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{profile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-700">ऑनलाइन</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-blue-50">
                  <User className="w-4 h-4 mr-2" />
                  प्रोफाइल देखें
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-blue-50">
                  <Settings className="w-4 h-4 mr-2" />
                  सेटिंग्स
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoggingOut ? "लॉग आउट हो रहे हैं..." : "लॉग आउट"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">लोड हो रहा है...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

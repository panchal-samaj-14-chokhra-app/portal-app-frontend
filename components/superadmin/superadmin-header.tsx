"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Settings, LogOut, Shield, Clock } from "lucide-react"
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return "कभी नहीं"
    const date = new Date(lastLogin)
    return date.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">सुपर एडमिन पैनल</h1>
              <p className="text-sm text-gray-500">पंचाल समाज जनगणना प्रबंधन</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
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
                <Button variant="ghost" className="flex items-center gap-3 p-2 h-auto">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" alt={`${profile.firstName} ${profile.lastName}`} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {getInitials(profile.firstName, profile.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {profile.firstName} {profile.lastName}
                      </span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                        सुपर एडमिन
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>अंतिम लॉगिन: {formatLastLogin(profile.lastLogin)}</span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                    <p className="text-sm text-gray-500">{profile.mobileNumber}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>प्रोफाइल देखें</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>सेटिंग्स</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isLoggingOut ? "लॉग आउट हो रहे हैं..." : "लॉग आउट"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="text-red-500 text-sm">प्रोफाइल लोड नहीं हो सकी</div>
          )}
        </div>
      </div>
    </header>
  )
}

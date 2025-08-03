"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Shield, Calendar, Clock, Globe, Monitor } from "lucide-react"
import type { ProfileData } from "./types"

interface ProfileManagementProps {
  isLoading?: boolean
}

export function ProfileManagement({ isLoading = false }: ProfileManagementProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockProfile: ProfileData = {
          id: "super-admin-1",
          name: "सुपर एडमिन",
          email: "superadmin@panchalsamaj.org",
          role: "SUPER_ADMIN",
          createdAt: "2024-01-01T00:00:00Z",
          lastLogin: "2024-01-16T10:30:00Z",
          permissions: ["गांव प्रबंधन", "चोखला प्रबंधन", "उपयोगकर्ता प्रबंधन", "आंकड़े देखना", "सिस्टम सेटिंग्स"],
          sessionInfo: {
            ipAddress: "192.168.1.100",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            loginTime: "2024-01-16T10:30:00Z",
          },
        }

        setProfile(mockProfile)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <User className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">प्रोफाइल लोड नहीं हो सकी</h3>
          <p className="text-gray-500 text-center">प्रोफाइल की जानकारी लोड करने में समस्या हुई है।</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">प्रोफाइल जानकारी</h2>
        <p className="text-gray-600">आपकी खाता और सत्र की विस्तृत जानकारी</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              व्यक्तिगत जानकारी
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">नाम</label>
              <p className="text-lg font-medium text-gray-900">{profile.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">ईमेल</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">भूमिका</label>
              <Badge className="bg-purple-100 text-purple-800 mt-1">
                <Shield className="w-3 h-3 mr-1" />
                सुपर एडमिन
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">खाता बनाया गया</label>
              <p className="text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(profile.createdAt).toLocaleDateString("hi-IN")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              सत्र की जानकारी
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">अंतिम लॉगिन</label>
              <p className="text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString("hi-IN") : "कभी नहीं"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">IP पता</label>
              <p className="text-gray-900 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {profile.sessionInfo.ipAddress}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">ब्राउज़र</label>
              <p className="text-gray-900 text-sm break-all">{profile.sessionInfo.userAgent.substring(0, 50)}...</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">लॉगिन समय</label>
              <p className="text-gray-900">{new Date(profile.sessionInfo.loginTime).toLocaleString("hi-IN")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              अनुमतियां
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {profile.permissions.map((permission, index) => (
                <Badge key={index} variant="secondary" className="justify-center py-2">
                  {permission}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

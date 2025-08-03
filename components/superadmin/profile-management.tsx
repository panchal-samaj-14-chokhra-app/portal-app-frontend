"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Building2, MapPin, Clock } from "lucide-react"
import type { Session } from "next-auth"

interface ProfileManagementProps {
  userData: Session | null
}

export function ProfileManagement({ userData }: ProfileManagementProps) {
  if (!userData?.user) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <div className="text-orange-600 mb-4">⚠️ प्रोफाइल डेटा उपलब्ध नहीं</div>
        </CardContent>
      </Card>
    )
  }

  const user = userData.user

  return (
    <Card className="mb-8 shadow-lg border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <User className="w-5 h-5" />
          सुपर एडमिन प्रोफ़ाइल
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-800 border-b border-orange-200 pb-2">बुनियादी जानकारी</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <User className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-xs text-orange-600 uppercase tracking-wide">यूज़र ID</p>
                  <p className="text-sm font-mono text-orange-900 break-all">{user.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Mail className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-xs text-orange-600 uppercase tracking-wide">ईमेल</p>
                  <p className="text-sm text-orange-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-xs text-orange-600 uppercase tracking-wide">भूमिका</p>
                  <Badge variant="destructive" className="mt-1">
                    {user.role === "SUPER_ADMIN" ? "सुपर एडमिन" : user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-800 border-b border-orange-200 pb-2">सिस्टम जानकारी</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">चौकला ID</p>
                  <p className="text-sm text-gray-900 font-mono">{user.choklaId || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">गांव ID</p>
                  <p className="text-sm text-gray-900 font-mono">{user.villageId || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">टोकन समाप्ति</p>
                  <p className="text-sm text-gray-900">{new Date(userData.expires).toLocaleString("hi-IN")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Status */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-800 font-medium">सत्र सक्रिय</span>
          </div>
          <p className="text-sm text-green-700 mt-1">आपका सत्र सक्रिय है और सभी सुविधाएं उपलब्ध हैं।</p>
        </div>
      </CardContent>
    </Card>
  )
}

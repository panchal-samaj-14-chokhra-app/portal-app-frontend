"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Shield, Building, MapPin, Clock } from "lucide-react"

interface ProfileViewProps {
  userData: {
    user?: {
      id: string
      email: string
      role: string
      choklaId?: string
      villageId?: string
    }
    expires: string
  } | null
}

export default function ProfileView({ userData }: ProfileViewProps) {
  return (
    <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border-orange-200/50">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <User className="w-5 h-5" />
          सुपर एडमिन प्रोफ़ाइल
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <User className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-700">ID</p>
              <p className="text-orange-900 font-mono text-sm">{userData?.user?.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-700">Email</p>
              <p className="text-blue-900">{userData?.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Shield className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-700">Role</p>
              <p className="text-purple-900 font-semibold">{userData?.user?.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Building className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-700">Chokla ID</p>
              <p className="text-green-900 font-mono text-sm">{userData?.user?.choklaId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Village ID</p>
              <p className="text-gray-900 font-mono text-sm">{userData?.user?.villageId ?? "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <Clock className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-700">Token Expires</p>
              <p className="text-red-900 text-sm">{new Date(userData?.expires || "").toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

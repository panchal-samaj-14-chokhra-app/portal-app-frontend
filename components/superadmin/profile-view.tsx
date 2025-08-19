"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Shield } from "lucide-react"

interface ProfileViewProps {
  userData: any
}

export default function ProfileView({ userData }: ProfileViewProps) {
  const user = userData?.user

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800 flex items-center gap-2">
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            सुपर एडमिन प्रोफ़ाइल
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-4 text-center sm:text-left w-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-orange-900">{user?.name || "सुपर एडमिन"}</h2>
                <p className="text-orange-600 font-medium">सुपर एडमिन</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-orange-600 font-medium">ईमेल</p>
                      <p className="text-orange-900 font-semibold truncate">{user?.email || "उपलब्ध नहीं"}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-orange-600 font-medium">भूमिका</p>
                      <p className="text-orange-900 font-semibold">सुपर एडमिन</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

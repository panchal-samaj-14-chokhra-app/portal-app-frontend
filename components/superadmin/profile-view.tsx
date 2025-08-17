"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar } from "lucide-react"

interface ProfileViewProps {
  userData: any
}

export default function ProfileView({ userData }: ProfileViewProps) {
  return (
    <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          सुपर एडमिन प्रोफ़ाइल
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-orange-800">प्रोफ़ाइल की जानकारी</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-orange-700">ID:</span>
                <span className="ml-2 text-orange-800 break-all">{userData?.user?.id}</span>
              </div>
              <div>
                <span className="font-medium text-orange-700">Email:</span>
                <span className="ml-2 text-orange-800">{userData?.user?.email}</span>
              </div>
              <div>
                <span className="font-medium text-orange-700">Role:</span>
                <span className="ml-2 text-orange-800">{userData?.user?.role}</span>
              </div>
              <div>
                <span className="font-medium text-orange-700">Chokhra ID:</span>
                <span className="ml-2 text-orange-800">{userData?.user?.choklaId}</span>
              </div>
              <div>
                <span className="font-medium text-orange-700">Village ID:</span>
                <span className="ml-2 text-orange-800">{userData?.user?.villageId ?? "N/A"}</span>
              </div>
              <div>
                <span className="font-medium text-orange-700">Token Expires:</span>
                <span className="ml-2 text-orange-800">
                  {userData?.expires ? new Date(userData.expires).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

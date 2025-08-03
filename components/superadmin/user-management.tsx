"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Loader2, AlertCircle } from "lucide-react"

interface User {
  id: string
  email: string
  fullName: string
  globalRole: string
  isActive: boolean
  createdAt: string
}

interface UserManagementProps {
  users: User[]
  isLoading: boolean
  error: string | null
  onToggleActive: (userId: string, current: boolean) => void
}

export default function UserManagement({ users, isLoading, error, onToggleActive }: UserManagementProps) {
  if (isLoading) {
    return (
      <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader>
          <CardTitle className="text-orange-800">यूज़र प्रबंधन</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-orange-600">यूज़र की जानकारी लोड हो रही है...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border-red-200/50">
        <CardHeader>
          <CardTitle className="text-orange-800">यूज़र प्रबंधन</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-600">डेटा लोड करने में त्रुटि हुई</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border-orange-200/50">
      <CardHeader>
        <CardTitle className="text-orange-800">यूज़र प्रबंधन</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] bg-white border border-orange-200 rounded-lg shadow">
            <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">ईमेल</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">नाम</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">भूमिका</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">सक्रिय</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  निर्माण तिथि
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-orange-50 transition-colors duration-150">
                  <td className="px-4 py-3 text-orange-900 text-xs break-all font-mono">{user.id}</td>
                  <td className="px-4 py-3 text-orange-800 font-medium">{user.email}</td>
                  <td className="px-4 py-3 text-orange-800">{user.fullName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.globalRole === "superadmin"
                          ? "bg-purple-100 text-purple-800"
                          : user.globalRole === "admin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.globalRole}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Switch checked={user.isActive} onCheckedChange={() => onToggleActive(user.id, user.isActive)} />
                  </td>
                  <td className="px-4 py-3 text-orange-700 text-xs">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("hi-IN") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

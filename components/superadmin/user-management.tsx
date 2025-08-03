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
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">यूज़र प्रबंधन</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-orange-600">लोड हो रहा है...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">यूज़र प्रबंधन</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">यूज़र प्रबंधन</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full bg-white border border-orange-200 rounded-lg shadow">
              <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                <tr>
                  <th className="px-2 lg:px-4 py-2 text-left text-xs font-bold text-white uppercase">ID</th>
                  <th className="px-2 lg:px-4 py-2 text-left text-xs font-bold text-white uppercase">ईमेल</th>
                  <th className="px-2 lg:px-4 py-2 text-left text-xs font-bold text-white uppercase">नाम</th>
                  <th className="px-2 lg:px-4 py-2 text-left text-xs font-bold text-white uppercase">भूमिका</th>
                  <th className="px-2 lg:px-4 py-2 text-left text-xs font-bold text-white uppercase">सक्रिय</th>
                  <th className="px-2 lg:px-4 py-2 text-left text-xs font-bold text-white uppercase">निर्माण तिथि</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`border-b border-orange-100 hover:bg-orange-50 ${idx % 2 === 0 ? "bg-orange-25" : "bg-white"}`}
                    >
                      <td className="px-2 lg:px-4 py-2 text-orange-900 text-xs break-all max-w-[100px]">
                        <div className="truncate" title={user.id}>
                          {user.id}
                        </div>
                      </td>
                      <td className="px-2 lg:px-4 py-2 text-orange-800 text-xs lg:text-sm">
                        <div className="truncate max-w-[120px] lg:max-w-none" title={user.email}>
                          {user.email}
                        </div>
                      </td>
                      <td className="px-2 lg:px-4 py-2 text-orange-800 text-xs lg:text-sm">
                        <div className="truncate max-w-[100px] lg:max-w-none" title={user.fullName}>
                          {user.fullName}
                        </div>
                      </td>
                      <td className="px-2 lg:px-4 py-2 text-orange-800 text-xs lg:text-sm">{user.globalRole}</td>
                      <td className="px-2 lg:px-4 py-2">
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={() => onToggleActive(user.id, user.isActive)}
                        />
                      </td>
                      <td className="px-2 lg:px-4 py-2 text-orange-700 text-xs">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("hi-IN") : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      कोई यूज़र नहीं मिला
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

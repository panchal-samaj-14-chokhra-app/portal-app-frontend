"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Loader2, AlertCircle, Plus, Users } from "lucide-react"
import { Button } from "../ui/button"

interface User {
  id: string
  email: string
  fullName: string
  globalRole: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
  mobileNumber?: string
}

interface UserManagementProps {
  onAddUser: () => void
  users: User[]
  isLoading: boolean
  error: string | null
  onToggleActive: (userId: string, current: boolean) => void
}

export default function UserManagement({ users, isLoading, error, onToggleActive, onAddUser }: UserManagementProps) {
  if (isLoading) {
    return (
      <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800">यूज़र प्रबंधन</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
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
      <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800">यूज़र प्रबंधन</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="w-8 h-8 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800 flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            यूज़र प्रबंधन
          </CardTitle>
          <Button
            variant="outline"
            onClick={onAddUser}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:from-orange-600 hover:to-orange-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            यूज़र जोड़ें
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile Card Layout */}
        <div className="block lg:hidden">
          {users && users.length > 0 ? (
            <div className="divide-y divide-orange-100">
              {users.map((user, idx) => (
                <div key={user.id} className="p-4 hover:bg-orange-50 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                          #{idx + 1}
                        </span>
                        <h3 className="font-semibold text-orange-900 text-sm truncate">{user.fullName}</h3>
                      </div>
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={() => onToggleActive(user.id, user.isActive)}
                        className="flex-shrink-0"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">ईमेल:</span>
                        <span className="text-orange-800 truncate ml-2">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">भूमिका:</span>
                        <span className="text-orange-800">{user.globalRole}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">निर्माण तिथि:</span>
                        <span className="text-orange-800">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString("hi-IN") : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">आख़िरी लॉगिन:</span>
                        <span className="text-orange-800">
                          {user?.lastLogin ? new Date(user?.lastLogin).toLocaleDateString("hi-IN") : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">संपर्क:</span>
                        <span className="text-orange-800">{user?.mobileNumber || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>कोई यूज़र नहीं मिला</p>
            </div>
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full bg-white">
            <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">क्रम संख्या</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">ईमेल</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">नाम</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">भूमिका</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">निर्माण तिथि</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">आख़िरी लॉगिन</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">संपर्क</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">कार्रवाई</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b border-orange-100 hover:bg-orange-50 ${
                      idx % 2 === 0 ? "bg-orange-25" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 text-orange-900 text-sm">{idx + 1}</td>
                    <td className="px-4 py-3 text-orange-900 text-xs">
                      <div className="truncate max-w-[100px]" title={user.id}>
                        {user.id}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-orange-800 text-sm">
                      <div className="truncate max-w-[150px]" title={user.email}>
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-orange-800 text-sm">
                      <div className="truncate max-w-[120px]" title={user.fullName}>
                        {user.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-orange-800 text-sm">{user.globalRole}</td>
                    <td className="px-4 py-3 text-orange-700 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("hi-IN") : "-"}
                    </td>
                    <td className="px-4 py-3 text-orange-700 text-xs">
                      {user?.lastLogin ? new Date(user?.lastLogin).toLocaleDateString("hi-IN") : "-"}
                    </td>
                    <td className="px-4 py-3 text-orange-700 text-xs">{user?.mobileNumber || "-"}</td>
                    <td className="px-4 py-3">
                      <Switch checked={user.isActive} onCheckedChange={() => onToggleActive(user.id, user.isActive)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    कोई यूज़र नहीं मिला
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Mail, Calendar, Shield } from "lucide-react"
import type { User } from "./types"

interface UserManagementProps {
  users: User[]
  isLoading: boolean
  error?: string
  onToggleActive: (userId: string, current: boolean) => void
}

export function UserManagement({ users, isLoading, error, onToggleActive }: UserManagementProps) {
  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <div className="text-red-600 mb-4">❌ डेटा लोड करने में त्रुटि</div>
          <p className="text-gray-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      SUPER_ADMIN: { label: "सुपर एडमिन", variant: "destructive" as const },
      CHOKHLA_ADMIN: { label: "चौकला एडमिन", variant: "default" as const },
      VILLAGE_ADMIN: { label: "गांव एडमिन", variant: "secondary" as const },
    }

    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, variant: "outline" as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Card className="mb-8 shadow-lg border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <Users className="w-5 h-5" />
          यूज़र प्रबंधन
        </CardTitle>
        <p className="text-sm text-orange-600">कुल यूज़र: {users?.length || 0}</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        ) : users?.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">कोई यूज़र नहीं मिला</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] bg-white border border-orange-200 rounded-lg shadow">
              <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    यूज़र जानकारी
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">भूमिका</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">स्थिति</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    निर्माण तिथि
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {users?.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-orange-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-orange-25"}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">
                            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-orange-900">{user.fullName}</div>
                          <div className="flex items-center gap-1 text-xs text-orange-600">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-1">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-orange-500" />
                        {getRoleBadge(user.globalRole)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`} />
                        <span className={`text-sm ${user.isActive ? "text-green-700" : "text-red-700"}`}>
                          {user.isActive ? "सक्रिय" : "निष्क्रिय"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-orange-700">
                        <Calendar className="w-4 h-4" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("hi-IN") : "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={() => onToggleActive(user.id, user.isActive)}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

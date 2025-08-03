"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, User, Mail, Phone, MapPin } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

export function UserManagement() {
  const { users, isLoadingUsers } = useSuperAdmin()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "destructive"
      case "ADMIN":
        return "default"
      default:
        return "secondary"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "सुपर एडमिन"
      case "ADMIN":
        return "एडमिन"
      default:
        return "उपयोगकर्ता"
    }
  }

  if (isLoadingUsers) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">उपयोगकर्ता प्रबंधन</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">उपयोगकर्ता प्रबंधन</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          नया उपयोगकर्ता जोड़ें
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="उपयोगकर्ता खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-600" />
                  {user.firstName} {user.lastName}
                </span>
                <div className="flex space-x-2">
                  <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>
                  <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "सक्रिय" : "निष्क्रिय"}</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {user.mobileNumber}
                </p>
                {user.state && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {user.district}, {user.state}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  <strong>अंतिम लॉगिन:</strong>{" "}
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("hi-IN") : "कभी नहीं"}
                </p>
                <p className="text-xs text-gray-500">
                  <strong>बनाया गया:</strong> {new Date(user.createdAt).toLocaleDateString("hi-IN")}
                </p>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  विवरण देखें
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  संपादित करें
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
          <p className="text-gray-600">खोज शब्द बदलकर पुनः प्रयास करें।</p>
        </div>
      )}
    </div>
  )
}

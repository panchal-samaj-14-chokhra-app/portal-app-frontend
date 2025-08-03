"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Mail, Phone, MapPin, Plus, Shield } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

export function UserManagement() {
  const { users, isLoadingUsers, fetchUsers } = useSuperAdmin()

  if (isLoadingUsers) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-red-100 text-red-800"
      case "ADMIN":
        return "bg-blue-100 text-blue-800"
      case "CHOKHLA":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">उपयोगकर्ता प्रबंधन</h1>
          <p className="text-gray-600 mt-1">सभी उपयोगकर्ताओं की जानकारी और प्रबंधन</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          नया उपयोगकर्ता जोड़ें
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card
            key={user.id}
            className="bg-white/70 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription>
                    {user.district}, {user.state}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "सक्रिय" : "निष्क्रिय"}</Badge>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 truncate">{user.email}</span>
                </div>
                {user.mobileNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{user.mobileNumber}</span>
                  </div>
                )}
                {user.village && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{user.village}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>अंतिम लॉगिन:</span>
                  <span className="font-medium">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("hi-IN") : "कभी नहीं"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>पंजीकरण:</span>
                  <span className="font-medium">{new Date(user.createdAt).toLocaleDateString("hi-IN")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
            <p className="text-gray-500 text-center mb-4">अभी तक कोई उपयोगकर्ता पंजीकृत नहीं है।</p>
            <Button onClick={fetchUsers}>
              <Plus className="w-4 h-4 mr-2" />
              पहला उपयोगकर्ता जोड़ें
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

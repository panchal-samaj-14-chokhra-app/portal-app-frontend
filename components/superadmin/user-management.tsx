"use client"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Users, Plus, UserCheck, UserX, Loader2, Mail } from "lucide-react"

interface User {
  id: string
  fullName: string
  email: string
  globalRole: string
  isActive: boolean
  createdAt: string
  village?: {
    name: string
  }
  chokhla?: {
    name: string
  }
}

interface UserManagementProps {
  users: User[]
  isLoading: boolean
  error: string | null
  onAddUser: () => void
  onToggleActive: (userId: string, currentStatus: boolean) => void
}

const UserManagement: React.FC<UserManagementProps> = ({ users, isLoading, error, onAddUser, onToggleActive }) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Badge className="bg-red-100 text-red-700 border-red-200">सुपर एडमिन</Badge>
      case "CHOKHLA_ADMIN":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">चोखरा एडमिन</Badge>
      case "VILLAGE_MEMBER":
        return <Badge className="bg-green-100 text-green-700 border-green-200">गांव सदस्य</Badge>
      default:
        return <Badge variant="outline">अज्ञात</Badge>
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        <UserCheck className="w-3 h-3 mr-1" />
        सक्रिय
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 border-red-200">
        <UserX className="w-3 h-3 mr-1" />
        निष्क्रिय
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Users className="w-5 h-5 mr-2" />
              यूज़र प्रबंधन
            </CardTitle>
            <CardDescription>सभी उपयोगकर्ताओं की जानकारी और प्रबंधन</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                <p className="text-gray-600">उपयोगकर्ताओं की जानकारी लोड हो रही है...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-red-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <Users className="w-5 h-5 mr-2" />
              यूज़र प्रबंधन
            </CardTitle>
            <CardDescription>सभी उपयोगकर्ताओं की जानकारी और प्रबंधन</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <UserX className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">त्रुटि</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeUsers = users?.filter((user) => user.isActive)?.length || 0
  const inactiveUsers = users?.filter((user) => !user.isActive)?.length || 0

  return (
    <div className="w-full space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">कुल यूज़र</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{users?.length || 0}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">सक्रिय यूज़र</p>
                <p className="text-xl sm:text-2xl font-bold text-green-700">{activeUsers}</p>
              </div>
              <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">निष्क्रिय यूज़र</p>
                <p className="text-xl sm:text-2xl font-bold text-red-700">{inactiveUsers}</p>
              </div>
              <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">नया यूज़र</p>
                <Button onClick={onAddUser} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white mt-2">
                  <Plus className="w-4 h-4 mr-1" />
                  जोड़ें
                </Button>
              </div>
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table/Cards */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center text-orange-700">
                <Users className="w-5 h-5 mr-2" />
                उपयोगकर्ताओं की सूची
              </CardTitle>
              <CardDescription>सभी पंजीकृत उपयोगकर्ताओं की विस्तृत जानकारी</CardDescription>
            </div>
            <Button onClick={onAddUser} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              नया यूज़र जोड़ें
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Mobile Card Layout */}
          <div className="block md:hidden">
            {users?.length > 0 ? (
              <div className="space-y-4 p-4">
                {users.map((user, index) => (
                  <Card key={user.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200">#{index + 1}</Badge>
                          <h3 className="font-semibold text-gray-900 text-sm">{user.fullName}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(user.isActive)}
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={() => onToggleActive(user.id, user.isActive)}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 truncate">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">भूमिका:</span>
                          {getRoleBadge(user.globalRole)}
                        </div>
                        {user.village && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">गांव:</span>
                            <span className="font-medium text-xs">{user.village.name}</span>
                          </div>
                        )}
                        {user.chokhla && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">चोखरा:</span>
                            <span className="font-medium text-xs">{user.chokhla.name}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-600">पंजीकरण:</span>
                          <span className="text-xs text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString("hi-IN")}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
                <p className="text-gray-600 mb-4">अभी तक कोई उपयोगकर्ता पंजीकृत नहीं है</p>
                <Button onClick={onAddUser} className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  पहला उपयोगकर्ता जोड़ें
                </Button>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">क्र.सं.</TableHead>
                  <TableHead>नाम</TableHead>
                  <TableHead>ईमेल</TableHead>
                  <TableHead>भूमिका</TableHead>
                  <TableHead>गांव/चोखरा</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead>पंजीकरण तिथि</TableHead>
                  <TableHead className="text-center">सक्रिय/निष्क्रिय</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">{index + 1}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-orange-600" />
                          {user.fullName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-[200px]" title={user.email}>
                            {user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.globalRole)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.village && <div className="text-green-600">गांव: {user.village.name}</div>}
                          {user.chokhla && <div className="text-blue-600">चोखरा: {user.chokhla.name}</div>}
                          {!user.village && !user.chokhla && <span className="text-gray-500">-</span>}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("hi-IN")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={() => onToggleActive(user.id, user.isActive)}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
                      <p className="text-gray-600 mb-4">अभी तक कोई उपयोगकर्ता पंजीकृत नहीं है</p>
                      <Button onClick={onAddUser} className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        पहला उपयोगकर्ता जोड़ें
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserManagement

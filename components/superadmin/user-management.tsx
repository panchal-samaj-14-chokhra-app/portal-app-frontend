"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Users, UserPlus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  id: string
  fullName: string
  email: string
  globalRole: string
  choklaId?: string
  choklaName?: string
  villageId?: string
  villageName?: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

interface UserManagementProps {
  users: User[]
  isLoading: boolean
  error: string | null
  onAddUser: () => void
  onToggleActive: (userId: string, currentStatus: boolean) => void
}

export default function UserManagement({ users, isLoading, error, onAddUser, onToggleActive }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.choklaName && user.choklaName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.villageName && user.villageName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = selectedRole === "all" || user.globalRole === selectedRole
    return matchesSearch && matchesRole
  })

  const roleStats = {
    total: users.length,
    superAdmin: users.filter((u) => u.globalRole === "SUPER_ADMIN").length,
    chokhlaAdmin: users.filter((u) => u.globalRole === "CHOKHLA_MEMBER").length,
    villageAdmin: users.filter((u) => u.globalRole === "VILLAGE_MEMBER").length,
    active: users.filter((u) => u.isActive).length,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">उपयोगकर्ता प्रबंधन</h1>
            <p className="text-gray-600">सभी उपयोगकर्ताओं की जानकारी देखें और प्रबंधित करें</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">उपयोगकर्ता प्रबंधन</h1>
            <p className="text-gray-600">सभी उपयोगकर्ताओं की जानकारी देखें और प्रबंधित करें</p>
          </div>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                पुनः प्रयास करें
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">उपयोगकर्ता प्रबंधन</h1>
          <p className="text-gray-600">सभी उपयोगकर्ताओं की जानकारी देखें और प्रबंधित करें</p>
        </div>
        <Button onClick={onAddUser} className="bg-orange-600 hover:bg-orange-700">
          <UserPlus className="w-4 h-4 mr-2" />
          नया उपयोगकर्ता जोड़ें
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल उपयोगकर्ता</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.total}</div>
            <p className="text-xs text-muted-foreground">पंजीकृत उपयोगकर्ता</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">सुपर एडमिन</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.superAdmin}</div>
            <p className="text-xs text-muted-foreground">सिस्टम एडमिन</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">चोखला एडमिन</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.chokhlaAdmin}</div>
            <p className="text-xs text-muted-foreground">चोखला प्रबंधक</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">गांव एडमिन</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.villageAdmin}</div>
            <p className="text-xs text-muted-foreground">गांव प्रबंधक</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">सक्रिय उपयोगकर्ता</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.active}</div>
            <p className="text-xs text-muted-foreground">कुल में से</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>फिल्टर और खोज</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="नाम, ईमेल, चोखला या गांव खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">सभी भूमिकाएं</option>
              <option value="SUPER_ADMIN">सुपर एडमिन</option>
              <option value="CHOKHLA_MEMBER">चोखला एडमिन</option>
              <option value="VILLAGE_MEMBER">गांव एडमिन</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>उपयोगकर्ताओं की सूची</CardTitle>
          <CardDescription>
            {filteredUsers.length} उपयोगकर्ता मिले (कुल {users.length} में से)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>नाम</TableHead>
                  <TableHead>ईमेल</TableHead>
                  <TableHead>भूमिका</TableHead>
                  <TableHead>चोखला/गांव</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead>अंतिम लॉगिन</TableHead>
                  <TableHead>बनाया गया</TableHead>
                  <TableHead>कार्य</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.globalRole === "SUPER_ADMIN" && "सुपर एडमिन"}
                        {user.globalRole === "CHOKHLA_MEMBER" && "चोखला एडमिन"}
                        {user.globalRole === "VILLAGE_MEMBER" && "गांव एडमिन"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.choklaName && <div>चोखला: {user.choklaName}</div>}
                        {user.villageName && <div>गांव: {user.villageName}</div>}
                        {!user.choklaName && !user.villageName && <span className="text-gray-500">-</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "सक्रिय" : "निष्क्रिय"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("hi-IN") : "कभी नहीं"}
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString("hi-IN")}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggleActive(user.id, user.isActive)}
                          className={
                            user.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"
                          }
                        >
                          {user.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">कोई उपयोगकर्ता नहीं मिला</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedRole !== "all" ? "अपने फिल्टर बदलकर देखें" : "नया उपयोगकर्ता जोड़ने के लिए ऊपर बटन दबाएं"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

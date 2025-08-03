"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserCog, Shield, Users, UserIcon, CheckCircle, XCircle } from "lucide-react"
import { USER_ROLES } from "./constants"
import type { User as UserType } from "./types"

interface UserManagementProps {
  isLoading?: boolean
}

export function UserManagement({ isLoading = false }: UserManagementProps) {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockUsers: UserType[] = [
          {
            id: "1",
            name: "राम पटेल",
            email: "ram.patel@example.com",
            role: "CHOKHLA",
            isActive: true,
            lastLogin: "2024-01-15T10:30:00Z",
            createdAt: "2024-01-10T08:00:00Z",
            updatedAt: "2024-01-15T10:30:00Z",
          },
          {
            id: "2",
            name: "श्याम शर्मा",
            email: "shyam.sharma@example.com",
            role: "CHOKHLA",
            isActive: false,
            lastLogin: "2024-01-12T14:20:00Z",
            createdAt: "2024-01-08T09:15:00Z",
            updatedAt: "2024-01-12T14:20:00Z",
          },
          {
            id: "3",
            name: "गीता देवी",
            email: "geeta.devi@example.com",
            role: "ADMIN",
            isActive: true,
            lastLogin: "2024-01-16T16:45:00Z",
            createdAt: "2024-01-05T11:30:00Z",
            updatedAt: "2024-01-16T16:45:00Z",
          },
        ]

        setUsers(mockUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Shield className="w-4 h-4" />
      case "ADMIN":
        return <UserCog className="w-4 h-4" />
      case "CHOKHLA":
        return <Users className="w-4 h-4" />
      default:
        return <UserIcon className="w-4 h-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800"
      case "ADMIN":
        return "bg-blue-100 text-blue-800"
      case "CHOKHLA":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">उपयोगकर्ता प्रबंधन</h2>
          <p className="text-gray-600">सभी पंजीकृत उपयोगकर्ताओं की जानकारी</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          कुल उपयोगकर्ता: {users.length}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            उपयोगकर्ता सूची
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UserCog className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
              <p className="text-gray-500 text-center">अभी तक कोई उपयोगकर्ता पंजीकृत नहीं है।</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>उपयोगकर्ता</TableHead>
                    <TableHead>भूमिका</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead>अंतिम लॉगिन</TableHead>
                    <TableHead>पंजीकरण दिनांक</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {USER_ROLES[user.role as keyof typeof USER_ROLES]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            सक्रिय
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            निष्क्रिय
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? (
                          <span className="text-sm text-gray-600">
                            {new Date(user.lastLogin).toLocaleDateString("hi-IN")}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">कभी नहीं</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString("hi-IN")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Shield,
  UserCheck,
  MapPin,
} from "lucide-react"
import { USER_ROLES } from "./constants"
import type { User } from "./types"

interface UserManagementProps {
  users: User[]
  isLoading: boolean
  onRefresh: () => void
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>
}

export function UserManagement({ users, isLoading, onRefresh, onToggleStatus }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.mobileNumber.includes(searchTerm),
      )
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => (statusFilter === "active" ? user.isActive : !user.isActive))
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Shield className="w-4 h-4" />
      case "CHOKHLA":
        return <UserCheck className="w-4 h-4" />
      case "VILLAGE_ADMIN":
        return <MapPin className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    const roleObj = USER_ROLES.find((r) => r.value === role)
    return roleObj ? roleObj.label : role
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "destructive"
      case "CHOKHLA":
        return "default"
      case "VILLAGE_ADMIN":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return "कभी नहीं"
    return new Date(lastLogin).toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8" />
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">उपयोगकर्ता प्रबंधन</h2>
          <p className="text-gray-600">कुल {users.length} उपयोगकर्ता पंजीकृत हैं</p>
        </div>
        <Button onClick={onRefresh} className="bg-blue-600 hover:bg-blue-700">
          रीफ्रेश करें
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="नाम, ईमेल या मोबाइल खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="भूमिका चुनें" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">सभी भूमिकाएं</SelectItem>
            {USER_ROLES.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="स्थिति फिल्टर" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">सभी स्थितियां</SelectItem>
            <SelectItem value="active">सक्रिय</SelectItem>
            <SelectItem value="inactive">निष्क्रिय</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            उपयोगकर्ता सूची ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
              <p className="text-gray-500 text-center">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "फिल्टर बदलकर दोबारा कोशिश करें"
                  : "अभी तक कोई उपयोगकर्ता पंजीकृत नहीं है"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>उपयोगकर्ता</TableHead>
                    <TableHead>संपर्क</TableHead>
                    <TableHead>भूमिका</TableHead>
                    <TableHead>स्थान</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead>पंजीकरण</TableHead>
                    <TableHead>अंतिम लॉगिन</TableHead>
                    <TableHead className="text-right">कार्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{user.mobileNumber}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                          {getRoleIcon(user.role)}
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {user.village && <div>{user.village}</div>}
                          {user.district && <div className="text-gray-500">{user.district}</div>}
                          {user.state && <div className="text-gray-500">{user.state}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "सक्रिय" : "निष्क्रिय"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{formatLastLogin(user.lastLogin)}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              विवरण देखें
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              संपादित करें
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onToggleStatus(user.id, !user.isActive)}>
                              {user.isActive ? (
                                <>
                                  <ToggleLeft className="w-4 h-4 mr-2" />
                                  निष्क्रिय करें
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="w-4 h-4 mr-2" />
                                  सक्रिय करें
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              हटाएं
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  UserCheck,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  UserIcon,
} from "lucide-react"
import type { User } from "./types"

interface UserManagementProps {
  users: User[]
  isLoading: boolean
  onRefresh: () => void
  onToggleStatus: (id: string, isActive: boolean) => void
}

export function UserManagement({ users, isLoading, onRefresh, onToggleStatus }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.village && user.village.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive)
    const matchesState = stateFilter === "all" || user.state === stateFilter

    return matchesSearch && matchesRole && matchesStatus && matchesState
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "कभी नहीं"
    return new Date(lastLogin).toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            एडमिन
          </Badge>
        )
      case "USER":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <UserIcon className="w-3 h-3" />
            उपयोगकर्ता
          </Badge>
        )
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
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
        <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2 bg-transparent">
          <RefreshCw className="w-4 h-4" />
          रीफ्रेश करें
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="नाम, ईमेल या स्थान से खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="भूमिका चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी भूमिकाएं</SelectItem>
                <SelectItem value="ADMIN">एडमिन</SelectItem>
                <SelectItem value="USER">उपयोगकर्ता</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="स्थिति फिल्टर" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी स्थिति</SelectItem>
                <SelectItem value="active">सक्रिय</SelectItem>
                <SelectItem value="inactive">निष्क्रिय</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="राज्य चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी राज्य</SelectItem>
                <SelectItem value="गुजरात">गुजरात</SelectItem>
                <SelectItem value="राजस्थान">राजस्थान</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            उपयोगकर्ता सूची ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>उपयोगकर्ता जानकारी</TableHead>
                  <TableHead>संपर्क</TableHead>
                  <TableHead>स्थान</TableHead>
                  <TableHead>भूमिका</TableHead>
                  <TableHead>अंतिम लॉगिन</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead>कार्य</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-green-700">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">पंजीकरण: {formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-900">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-900">{user.mobileNumber}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.district}</p>
                          <p className="text-xs text-gray-500">
                            {user.village ? `${user.village}, ` : ""}
                            {user.state}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-900">{formatLastLogin(user.lastLogin)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={(checked) => onToggleStatus(user.id, checked)}
                        />
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "सक्रिय" : "निष्क्रिय"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        विवरण
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <UserCheck className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
              <p className="text-gray-500 text-center">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all" || stateFilter !== "all"
                  ? "फिल्टर बदलकर दोबारा कोशिश करें"
                  : "अभी तक कोई उपयोगकर्ता पंजीकृत नहीं है"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

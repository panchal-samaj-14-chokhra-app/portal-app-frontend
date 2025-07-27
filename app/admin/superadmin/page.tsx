"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  MapPin,
  Home,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Settings,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react"
import { useAllVillages, useAllChokhlas, useGetAllUserList } from "@/data-hooks/mutation-query/useQueryAndMutation"

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddVillageOpen, setIsAddVillageOpen] = useState(false)
  const [isAddChokhlaOpen, setIsAddChokhlaOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  // Fetch data
  const { data: villages, isLoading: villagesLoading } = useAllVillages()
  const { data: chokhlas, isLoading: chokhlasLoading } = useAllChokhlas()
  const { data: users, isLoading: usersLoading } = useGetAllUserList()

  // Mock data for demonstration
  const dashboardStats = {
    totalChokhlas: chokhlas?.length || 0,
    totalVillages: villages?.length || 0,
    totalFamilies: 1250,
    totalMembers: 4800,
    totalUsers: users?.length || 0,
    activeRequests: 23,
    pendingApprovals: 8,
    recentActivity: 156,
  }

  const recentActivities = [
    { id: 1, action: "New family registered", village: "Ahmedabad", time: "2 hours ago" },
    { id: 2, action: "Village data updated", village: "Surat", time: "4 hours ago" },
    { id: 3, action: "User approved", village: "Vadodara", time: "6 hours ago" },
    { id: 4, action: "Family request pending", village: "Rajkot", time: "8 hours ago" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage the entire Panchal Samaj Census system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chokhlas">Chokhlas</TabsTrigger>
          <TabsTrigger value="villages">Villages</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Chokhlas</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalChokhlas}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Villages</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalVillages}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Families</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalFamilies}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +89 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalMembers}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +234 from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.village}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Users</span>
                    <Badge variant="default">{dashboardStats.totalUsers}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Requests</span>
                    <Badge variant="secondary">{dashboardStats.activeRequests}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Approvals</span>
                    <Badge variant="destructive">{dashboardStats.pendingApprovals}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Health</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Chokhlas Tab */}
        <TabsContent value="chokhlas" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chokhlas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Dialog open={isAddChokhlaOpen} onOpenChange={setIsAddChokhlaOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Chokhla
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Chokhla</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="chokhla-name">Chokhla Name</Label>
                    <Input id="chokhla-name" placeholder="Enter chokhla name" />
                  </div>
                  <div>
                    <Label htmlFor="chokhla-code">Chokhla Code</Label>
                    <Input id="chokhla-code" placeholder="Enter chokhla code" />
                  </div>
                  <div>
                    <Label htmlFor="chokhla-region">Region</Label>
                    <Input id="chokhla-region" placeholder="Enter region" />
                  </div>
                  <div>
                    <Label htmlFor="chokhla-description">Description</Label>
                    <Textarea id="chokhla-description" placeholder="Enter description" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddChokhlaOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Add Chokhla</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Code</th>
                      <th className="text-left p-4">Villages</th>
                      <th className="text-left p-4">Families</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chokhlasLoading ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      chokhlas?.map((chokhla: any) => (
                        <tr key={chokhla.id} className="border-b">
                          <td className="p-4 font-medium">{chokhla.name}</td>
                          <td className="p-4">{chokhla.code || "N/A"}</td>
                          <td className="p-4">{chokhla.villageCount || 0}</td>
                          <td className="p-4">{chokhla.familyCount || 0}</td>
                          <td className="p-4">
                            <Badge variant={chokhla.isActive ? "default" : "secondary"}>
                              {chokhla.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Villages Tab */}
        <TabsContent value="villages" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search villages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Dialog open={isAddVillageOpen} onOpenChange={setIsAddVillageOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Village
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Village</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="village-name">Village Name</Label>
                    <Input id="village-name" placeholder="Enter village name" />
                  </div>
                  <div>
                    <Label htmlFor="village-chokhla">Chokhla</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chokhla" />
                      </SelectTrigger>
                      <SelectContent>
                        {chokhlas?.map((chokhla: any) => (
                          <SelectItem key={chokhla.id} value={chokhla.id}>
                            {chokhla.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="village-pincode">Pincode</Label>
                    <Input id="village-pincode" placeholder="Enter pincode" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddVillageOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Add Village</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Chokhla</th>
                      <th className="text-left p-4">Pincode</th>
                      <th className="text-left p-4">Families</th>
                      <th className="text-left p-4">Members</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {villagesLoading ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      villages?.map((village: any) => (
                        <tr key={village.id} className="border-b">
                          <td className="p-4 font-medium">{village.name}</td>
                          <td className="p-4">{village.chokhlaName || "N/A"}</td>
                          <td className="p-4">{village.pincode || "N/A"}</td>
                          <td className="p-4">{village.familyCount || 0}</td>
                          <td className="p-4">{village.memberCount || 0}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input id="user-name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" type="email" placeholder="Enter email" />
                  </div>
                  <div>
                    <Label htmlFor="user-role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="user-village">Assigned Village</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select village" />
                      </SelectTrigger>
                      <SelectContent>
                        {villages?.map((village: any) => (
                          <SelectItem key={village.id} value={village.id}>
                            {village.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Add User</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Role</th>
                      <th className="text-left p-4">Village</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      users?.map((user: any) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-4 font-medium">{user.name}</td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4">
                            <Badge variant="outline">{user.role}</Badge>
                          </td>
                          <td className="p-4">{user.villageName || "N/A"}</td>
                          <td className="p-4">
                            <Badge variant={user.isActive ? "default" : "secondary"}>
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Request management functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics and reporting functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, MapPin, Building, TrendingUp, Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API calls
const mockStats = {
  totalChokhlas: 8,
  totalVillages: 156,
  totalFamilies: 3420,
  totalMembers: 14680,
}

const mockChokhlas = [
  { id: "1", name: "Chokhla Central", villages: 12, families: 450, members: 1850, status: "active" },
  { id: "2", name: "Chokhla North", villages: 18, families: 520, members: 2100, status: "active" },
  { id: "3", name: "Chokhla South", villages: 22, families: 680, members: 2750, status: "active" },
  { id: "4", name: "Chokhla East", villages: 15, families: 380, members: 1520, status: "active" },
  { id: "5", name: "Chokhla West", villages: 20, families: 590, members: 2380, status: "active" },
]

const mockVillages = [
  { id: "1", name: "Village Alpha", chokhla: "Chokhla Central", families: 45, members: 180, status: "active" },
  { id: "2", name: "Village Beta", chokhla: "Chokhla North", families: 38, members: 152, status: "active" },
  { id: "3", name: "Village Gamma", chokhla: "Chokhla South", families: 52, members: 208, status: "active" },
  { id: "4", name: "Village Delta", chokhla: "Chokhla East", families: 41, members: 164, status: "active" },
  { id: "5", name: "Village Epsilon", chokhla: "Chokhla West", families: 35, members: 140, status: "active" },
]

const mockRequests = [
  { id: "1", type: "Family Registration", village: "Village Alpha", status: "pending", date: "2024-01-15" },
  { id: "2", type: "Member Addition", village: "Village Beta", status: "approved", date: "2024-01-14" },
  { id: "3", type: "Data Correction", village: "Village Gamma", status: "pending", date: "2024-01-13" },
  { id: "4", type: "Family Transfer", village: "Village Delta", status: "rejected", date: "2024-01-12" },
]

export default function SuperAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddChokhlaOpen, setIsAddChokhlaOpen] = useState(false)
  const [isAddVillageOpen, setIsAddVillageOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all Chokhlas, villages, and census data across the organization</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chokhlas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalChokhlas}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Villages</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalVillages}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
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
            <div className="text-2xl font-bold">{mockStats.totalFamilies}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +45 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +180 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="chokhlas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chokhlas">Chokhlas</TabsTrigger>
          <TabsTrigger value="villages">Villages</TabsTrigger>
          <TabsTrigger value="families">Families</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Chokhlas Tab */}
        <TabsContent value="chokhlas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Chokhla Management</CardTitle>
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
                        <Label htmlFor="chokhla-description">Description</Label>
                        <Textarea id="chokhla-description" placeholder="Enter description" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddChokhlaOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsAddChokhlaOpen(false)}>Add Chokhla</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search chokhlas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="space-y-2">
                  {mockChokhlas.map((chokhla) => (
                    <div key={chokhla.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">{chokhla.name}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Villages: {chokhla.villages}</span>
                          <span>Families: {chokhla.families}</span>
                          <span>Members: {chokhla.members}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(chokhla.status)}>{chokhla.status}</Badge>
                        <Link href={`/admin/chokhla/${chokhla.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Villages Tab */}
        <TabsContent value="villages" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Village Management</CardTitle>
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
                        <Input id="village-chokhla" placeholder="Select chokhla" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddVillageOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsAddVillageOpen(false)}>Add Village</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search villages..." className="max-w-sm" />
                </div>
                <div className="space-y-2">
                  {mockVillages.map((village) => (
                    <div key={village.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">{village.name}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Chokhla: {village.chokhla}</span>
                          <span>Families: {village.families}</span>
                          <span>Members: {village.members}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(village.status)}>{village.status}</Badge>
                        <Link href={`/admin/village/${village.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Families Tab */}
        <TabsContent value="families" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Family Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Family management interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium">{request.type}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Village: {request.village}</span>
                        <span>Date: {request.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Reports and analytics interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

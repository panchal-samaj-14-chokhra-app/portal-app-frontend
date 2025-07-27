"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Users, Home, Building, Plus, Search, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  useAllChokhlas,
  useAllVillages,
  useCreateChokhla,
  useCreateVillage,
  useGetAllUserList,
} from "@/data-hooks/mutation-query/useQueryAndMutation"

export default function SuperAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [newChokhla, setNewChokhla] = useState({ name: "", code: "" })
  const [newVillage, setNewVillage] = useState({ name: "", code: "", choklaId: "" })
  const [isChokhlaDialogOpen, setIsChokhlaDialogOpen] = useState(false)
  const [isVillageDialogOpen, setIsVillageDialogOpen] = useState(false)

  // Fetch data
  const { data: chokhlasResponse, isLoading: chokhlasLoading } = useAllChokhlas()
  const { data: villagesResponse, isLoading: villagesLoading } = useAllVillages()
  const { data: usersResponse, isLoading: usersLoading } = useGetAllUserList()

  const chokhlas = chokhlasResponse?.data || []
  const villages = villagesResponse?.data || []
  const users = usersResponse?.data || []

  // Mutations
  const createChokhlaMutation = useCreateChokhla()
  const createVillageMutation = useCreateVillage()

  // Calculate statistics
  const totalChokhlas = chokhlas.length
  const totalVillages = villages.length
  const totalFamilies = villages.reduce((sum, village) => sum + (village.totalFamilies || 0), 0)
  const totalMembers = villages.reduce((sum, village) => sum + (village.totalMembers || 0), 0)

  // Filter functions
  const filteredChokhlas = chokhlas.filter(
    (chokhla) =>
      chokhla.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredVillages = villages.filter(
    (village) =>
      village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle form submissions
  const handleCreateChokhla = async () => {
    if (!newChokhla.name || !newChokhla.code) return

    try {
      await createChokhlaMutation.mutateAsync(newChokhla)
      setNewChokhla({ name: "", code: "" })
      setIsChokhlaDialogOpen(false)
    } catch (error) {
      console.error("Error creating chokhla:", error)
    }
  }

  const handleCreateVillage = async () => {
    if (!newVillage.name || !newVillage.code || !newVillage.choklaId) return

    try {
      await createVillageMutation.mutateAsync(newVillage)
      setNewVillage({ name: "", code: "", choklaId: "" })
      setIsVillageDialogOpen(false)
    } catch (error) {
      console.error("Error creating village:", error)
    }
  }

  if (chokhlasLoading || villagesLoading || usersLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600">Manage chokhlas, villages, and system administration</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isChokhlaDialogOpen} onOpenChange={setIsChokhlaDialogOpen}>
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
                  <Input
                    id="chokhla-name"
                    value={newChokhla.name}
                    onChange={(e) => setNewChokhla({ ...newChokhla, name: e.target.value })}
                    placeholder="Enter chokhla name"
                  />
                </div>
                <div>
                  <Label htmlFor="chokhla-code">Chokhla Code</Label>
                  <Input
                    id="chokhla-code"
                    value={newChokhla.code}
                    onChange={(e) => setNewChokhla({ ...newChokhla, code: e.target.value })}
                    placeholder="Enter chokhla code"
                  />
                </div>
                <Button onClick={handleCreateChokhla} className="w-full">
                  Create Chokhla
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chokhlas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChokhlas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Villages</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVillages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Families</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFamilies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search chokhlas, villages, or users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chokhlas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chokhlas">Chokhlas</TabsTrigger>
          <TabsTrigger value="villages">Villages</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Chokhlas Tab */}
        <TabsContent value="chokhlas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chokhlas Management</CardTitle>
                <Dialog open={isChokhlaDialogOpen} onOpenChange={setIsChokhlaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Chokhla
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredChokhlas.map((chokhla) => (
                  <div key={chokhla.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-lg">{chokhla.name}</h3>
                          <p className="text-sm text-gray-600">Code: {chokhla.code}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="secondary">{chokhla.totalVillages} Villages</Badge>
                          <Badge variant="outline">{chokhla.totalFamilies} Families</Badge>
                          <Badge variant="outline">{chokhla.totalMembers} Members</Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/admin/chokhla/${chokhla.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Villages Tab */}
        <TabsContent value="villages">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Villages Management</CardTitle>
                <Dialog open={isVillageDialogOpen} onOpenChange={setIsVillageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
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
                        <Input
                          id="village-name"
                          value={newVillage.name}
                          onChange={(e) => setNewVillage({ ...newVillage, name: e.target.value })}
                          placeholder="Enter village name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="village-code">Village Code</Label>
                        <Input
                          id="village-code"
                          value={newVillage.code}
                          onChange={(e) => setNewVillage({ ...newVillage, code: e.target.value })}
                          placeholder="Enter village code"
                        />
                      </div>
                      <div>
                        <Label htmlFor="chokhla-select">Select Chokhla</Label>
                        <Select
                          value={newVillage.choklaId}
                          onValueChange={(value) => setNewVillage({ ...newVillage, choklaId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a chokhla" />
                          </SelectTrigger>
                          <SelectContent>
                            {chokhlas.map((chokhla) => (
                              <SelectItem key={chokhla.id} value={chokhla.id}>
                                {chokhla.name} ({chokhla.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleCreateVillage} className="w-full">
                        Create Village
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVillages.map((village) => (
                  <div key={village.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-lg">{village.name}</h3>
                          <p className="text-sm text-gray-600">
                            Code: {village.code} | Chokhla: {village.chokhla?.name}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="secondary">{village.totalFamilies} Families</Badge>
                          <Badge variant="outline">{village.totalMembers} Members</Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/admin/village/${village.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Badge variant={user.role === "superadmin" ? "default" : "secondary"}>{user.role}</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">No pending requests at this time.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">Reports functionality coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

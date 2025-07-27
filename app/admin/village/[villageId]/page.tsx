"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Users, Home, Phone, Mail, Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API call
const mockVillageData = {
  id: "1",
  name: "Village Alpha",
  chokhla: "Chokhla Central",
  totalFamilies: 45,
  totalMembers: 180,
  headPerson: {
    name: "Rajesh Panchal",
    phone: "+91 98765 43210",
    email: "rajesh.panchal@example.com",
  },
  families: [
    {
      id: "1",
      familyHead: "John Panchal",
      members: 4,
      address: "123 Main Street",
      phone: "+91 98765 43210",
      status: "active",
    },
    {
      id: "2",
      familyHead: "David Panchal",
      members: 3,
      address: "456 Oak Avenue",
      phone: "+91 98765 43211",
      status: "active",
    },
    {
      id: "3",
      familyHead: "Michael Panchal",
      members: 5,
      address: "789 Pine Road",
      phone: "+91 98765 43212",
      status: "active",
    },
    {
      id: "4",
      familyHead: "Robert Panchal",
      members: 2,
      address: "321 Elm Street",
      phone: "+91 98765 43213",
      status: "inactive",
    },
    {
      id: "5",
      familyHead: "William Panchal",
      members: 6,
      address: "654 Maple Drive",
      phone: "+91 98765 43214",
      status: "active",
    },
  ],
}

export default function VillageDetailPage() {
  const params = useParams()
  const villageId = params.villageId as string

  // In a real app, you would fetch data based on villageId
  const village = mockVillageData

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/superadmin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{village.name}</h1>
            <p className="text-muted-foreground">Part of {village.chokhla}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Village
          </Button>
          <Link href={`/admin/village/${villageId}/add-family`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Family
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Families</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{village.totalFamilies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{village.totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Families</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{village.families.filter((f) => f.status === "active").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Family Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(village.totalMembers / village.totalFamilies)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Village Head Information */}
      <Card>
        <CardHeader>
          <CardTitle>Village Head</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{village.headPerson.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{village.headPerson.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{village.headPerson.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Families List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Families in {village.name}</CardTitle>
            <Link href={`/admin/village/${villageId}/add-family`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Family
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search families..." className="max-w-sm" />
            </div>
            <div className="space-y-2">
              {village.families.map((family) => (
                <div key={family.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">{family.familyHead}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Members: {family.members}</span>
                      <span>Address: {family.address}</span>
                      <span>Phone: {family.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(family.status)}>{family.status}</Badge>
                    <Link href={`/admin/village/${villageId}/family/${family.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/village/${villageId}/family/${family.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
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
    </div>
  )
}

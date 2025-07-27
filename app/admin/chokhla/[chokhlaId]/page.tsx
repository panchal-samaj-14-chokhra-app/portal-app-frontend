"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API call
const mockChokhlaData = {
  id: "1",
  name: "Chokhla Central",
  description: "Main administrative center for the region",
  totalVillages: 12,
  totalFamilies: 450,
  totalMembers: 1850,
  establishedYear: 1985,
  headPerson: {
    name: "Ramesh Panchal",
    phone: "+91 98765 43210",
    email: "ramesh.panchal@example.com",
  },
  villages: [
    { id: "1", name: "Village A", families: 45, members: 180 },
    { id: "2", name: "Village B", families: 38, members: 152 },
    { id: "3", name: "Village C", families: 52, members: 208 },
    { id: "4", name: "Village D", families: 41, members: 164 },
    { id: "5", name: "Village E", families: 35, members: 140 },
  ],
}

export default function ChokhlaDetailPage() {
  const params = useParams()
  const chokhlaId = params.chokhlaId as string

  // In a real app, you would fetch data based on chokhlaId
  const chokhla = mockChokhlaData

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/superadmin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{chokhla.name}</h1>
          <p className="text-muted-foreground">{chokhla.description}</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Villages</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chokhla.totalVillages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Families</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chokhla.totalFamilies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chokhla.totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Established</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chokhla.establishedYear}</div>
          </CardContent>
        </Card>
      </div>

      {/* Head Person Information */}
      <Card>
        <CardHeader>
          <CardTitle>Head Person</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{chokhla.headPerson.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{chokhla.headPerson.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{chokhla.headPerson.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Villages List */}
      <Card>
        <CardHeader>
          <CardTitle>Villages in {chokhla.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chokhla.villages.map((village) => (
              <Link key={village.id} href={`/admin/village/${village.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{village.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Families: <span className="font-medium">{village.families}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Members: <span className="font-medium">{village.members}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

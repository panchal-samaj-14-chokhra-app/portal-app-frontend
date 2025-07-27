"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Home, Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useChokhlaDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"

export default function ChokhlaDetailPage() {
  const params = useParams()
  const chokhlaId = params.chokhlaId as string

  const { data: chokhlaResponse, isLoading, error } = useChokhlaDetails(chokhlaId)
  const chokhla = chokhlaResponse?.data

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !chokhla) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chokhla Not Found</h2>
          <p className="text-gray-600 mb-6">The requested chokhla could not be found.</p>
          <Link href="/admin/superadmin">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/superadmin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{chokhla.name}</h1>
            <p className="text-gray-600">Code: {chokhla.code}</p>
          </div>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Chokhla
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Home className="h-4 w-4 text-muted-foreground" />
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
      </div>

      {/* Villages List */}
      <Card>
        <CardHeader>
          <CardTitle>Villages in {chokhla.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {chokhla.villages && chokhla.villages.length > 0 ? (
            <div className="space-y-4">
              {chokhla.villages.map((village) => (
                <div key={village.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-lg">{village.name}</h3>
                        <p className="text-sm text-gray-600">Code: {village.code}</p>
                      </div>
                      <div className="flex space-x-4">
                        <Badge variant="secondary">{village.totalFamilies} Families</Badge>
                        <Badge variant="outline">{village.totalMembers} Members</Badge>
                      </div>
                    </div>
                    <Link href={`/admin/village/${village.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No villages found in this chokhla.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

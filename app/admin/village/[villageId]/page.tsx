"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MapPin, Users, Home, Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useVillageDetails, useDeleteFamilyUsingID } from "@/data-hooks/mutation-query/useQueryAndMutation"

export default function VillageDetailPage() {
  const params = useParams()
  const villageId = params.villageId as string
  const [searchTerm, setSearchTerm] = useState("")

  const { data: villageResponse, isLoading, error } = useVillageDetails(villageId)
  const village = villageResponse?.data

  const deleteFamilyMutation = useDeleteFamilyUsingID()

  const handleDeleteFamily = async (familyId: string) => {
    try {
      await deleteFamilyMutation.mutateAsync(familyId)
    } catch (error) {
      console.error("Error deleting family:", error)
    }
  }

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

  if (error || !village) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Village Not Found</h2>
          <p className="text-gray-600 mb-6">The requested village could not be found.</p>
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

  const filteredFamilies =
    village.families?.filter(
      (family) =>
        family.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.address.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

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
            <h1 className="text-3xl font-bold text-gray-900">{village.name}</h1>
            <p className="text-gray-600">
              Code: {village.code} | Chokhla: {village.chokhla?.name}
            </p>
          </div>
        </div>
        <Link href={`/admin/village/${villageId}/add-family`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Family
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <CardTitle className="text-sm font-medium">Average Family Size</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {village.totalFamilies > 0 ? Math.round(village.totalMembers / village.totalFamilies) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search families..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Families List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Families in {village.name}</CardTitle>
            <Link href={`/admin/village/${villageId}/add-family`}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Family
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFamilies.length > 0 ? (
            <div className="space-y-4">
              {filteredFamilies.map((family) => (
                <div key={family.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-lg">{family.headName}</h3>
                        <p className="text-sm text-gray-600">{family.address}</p>
                        {family.phone && <p className="text-sm text-gray-500">Phone: {family.phone}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="secondary">{family.totalMembers} Members</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/village/${villageId}/family/${family.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/village/${villageId}/family/${family.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Family</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {family.headName}'s family? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteFamily(family.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm ? "No families found matching your search." : "No families found in this village."}
              </p>
              <Link href={`/admin/village/${villageId}/add-family`}>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Family
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

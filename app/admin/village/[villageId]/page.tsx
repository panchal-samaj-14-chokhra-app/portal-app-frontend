"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { Users, Home, Phone, MapPin, Plus, Search, Edit, Trash2, Eye, Calendar, Filter } from "lucide-react"
import { useVillageDetails, useDeleteFamilyUsingID } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { toast } from "@/hooks/use-toast"

export default function VillageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const villageId = params.villageId as string

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFamily, setSelectedFamily] = useState<any>(null)

  const { data: village, isLoading, error, refetch } = useVillageDetails(villageId)
  const deleteFamilyMutation = useDeleteFamilyUsingID()

  const handleDeleteFamily = async (familyId: string) => {
    try {
      await deleteFamilyMutation.mutateAsync(familyId)
      toast({
        title: "Success",
        description: "Family deleted successfully",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete family",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error loading village details</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!village) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>Village not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredFamilies =
    village.families?.filter(
      (family: any) =>
        family.familyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.headOfFamily?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{village.name}</h1>
          <p className="text-muted-foreground mt-1">Village Details and Family Management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/village/${villageId}/add-family`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Family
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Village
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Families</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{village.families?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{village.totalMembers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pincode</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{village.pincode || "N/A"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chokhla</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{village.chokhlaName || "N/A"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Village Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Village Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Village Name</label>
              <p className="text-sm">{village.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Pincode</label>
              <p className="text-sm">{village.pincode || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Chokhla</label>
              <p className="text-sm">{village.chokhlaName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">District</label>
              <p className="text-sm">{village.district || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Families List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Families ({filteredFamilies.length})
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search families..."
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
          </div>
        </CardHeader>
        <CardContent>
          {filteredFamilies.length > 0 ? (
            <div className="space-y-4">
              {filteredFamilies.map((family: any) => (
                <Card key={family.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{family.familyName || "N/A"}</h4>
                          <Badge variant="outline" className="text-xs">
                            {family.members?.length || 0} members
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Head: {family.headOfFamily || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{family.contactNumber || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            <span>{family.address || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/village/${villageId}/family/${family.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/village/${villageId}/family/${family.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Family</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this family? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFamily(family.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No families found matching your search" : "No families found in this village"}
              </p>
              <Button onClick={() => router.push(`/admin/village/${villageId}/add-family`)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Family
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Record Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-muted-foreground">Created</label>
              <p>{village.createdAt ? new Date(village.createdAt).toLocaleDateString() : "N/A"}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">Last Updated</label>
              <p>{village.updatedAt ? new Date(village.updatedAt).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

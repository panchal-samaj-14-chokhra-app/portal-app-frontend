"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Users, Home, Phone, Mail, Calendar } from "lucide-react"
import { useChokhlaDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"

export default function ChokhlaDetailPage() {
  const params = useParams()
  const chokhlaId = params.chokhlaId as string

  const { data: chokhla, isLoading, error } = useChokhlaDetails(chokhlaId)

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
            <p className="text-red-500">Error loading chokhla details</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!chokhla) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>Chokhla not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{chokhla.name}</h1>
          <p className="text-muted-foreground mt-1">Chokhla Details and Statistics</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          ID: {chokhla.id}
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Villages</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chokhla.totalVillages || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Families</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chokhla.totalFamilies || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chokhla.totalMembers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Status</CardTitle>
            <Badge variant={chokhla.isActive ? "default" : "secondary"}>
              {chokhla.isActive ? "Active" : "Inactive"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {chokhla.isActive ? "Currently Active" : "Currently Inactive"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chokhla Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Chokhla Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-sm">{chokhla.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Code</label>
              <p className="text-sm">{chokhla.code || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Region</label>
              <p className="text-sm">{chokhla.region || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">District</label>
              <p className="text-sm">{chokhla.district || "N/A"}</p>
            </div>
          </div>

          {chokhla.description && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm mt-1">{chokhla.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Villages List */}
      {chokhla.villages && chokhla.villages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Villages in this Chokhla
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chokhla.villages.map((village: any) => (
                <Card key={village.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{village.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {village.familyCount || 0} families
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{village.memberCount || 0} members</span>
                      </div>
                      {village.pincode && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{village.pincode}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 bg-transparent"
                      onClick={() => (window.location.href = `/admin/village/${village.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      {(chokhla.contactPerson || chokhla.contactPhone || chokhla.contactEmail) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {chokhla.contactPerson && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{chokhla.contactPerson}</span>
              </div>
            )}
            {chokhla.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{chokhla.contactPhone}</span>
              </div>
            )}
            {chokhla.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{chokhla.contactEmail}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
              <p>{chokhla.createdAt ? new Date(chokhla.createdAt).toLocaleDateString() : "N/A"}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">Last Updated</label>
              <p>{chokhla.updatedAt ? new Date(chokhla.updatedAt).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

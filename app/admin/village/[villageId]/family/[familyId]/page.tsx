"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Users, Phone, Calendar, Edit, Trash2, UserPlus, Home, User } from "lucide-react"
import { useGetFamilyDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"

export default function FamilyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const villageId = params.villageId as string
  const familyId = params.familyId as string

  const { data: family, isLoading, error } = useGetFamilyDetails(familyId)

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
            <p className="text-red-500">Error loading family details</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!family) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>Family not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const headOfFamily = family.members?.find((member: any) => member.isHead) || family.members?.[0]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/village/${villageId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Village
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{family.familyName || "Family Details"}</h1>
            <p className="text-muted-foreground mt-1">
              Family ID: {family.id} • {family.members?.length || 0} members
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/village/${villageId}/family/${familyId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Family
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Family
          </Button>
        </div>
      </div>

      {/* Family Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{family.members?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Head of Family</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{headOfFamily?.name || "N/A"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{family.contactNumber || headOfFamily?.phone || "N/A"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Address</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{family.address || "N/A"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Family Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Family Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Family Name</label>
              <p className="text-sm">{family.familyName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Family ID</label>
              <p className="text-sm">{family.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact Number</label>
              <p className="text-sm">{family.contactNumber || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm">{family.email || "N/A"}</p>
            </div>
          </div>

          {family.address && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm mt-1">{family.address}</p>
              </div>
            </>
          )}

          {family.notes && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="text-sm mt-1">{family.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Family Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Family Members ({family.members?.length || 0})
            </CardTitle>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {family.members && family.members.length > 0 ? (
            <div className="space-y-4">
              {family.members.map((member: any, index: number) => (
                <Card key={member.id || index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {member.name}
                            {member.isHead && (
                              <Badge variant="default" className="text-xs">
                                Head of Family
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {member.relation || "N/A"} • {member.age ? `${member.age} years` : "Age N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-muted-foreground">Gender</label>
                        <p>{member.gender || "N/A"}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Date of Birth</label>
                        <p>{member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Education</label>
                        <p>{member.education || "N/A"}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Occupation</label>
                        <p>{member.occupation || "N/A"}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Phone</label>
                        <p>{member.phone || "N/A"}</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Email</label>
                        <p>{member.email || "N/A"}</p>
                      </div>
                    </div>

                    {member.maritalStatus && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <label className="font-medium text-muted-foreground">Marital Status</label>
                            <p>{member.maritalStatus}</p>
                          </div>
                          {member.spouseName && (
                            <div>
                              <label className="font-medium text-muted-foreground">Spouse Name</label>
                              <p>{member.spouseName}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No family members found</p>
              <Button className="mt-4">
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Member
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
              <p>{family.createdAt ? new Date(family.createdAt).toLocaleDateString() : "N/A"}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">Last Updated</label>
              <p>{family.updatedAt ? new Date(family.updatedAt).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

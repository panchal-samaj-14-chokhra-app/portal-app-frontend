"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Mail, GraduationCap, Briefcase, Heart, ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { useGetFamilyDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"

export default function FamilyDetailPage() {
  const params = useParams()
  const familyId = params.familyId as string
  const villageId = params.villageId as string

  const { data: familyResponse, isLoading, error } = useGetFamilyDetails(familyId)
  const family = familyResponse?.data

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

  if (error || !family) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Family Not Found</h2>
          <p className="text-gray-600 mb-6">The requested family could not be found.</p>
          <Link href={`/admin/village/${villageId}`}>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Village
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
          <Link href={`/admin/village/${villageId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Village
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{family.headName}'s Family</h1>
            <p className="text-gray-600">{family.address}</p>
          </div>
        </div>
        <Link href={`/admin/village/${villageId}/family/${familyId}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Family
          </Button>
        </Link>
      </div>

      {/* Family Information */}
      <Card>
        <CardHeader>
          <CardTitle>Family Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Family Head</p>
              <p className="text-lg">{family.headName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <p className="text-lg">{family.totalMembers}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-lg">{family.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Village</p>
              <p className="text-lg">{family.village?.name}</p>
            </div>
            {family.phone && (
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-lg flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {family.phone}
                </p>
              </div>
            )}
            {family.email && (
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {family.email}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Family Members */}
      <Card>
        <CardHeader>
          <CardTitle>Family Members ({family.members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {family.members.map((member, index) => (
              <div key={member.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Age: {member.age}</span>
                          <span>•</span>
                          <span className="capitalize">{member.gender}</span>
                          <span>•</span>
                          <span>{member.relation}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {member.education && (
                          <Badge variant="outline" className="flex items-center">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {member.education}
                          </Badge>
                        )}
                        {member.occupation && (
                          <Badge variant="outline" className="flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {member.occupation}
                          </Badge>
                        )}
                        {member.maritalStatus && (
                          <Badge variant="outline" className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {member.maritalStatus}
                          </Badge>
                        )}
                      </div>

                      {(member.phone || member.email) && (
                        <div className="flex items-center space-x-4 text-sm">
                          {member.phone && (
                            <span className="flex items-center text-gray-600">
                              <Phone className="h-3 w-3 mr-1" />
                              {member.phone}
                            </span>
                          )}
                          {member.email && (
                            <span className="flex items-center text-gray-600">
                              <Mail className="h-3 w-3 mr-1" />
                              {member.email}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < family.members.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

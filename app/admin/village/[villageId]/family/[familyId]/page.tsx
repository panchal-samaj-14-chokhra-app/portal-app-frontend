"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Phone, Mail, MapPin, Edit, UserPlus } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API call
const mockFamilyData = {
  id: "1",
  familyHead: "John Panchal",
  address: "123 Main Street, Village Center",
  phone: "+91 98765 43210",
  email: "john.panchal@example.com",
  registrationDate: "2023-01-15",
  status: "active",
  members: [
    {
      id: "1",
      name: "John Panchal",
      age: 45,
      gender: "male",
      relation: "head",
      occupation: "Farmer",
      education: "Graduate",
      maritalStatus: "married",
    },
    {
      id: "2",
      name: "Jane Panchal",
      age: 40,
      gender: "female",
      relation: "wife",
      occupation: "Teacher",
      education: "Post Graduate",
      maritalStatus: "married",
    },
    {
      id: "3",
      name: "Mike Panchal",
      age: 18,
      gender: "male",
      relation: "son",
      occupation: "Student",
      education: "Higher Secondary",
      maritalStatus: "unmarried",
    },
    {
      id: "4",
      name: "Sarah Panchal",
      age: 16,
      gender: "female",
      relation: "daughter",
      occupation: "Student",
      education: "Secondary",
      maritalStatus: "unmarried",
    },
  ],
}

export default function FamilyDetailPage() {
  const params = useParams()
  const villageId = params.villageId as string
  const familyId = params.familyId as string

  // In a real app, you would fetch data based on familyId
  const family = mockFamilyData

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

  const getRelationColor = (relation: string) => {
    switch (relation) {
      case "head":
        return "bg-blue-100 text-blue-800"
      case "wife":
        return "bg-pink-100 text-pink-800"
      case "son":
        return "bg-green-100 text-green-800"
      case "daughter":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/village/${villageId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Village
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{family.familyHead} Family</h1>
            <p className="text-muted-foreground">Family ID: {family.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/village/${villageId}/family/${familyId}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Family
            </Button>
          </Link>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Family Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Head:</span>
              <span>{family.familyHead}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Address:</span>
              <span>{family.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Phone:</span>
              <span>{family.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{family.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge className={getStatusColor(family.status)}>{family.status}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Registration Date:</span>
              <span>{family.registrationDate}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Members:</span>
              <span className="font-bold">{family.members.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Male Members:</span>
              <span className="font-bold">{family.members.filter((m) => m.gender === "male").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Female Members:</span>
              <span className="font-bold">{family.members.filter((m) => m.gender === "female").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Married Members:</span>
              <span className="font-bold">{family.members.filter((m) => m.maritalStatus === "married").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Working Members:</span>
              <span className="font-bold">{family.members.filter((m) => m.occupation !== "Student").length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Family Members */}
      <Card>
        <CardHeader>
          <CardTitle>Family Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {family.members.map((member) => (
              <Card key={member.id} className="border-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge className={getRelationColor(member.relation)}>{member.relation}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Age:</span>
                      <span className="ml-1 font-medium">{member.age}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="ml-1 font-medium capitalize">{member.gender}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Occupation:</span>
                      <span className="ml-1 font-medium">{member.occupation}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Education:</span>
                      <span className="ml-1 font-medium">{member.education}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Marital Status:</span>
                      <span className="ml-1 font-medium capitalize">{member.maritalStatus}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

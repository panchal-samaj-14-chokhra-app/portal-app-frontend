"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AddEditFamily } from "@/components/group-component/add-edit-family"

// Mock family data - replace with actual API call
const mockFamilyData = {
  id: "1",
  familyHead: "John Panchal",
  address: "123 Main Street, Village Center",
  phone: "+91 98765 43210",
  email: "john.panchal@example.com",
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
  ],
}

export default function EditFamilyPage() {
  const params = useParams()
  const router = useRouter()
  const villageId = params.villageId as string
  const familyId = params.familyId as string

  const handleBack = () => {
    router.push(`/admin/village/${villageId}/family/${familyId}`)
  }

  const handleSave = (familyData: any) => {
    // Handle saving the family data
    console.log("Saving family data:", familyData)
    // After successful save, redirect back to family detail page
    router.push(`/admin/village/${villageId}/family/${familyId}`)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Family
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Family</h1>
          <p className="text-muted-foreground">Edit family information and members</p>
        </div>
      </div>

      {/* Edit Family Form */}
      <AddEditFamily
        mode="edit"
        villageId={villageId}
        familyId={familyId}
        initialData={mockFamilyData}
        onSave={handleSave}
        onCancel={handleBack}
      />
    </div>
  )
}

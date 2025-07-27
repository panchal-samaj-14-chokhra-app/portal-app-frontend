"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AddEditFamily } from "@/components/group-component/add-edit-family"
import { useGetFamilyDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"

export default function EditFamilyPage() {
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
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !family) {
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Family</h1>
          <p className="text-muted-foreground mt-1">Edit family information and members</p>
        </div>
      </div>

      {/* Edit Family Form */}
      <Card>
        <CardHeader>
          <CardTitle>Family Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AddEditFamily
            villageId={villageId}
            familyId={familyId}
            initialData={family}
            mode="edit"
            onSuccess={() => router.push(`/admin/village/${villageId}/family/${familyId}`)}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  )
}

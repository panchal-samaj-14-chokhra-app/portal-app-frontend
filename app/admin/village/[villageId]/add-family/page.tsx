"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AddEditFamily from "@/components/group-component/add-edit-family"

export default function AddFamilyPage() {
  const params = useParams()
  const router = useRouter()
  const villageId = params.villageId as string

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Family</h1>
          <p className="text-muted-foreground mt-1">Add a new family to the village</p>
        </div>
      </div>

      {/* Add Family Form */}
      <Card>
        <CardHeader>
          <CardTitle>Family Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AddEditFamily
            villageId={villageId}
            mode="add"
            onSuccess={() => router.push(`/admin/village/${villageId}`)}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  )
}

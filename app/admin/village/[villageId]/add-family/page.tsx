"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AddEditFamily } from "@/components/group-component/add-edit-family"

export default function AddFamilyPage() {
  const params = useParams()
  const router = useRouter()
  const villageId = params.villageId as string

  const handleBack = () => {
    router.push(`/admin/village/${villageId}`)
  }

  const handleSave = (familyData: any) => {
    // Handle saving the family data
    console.log("Saving family data:", familyData)
    // After successful save, redirect back to village page
    router.push(`/admin/village/${villageId}`)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Village
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Family</h1>
          <p className="text-muted-foreground">Add a new family to the village</p>
        </div>
      </div>

      {/* Add Family Form */}
      <AddEditFamily mode="add" villageId={villageId} onSave={handleSave} onCancel={handleBack} />
    </div>
  )
}

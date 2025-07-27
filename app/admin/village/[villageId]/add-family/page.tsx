"use client"

import { useParams, useRouter } from "next/navigation"
import AddEditFamily from "@/components/group-component/add-edit-family"
import { useVillageDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"

export default function AddFamilyPage() {
  const params = useParams()
  const router = useRouter()
  const villageId = params.villageId as string

  const { data: villageResponse } = useVillageDetails(villageId)
  const village = villageResponse?.data

  const handleSuccess = () => {
    router.push(`/admin/village/${villageId}`)
  }

  const handleCancel = () => {
    router.push(`/admin/village/${villageId}`)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Family</h1>
        {village && <p className="text-gray-600">Adding family to {village.name}</p>}
      </div>

      <AddEditFamily villageId={villageId} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}

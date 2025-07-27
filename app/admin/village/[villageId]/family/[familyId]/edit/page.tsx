"use client"

import { useParams, useRouter } from "next/navigation"
import AddEditFamily from "@/components/group-component/add-edit-family"
import { useGetFamilyDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"

export default function EditFamilyPage() {
  const params = useParams()
  const router = useRouter()
  const villageId = params.villageId as string
  const familyId = params.familyId as string

  const { data: familyResponse, isLoading } = useGetFamilyDetails(familyId)
  const family = familyResponse?.data

  const handleSuccess = () => {
    router.push(`/admin/village/${villageId}/family/${familyId}`)
  }

  const handleCancel = () => {
    router.push(`/admin/village/${villageId}/family/${familyId}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!family) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Family Not Found</h2>
          <p className="text-gray-600">The requested family could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Family</h1>
        <p className="text-gray-600">Editing {family.headName}'s family</p>
      </div>

      <AddEditFamily family={family} villageId={villageId} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}

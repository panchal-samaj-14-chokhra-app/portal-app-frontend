"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReusableTable from "@/components/ui/ReusableTable"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface Village {
  id: string
  name: string
  villageMemberName: string
  district: string
  state: string
}

interface VillageManagementProps {
  villages: Village[]
  isLoading: boolean
}

export default function VillageManagement({ villages, isLoading }: VillageManagementProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader>
          <CardTitle className="text-orange-800">गांव सूची</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-orange-600">गांव की जानकारी लोड हो रही है...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border-orange-200/50">
      <CardHeader>
        <CardTitle className="text-orange-800">गांव सूची</CardTitle>
      </CardHeader>
      <CardContent>
        <ReusableTable
          columns={[
            { label: "नाम", accessor: "name" },
            { label: "सदस्य", accessor: "villageMemberName" },
            { label: "जिला", accessor: "district" },
            { label: "राज्य", accessor: "state" },
          ]}
          data={villages || []}
          loading={false}
          actions={(row) => (
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/village/${row.id}`)}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              देखें
            </Button>
          )}
          caption="सभी गांवों की सूची"
        />
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReusableTable from "@/components/ui/ReusableTable"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Plus, Loader2 } from "lucide-react"

interface Chokhla {
  id: string
  name: string
  adhyaksh: string
  contactNumber: string
  state: string
  district: string
  villageName: string
}

interface ChokhlaManagementProps {
  chokhlas: Chokhla[]
  isLoading: boolean
  onAddChokhla: () => void
}

export default function ChokhlaManagement({ chokhlas, isLoading, onAddChokhla }: ChokhlaManagementProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-orange-800">चौकला सूची</CardTitle>
          <Button
            variant="outline"
            onClick={onAddChokhla}
            className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            चौकला जोड़ें
          </Button>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-orange-600">चौकला की जानकारी लोड हो रही है...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border-orange-200/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-orange-800">चौकला सूची</CardTitle>
        <Button
          variant="outline"
          onClick={onAddChokhla}
          className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
        >
          <Plus className="w-4 h-4 mr-2" />
          चौकला जोड़ें
        </Button>
      </CardHeader>
      <CardContent>
        <ReusableTable
          columns={[
            { label: "नाम", accessor: "name" },
            { label: "अध्यक्ष", accessor: "adhyaksh" },
            { label: "संपर्क नंबर", accessor: "contactNumber" },
            { label: "राज्य", accessor: "state" },
            { label: "जिला", accessor: "district" },
            { label: "गांव", accessor: "villageName" },
          ]}
          data={chokhlas || []}
          loading={false}
          actions={(row) => (
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/chokhla/${row.id}`)}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              देखें
            </Button>
          )}
          caption="सभी चौकला की सूची"
        />
      </CardContent>
    </Card>
  )
}

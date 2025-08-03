"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Users, Eye } from "lucide-react"
import type { Village } from "./types"

interface VillageManagementProps {
  villages: Village[]
  isLoading: boolean
  error?: string
}

export function VillageManagement({ villages, isLoading, error }: VillageManagementProps) {
  const router = useRouter()

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <div className="text-red-600 mb-4">❌ डेटा लोड करने में त्रुटि</div>
          <p className="text-gray-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8 shadow-lg border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          गांव प्रबंधन
        </CardTitle>
        <p className="text-sm text-orange-600">कुल गांव: {villages?.length || 0}</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : villages?.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">कोई गांव नहीं मिला</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] bg-white border border-orange-200 rounded-lg shadow">
              <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    गांव का नाम
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">सदस्य</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">जिला</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">राज्य</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {villages?.map((village, index) => (
                  <tr
                    key={village.id}
                    className={`hover:bg-orange-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-orange-25"}`}
                  >
                    <td className="px-4 py-3 text-orange-900 font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        {village.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-orange-800">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        {village.villageMemberName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-orange-800">{village.district}</td>
                    <td className="px-4 py-3 text-orange-800">{village.state}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/village/${village.id}`)}
                        className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        देखें
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

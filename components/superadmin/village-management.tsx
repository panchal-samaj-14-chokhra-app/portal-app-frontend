"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

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
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">गांव सूची</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-orange-600">लोड हो रहा है...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">गांव सूची</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <table className="w-full divide-y divide-orange-200">
              <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                <tr>
                  <th className="px-2 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    नाम
                  </th>
                  <th className="px-2 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    सदस्य
                  </th>
                  <th className="px-2 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    जिला
                  </th>
                  <th className="px-2 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    राज्य
                  </th>
                  <th className="px-2 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    कार्रवाई
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-100">
                {villages && villages.length > 0 ? (
                  villages.map((village, idx) => (
                    <tr
                      key={village.id}
                      className={idx % 2 === 0 ? "bg-orange-50 hover:bg-orange-100" : "bg-white hover:bg-orange-50"}
                    >
                      <td className="px-2 lg:px-6 py-4 whitespace-nowrap font-medium text-orange-900 text-sm">
                        {village.name}
                      </td>
                      <td className="px-2 lg:px-6 py-4 whitespace-nowrap text-orange-800 text-sm">
                        {village.villageMemberName}
                      </td>
                      <td className="px-2 lg:px-6 py-4 whitespace-nowrap text-orange-800 text-sm">
                        {village.district}
                      </td>
                      <td className="px-2 lg:px-6 py-4 whitespace-nowrap text-orange-800 text-sm">{village.state}</td>
                      <td className="px-2 lg:px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-400 text-orange-600 hover:bg-orange-100 text-xs bg-transparent"
                          onClick={() => router.push(`/admin/village/${village.id}`)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          देखें
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      कोई गांव नहीं मिला
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

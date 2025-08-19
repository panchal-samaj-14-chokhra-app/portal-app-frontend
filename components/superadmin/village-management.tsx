"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { Home } from "lucide-react" // Import Home component

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
      <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800">गांव सूची</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-orange-600">लोड हो रहा है...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800 flex items-center gap-2">
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          गांव सूची
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile Card Layout */}
        <div className="block md:hidden">
          {villages && villages.length > 0 ? (
            <div className="divide-y divide-orange-100">
              {villages.map((village, idx) => (
                <div key={village.id} className="p-4 hover:bg-orange-50 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                          #{idx + 1}
                        </span>
                        <h3 className="font-semibold text-orange-900 text-sm">{village.name}</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-400 text-orange-600 hover:bg-orange-100 text-xs bg-transparent"
                        onClick={() => router.push(`/admin/village/${village.id}`)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        देखें
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">सदस्य:</span>
                        <span className="text-orange-800">{village.villageMemberName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">जिला:</span>
                        <span className="text-orange-800">{village.district}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">राज्य:</span>
                        <span className="text-orange-800">{village.state}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>कोई गांव नहीं मिला</p>
            </div>
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  क्रम संख्या
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  नाम
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  सदस्य
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  जिला
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  राज्य
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
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
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap font-medium text-orange-900 text-sm">
                      {idx + 1}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap font-medium text-orange-900 text-sm">
                      {village.name}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-orange-800 text-sm">
                      {village.villageMemberName}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-orange-800 text-sm">{village.district}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-orange-800 text-sm">{village.state}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    कोई गांव नहीं मिला
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddVillageForm } from "./add-village-form"
import type { UseFormReturn } from "react-hook-form"
import { Loader2, Eye, MapPin } from "lucide-react"

interface VillageManagementProps {
  villages: any[]
  isLoading: boolean
  userType: string | undefined
  chokhlaId: string
  onVillageView: (villageId: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<any>
  onSubmit: (data: any) => void
  isCreating: boolean
}

export function VillageManagement({
  villages,
  isLoading,
  userType,
  chokhlaId,
  onVillageView,
  open,
  onOpenChange,
  form,
  onSubmit,
  isCreating,
}: VillageManagementProps) {
  return (
    <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
            गांव सूची
          </CardTitle>
          <AddVillageForm
            open={open}
            onOpenChange={onOpenChange}
            form={form}
            onSubmit={onSubmit}
            isCreating={isCreating}
            userType={userType}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="w-full divide-y divide-orange-200">
              <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    क्रम संख्या
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    गांव का नाम
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    सदस्य
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    मोबाइल नंबर
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    आयु
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    तहसील
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    जिला
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    राज्य
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    कार्रवाई
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <span className="text-orange-600 font-medium">लोड हो रहा है...</span>
                      </div>
                    </td>
                  </tr>
                ) : villages && villages.length > 0 ? (
                  villages.map((village: any, idx: number) => (
                    <tr
                      key={village.id}
                      className={`transition-colors duration-200 ${idx % 2 === 0 ? "bg-orange-50 hover:bg-orange-100" : "bg-white hover:bg-orange-50"
                        }`}
                    >
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <div className="font-semibold text-orange-900 text-sm">{idx + 1}</div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <div className="font-semibold text-orange-900 text-sm">{village.name}</div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-orange-800 text-sm">
                        {village.villageMemberName || "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-orange-800 text-sm">
                        {village.mobileNumber || "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-orange-800 text-sm">
                        {village.age || "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-orange-800 text-sm">
                        {village.tehsil || "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-orange-800 text-sm">
                        {village.district || "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-orange-800 text-sm">
                        {village.state || "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-300 text-orange-600 hover:bg-orange-100 hover:text-orange-800 hover:border-orange-400 transition-all duration-200 bg-transparent text-xs sm:text-sm"
                          onClick={() => onVillageView(village.id)}
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          देखें
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
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

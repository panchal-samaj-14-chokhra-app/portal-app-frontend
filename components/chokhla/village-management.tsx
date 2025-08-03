"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddVillageForm } from "./add-village-form"
import { Eye, MapPin, Phone, User } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

interface VillageManagementProps {
  villages: any[]
  isLoading: boolean
  userType: string | undefined
  chokhlaId: string
  onVillageView: (villageId: string) => void
  // Form props
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
    <Card className="shadow-lg border-orange-100">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-orange-800 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
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
          <div className="min-w-full">
            <table className="w-full divide-y divide-orange-200">
              <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      गांव का नाम
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      सदस्य
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      मोबाइल नंबर
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">आयु</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">तहसील</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">जिला</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">राज्य</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="text-orange-600 font-medium">लोड हो रहा है...</span>
                      </div>
                    </td>
                  </tr>
                ) : villages?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <MapPin className="w-12 h-12 text-gray-400" />
                        <span className="text-gray-600 font-medium">कोई गांव नहीं मिला</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (villages || []).map((village: any, idx: number) => (
                    <tr
                      key={village.id}
                      className={`transition-colors hover:bg-orange-50 ${idx % 2 === 0 ? "bg-white" : "bg-orange-25"}`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-orange-900">{village.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-orange-800">
                        {village.villageMemberName || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-orange-800">{village.mobileNumber || "-"}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-orange-800">{village.age || "-"}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-orange-800">{village.tehsil || "-"}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-orange-800">{village.district || "-"}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-orange-800">{village.state || "-"}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-300 text-orange-600 hover:bg-orange-100 hover:text-orange-800 hover:border-orange-400 transition-all duration-200 bg-transparent"
                          onClick={() => onVillageView(village.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          देखें
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

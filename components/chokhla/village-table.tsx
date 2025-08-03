"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Village } from "./types"
import { Eye, MapPin, Phone, User } from "lucide-react"

interface VillageTableProps {
  villages: Village[]
  isLoading: boolean
  onViewVillage: (villageId: string) => void
}

export function VillageTable({ villages, isLoading, onViewVillage }: VillageTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-orange-600 font-medium">लोड हो रहा है...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!villages || villages.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">कोई गांव नहीं मिला</p>
            <p className="text-sm">नया गांव जोड़ने के लिए ऊपर दिए गए बटन का उपयोग करें</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold text-white">गांव की जानकारी</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-white">संपर्क विवरण</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-white">स्थान</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-white">सुविधाएं</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-white">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {villages.map((village, idx) => (
                <tr
                  key={village.id}
                  className={`${
                    idx % 2 === 0 ? "bg-orange-50 hover:bg-orange-100" : "bg-white hover:bg-orange-50"
                  } transition-colors`}
                >
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-orange-900">{village.name}</div>
                      <div className="flex items-center text-sm text-orange-700">
                        <User className="w-3 h-3 mr-1" />
                        {village.villageMemberName}
                      </div>
                      <div className="text-xs text-gray-600">आयु: {village.age}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-orange-800">
                        <Phone className="w-3 h-3 mr-1" />
                        {village.mobileNumber}
                      </div>
                      {village.email && <div className="text-xs text-gray-600">{village.email}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1 text-sm">
                      <div className="text-orange-800">{village.tehsil}</div>
                      <div className="text-orange-700">{village.district}</div>
                      <div className="text-gray-600">{village.state}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {village.isVillageHaveSchool && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          स्कूल
                        </Badge>
                      )}
                      {village.isVillageHavePrimaryHealthCare && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          स्वास्थ्य केंद्र
                        </Badge>
                      )}
                      {village.isVillageHaveCommunityHall && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                          कम्युनिटी हॉल
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-400 text-orange-600 hover:bg-orange-100 hover:text-orange-800 bg-transparent"
                      onClick={() => onViewVillage(village.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      देखें
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, Plus, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Chokhla {
  id: string
  name: string
  description?: string
  createdAt: string
  _count?: {
    villages: number
  }
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
      <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800">चोखरा प्रबंधन</CardTitle>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            चोखरा प्रबंधन
          </CardTitle>
          <Button
            variant="outline"
            onClick={onAddChokhla}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:from-orange-600 hover:to-orange-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            चोखरा जोड़ें
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile Card Layout */}
        <div className="block md:hidden">
          {chokhlas && chokhlas.length > 0 ? (
            <div className="divide-y divide-orange-100">
              {chokhlas.map((chokhla, idx) => (
                <div key={chokhla.id} className="p-4 hover:bg-orange-50 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                          #{idx + 1}
                        </span>
                        <h3 className="font-semibold text-orange-900 text-sm">{chokhla.name}</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-400 text-orange-600 hover:bg-orange-100 text-xs bg-transparent"
                        onClick={() => router.push(`/admin/chokhla/${chokhla.id}`)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        देखें
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">विवरण:</span>
                        <span className="text-orange-800">{chokhla.description || "कोई विवरण नहीं"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">गांव:</span>
                        <span className="text-orange-800">{chokhla._count?.villages || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">निर्माण तिथि:</span>
                        <span className="text-orange-800">
                          {new Date(chokhla.createdAt).toLocaleDateString("hi-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>कोई चोखरा नहीं मिला</p>
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
                  विवरण
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  गांव
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  निर्माण तिथि
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  कार्रवाई
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-orange-100">
              {chokhlas && chokhlas.length > 0 ? (
                chokhlas.map((chokhla, idx) => (
                  <tr
                    key={chokhla.id}
                    className={idx % 2 === 0 ? "bg-orange-50 hover:bg-orange-100" : "bg-white hover:bg-orange-50"}
                  >
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap font-medium text-orange-900 text-sm">
                      {idx + 1}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap font-medium text-orange-900 text-sm">
                      {chokhla.name}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-orange-800 text-sm">
                      <div className="max-w-xs truncate">{chokhla.description || "कोई विवरण नहीं"}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-orange-800 text-sm">
                      {chokhla._count?.villages || 0}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-orange-800 text-sm">
                      {new Date(chokhla.createdAt).toLocaleDateString("hi-IN")}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-400 text-orange-600 hover:bg-orange-100 text-xs bg-transparent"
                        onClick={() => router.push(`/admin/chokhla/${chokhla.id}`)}
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
                    कोई चोखरा नहीं मिला
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

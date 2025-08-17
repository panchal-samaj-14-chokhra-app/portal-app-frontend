"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

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
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
          <CardTitle className="text-lg lg:text-xl">चोखरा सूची</CardTitle>
          <Button
            variant="outline"
            onClick={onAddChokhla}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:from-orange-600 hover:to-orange-700 w-full lg:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            चोखरा जोड़ें
          </Button>
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
      <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
        <CardTitle className="text-lg lg:text-xl">चोखरा सूची</CardTitle>
        <Button
          variant="outline"
          onClick={onAddChokhla}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:from-orange-600 hover:to-orange-700 w-full lg:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          चोखरा जोड़ें
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="w-full divide-y divide-orange-200">
              <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                <tr>
                  <th className="px-2 lg:px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    नाम
                  </th>
                  <th className="px-2 lg:px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    अध्यक्ष
                  </th>
                  <th className="px-2 lg:px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    संपर्क
                  </th>
                  <th className="px-2 lg:px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    राज्य
                  </th>
                  <th className="px-2 lg:px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    जिला
                  </th>
                  <th className="px-2 lg:px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    गांव
                  </th>
                  <th className="px-2 lg:px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
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
                      <td className="px-2 lg:px-4 py-4 whitespace-nowrap font-medium text-orange-900 text-sm">
                        {chokhla.name}
                      </td>
                      <td className="px-2 lg:px-4 py-4 whitespace-nowrap text-orange-800 text-sm">
                        {chokhla.adhyaksh}
                      </td>
                      <td className="px-2 lg:px-4 py-4 whitespace-nowrap text-orange-800 text-sm">
                        {chokhla.contactNumber}
                      </td>
                      <td className="px-2 lg:px-4 py-4 whitespace-nowrap text-orange-800 text-sm">{chokhla.state}</td>
                      <td className="px-2 lg:px-4 py-4 whitespace-nowrap text-orange-800 text-sm">
                        {chokhla.district}
                      </td>
                      <td className="px-2 lg:px-4 py-4 whitespace-nowrap text-orange-800 text-sm">
                        {chokhla.villageName}
                      </td>
                      <td className="px-2 lg:px-4 py-4 whitespace-nowrap">
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
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      कोई चोखरा नहीं मिला
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

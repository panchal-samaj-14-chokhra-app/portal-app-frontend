"use client"
import { Plus, Eye, MapPin, Users, School, Heart, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddVillageForm } from "./add-village-form"

interface Village {
  id: string
  name: string
  villageMemberName: string
  mobileNumber: string
  email: string
  tehsil: string
  district: string
  state: string
  isVillageHaveSchool: boolean
  isVillageHavePrimaryHealthCare: boolean
  isVillageHaveCommunityHall: boolean
  _count?: {
    families: number
  }
}

interface VillageManagementProps {
  villages: Village[]
  isLoading: boolean
  userType: string
  chokhlaId: string
  onVillageView: (villageId: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  form: any
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
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">गांव प्रबंधन</h2>
            <p className="text-sm text-gray-600 mt-1">अपने चोखरा के सभी गांवों को प्रबंधित करें</p>
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">गांव प्रबंधन</h2>
          <p className="text-sm text-gray-600 mt-1">अपने चोखरा के सभी गांवों को प्रबंधित करें</p>
        </div>

        {userType === "SUPER_ADMIN" && (
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                नया गांव जोड़ें
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-orange-700">नया गांव जोड़ें</DialogTitle>
              </DialogHeader>
              <AddVillageForm form={form} onSubmit={onSubmit} isCreating={isCreating} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">कुल गांव</p>
                <p className="text-2xl font-bold text-blue-700">{villages?.length || 0}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">कुल परिवार</p>
                <p className="text-2xl font-bold text-green-700">
                  {villages?.reduce((acc, village) => acc + (village._count?.families || 0), 0) || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">स्कूल वाले गांव</p>
                <p className="text-2xl font-bold text-purple-700">
                  {villages?.filter((v) => v.isVillageHaveSchool).length || 0}
                </p>
              </div>
              <School className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">स्वास्थ्य केंद्र वाले गांव</p>
                <p className="text-2xl font-bold text-red-700">
                  {villages?.filter((v) => v.isVillageHavePrimaryHealthCare).length || 0}
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Villages List */}
      {!villages || villages.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">कोई गांव नहीं मिला</h3>
            <p className="text-gray-500 text-center mb-4">
              अभी तक कोई गांव नहीं जोड़ा गया है। नया गांव जोड़ने के लिए ऊपर दिए गए बटन पर क्लिक करें।
            </p>
            {userType === "SUPER_ADMIN" && (
              <Button
                onClick={() => onOpenChange(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                पहला गांव जोड़ें
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {villages.map((village) => (
              <Card key={village.id} className="hover:shadow-lg transition-shadow duration-200 border-orange-200/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">{village.name}</CardTitle>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {village.villageMemberName}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {village._count?.families || 0} परिवार
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium w-16">फोन:</span>
                        <span>{village.mobileNumber}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium w-16">ईमेल:</span>
                        <span className="truncate">{village.email}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                      <span>
                        {village.tehsil}, {village.district}, {village.state}
                      </span>
                    </div>

                    {/* Facilities */}
                    <div className="flex flex-wrap gap-2">
                      {village.isVillageHaveSchool && (
                        <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                          <School className="w-3 h-3 mr-1" />
                          स्कूल
                        </Badge>
                      )}
                      {village.isVillageHavePrimaryHealthCare && (
                        <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                          <Heart className="w-3 h-3 mr-1" />
                          स्वास्थ्य केंद्र
                        </Badge>
                      )}
                      {village.isVillageHaveCommunityHall && (
                        <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                          <Building className="w-3 h-3 mr-1" />
                          सामुदायिक हॉल
                        </Badge>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button
                        onClick={() => onVillageView(village.id)}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        विवरण देखें
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Card className="border-orange-200/50 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-400 to-orange-500">
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        गांव का नाम
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        प्रतिनिधि
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        संपर्क
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        स्थान
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        परिवार
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        सुविधाएं
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        कार्रवाई
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {villages.map((village, index) => (
                      <tr
                        key={village.id}
                        className={`${
                          index % 2 === 0 ? "bg-orange-50" : "bg-white"
                        } hover:bg-orange-100 transition-colors duration-150`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{village.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{village.villageMemberName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{village.mobileNumber}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[150px]">{village.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{village.tehsil}</div>
                          <div className="text-sm text-gray-500">
                            {village.district}, {village.state}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            {village._count?.families || 0}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {village.isVillageHaveSchool && (
                              <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                                <School className="w-3 h-3 mr-1" />
                                स्कूल
                              </Badge>
                            )}
                            {village.isVillageHavePrimaryHealthCare && (
                              <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                                <Heart className="w-3 h-3 mr-1" />
                                स्वास्थ्य
                              </Badge>
                            )}
                            {village.isVillageHaveCommunityHall && (
                              <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                                <Building className="w-3 h-3 mr-1" />
                                हॉल
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            onClick={() => onVillageView(village.id)}
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
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
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, MapPin, Users, School, Heart, Building, Loader2, Phone, Mail } from "lucide-react"
import { AddVillageForm } from "./add-village-form"
import type { UseFormReturn } from "react-hook-form"

interface Village {
  id: string
  name: string
  villageMemberName: string
  mobileNumber: string
  email: string
  tehsil: string
  district: string
  state: string
  age?: number
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
  if (isLoading) {
    return (
      <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 sm:p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="text-orange-600 font-medium">लोड हो रहा है...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">कुल गांव</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-700">{villages?.length || 0}</p>
                <p className="text-xs text-blue-500 mt-1">पंजीकृत गांव</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">कुल परिवार</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-700">
                  {villages?.reduce((acc, village) => acc + (village._count?.families || 0), 0) || 0}
                </p>
                <p className="text-xs text-green-500 mt-1">पंजीकृत परिवार</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">स्कूल वाले गांव</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-700">
                  {villages?.filter((v) => v.isVillageHaveSchool).length || 0}
                </p>
                <p className="text-xs text-purple-500 mt-1">शिक्षा सुविधा</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <School className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">स्वास्थ्य केंद्र वाले गांव</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-700">
                  {villages?.filter((v) => v.isVillageHavePrimaryHealthCare).length || 0}
                </p>
                <p className="text-xs text-red-500 mt-1">स्वास्थ्य सुविधा</p>
              </div>
              <div className="bg-red-500 p-3 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Village Management Card */}
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
          {!villages || villages.length === 0 ? (
            <div className="text-center py-12 px-6">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई गांव नहीं मिला</h3>
              <p className="text-gray-600 mb-4">अभी तक कोई गांव नहीं जोड़ा गया है।</p>
              {(userType === "CHOKHLA_MEMBER" || userType === "SUPER_ADMIN") && (
                <Button
                  onClick={() => onOpenChange(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  पहला गांव जोड़ें
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden">
                <div className="space-y-4 p-4">
                  {villages.map((village, index) => (
                    <Card key={village.id} className="border border-orange-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200">#{index + 1}</Badge>
                            <h3 className="font-semibold text-gray-900 text-sm">{village.name}</h3>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {village._count?.families || 0} परिवार
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">प्रतिनिधि:</span>
                            <span className="font-medium">{village.villageMemberName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{village.mobileNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 truncate">{village.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <span className="text-gray-600 text-xs">
                              {village.tehsil}, {village.district}, {village.state}
                            </span>
                          </div>
                          {village.age && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">आयु:</span>
                              <span className="font-medium">{village.age} वर्ष</span>
                            </div>
                          )}
                        </div>

                        {/* Facilities */}
                        <div className="flex flex-wrap gap-2 mt-3">
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

                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <Button
                            onClick={() => onVillageView(village.id)}
                            size="sm"
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            विवरण देखें
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <div className="min-w-[1200px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-400 hover:to-orange-500">
                        <TableHead className="text-white font-bold text-sm uppercase tracking-wider">
                          क्रम संख्या
                        </TableHead>
                        <TableHead className="text-white font-bold text-sm uppercase tracking-wider">
                          गांव का नाम
                        </TableHead>
                        <TableHead className="text-white font-bold text-sm uppercase tracking-wider">
                          प्रतिनिधि
                        </TableHead>
                        <TableHead className="text-white font-bold text-sm uppercase tracking-wider">
                          संपर्क जानकारी
                        </TableHead>
                        <TableHead className="text-white font-bold text-sm uppercase tracking-wider">आयु</TableHead>
                        <TableHead className="text-white font-bold text-sm uppercase tracking-wider">स्थान</TableHead>
                        <TableHead className="text-white font-bold text-sm uppercase tracking-wider">परिवार</TableHead>
                        <TableHead className="text-white font-bold text-sm uppercase tracking-wider">सुविधाएं</TableHead>
                        <TableHead className="text-white font-bold text-sm uppercase tracking-wider">कार्रवाई</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-orange-100">
                      {villages.map((village, index) => (
                        <TableRow
                          key={village.id}
                          className={`transition-colors duration-200 ${
                            index % 2 === 0 ? "bg-orange-50 hover:bg-orange-100" : "bg-white hover:bg-orange-50"
                          }`}
                        >
                          <TableCell className="px-4 py-4 whitespace-nowrap">
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200">{index + 1}</Badge>
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className="font-semibold text-orange-900 text-sm">{village.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap">
                            <div className="text-orange-800 text-sm font-medium">{village.villageMemberName}</div>
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap">
                            <div className="text-orange-800 text-sm">
                              <div className="flex items-center gap-1 mb-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                {village.mobileNumber}
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span className="truncate max-w-[150px]">{village.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-orange-800 text-sm">
                            {village.age ? `${village.age} वर्ष` : "-"}
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap">
                            <div className="text-orange-800 text-sm">
                              <div>{village.tehsil}</div>
                              <div className="text-gray-500 text-xs">
                                {village.district}, {village.state}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-center">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {village._count?.families || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap">
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
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-orange-300 text-orange-600 hover:bg-orange-100 hover:text-orange-800 hover:border-orange-400 transition-all duration-200 bg-transparent text-xs sm:text-sm"
                              onClick={() => onVillageView(village.id)}
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              देखें
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

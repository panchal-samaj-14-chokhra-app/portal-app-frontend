"use client"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, MapPin, Users, Building2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Village {
  id: string
  name: string
  villageMemberName: string
  mobileNumber: string
  email: string
  tehsil: string
  district: string
  state: string
  families: any[]
  chakolaName: string
  familyCount: number
  memberCount: number
  createdDate: string
}

interface VillageManagementProps {
  villages: Village[]
  isLoading: boolean
}

const VillageManagement: React.FC<VillageManagementProps> = ({ villages, isLoading }) => {
  const router = useRouter()

  const handleViewVillage = (villageId: string) => {
    router.push(`/admin/village/${villageId}`)
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Building2 className="w-5 h-5 mr-2" />
              गांव प्रबंधन
            </CardTitle>
            <CardDescription>सभी गांवों की जानकारी और प्रबंधन</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                <p className="text-gray-600">गांवों की जानकारी लोड हो रही है...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">कुल गांव</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{villages?.length || 0}</p>
              </div>
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">कुल परिवार</p>
                <p className="text-xl sm:text-2xl font-bold text-green-700">
                  {villages?.reduce((sum, village) => sum + (village.familyCount || 0), 0) || 0}
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">कुल सदस्य</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-700">
                  {villages?.reduce((sum, village) => sum + (village.memberCount || 0), 0) || 0}
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">सक्रिय गांव</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-700">{villages?.length || 0}</p>
              </div>
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Villages Table/Cards */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700">
            <Building2 className="w-5 h-5 mr-2" />
            गांवों की सूची
          </CardTitle>
          <CardDescription>सभी पंजीकृत गांवों की विस्तृत जानकारी</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Mobile Card Layout */}
          <div className="block md:hidden">
            {villages?.length > 0 ? (
              <div className="space-y-4 p-4">
                {villages.map((village, index) => (
                  <Card key={village.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200">#{index + 1}</Badge>
                          <h3 className="font-semibold text-gray-900 text-sm">{village.name}</h3>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewVillage(village.id)}
                          className="bg-transparent border-orange-200 text-orange-600 hover:bg-orange-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">गांव सदस्य:</span>
                          <span className="font-medium">{village.villageMemberName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">मोबाइल:</span>
                          <span className="font-medium">{village.mobileNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">चोखरा:</span>
                          <span className="font-medium">{village.chakolaName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">स्थान:</span>
                          <span className="font-medium text-xs">
                            {village.tehsil}, {village.district}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{village.familyCount || 0}</div>
                            <div className="text-xs text-gray-500">परिवार</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{village.memberCount || 0}</div>
                            <div className="text-xs text-gray-500">सदस्य</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई गांव नहीं मिला</h3>
                <p className="text-gray-600">अभी तक कोई गांव पंजीकृत नहीं है</p>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">क्र.सं.</TableHead>
                  <TableHead>गांव का नाम</TableHead>
                  <TableHead>गांव सदस्य</TableHead>
                  <TableHead>संपर्क</TableHead>
                  <TableHead>चोखरा</TableHead>
                  <TableHead>स्थान</TableHead>
                  <TableHead className="text-center">परिवार</TableHead>
                  <TableHead className="text-center">सदस्य</TableHead>
                  <TableHead className="text-center">कार्य</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {villages?.length > 0 ? (
                  villages.map((village, index) => (
                    <TableRow key={village.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">{index + 1}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-orange-600" />
                          {village.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{village.villageMemberName}</div>
                          <div className="text-sm text-gray-500">{village.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{village.mobileNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{village.chakolaName}</div>

                        </div>
                      </TableCell>
                      <TableCell>{village.mobileNumber}</TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <div>{village.tehsil}</div>
                          <div className="text-gray-500">
                            {village.district}, {village.state}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {village.families.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {village.memberCount || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewVillage(village.id)}
                          className="bg-transparent border-orange-200 text-orange-600 hover:bg-orange-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          देखें
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई गांव नहीं मिला</h3>
                      <p className="text-gray-600">अभी तक कोई गांव पंजीकृत नहीं है</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VillageManagement

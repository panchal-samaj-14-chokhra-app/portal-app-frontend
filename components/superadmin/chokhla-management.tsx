"use client"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Plus, Building2, Users, MapPin, Loader2, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

interface Chokhla {
  id: string
  name: string
  adhyaksh: string
  contactNumber: string
  state: string
  district: string
  villageName: string
  villageCount: number
  familyCount: number
  memberCount: number
  createdDate: string
}

interface ChokhlaManagementProps {
  chokhlas: Chokhla[]
  isLoading: boolean
  onAddChokhla: () => void
}

const ChokhlaManagement: React.FC<ChokhlaManagementProps> = ({ chokhlas, isLoading, onAddChokhla }) => {
  const router = useRouter()

  const handleViewChokhla = (chokhlaId: string) => {
    router.push(`/admin/chokhla/${chokhlaId}`)
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Building2 className="w-5 h-5 mr-2" />
              चोखरा प्रबंधन
            </CardTitle>
            <CardDescription>सभी चोखरों की जानकारी और प्रबंधन</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                <p className="text-gray-600">चोखरों की जानकारी लोड हो रही है...</p>
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
                <p className="text-blue-600 text-sm font-medium">कुल चोखरा</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{chokhlas?.length || 0}</p>
              </div>
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">कुल गांव</p>
                <p className="text-xl sm:text-2xl font-bold text-green-700">
                  {chokhlas?.reduce((sum, chokhla) => sum + (chokhla.villageCount || 0), 0) || 0}
                </p>
              </div>
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">कुल परिवार</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-700">
                  {chokhlas?.reduce((sum, chokhla) => sum + (chokhla.familyCount || 0), 0) || 0}
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
                <p className="text-orange-600 text-sm font-medium">नया चोखरा</p>
                <Button onClick={onAddChokhla} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white mt-2">
                  <Plus className="w-4 h-4 mr-1" />
                  जोड़ें
                </Button>
              </div>
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chokhlas Table/Cards */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center text-orange-700">
                <Building2 className="w-5 h-5 mr-2" />
                चोखरों की सूची
              </CardTitle>
              <CardDescription>सभी पंजीकृत चोखरों की विस्तृत जानकारी</CardDescription>
            </div>
            <Button onClick={onAddChokhla} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              नया चोखरा जोड़ें
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Mobile Card Layout */}
          <div className="block md:hidden">
            {chokhlas?.length > 0 ? (
              <div className="space-y-4 p-4">
                {chokhlas.map((chokhla, index) => (
                  <Card key={chokhla.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200">#{index + 1}</Badge>
                          <h3 className="font-semibold text-gray-900 text-sm">{chokhla.name}</h3>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewChokhla(chokhla.id)}
                          className="bg-transparent border-orange-200 text-orange-600 hover:bg-orange-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">अध्यक्ष:</span>
                          <span className="font-medium">{chokhla.adhyaksh}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{chokhla.contactNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">स्थान:</span>
                          <span className="font-medium text-xs">
                            {chokhla.district}, {chokhla.state}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{chokhla.villageCount || 0}</div>
                            <div className="text-xs text-gray-500">गांव</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{chokhla.familyCount || 0}</div>
                            <div className="text-xs text-gray-500">परिवार</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{chokhla.memberCount || 0}</div>
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
                <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई चोखरा नहीं मिला</h3>
                <p className="text-gray-600 mb-4">अभी तक कोई चोखरा पंजीकृत नहीं है</p>
                <Button onClick={onAddChokhla} className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  पहला चोखरा जोड़ें
                </Button>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">क्र.सं.</TableHead>
                  <TableHead>चोखरा नाम</TableHead>
                  <TableHead>अध्यक्ष</TableHead>
                  <TableHead>संपर्क</TableHead>
                  <TableHead>स्थान</TableHead>
                  <TableHead className="text-center">गांव</TableHead>
                  <TableHead className="text-center">परिवार</TableHead>
                  <TableHead className="text-center">सदस्य</TableHead>
                  <TableHead className="text-center">कार्य</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chokhlas?.length > 0 ? (
                  chokhlas.map((chokhla, index) => (
                    <TableRow key={chokhla.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">{index + 1}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-orange-600" />
                          {chokhla.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{chokhla.adhyaksh}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {chokhla.contactNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{chokhla.district}</div>
                          <div className="text-gray-500">{chokhla.state}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {chokhla.villageCount || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {chokhla.familyCount || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {chokhla.memberCount || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewChokhla(chokhla.id)}
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
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई चोखरा नहीं मिला</h3>
                      <p className="text-gray-600 mb-4">अभी तक कोई चोखरा पंजीकृत नहीं है</p>
                      <Button onClick={onAddChokhla} className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        पहला चोखरा जोड़ें
                      </Button>
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

export default ChokhlaManagement

"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Users, Home, Plus, Search, LogOut, Eye, Edit, Trash2, UserCheck, MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Input } from "@/components/ui/input/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { useDeleteFamilyUsingID, useVillageDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"


export default function VillageDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.villageId
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { data: villageData, isLoading, error } = useVillageDetails(villageId);
  const { mutate: deleteFamily, } = useDeleteFamilyUsingID();
  const families = useMemo(() => {
    return villageData?.families
  }, [villageData?.families])

  const chokhlaID = useMemo(() => {
    return villageData?.choklaId
  }, [villageData])
  const userType = useMemo(() => session?.user?.role, [session?.user?.role])


  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")
  }, [session, status, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  const handleAddFamily = () => {
    if (userType !== "VILLAGE_MEMBER") {
      router.back();
      return;
    }
    router.push(`/admin/village/${villageId}/add-family?chakolaId=${chokhlaID}`)
  }

  const filteredFamilies = families?.filter((family: { mukhiyaName: string; familyId: string; status: string }) => {
    const matchesSearch =
      family.mukhiyaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.familyId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || family.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-700 border-green-200">सत्यापित</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">लंबित</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">मसौदा</Badge>
      default:
        return <Badge variant="outline">अज्ञात</Badge>
    }
  }

  const handleDeleteFamily = async (familyId: string) => {
    return await deleteFamily(familyId);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={50}
                height={50}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">{villageData?.name}</h1>
                <p className="text-orange-100 text-sm">स्वागत है, {session.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {userType !== "VILLAGE_MEMBER" ? (
                <Button
                  onClick={handleAddFamily}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  वापस जॉए
                </Button>
              ) : (
                <Button
                  onClick={handleAddFamily}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  नया परिवार
                </Button>
              )}

              <Button
                onClick={handleSignOut}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                लॉगआउट
              </Button>
            </div>
          </div>
        </div>
      </header>


      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">कुल परिवार</p>
                  <p className="text-2xl font-bold text-blue-700">{villageData?.families?.length}</p>
                </div>
                <Home className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">कुल सदस्य</p>
                  <p className="text-2xl font-bold text-green-700">{villageData?.genderCount.MALE + villageData?.genderCount.FEMALE + villageData?.genderCount.OTHER}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">पुरुष</p>
                  <p className="text-2xl font-bold text-purple-700">{villageData?.genderCount.MALE || 0}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-600 text-sm font-medium">महिला</p>
                  <p className="text-2xl font-bold text-pink-700">{villageData?.genderCount.FEMALE || 0}</p>
                </div>
                <Users className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-600 text-sm font-medium">अन्य</p>
                  <p className="text-2xl font-bold text-pink-700">{villageData?.genderCount.OTHER || 0}</p>
                </div>
                <Users className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>परिवार खोजें और फ़िल्टर करें</CardTitle>
            <CardDescription>परिवारों को खोजें और स्थिति के अनुसार फ़िल्टर करें</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="मुखिया का नाम या परिवार ID खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                >
                  सभी
                </Button>
                <Button
                  variant={statusFilter === "verified" ? "default" : "outline"}
                  onClick={() => setStatusFilter("verified")}
                  size="sm"
                >
                  सत्यापित
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  size="sm"
                >
                  लंबित
                </Button>
                <Button
                  variant={statusFilter === "draft" ? "default" : "outline"}
                  onClick={() => setStatusFilter("draft")}
                  size="sm"
                >
                  मसौदा
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Families Table */}
        <Card>
          <CardHeader>
            <CardTitle>परिवारों की सूची</CardTitle>
            <CardDescription>गांव के सभी पंजीकृत परिवारों की जानकारी</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>परिवार ID</TableHead>
                    <TableHead>मुखिया का नाम</TableHead>
                    <TableHead>कुल सदस्य</TableHead>
                    <TableHead>पुरुष/महिला</TableHead>
                    <TableHead>पता</TableHead>
                    <TableHead>संपर्क</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead>कार्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFamilies?.map((family) => (
                    <TableRow key={family.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{family.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-orange-600" />
                          {family.mukhiyaName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {family.genderCount.MALE + family.genderCount.FEMALE + family.genderCount.OTHER}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                            पु: {family.genderCount.MALE}
                          </Badge>
                          <Badge variant="outline" className="bg-pink-50 text-pink-700 text-xs">
                            म: {family.genderCount.FEMALE}
                          </Badge>
                          <Badge variant="outline" className="bg-pink-50 text-pink-700 text-xs">
                            अ: {family.genderCount.OTHER}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={family.currentAddress}>
                        {family.currentAddress}
                      </TableCell>
                      <TableCell>{family.contactNumber || "N/A"}</TableCell>
                      <TableCell>{family.economicStatus}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/village/${villageId}/family/${family.id}?choklaId=${villageData.choklaId}`)}
                            className="bg-transparent"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/village/${villageId}/family/${family.id}/edit?choklaId=${villageData.choklaId}`)}
                            className="bg-transparent"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFamily(family.id)}
                            className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredFamilies?.length === 0 && (
              <div className="text-center py-8">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई परिवार नहीं मिला</h3>
                <p className="text-gray-600 mb-4">खोज मापदंड के अनुसार कोई परिवार नहीं मिला</p>
                <Button
                  onClick={handleAddFamily}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  पहला परिवार जोड़ें
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {userType !== "VILLAGE_MEMBER" && (<Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <Plus className="w-5 h-5 mr-2" />
                नया परिवार जोड़ें
              </CardTitle>
              <CardDescription>नए परिवार का पंजीकरण करें</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={handleAddFamily}
              >
                परिवार पंजीकरण शुरू करें
              </Button>
            </CardContent>
          </Card>)}

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <MapPin className="w-5 h-5 mr-2" />
                गांव की जानकारी
              </CardTitle>
              <CardDescription>गांव के बारे में विस्तृत जानकारी</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>गांव ID:</strong> {villageData?.id}</p>
                <p><strong>नाम:</strong> {villageData?.name}</p>
                <p><strong>चौकला:</strong> {villageData?.chakolaName}</p>
                <p><strong>गांव सदस्य का नाम:</strong> {villageData?.villageMemberName}</p>
                <p><strong>मोबाइल नंबर:</strong> {villageData?.mobileNumber}</p>
                <p><strong>आयु:</strong> {villageData?.age}</p>
                <p><strong>ईमेल:</strong> {villageData?.email}</p>
                <p><strong>तहसील:</strong> {villageData?.tehsil}</p>
                <p><strong>जिला:</strong> {villageData?.district}</p>
                <p><strong>राज्य:</strong> {villageData?.state}</p>
                <p><strong>क्या गांव में स्कूल है?:</strong> {villageData?.isVillageHaveSchool ? 'हाँ' : 'नहीं'}</p>
                <p><strong>क्या प्राथमिक स्वास्थ्य केंद्र है?:</strong> {villageData?.isVillageHavePrimaryHealthCare ? 'हाँ' : 'नहीं'}</p>
                <p><strong>क्या कम्युनिटी हॉल है?:</strong> {villageData?.isVillageHaveCommunityHall ? 'हाँ' : 'नहीं'}</p>
                <p><strong>अक्षांश (Latitude):</strong> {villageData?.latitude}</p>
                <p><strong>देशांतर (Longitude):</strong> {villageData?.longitude}</p>
                <p><strong>चौकला ID:</strong> {villageData?.choklaId}</p>
                <p><strong>निर्माण तिथि:</strong> {new Date(villageData?.createdDate).toLocaleDateString()}</p>
                <p><strong>अद्यतन तिथि:</strong> {new Date(villageData?.updatedDate).toLocaleDateString()}</p>
              </div>
            </CardContent>

          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardTitle className="flex items-center text-blue-700">गांव का नक्शा (Google Map)</CardTitle>
            <CardContent >
              {villageData?.latitude && villageData?.longitude ? (
                <iframe
                  title="Google Map"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${26.85},${75.82}&z=14&output=embed`}
                ></iframe>
              ) : (
                <p>स्थान उपलब्ध नहीं है (Location not available)</p>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}

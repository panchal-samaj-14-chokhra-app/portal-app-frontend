"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  Users,
  Home,
  Plus,
  Search,
  LogOut,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  MapPin,
  ArrowLeft,
  Menu,
  X,
  Share,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
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
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mapLoading, setMapLoading] = useState(true)
  const [mapError, setMapError] = useState(false)
  const { data: villageData, isLoading, error } = useVillageDetails(villageId)
  const { mutate: deleteFamily } = useDeleteFamilyUsingID()

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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700 text-sm sm:text-base">लोड हो रहा है...</p>
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
      router.back()
      return
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
        return <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">सत्यापित</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">लंबित</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">मसौदा</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            अज्ञात
          </Badge>
        )
    }
  }

  const handleDeleteFamily = async (familyId: string) => {
    return await deleteFamily(familyId)
  }

  const handleMapLoad = () => {
    setMapLoading(false)
    setMapError(false)
  }

  const handleMapError = () => {
    setMapLoading(false)
    setMapError(true)
  }

  const shareLocation = async () => {
    const locationUrl = `https://maps.google.com/maps?q=${villageData.latitude},${villageData.longitude}&z=15`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${villageData.name} का स्थान`,
          text: `${villageData.name}, ${villageData.district}, ${villageData.state} का स्थान देखें`,
          url: locationUrl,
        })
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(locationUrl)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(locationUrl)
        // You could add a toast notification here
        alert("स्थान लिंक कॉपी हो गया!")
      } catch (error) {
        console.error("Failed to copy location:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={40}
                height={40}
                className="rounded-full shadow-lg flex-shrink-0 sm:w-[50px] sm:h-[50px]"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-white truncate">{villageData?.name}</h1>
                <p className="text-orange-100 text-xs sm:text-sm truncate">स्वागत है, {session.user?.name}</p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {userType !== "VILLAGE_MEMBER" ? (
                <Button onClick={handleAddFamily} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  वापस जाएं
                </Button>
              ) : (
                <Button onClick={handleAddFamily} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/20 p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/20">
              <div className="flex flex-col gap-2">
                {userType !== "VILLAGE_MEMBER" ? (
                  <Button
                    onClick={() => {
                      handleAddFamily()
                      setShowMobileMenu(false)
                    }}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 justify-start"
                    size="sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस जाएं
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleAddFamily()
                      setShowMobileMenu(false)
                    }}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 justify-start"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    नया परिवार
                  </Button>
                )}
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 justify-start"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  लॉगआउट
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-xs sm:text-sm font-medium">कुल परिवार</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-700">{villageData?.families?.length || 0}</p>
                </div>
                <Home className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-xs sm:text-sm font-medium">कुल सदस्य</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-700">
                    {(villageData?.genderCount.MALE || 0) +
                      (villageData?.genderCount.FEMALE || 0) +
                      (villageData?.genderCount.OTHER || 0)}
                  </p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-xs sm:text-sm font-medium">पुरुष</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-700">{villageData?.genderCount.MALE || 0}</p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-600 text-xs sm:text-sm font-medium">महिला</p>
                  <p className="text-lg sm:text-2xl font-bold text-pink-700">{villageData?.genderCount.FEMALE || 0}</p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-600 text-xs sm:text-sm font-medium">अन्य</p>
                  <p className="text-lg sm:text-2xl font-bold text-indigo-700">{villageData?.genderCount.OTHER || 0}</p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">परिवार खोजें और फ़िल्टर करें</CardTitle>
            <CardDescription className="text-sm">परिवारों को खोजें और स्थिति के अनुसार फ़िल्टर करें</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="मुखिया का नाम या परिवार ID खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                  className="text-xs"
                >
                  सभी
                </Button>
                <Button
                  variant={statusFilter === "verified" ? "default" : "outline"}
                  onClick={() => setStatusFilter("verified")}
                  size="sm"
                  className="text-xs"
                >
                  सत्यापित
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  size="sm"
                  className="text-xs"
                >
                  लंबित
                </Button>
                <Button
                  variant={statusFilter === "draft" ? "default" : "outline"}
                  onClick={() => setStatusFilter("draft")}
                  size="sm"
                  className="text-xs"
                >
                  मसौदा
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Families Table */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">परिवारों की सूची</CardTitle>
            <CardDescription className="text-sm">गांव के सभी पंजीकृत परिवारों की जानकारी</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">परिवार ID</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">मुखिया का नाम</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">कुल सदस्य</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden md:table-cell">पुरुष/महिला</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden lg:table-cell">पता</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden lg:table-cell">संपर्क</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden md:table-cell">स्थिति</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">कार्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFamilies?.map((family) => (
                    <TableRow key={family.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-4">{family.id}</TableCell>
                      <TableCell className="px-2 sm:px-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                            {family.mukhiyaName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell px-2 sm:px-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                          {(family.genderCount?.MALE || 0) +
                            (family.genderCount?.FEMALE || 0) +
                            (family.genderCount?.OTHER || 0)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell px-2 sm:px-4">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                            पु: {family.genderCount?.MALE || 0}
                          </Badge>
                          <Badge variant="outline" className="bg-pink-50 text-pink-700 text-xs">
                            म: {family.genderCount?.FEMALE || 0}
                          </Badge>
                          {(family.genderCount?.OTHER || 0) > 0 && (
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 text-xs">
                              अ: {family.genderCount?.OTHER || 0}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-2 sm:px-4 max-w-xs">
                        <div className="truncate text-xs sm:text-sm" title={family.currentAddress}>
                          {family.currentAddress}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-2 sm:px-4 text-xs sm:text-sm">
                        {family.contactNumber || "N/A"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell px-2 sm:px-4 text-xs sm:text-sm">
                        {family.economicStatus}
                      </TableCell>
                      <TableCell className="px-2 sm:px-4">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/admin/village/${villageId}/family/${family.id}?choklaId=${villageData.choklaId}`,
                              )
                            }
                            className="bg-transparent p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/village/${villageId}/family/${family.id}/edit?choklaId=${villageData.choklaId}`,
                              )
                            }
                            className="bg-transparent p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFamily(family.id)}
                            className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50 p-1 sm:p-2 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {userType === "VILLAGE_MEMBER" && filteredFamilies?.length === 0 && (
              <div className="text-center py-8 px-4">
                <Home className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">कोई परिवार नहीं मिला</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">खोज मापदंड के अनुसार कोई परिवार नहीं मिला</p>
                <Button onClick={handleAddFamily} className="bg-orange-500 hover:bg-orange-600" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  पहला परिवार जोड़ें
                </Button>
              </div>
            )}

            {userType !== "VILLAGE_MEMBER" && filteredFamilies?.length === 0 && (
              <div className="text-center py-8 px-4">
                <Home className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">कोई परिवार नहीं मिला</h3>
                <p className="text-gray-600 text-sm sm:text-base">खोज मापदंड के अनुसार कोई परिवार नहीं मिला</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {userType === "VILLAGE_MEMBER" && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center text-orange-700 text-base sm:text-lg">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  नया परिवार जोड़ें
                </CardTitle>
                <CardDescription className="text-sm">नए परिवार का पंजीकरण करें</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-sm" onClick={handleAddFamily}>
                  परिवार पंजीकरण शुरू करें
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-blue-700 text-base sm:text-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                गांव की जानकारी
              </CardTitle>
              <CardDescription className="text-sm">गांव के बारे में विस्तृत जानकारी</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p>
                    <strong>गांव ID:</strong> <span className="break-all">{villageData?.id}</span>
                  </p>
                  <p>
                    <strong>नाम:</strong> {villageData?.name}
                  </p>
                  <p>
                    <strong>चौकला:</strong> {villageData?.chakolaName}
                  </p>
                  <p>
                    <strong>सदस्य:</strong> <span className="break-all">{villageData?.villageMemberName}</span>
                  </p>
                  <p>
                    <strong>मोबाइल:</strong> {villageData?.mobileNumber}
                  </p>
                  <p>
                    <strong>आयु:</strong> {villageData?.age}
                  </p>
                  <p>
                    <strong>ईमेल:</strong> <span className="break-all">{villageData?.email}</span>
                  </p>
                  <p>
                    <strong>तहसील:</strong> {villageData?.tehsil}
                  </p>
                  <p>
                    <strong>जिला:</strong> {villageData?.district}
                  </p>
                  <p>
                    <strong>राज्य:</strong> {villageData?.state}
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p>
                    <strong>स्कूल:</strong> {villageData?.isVillageHaveSchool ? "हाँ" : "नहीं"}
                  </p>
                  <p>
                    <strong>स्वास्थ्य केंद्र:</strong> {villageData?.isVillageHavePrimaryHealthCare ? "हाँ" : "नहीं"}
                  </p>
                  <p>
                    <strong>कम्युनिटी हॉल:</strong> {villageData?.isVillageHaveCommunityHall ? "हाँ" : "नहीं"}
                  </p>
                </div>
                <div className="pt-2 border-t text-xs text-gray-600">
                  <p>
                    <strong>निर्माण:</strong>{" "}
                    {villageData?.createdDate ? new Date(villageData.createdDate).toLocaleDateString() : "N/A"}
                  </p>
                  <p>
                    <strong>अद्यतन:</strong>{" "}
                    {villageData?.updatedDate ? new Date(villageData.updatedDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-blue-700 text-base sm:text-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                गांव का नक्शा
              </CardTitle>
              <CardDescription className="text-sm">Google Map पर स्थान देखें</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {villageData?.latitude && villageData?.longitude ? (
                <div className="relative w-full h-48 sm:h-64 lg:h-72 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-50">
                  {/* Map Loading Overlay */}
                  {mapLoading && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center z-20">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-blue-700 text-sm">मैप लोड हो रहा है...</p>
                      </div>
                    </div>
                  )}

                  {/* Map Error Overlay */}
                  {mapError && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center z-20">
                      <div className="text-center p-4">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-red-700 mb-2">मैप लोड नहीं हो सका</h3>
                        <p className="text-sm text-red-600 mb-4">कृपया अपना इंटरनेट कनेक्शन जांचें</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setMapError(false)
                            setMapLoading(true)
                            // Force iframe reload
                            const iframe = document.querySelector("#village-map-iframe")
                            if (iframe) {
                              iframe.src = iframe.src
                            }
                          }}
                          className="bg-white text-red-600 border-red-300 hover:bg-red-50"
                        >
                          पुनः प्रयास करें
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Google Map Iframe with Pin */}
                  <iframe
                    id="village-map-iframe"
                    title="Village Location on Google Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${villageData.latitude},${villageData.longitude}&z=16&output=embed&maptype=roadmap&markers=color:red%7Clabel:${encodeURIComponent(villageData.name?.charAt(0) || "V")}%7C${villageData.latitude},${villageData.longitude}`}
                    className="rounded-xl"
                    onLoad={handleMapLoad}
                    onError={handleMapError}
                  />

                  {/* Village Info Overlay */}
                  {!mapLoading && !mapError && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-white/20">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">
                            {villageData?.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate max-w-[120px]">
                            {villageData?.district}, {villageData?.state}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Coordinates Display */}
                  {!mapLoading && !mapError && (
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white rounded-lg px-2 py-1 text-xs font-mono">
                      {Number.parseFloat(villageData.latitude).toFixed(4)},{" "}
                      {Number.parseFloat(villageData.longitude).toFixed(4)}
                    </div>
                  )}

                  {/* Zoom Controls Hint */}
                  {!mapLoading && !mapError && (
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-gray-600">
                      स्क्रॉल करके ज़ूम करें
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 sm:h-64 lg:h-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">स्थान डेटा उपलब्ध नहीं है</h3>
                    <p className="text-sm text-gray-500 mb-4">इस गांव के लिए GPS निर्देशांक उपलब्ध नहीं हैं</p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <p className="text-xs text-amber-700 font-medium mb-1">समस्या:</p>
                          <p className="text-xs text-amber-600">
                            गांव के सटीक स्थान के लिए GPS निर्देशांक (अक्षांश और देशांतर) की आवश्यकता है
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Map Actions */}
              {villageData?.latitude && villageData?.longitude && (
                <div className="mt-4 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/maps?q=${villageData.latitude},${villageData.longitude}&z=16`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Google Maps में खोलें
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs bg-white hover:bg-green-50 border-green-200 text-green-700"
                      onClick={shareLocation}
                    >
                      <Share className="w-4 h-4 mr-2" />
                      स्थान साझा करें
                    </Button>
                  </div>

                  {/* Additional Map Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-xs text-blue-700 font-medium mb-1">मैप की जानकारी:</p>
                        <p className="text-xs text-blue-600">
                          • लाल पिन गांव का सटीक स्थान दिखाता है
                          <br />• मैप पर स्क्रॉल करके ज़ूम इन/आउट करें
                          <br />• पूर्ण स्क्रीन के लिए "Google Maps में खोलें" पर क्लिक करें
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

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
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Input } from "@/components/ui/input/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table"
import { useDeleteFamilyUsingID, useVillageDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useQueryClient } from "@tanstack/react-query"

export default function VillageDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.villageId as string

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Deletion flow state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name?: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{
    loading: boolean
    success: boolean
    error: boolean
    message: string
  }>({
    loading: false,
    success: false,
    error: false,
    message: "",
  })

  const queryClient = useQueryClient()

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
      router.back()
      return
    }
    router.push(`/admin/village/${villageId}/add-family?chakolaId=${chokhlaID}`)
  }

  const filteredFamilies = families?.filter((family: { mukhiyaName: string; id: string; status: string }) => {
    const matchesSearch =
      family.mukhiyaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.id.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Ask for confirmation before deletion
  const requestDeleteFamily = (familyId: string, familyName?: string) => {
    setConfirmTarget({ id: familyId, name: familyName })
    setConfirmOpen(true)
  }

  // Delete logic with loading, success, and error modals
  const handleDeleteFamily = async () => {
    if (!confirmTarget?.id) return
    const familyId = confirmTarget.id

    // Close confirmation and start loading
    setConfirmOpen(false)
    setDeletingId(familyId)
    setDeleteModal({ loading: true, success: false, error: false, message: "" })

    deleteFamily(familyId, {
      onSuccess: async (data: any) => {
        if (data?.success) {
          // Invalidate queries to refresh the families/village table
          try {
            await queryClient.invalidateQueries({
              predicate: (q) => {
                const k = q.queryKey as any[]
                return (
                  k?.includes("village") ||
                  k?.includes("villageDetails") ||
                  k?.includes("families") ||
                  (Array.isArray(k) && k.some((p) => p === villageId))
                )
              },
            })
          } catch (e) {
            // ignore
          }
          // Additionally refresh the route cache as a fallback
          if (typeof router.refresh === "function") {
            router.refresh()
          }

          setDeleteModal({
            loading: false,
            success: true,
            error: false,
            message: data?.message || "Family deleted successfully",
          })
        } else {
          setDeleteModal({
            loading: false,
            success: false,
            error: true,
            message: data?.message || "परिवार हटाने में समस्या हुई",
          })
        }
      },
      onError: (err: any) => {
        setDeleteModal({
          loading: false,
          success: false,
          error: true,
          message: err?.message || "परिवार हटाने में समस्या हुई",
        })
      },
      onSettled: () => {
        setDeletingId(null)
      },
    })
  }

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
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-white truncate">{villageData?.name}</h1>
                <p className="text-orange-100 text-sm truncate">स्वागत है, {session.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {userType !== "VILLAGE_MEMBER" ? (
                <Button onClick={handleAddFamily} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  वापस जॉए
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
                  <p className="text-2xl font-bold text-green-700">
                    {(villageData?.genderCount?.MALE || 0) +
                      (villageData?.genderCount?.FEMALE || 0) +
                      (villageData?.genderCount?.OTHER || 0)}
                  </p>
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
                  <p className="text-2xl font-bold text-purple-700">{villageData?.genderCount?.MALE || 0}</p>
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
                  <p className="text-2xl font-bold text-pink-700">{villageData?.genderCount?.FEMALE || 0}</p>
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
                  <p className="text-2xl font-bold text-pink-700">{villageData?.genderCount?.OTHER || 0}</p>
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
              <div className="flex gap-2 flex-wrap">
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
                  {filteredFamilies?.map((family: any) => {
                    const totalMembers =
                      (family?.genderCount?.MALE || 0) +
                      (family?.genderCount?.FEMALE || 0) +
                      (family?.genderCount?.OTHER || 0)
                    const isRowDeleting = deletingId === family.id && deleteModal.loading

                    return (
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
                            {totalMembers}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                              पु: {family?.genderCount?.MALE || 0}
                            </Badge>
                            <Badge variant="outline" className="bg-pink-50 text-pink-700 text-xs">
                              म: {family?.genderCount?.FEMALE || 0}
                            </Badge>
                            <Badge variant="outline" className="bg-pink-50 text-pink-700 text-xs">
                              अ: {family?.genderCount?.OTHER || 0}
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
                              onClick={() =>
                                router.push(
                                  `/admin/village/${villageId}/family/${family.id}?choklaId=${villageData.choklaId}`,
                                )
                              }
                              className="bg-transparent"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  `/admin/village/${villageId}/family/${family.id}/edit?choklaId=${villageData.choklaId}`,
                                )
                              }
                              className="bg-transparent"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => requestDeleteFamily(family.id, family.mukhiyaName)}
                              disabled={isRowDeleting}
                              className={`bg-transparent ${isRowDeleting
                                ? "opacity-70 cursor-not-allowed"
                                : "text-red-600 hover:text-red-700 hover:bg-red-50"
                                }`}
                            >
                              {isRowDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {userType === "VILLAGE_MEMBER" ? (
              filteredFamilies?.length === 0 && (
                <div className="text-center py-8">
                  <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई परिवार नहीं मिला</h3>
                  <p className="text-gray-600 mb-4">खोज मापदंड के अनुसार कोई परिवार नहीं मिला</p>
                  <Button onClick={handleAddFamily} className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    पहला परिवार जोड़ें
                  </Button>
                </div>
              )
            ) : (
              <div>No member</div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {userType === "VILLAGE_MEMBER" && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <Plus className="w-5 h-5 mr-2" />
                  नया परिवार जोड़ें
                </CardTitle>
                <CardDescription>नए परिवार का पंजीकरण करें</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleAddFamily}>
                  परिवार पंजीकरण शुरू करें
                </Button>
              </CardContent>
            </Card>
          )}

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
                <p>
                  <strong>गांव ID:</strong> {villageData?.id}
                </p>
                <p>
                  <strong>नाम:</strong> {villageData?.name}
                </p>
                <p>
                  <strong>चौकला:</strong> {villageData?.chakolaName}
                </p>
                <p>
                  <strong>गांव सदस्य का नाम:</strong> {villageData?.villageMemberName}
                </p>
                <p>
                  <strong>मोबाइल नंबर:</strong> {villageData?.mobileNumber}
                </p>
                <p>
                  <strong>आयु:</strong> {villageData?.age}
                </p>
                <p>
                  <strong>ईमेल:</strong> {villageData?.email}
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
                <p>
                  <strong>क्या गांव में स्कूल है?:</strong> {villageData?.isVillageHaveSchool ? "हाँ" : "नहीं"}
                </p>
                <p>
                  <strong>क्या प्राथमिक स्वास्थ्य केंद्र है?:</strong>{" "}
                  {villageData?.isVillageHavePrimaryHealthCare ? "हाँ" : "नहीं"}
                </p>
                <p>
                  <strong>क्या कम्युनिटी हॉल है?:</strong> {villageData?.isVillageHaveCommunityHall ? "हाँ" : "नहीं"}
                </p>
                <p>
                  <strong>अक्षांश (Latitude):</strong> {villageData?.latitude}
                </p>
                <p>
                  <strong>देशांतर (Longitude):</strong> {villageData?.longitude}
                </p>
                <p>
                  <strong>चौकला ID:</strong> {villageData?.choklaId}
                </p>
                <p>
                  <strong>निर्माण तिथि:</strong>{" "}
                  {villageData?.createdDate ? new Date(villageData?.createdDate).toLocaleDateString() : "-"}
                </p>
                <p>
                  <strong>अद्यतन तिथि:</strong>{" "}
                  {villageData?.updatedDate ? new Date(villageData?.updatedDate).toLocaleDateString() : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <MapPin className="w-5 h-5 mr-2" />
                गांव का नक्शा (Google Map)
              </CardTitle>

            </CardHeader>
            <CardContent>
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

      {/* Confirmation Modal */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[420px]">
          <AlertDialogHeader>
            <AlertDialogTitle>क्या आप वाकई इस परिवार को हटाना चाहते हैं?</AlertDialogTitle>
            <AlertDialogDescription>
              यह कार्रवाई पूर्ववत नहीं की जा सकती।{" "}
              <span className="font-medium">
                {confirmTarget?.name ? `(${confirmTarget.name}) ` : ""}
                {confirmTarget?.id ? `ID: ${confirmTarget.id}` : ""}
              </span>{" "}
              को हटाने पर सभी संबंधित डेटा भी हट सकता है।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteFamily}>
              हां, हटाएं
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Loading Modal */}
      <Dialog open={deleteModal.loading} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
              परिवार हटाया जा रहा है
            </DialogTitle>
            <DialogDescription>कृपया प्रतीक्षा करें...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        open={deleteModal.success}
        onOpenChange={(open) => {
          if (!open) setDeleteModal((s) => ({ ...s, success: false }))
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              सफलतापूर्वक हटाया गया
            </DialogTitle>
            <DialogDescription className="text-gray-700">{deleteModal.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeleteModal((s) => ({ ...s, success: false }))}>ठीक है</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog
        open={deleteModal.error}
        onOpenChange={(open) => {
          if (!open) setDeleteModal((s) => ({ ...s, error: false }))
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              हटाने में त्रुटि
            </DialogTitle>
            <DialogDescription className="text-gray-700">{deleteModal.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal((s) => ({ ...s, error: false }))}>
              बंद करें
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

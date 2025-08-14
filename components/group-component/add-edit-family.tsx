"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDeleteMember, useGetFamilyDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, User, Home, MapPin, Users, FileText, AlertCircle, CheckCircle2, Info } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"
import { Badge } from "@/components/ui/badge"
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
import type { FamilyData, FamilyMember, FamilyFormProps } from "./family-form/types"

import { initialMember } from "./family-form/constants"

import { MemberForm } from "./family-form/member-form"

export default function FamilyForm({ mode, familyId }: FamilyFormProps) {
  const queryClient = useQueryClient()
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false)
  // State for member delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const { data: familyDetails, isLoading: isFetching } = useGetFamilyDetails(familyId || "")
  const [dataVersion, setDataVersion] = useState(0)
  // Initialize family data
  const [familyData, setFamilyData] = useState<FamilyData>(() => ({
    mukhiyaName: "",
    currentAddress: "",
    permanentAddress: "",
    status: "draft",
    economicStatus: "",
    longitude: null,
    latitude: null,
    anyComment: "",
    // legacy fields for compatibility
    familyDistrict: "",
    familyState: "",
    familyPincode: "",
    // new prisma fields
    permanentFamilyDistrict: "",
    permanentFamilyState: "",
    permanentFamilyPincode: "",
    permanentFamilyVillage: "",
    currentFamilyDistrict: "",
    currentFamilyState: "",
    currentFamilyPincode: "",
    currentFamilyVillage: "",
    // Members
    members: [],
  }))

  // Populate when familyDetails are loaded or change

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const { mutate: deleteMember, isSuccess: deleteSuccess } = useDeleteMember()

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")
  }, [session, status, router])

  useEffect(() => {
    // Get current location
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFamilyData((prev) => ({
            ...prev,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          }))
        },
        () => {
          setFamilyData((prev) => ({
            ...prev,
            longitude: null,
            latitude: null,
          }))
        },
      )
    }
  }, [])

  // Removed unused mukhiyaCount

  const addMember = () => {
    const newMember: FamilyMember = {
      ...initialMember,
      id: `member-${Date.now()}`,
      isMukhiya: false,
    }
    setFamilyData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }))
  }

  const removeMember = (memberId: string) => {
    setFamilyData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }))
  }

  // Handler to request delete confirmation
  const requestDeleteMember = (member: any) => {
    setDeleteTarget(member)
    setDeleteConfirmOpen(true)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-700 hindi-text">जानकारी लोड हो रही है...</p>
            <p className="text-sm text-gray-500">कृपया प्रतीक्षा करें</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) return null

  function handleEditMember(person: any): void {
    // Extract villageId and chakolaId from familyDetails or params
    const villageId = familyDetails?.villageId || params?.villageId || ""
    const chakolaId = familyDetails?.chakolaId || ""
    const personId = person.id || ""

    // Navigate to edit member page with person ID
    router.push(`/admin/village/${villageId}/family/${familyDetails?.id}/edit/${personId}?choklaId=${chakolaId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 shadow-xl sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="lg"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hindi-text font-medium">वापस</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white hindi-text truncate drop-shadow-lg">
                  {mode === "edit" ? "परिवार संपादित करें" : "नया परिवार जोड़ें"}
                </h1>
                <p className="text-orange-100 text-base sm:text-lg hindi-text truncate mt-1">
                  परिवार पंजीकरण फॉर्म - संपूर्ण विवरण
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Family Details Section */}
      {mode === "edit" && familyDetails && (
        <div className="container mx-auto px-4 sm:px-6 pt-8 pb-4 max-w-7xl">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-white backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-xl p-6">
              <CardTitle className="text-xl sm:text-2xl hindi-text flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Info className="h-6 w-6" />
                </div>
                परिवार की मुख्य जानकारी
              </CardTitle>
              <CardDescription className="text-orange-100 text-base">पंजीकृत परिवार का विस्तृत विवरण</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <User className="h-4 w-4" />
                    मुखिया का नाम
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{familyDetails.mukhiyaName || "—"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <FileText className="h-4 w-4" />
                    आर्थिक स्थिति
                  </div>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {familyDetails.economicStatus || "—"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <CheckCircle2 className="h-4 w-4" />
                    स्थिति
                  </div>
                  <Badge
                    variant={familyDetails.status === "completed" ? "default" : "secondary"}
                    className="text-sm px-3 py-1"
                  >
                    {familyDetails.status || "—"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Village ID</div>
                  <p className="text-gray-900 font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                    {familyDetails.villageId || "—"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Chakola ID</div>
                  <p className="text-gray-900 font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                    {familyDetails.chakolaId || "—"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <MapPin className="h-4 w-4" />
                    स्थान निर्देशांक
                  </div>
                  <p className="text-sm text-gray-700">
                    {familyDetails.longitude && familyDetails.latitude
                      ? `${familyDetails.latitude?.toFixed(6)}, ${familyDetails.longitude?.toFixed(6)}`
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Address Information */}
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Permanent Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                      <Home className="h-5 w-5 text-green-600" />
                      स्थायी पता (Permanent Address)
                    </h3>
                    <div className="space-y-3 pl-7">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">राज्य:</span>
                          <p className="text-gray-900">{familyDetails.permanentFamilyState || "—"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">जिला:</span>
                          <p className="text-gray-900">{familyDetails.permanentFamilyDistrict || "—"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">गांव:</span>
                          <p className="text-gray-900">{familyDetails.permanentFamilyVillage || "—"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">पिनकोड:</span>
                          <p className="text-gray-900 font-mono">{familyDetails.permanentFamilyPincode || "—"}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">पूरा पता:</span>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                          {familyDetails.permanentAddress || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      वर्तमान पता (Current Address)
                    </h3>
                    <div className="space-y-3 pl-7">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">राज्य:</span>
                          <p className="text-gray-900">{familyDetails.currentFamilyState || "—"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">जिला:</span>
                          <p className="text-gray-900">{familyDetails.currentFamilyDistrict || "—"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">गांव:</span>
                          <p className="text-gray-900">{familyDetails.currentFamilyVillage || "—"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">पिनकोड:</span>
                          <p className="text-gray-900 font-mono">{familyDetails.currentFamilyPincode || "—"}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">पूरा पता:</span>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                          {familyDetails.currentAddress || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                {familyDetails.anyComment && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      टिप्पणी (Comments)
                    </h3>
                    <p className="text-gray-700 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400 ml-7">
                      {familyDetails.anyComment}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Family Members Table */}
      {familyDetails?.Person && Array.isArray(familyDetails.Person) && (
        <div className="container mx-auto px-4 sm:px-6 pb-4 max-w-7xl">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-white backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl p-6">
              <CardTitle className="text-xl sm:text-2xl hindi-text flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Users className="h-6 w-6" />
                </div>
                परिवार के सदस्य
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 ml-auto">
                  {familyDetails.Person.length} सदस्य
                </Badge>
              </CardTitle>
              <CardDescription className="text-blue-100 text-base">परिवार में सभी सदस्यों की विस्तृत सूची</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              {familyDetails.Person.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          नाम (Name)
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          आयु (Age)
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          रिश्ता (Relation)
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          कार्य (Actions)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {familyDetails.Person.map((person: any, index: number) => (
                        <tr
                          key={person.id}
                          className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {person.firstName} {person.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 font-medium">{person.age} वर्ष</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="text-sm">
                              {person.relation}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-3">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditMember(person)}
                                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z"
                                  />
                                </svg>
                                संपादित करें
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => requestDeleteMember(person)}
                                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                हटाएं
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg hindi-text">कोई सदस्य नहीं मिला।</p>
                  <p className="text-gray-400 text-sm mt-2">परिवार में सदस्य जोड़ने के लिए नीचे दिए गए बटन का उपयोग करें।</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Member Delete Confirmation Modal */}
      <AlertDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open)
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent className="sm:max-w-[500px] bg-gradient-to-br from-red-50 to-white border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-800 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              सदस्य हटाने की पुष्टि
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-700 mt-4">
              क्या आप वाकई इस सदस्य को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।
              {deleteTarget?.firstName && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg border-l-4 border-red-400">
                  <span className="font-semibold text-red-800">
                    सदस्य: {deleteTarget.firstName} {deleteTarget.lastName}
                  </span>
                  {deleteTarget.id && <div className="text-sm text-red-600 mt-1">ID: {deleteTarget.id}</div>}
                </div>
              )}
              <p className="text-sm text-gray-600 mt-3">इस सदस्य को हटाने पर सभी संबंधित डेटा भी हट जाएगा।</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300">
              रद्द करें
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
              onClick={() => {
                if (deleteTarget?.id) {
                  deleteMember(deleteTarget.id, {
                    onSuccess: () => {
                      setDeleteConfirmOpen(false)
                      setDeleteTarget(null)
                      setTimeout(() => setDeleteSuccessOpen(true), 100)
                      queryClient.invalidateQueries({ queryKey: ["family-detail", familyId] })
                    },
                  })
                } else {
                  setDeleteConfirmOpen(false)
                  setDeleteTarget(null)
                }
              }}
            >
              हां, हटाएं
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enhanced Member Delete Success Modal */}
      <AlertDialog
        open={deleteSuccessOpen}
        onOpenChange={(open) => {
          setDeleteSuccessOpen(open)
          if (!open) window.location.reload()
        }}
      >
        <AlertDialogContent className="sm:max-w-[420px] bg-gradient-to-br from-green-50 to-white border-green-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-green-800 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              सफलता!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-700 mt-4">
              सदस्य सफलतापूर्वक हटा दिया गया है। सभी संबंधित जानकारी भी हटा दी गई है।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogAction
              onClick={() => setDeleteSuccessOpen(false)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg w-full"
            >
              ठीक है
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enhanced Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Enhanced Error Alerts */}
        {(errors.mukhiya ||
          errors.mobile ||
          errors.economicStatus ||
          errors.permanentFamilyPincode ||
          errors.currentFamilyPincode) && (
            <Alert className="mb-8 border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800 text-base font-medium">
                <div className="space-y-2">
                  {errors.mukhiya && <div className="hindi-text flex items-center gap-2">• {errors.mukhiya}</div>}
                  {errors.mobile && <div className="hindi-text flex items-center gap-2">• {errors.mobile}</div>}
                  {errors.economicStatus && (
                    <div className="hindi-text flex items-center gap-2">• {errors.economicStatus}</div>
                  )}
                  {errors.permanentFamilyPincode && (
                    <div className="hindi-text flex items-center gap-2">• {errors.permanentFamilyPincode}</div>
                  )}
                  {errors.currentFamilyPincode && (
                    <div className="hindi-text flex items-center gap-2">• {errors.currentFamilyPincode}</div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

        {/* Enhanced Add Member Button */}
        <div className="mb-8 text-center">
          <Button
            type="button"
            onClick={addMember}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hindi-text text-lg px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <Users className="w-6 h-6 mr-3" />+ सदस्य जोड़ें (Add Member)
          </Button>
        </div>

        {/* Enhanced Dynamic Members Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-white backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-xl p-6 sm:p-8">
            <CardTitle className="text-xl sm:text-2xl hindi-text flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <User className="h-6 w-6" />
              </div>
              सदस्य की जानकारी
              {familyData.members.length > 0 && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 ml-auto">
                  {familyData.members.length} सदस्य
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-purple-100 text-base">
              परिवार के सभी सदस्यों की विस्तृत जानकारी भरें
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            {familyData.members.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-6">
                  <div className="mx-auto h-24 w-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                    <Users className="h-12 w-12 text-purple-500" />
                  </div>
                </div>

                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  परिवार के सदस्यों की जानकारी जोड़ने के लिए ऊपर दिए गए "सदस्य जोड़ें" बटन पर क्लिक करें।
                </p>

              </div>
            ) : (
              <div className="space-y-8">
                {familyData.members.map((member, idx) => (
                  <div key={member.id} className="relative">
                    <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 hindi-text">सदस्य {idx + 1}</h3>
                            <p className="text-sm text-gray-600">परिवार का सदस्य</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          ID: {member.id}
                        </Badge>
                      </div>

                      <MemberForm
                        key={`${member.id}-${dataVersion}`}
                        index={idx}
                        errors={errors}
                        onRemoveMember={() => removeMember(member.id)}
                        membersCount={familyData.members.length}
                      />

                      {familyData.members.length > 0 && (
                        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMember(member.id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            सदस्य हटाएं
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

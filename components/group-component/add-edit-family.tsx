"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDeleteMember, useGetFamilyDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, User, Home, MapPin, Users, FileText, AlertCircle, CheckCircle2, Info, Plus } from "lucide-react"
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
import { calculateAge } from "./family-form/utils"

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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700">जानकारी लोड हो रही है...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                  {mode === "edit" ? "परिवार संपादित करें" : "नया परिवार जोड़ें"}
                </h1>
                <p className="text-orange-100 text-sm truncate">परिवार पंजीकरण फॉर्म</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Family Details Section (edit mode only) */}
        {mode === "edit" && familyDetails && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                परिवार की मुख्य जानकारी
              </CardTitle>
              <CardDescription>पंजीकृत परिवार का विस्तृत विवरण</CardDescription>
            </CardHeader>
            <CardContent>
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
                      समाज हित के लिए सुझाव (Suggestions for the welfare of the community)
                    </h3>
                    <p className="text-gray-700 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400 ml-7">
                      {familyDetails.anyComment}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Family Members Table */}
        {familyDetails?.Person && Array.isArray(familyDetails.Person) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  परिवार के सदस्य
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {familyDetails.Person.length} सदस्य
                </Badge>
              </CardTitle>
              <CardDescription>परिवार में सभी सदस्यों की विस्तृत सूची</CardDescription>
            </CardHeader>
            <CardContent>
              {familyDetails.Person.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          नाम (Name)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          आयु (Age)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          रिश्ता (Relation)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          लिंग (Gender)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          वैवाहिक स्थिति (Marital Status)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          गोत्र (Gotra)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          दिव्यांग (Disability)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          कार्य (Actions)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {familyDetails.Person.map((person: any) => (
                        <tr key={person.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-orange-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {person.firstName} {person.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{calculateAge(person.dateOfBirth)} वर्ष</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="text-sm">
                              {person.relation}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{person.gender}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{person.maritalStatus}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{person.gotra}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {person.disability ? 'हाँ' : 'नहीं'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditMember(person)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                संपादित करें
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => requestDeleteMember(person)}
                                className="text-red-600 hover:text-red-700"
                              >
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
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">कोई सदस्य नहीं मिला।</p>
                  <p className="text-gray-400 text-sm mt-2">परिवार में सदस्य जोड़ने के लिए नीचे दिए गए बटन का उपयोग करें।</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error Alerts */}
        {(errors.mukhiya ||
          errors.mobile ||
          errors.economicStatus ||
          errors.permanentFamilyPincode ||
          errors.currentFamilyPincode) && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                <div className="space-y-1">
                  {errors.mukhiya && <div>{errors.mukhiya}</div>}
                  {errors.mobile && <div>{errors.mobile}</div>}
                  {errors.economicStatus && <div>{errors.economicStatus}</div>}
                  {errors.permanentFamilyPincode && <div>{errors.permanentFamilyPincode}</div>}
                  {errors.currentFamilyPincode && <div>{errors.currentFamilyPincode}</div>}
                </div>
              </AlertDescription>
            </Alert>
          )}

        {/* Add Member Button */}
        <div className="mb-6">
          <Button type="button" onClick={addMember} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            सदस्य जोड़ें (Add Member)
          </Button>
        </div>

        {/* Dynamic Members Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                सदस्य की जानकारी
              </div>
              {familyData.members.length > 0 && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {familyData.members.length} सदस्य
                </Badge>
              )}
            </CardTitle>
            <CardDescription>परिवार के सभी सदस्यों की विस्तृत जानकारी भरें</CardDescription>
          </CardHeader>
          <CardContent>
            {familyData.members.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई सदस्य नहीं जोड़ा गया</h3>
                <p className="text-gray-600 mb-4">
                  परिवार के सदस्यों की जानकारी जोड़ने के लिए ऊपर दिए गए "सदस्य जोड़ें" बटन पर क्लिक करें।
                </p>
                <Button type="button" onClick={addMember} className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  पहला सदस्य जोड़ें
                </Button>
              </div>
            ) : (
              <div className="">
                {familyData.members.map((member, idx) => (
                  <div key={member.id} className=" border-gray-200 rounded-lg ">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">सदस्य {idx + 1}</h3>
                          <p className="text-sm text-gray-600">परिवार का सदस्य</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
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

                    <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        सदस्य हटाएं
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Member Delete Confirmation Modal */}
      <AlertDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open)
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent className="sm:max-w-[420px]">
          <AlertDialogHeader>
            <AlertDialogTitle>क्या आप वाकई इस सदस्य को हटाना चाहते हैं?</AlertDialogTitle>
            <AlertDialogDescription>
              यह कार्रवाई पूर्ववत नहीं की जा सकती।
              <span className="font-medium">
                {deleteTarget?.firstName ? ` (${deleteTarget.firstName} ${deleteTarget.lastName}) ` : ""}
                {deleteTarget?.id ? `ID: ${deleteTarget.id}` : ""}
              </span>
              को हटाने पर सभी संबंधित डेटा भी हट सकता है।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
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

      {/* Member Delete Success Modal */}
      <AlertDialog
        open={deleteSuccessOpen}
        onOpenChange={(open) => {
          setDeleteSuccessOpen(open)
          if (!open) window.location.reload()
        }}
      >
        <AlertDialogContent className="sm:max-w-[420px]">
          <AlertDialogHeader>
            <AlertDialogTitle>सफलता!</AlertDialogTitle>
            <AlertDialogDescription>सदस्य सफलतापूर्वक हटा दिया गया है।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDeleteSuccessOpen(false)}>ठीक है</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useCreateFamily, useDeleteMember, useGetFamilyDetails, useUpdateFamily } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, User } from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Alert, AlertDescription } from "@/components/ui/alert/alert"
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
  const queryClient = useQueryClient();
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  // State for member delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
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

  const { mutate: deleteMember, isSuccess: deleteSuccess } = useDeleteMember();


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
    setDeleteTarget(member);
    setDeleteConfirmOpen(true);
  }



  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 hindi-text">जानकारी लोड हो रही है...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  function handleEditMember(person: any): void {
    // Extract villageId and chakolaId from familyDetails or params
    const villageId = familyDetails?.villageId || params?.villageId || "";
    const chakolaId = familyDetails?.chakolaId || "";
    const personId = person.id || "";

    // Navigate to edit member page with person ID
    router.push(
      `/admin/village/${villageId}/family/${familyDetails?.id}/edit/${personId}?choklaId=${chakolaId}`,
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Family Details Section (edit mode only) */}

      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg sticky top-0 z-10">


        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 touch-target flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hindi-text text-xs sm:text-sm">वापस</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white hindi-text truncate">
                  {mode === "edit" ? "परिवार संपादित करें" : "नया परिवार जोड़ें"}
                </h1>
                <p className="text-orange-100 text-xs sm:text-sm hindi-text truncate">परिवार पंजीकरण फॉर्म</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      {mode === "edit" && familyDetails && (
        <div className="container mx-auto px-3 sm:px-4 pt-6 pb-2 max-w-7xl">
          <Card className="mb-4 border-orange-200 bg-orange-50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base hindi-text">परिवार की मुख्य जानकारी</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">मुखिया का नाम:</span> {familyDetails.mukhiyaName || "—"}
              </div>
              <div>
                <span className="font-semibold">आर्थिक स्थिति:</span> {familyDetails.economicStatus || "—"}
              </div>
              <div>
                <span className="font-semibold">स्थिति:</span> {familyDetails.status || "—"}
              </div>
              <div>
                <span className="font-semibold">Village ID:</span> {familyDetails.villageId || "—"}
              </div>
              <div>
                <span className="font-semibold">Chakola ID:</span> {familyDetails.chakolaId || "—"}
              </div>
              <div>
                <span className="font-semibold">Permanent Address:</span> {familyDetails.permanentAddress || "—"}
              </div>
              <div>
                <span className="font-semibold">Permanent Village:</span> {familyDetails.permanentFamilyVillage || "—"}
              </div>
              <div>
                <span className="font-semibold">Permanent District:</span> {familyDetails.permanentFamilyDistrict || "—"}
              </div>
              <div>
                <span className="font-semibold">Permanent State:</span> {familyDetails.permanentFamilyState || "—"}
              </div>
              <div>
                <span className="font-semibold">Permanent Pincode:</span> {familyDetails.permanentFamilyPincode || "—"}
              </div>
              <div>
                <span className="font-semibold">Current Address:</span> {familyDetails.currentAddress || "—"}
              </div>
              <div>
                <span className="font-semibold">Current Village:</span> {familyDetails.currentFamilyVillage || "—"}
              </div>
              <div>
                <span className="font-semibold">Current District:</span> {familyDetails.currentFamilyDistrict || "—"}
              </div>
              <div>
                <span className="font-semibold">Current State:</span> {familyDetails.currentFamilyState || "—"}
              </div>
              <div>
                <span className="font-semibold">Current Pincode:</span> {familyDetails.currentFamilyPincode || "—"}
              </div>
              <div>
                <span className="font-semibold">Longitude:</span> {familyDetails.longitude ?? "—"}
              </div>
              <div>
                <span className="font-semibold">Latitude:</span> {familyDetails.latitude ?? "—"}
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold">टिप्पणी:</span> {familyDetails.anyComment || "—"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {familyDetails?.Person && Array.isArray(familyDetails.Person) ? (
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle>परिवार के सदस्य</CardTitle>
            <CardDescription>परिवार में सभी सदस्यों की सूची</CardDescription>
          </CardHeader>
          <CardContent>
            {familyDetails.Person.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">नाम</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">आयु</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">रिश्ता</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">कार्य</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {familyDetails.Person.map((person: any) => (
                      <tr key={person.id}>
                        <td className="px-4 py-2 whitespace-nowrap">{person.firstName} {person.lastName}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{person.age}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{person.relation}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => handleEditMember(person)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z" />
                              </svg>
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => requestDeleteMember(person)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">कोई सदस्य नहीं मिला।</div>
            )}
          </CardContent>
        </Card>
      ) : null}
      {/* Member Delete Confirmation Modal */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={(open) => {
        setDeleteConfirmOpen(open);
        if (!open) setDeleteTarget(null);
      }}>
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
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
              if (deleteTarget?.id) {
                deleteMember(deleteTarget.id, {
                  onSuccess: () => {
                    setDeleteConfirmOpen(false);
                    setDeleteTarget(null);
                    setTimeout(() => setDeleteSuccessOpen(true), 100); // ensure dialog closes before opening next
                    // Refetch family details so table updates
                    queryClient.invalidateQueries({ queryKey: ["family-detail", familyId] });
                  },
                });
              } else {
                setDeleteConfirmOpen(false);
                setDeleteTarget(null);
              }
            }}>
              हां, हटाएं
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Member Delete Success Modal (not nested) */}
      <AlertDialog open={deleteSuccessOpen} onOpenChange={(open) => {
        setDeleteSuccessOpen(open);
        if (!open) window.location.reload();
      }}>
        <AlertDialogContent className="sm:max-w-[420px]">
          <AlertDialogHeader>
            <AlertDialogTitle>सफलता!</AlertDialogTitle>
            <AlertDialogDescription>सदस्य सफलतापूर्वक हटा दिया गया।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDeleteSuccessOpen(false)}>ठीक है</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Error Alerts */}
        {(errors.mukhiya ||
          errors.mobile ||
          errors.economicStatus ||
          errors.permanentFamilyPincode ||
          errors.currentFamilyPincode) && (
            <Alert className="mb-4 sm:mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800 text-sm">
                {errors.mukhiya && <div className="hindi-text">{errors.mukhiya}</div>}
                {errors.mobile && <div className="hindi-text">{errors.mobile}</div>}
                {errors.economicStatus && <div className="hindi-text">{errors.economicStatus}</div>}
                {errors.permanentFamilyPincode && <div className="hindi-text">{errors.permanentFamilyPincode}</div>}
                {errors.currentFamilyPincode && <div className="hindi-text">{errors.currentFamilyPincode}</div>}
              </AlertDescription>
            </Alert>
          )}
        <Button type="button" onClick={addMember} className="hindi-text">
          + सदस्य जोड़ें (Add Member)
        </Button>
        {/* Dynamic Members Section */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center hindi-text text-lg sm:text-xl">
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              सदस्य की जानकारी
            </CardTitle>
            <CardDescription className="hindi-text text-sm">सदस्यों की जानकारी भरें</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">

            {familyData.members.map((member, idx) => (
              <div key={member.id} className="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
                <MemberForm
                  key={`${member.id}-${dataVersion}`}
                  index={idx}
                  errors={errors}

                  onRemoveMember={() => removeMember(member.id)}
                  membersCount={familyData.members.length}

                />
                {familyData.members.length > 0 && (
                  <div className="flex justify-end mt-2">
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeMember(member.id)}>
                      सदस्य हटाएं
                    </Button>
                  </div>
                )}
              </div>
            ))}


          </CardContent>
        </Card>
      </main>
    </div>
  )
}

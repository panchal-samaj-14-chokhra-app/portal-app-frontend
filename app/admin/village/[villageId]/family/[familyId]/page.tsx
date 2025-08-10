"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useMemo, useState, useCallback } from "react"
import Image from "next/image"
import {
  ArrowLeft,
  Edit,
  Download,
  MapPin,
  Calendar,
  User,
  FileText,
  Users,
  CreditCard,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs"
import { Separator } from "@/components/ui/separator/separator"
import { useGetFamilyDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import * as XLSX from "xlsx"

// TypeScript interfaces for type safety
interface FamilyMember {
  age: string | boolean | undefined
  name: string | boolean | undefined
  id: string
  fullName: string
  relation?: string
  isMukhiya?: boolean
  dateOfBirth?: string
  gender?: string
  aadhaarNumber?: string
  maritalStatus?: string
  educationLevel?: string
  schoolName?: string
  dropoutReason?: string
  isStudent?: boolean
  enrollmentStatus?: string
  occupationType?: string
  isEmployed?: boolean
  monthlyIncome?: string
  incomeSource?: string
  landOwned?: string
  livestock?: string
  hasDisability?: boolean
  disabilityType?: string
  chronicDisease?: string
  hasMajorHealthIssues?: boolean
  isVaccinated?: boolean
  hasHealthInsurance?: boolean
  welfareSchemes?: string[]
  hasSmartphone?: boolean
  hasInternet?: boolean
  hasBankAccount?: boolean
  hasJanDhanAccount?: boolean
  permanentAddress?: string
  currentAddress?: string
  villageName?: string
  pincode?: string
  district?: string
  state?: string
  caste?: string
  religion?: string
  bloodGroup?: string
}

export default function FamilyDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.villageId as string
  const familyId = params.familyId as string
  const { data: familyDetail, isLoading, error } = useGetFamilyDetails(familyId)

  // Delete flow UI state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")
  }, [session, status, router])

  const userType = useMemo(() => session?.user?.role, [session?.user?.role])

  const baseUrl =
    (process.env.NEXT_PUBLIC_API_URL as string | undefined) ||
    (process.env.NEXT_PUBLIC_REQUEST_URL as string | undefined) ||
    ""

  const deleteUrl = baseUrl ? `${baseUrl.replace(/\/+$/, "")}/families/${familyId}` : `/api/families/${familyId}`

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(deleteUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) {
        let message = "Failed to delete the family."
        try {
          const body = await res.json()
          message = body?.message || message
        } catch {
          const text = await res.text()
          if (text) message = text
        }
        throw new Error(message)
      }
      setConfirmOpen(false)
      setSuccessOpen(true)
    } catch (e: any) {
      setConfirmOpen(false)
      setErrorMessage(e?.message || "Something went wrong while deleting.")
      setErrorOpen(true)
    } finally {
      setIsDeleting(false)
    }
  }, [deleteUrl])

  const handleSuccessClose = () => {
    setSuccessOpen(false)
    router.push(`/admin/village/${villageId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700 hindi-text">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-600 font-bold text-lg mb-2">त्रुटि</p>
          <p className="text-gray-700">परिवार विवरण लोड करने में समस्या: {error.message || String(error)}</p>
          <Button className="mt-4" onClick={() => router.back()}>
            वापस जाएं
          </Button>
        </div>
      </div>
    )
  }

  if (!session || !familyDetail) return null

  const handleDownloadReport = () => {
    if (!familyDetail) return
    // Prepare data for Excel
    const familySheet = [
      {
        "परिवार ID": familyDetail.id,
        मुखिया: familyDetail.mukhiyaName,
        पता: familyDetail.currentAddress,
        "आर्थिक स्थिति": familyDetail.economicStatus,
        "पंजीकरण दिनांक": familyDetail.createdAt,
        "कुल सदस्य": familyDetail.Person.length,
      },
    ]
    const membersSheet = familyDetail.Person.map(
      (
        member: {
          fullName: any
          relation: any
          aadhaarNumber: any
          maritalStatus: any
          religion: any
          caste: any
          bloodGroup: any
          educationLevel: any
          occupationType: any
          monthlyIncome: any
          currentAddress: any
        },
        idx: number,
      ) => ({
        क्रम: idx + 1,
        नाम: member.fullName,
        रिश्ता: member.relation || "",
        "आधार नंबर": member.aadhaarNumber || "",
        "वैवाहिक स्थिति": member.maritalStatus || "",
        धर्म: member.religion || "",
        जाति: member.caste || "",
        "रक्त समूह": member.bloodGroup || "",
        "शिक्षा स्तर": member.educationLevel || "",
        रोजगार: member.occupationType || "",
        "मासिक आय": member.monthlyIncome || "",
        पता: member.currentAddress || "",
      }),
    )

    // Create workbook and add sheets
    const wb = XLSX.utils.book_new()
    const wsFamily = XLSX.utils.json_to_sheet(familySheet)
    const wsMembers = XLSX.utils.json_to_sheet(membersSheet)
    XLSX.utils.book_append_sheet(wb, wsFamily, "परिवार")
    XLSX.utils.book_append_sheet(wb, wsMembers, "सदस्य")

    // Export to Excel file
    XLSX.writeFile(wb, `family-report-${familyDetail.id}.xlsx`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <Image
                src="/images/main-logo.png"
                alt="Panchal Samaj Logo"
                width={50}
                height={50}
                className="rounded-full shadow-lg flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-white hindi-text truncate">
                  परिवार विवरण - {familyDetail.mukhiyaName}
                </h1>
                <p className="text-orange-100 text-sm">
                  {familyDetail.familyId} • {familyDetail.Person.length} सदस्य
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {userType === "VILLAGE_MEMBER" && (
                <>
                  <Button
                    onClick={() =>
                      router.push(
                        `/admin/village/${villageId}/family/${familyId}/edit?choklaId=${session.user?.choklaId}`,
                      )
                    }
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    <span className="hindi-text">संपादित करें</span>
                  </Button>

                  <Button
                    onClick={() => setConfirmOpen(true)}
                    variant="destructive"
                    className="bg-red-600/90 hover:bg-red-600 text-white"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span className="hindi-text">हटा रहे हैं...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        <span className="hindi-text">परिवार हटाएं</span>
                      </>
                    )}
                  </Button>
                </>
              )}
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hindi-text">वापस</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Family Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-orange-700 hindi-text">परिवार की जानकारी</CardTitle>
                  <Badge
                    className={
                      familyDetail.verificationStatus === "Verified"
                        ? "bg-green-500"
                        : familyDetail.verificationStatus === "Pending"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }
                  >
                    {familyDetail.verificationStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">परिवार मुखिया</p>
                      <p className="font-semibold">{familyDetail.mukhiyaName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">परिवार ID</p>
                      <p className="font-semibold">{familyDetail.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">कुल सदस्य</p>
                      <p className="font-semibold">{familyDetail.Person.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">पता</p>
                      <p className="font-semibold">{familyDetail.currentAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">पंजीकरण दिनांक</p>
                      <p className="font-semibold">{familyDetail.createdDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">अद्यतन तिथि</p>
                      <p className="font-semibold">{familyDetail.updatedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 hindi-text">आर्थिक स्थिति</p>
                      <p className="font-semibold">{familyDetail.economicStatus}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col space-y-2">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleDownloadReport}>
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hindi-text">परिवार रिपोर्ट डाउनलोड</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Family Members Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="hindi-text">परिवार के सदस्य ({familyDetail.Person?.length})</CardTitle>
                <CardDescription className="hindi-text">सभी सदस्यों की विस्तृत जानकारी</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {familyDetail?.Person?.map((member: FamilyMember, idx: number) => (
                    <Card key={member.id} className="border-gray-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{member.fullName}</h3>
                            {member.isMukhiya && <Badge className="bg-orange-100 text-orange-700">मुखिया</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="personal" className="w-full">
                          <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="personal" className="hindi-text text-xs">
                              व्यक्तिगत
                            </TabsTrigger>
                            <TabsTrigger value="address" className="hindi-text text-xs">
                              पता
                            </TabsTrigger>
                            <TabsTrigger value="education" className="hindi-text text-xs">
                              शिक्षा
                            </TabsTrigger>
                            <TabsTrigger value="employment" className="hindi-text text-xs">
                              रोजगार
                            </TabsTrigger>
                            <TabsTrigger value="health" className="hindi-text text-xs">
                              स्वास्थ्य
                            </TabsTrigger>
                            <TabsTrigger value="digital" className="hindi-text text-xs">
                              डिजिटल
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="personal" className="space-y-4">
                            <InfoCardGrid
                              items={[
                                { label: "नाम", value: member.name },
                                { label: "जन्म तिथि", value: member.dateOfBirth },
                                { label: "आयु", value: member.age },
                                { label: "आधार नंबर", value: member.aadhaarNumber },
                                { label: "वैवाहिक स्थिति", value: member.maritalStatus },
                                { label: "धर्म", value: member.religion },
                                { label: "जाति", value: member.caste },
                                { label: "रक्त समूह", value: member.bloodGroup },
                                {
                                  label: "विकलांगता",
                                  value: member.hasDisability ? `हां - ${member.disabilityType}` : "नहीं",
                                },
                              ]}
                            />
                          </TabsContent>

                          <TabsContent value="address" className="space-y-4">
                            <InfoCardGrid
                              items={[
                                { label: "स्थायी पता", value: member.permanentAddress },
                                { label: "वर्तमान पता", value: member.currentAddress },
                                { label: "गांव", value: member.villageName },
                                { label: "पिन कोड", value: member.pincode },
                                { label: "जिला", value: member.district },
                                { label: "राज्य", value: member.state },
                              ]}
                            />
                          </TabsContent>

                          <TabsContent value="education" className="space-y-4">
                            <InfoCardGrid
                              items={[
                                { label: "छात्र है", value: member.isStudent ? "हां" : "नहीं" },
                                { label: "शिक्षा स्तर", value: member.educationLevel },
                                { label: "नामांकन स्थिति", value: member.enrollmentStatus },
                                { label: "स्कूल/कॉलेज", value: member.schoolName },
                                member?.dropoutReason && { label: "छोड़ने का कारण", value: member.dropoutReason },
                              ]}
                            />
                          </TabsContent>

                          <TabsContent value="employment" className="space-y-4">
                            <InfoCardGrid
                              items={[
                                { label: "रोजगार में है", value: member.isEmployed ? "हां" : "नहीं" },
                                { label: "व्यवसाय", value: member.occupationType },
                                {
                                  label: "मासिक आय",
                                  value: member.monthlyIncome ? `₹${member.monthlyIncome}` : "नहीं दिया गया",
                                },
                                { label: "आय का स्रोत", value: member.incomeSource },
                                { label: "भूमि (एकड़)", value: member.landOwned || "नहीं" },
                                { label: "पशुधन", value: member.livestock || "नहीं" },
                              ]}
                            />
                          </TabsContent>

                          <TabsContent value="health" className="space-y-4">
                            <InfoCardGrid
                              items={[
                                { label: "स्वास्थ्य समस्या", value: member.hasMajorHealthIssues ? "हां" : "नहीं" },
                                member?.chronicDisease && { label: "पुरानी बीमारी", value: member.chronicDisease },
                                { label: "टीकाकरण", value: member.isVaccinated ? "पूरा" : "अधूरा" },
                                { label: "स्वास्थ्य बीमा", value: member.hasHealthInsurance ? "हां" : "नहीं" },
                                {
                                  label: "कल्याण योजनाएं",
                                  value:
                                    Array.isArray(member.welfareSchemes) && member.welfareSchemes.length > 0
                                      ? member.welfareSchemes.join(", ")
                                      : "कोई नहीं",
                                },
                              ]}
                            />
                          </TabsContent>

                          <TabsContent value="digital" className="space-y-4">
                            <InfoCardGrid
                              items={[
                                { label: "स्मार्टफोन", value: member.hasSmartphone ? "हां" : "नहीं" },
                                { label: "इंटरनेट", value: member.hasInternet ? "हां" : "नहीं" },
                                { label: "बैंक खाता", value: member.hasBankAccount ? "हां" : "नहीं" },
                                { label: "जन धन खाता", value: member.hasJanDhanAccount ? "हां" : "नहीं" },
                              ]}
                            />
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Confirm Delete Modal */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              परिवार हटाएं?
            </AlertDialogTitle>
            <AlertDialogDescription>
              क्या आप वाकई इस परिवार को हटाना चाहते हैं? यह क्रिया वापस नहीं की जा सकती।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>रद्द करें</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  हटाया जा रहा है...
                </>
              ) : (
                "पुष्टि करें"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              परिवार सफलतापूर्वक हटाया गया
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleSuccessClose} className="bg-green-600 hover:bg-green-700">
              ठीक है
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              त्रुटि
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-red-700">{errorMessage || "हटाने के दौरान कोई समस्या हुई।"}</div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setErrorOpen(false)}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              बंद करें
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Reusable InfoCardGrid for tab content
function InfoCardGrid({ items }: { items: { label: string; value: string | boolean | undefined }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items
        .filter((item): item is { label: string; value: string | boolean | undefined } => Boolean(item))
        .map(({ label, value }, idx) => (
          <InfoCard
            key={label + idx}
            label={label}
            value={typeof value === "boolean" ? (value ? "हां" : "नहीं") : (value as string) || "नहीं दिया गया"}
          />
        ))}
    </div>
  )
}

// Info Card Component
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-sm font-medium text-gray-600 hindi-text">{label}</p>
      <p className="text-sm text-gray-800 mt-1 break-words">{value || "नहीं दिया गया"}</p>
    </div>
  )
}

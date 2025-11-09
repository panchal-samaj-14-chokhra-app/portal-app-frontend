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
import { useDeleteFamilyUsingID, useVillageDetails, useGetPollsByVillage, useSubmitVote } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { getPollsByVillage } from '@/data-hooks/requests/village-family'
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
import AddFamilyDialog from "@/components/add-family-component/addfamily"
import { useToast } from '@/hooks/use-toast'
import DonutChart, { DEFAULT_COLORS } from '@/components/ui/donut'

export default function VillageDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const villageId = params.villageId as string

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  // State for AddFamilyDialog
  const [addFamilyOpen, setAddFamilyOpen] = useState(false)

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
  const { data: pollsResponse, isLoading: pollsLoading, error: pollsError } = useGetPollsByVillage(villageId)

  const polls = (pollsResponse && (pollsResponse.data || pollsResponse)) || []

  const [viewOpen, setViewOpen] = useState(false)
  const [viewIndex, setViewIndex] = useState(0)
  const [voteSelections, setVoteSelections] = useState<Record<string, string[]>>({})
  const [disabledQuestions, setDisabledQuestions] = useState<Record<string, boolean>>({})
  const [submittedPolls, setSubmittedPolls] = useState<Record<string, boolean>>({})

  const submitVoteMutation = useSubmitVote()


  const initializeFromPoll = (poll: any) => {
    const initialSelections: Record<string, string[]> = {}
    const initialDisabled: Record<string, boolean> = {}

    if (poll && poll.questions) {
      ; (poll.questions || []).forEach((q: any) => {
        if (q.villageVotedOptionId) {
          initialSelections[q.id] = [q.villageVotedOptionId]
          initialDisabled[q.id] = true
        } else if (q.villageVotedOptionIds && Array.isArray(q.villageVotedOptionIds) && q.villageVotedOptionIds.length) {
          initialSelections[q.id] = [...q.villageVotedOptionIds]
          initialDisabled[q.id] = true
        } else if (q.votedByVillage) {
          const votedOpt = (q.options || []).find((o: any) => o.votedByVillage || o.villageVoted)
          if (votedOpt) {
            initialSelections[q.id] = [votedOpt.id]
            initialDisabled[q.id] = true
          } else {
            initialSelections[q.id] = []
            initialDisabled[q.id] = true
          }
        } else {
          initialSelections[q.id] = []
          initialDisabled[q.id] = false
        }
      })
    }

    setVoteSelections(initialSelections)
    setDisabledQuestions(initialDisabled)
    if (poll && poll.id) {
      const anyDisabled = Object.values(initialDisabled).some(Boolean)
      setSubmittedPolls((s) => ({ ...s, [poll.id]: anyDisabled }))
    }
  }

  const openView = (idx: number) => {
    const poll = polls[idx]
    initializeFromPoll(poll)
    setViewIndex(idx)
    setViewOpen(true)
  }

  const prevView = () => {
    if (!polls || polls.length === 0) return
    setViewIndex((i) => {
      const nextIdx = (i - 1 + polls.length) % polls.length
      openView(nextIdx)
      return nextIdx
    })
  }
  const nextView = () => {
    if (!polls || polls.length === 0) return
    setViewIndex((i) => {
      const nextIdx = (i + 1) % polls.length
      openView(nextIdx)
      return nextIdx
    })
  }
  const { mutate: deleteFamily } = useDeleteFamilyUsingID()

  const sessionUserId = (session as any)?.user?.id
  const { toast } = useToast()

  const toggleSelection = (questionId: string, optionId: string, multiple: boolean) => {
    setVoteSelections((s) => {
      const current = s[questionId] ?? []
      if (multiple) {
        // toggle
        const exists = current.includes(optionId)
        return { ...s, [questionId]: exists ? current.filter((o) => o !== optionId) : [...current, optionId] }
      } else {
        return { ...s, [questionId]: [optionId] }
      }
    })
  }

  const handleSubmitVotesForCurrent = async () => {
    const poll = polls[viewIndex]
    if (!poll) return
    if (!sessionUserId) {
      // no user
      toast({ title: 'लॉगिन आवश्यक', description: 'कृपया पहले लॉगिन करें।', variant: 'destructive' })
      return
    }

    const submissions: any[] = []
      ; (poll.questions || []).forEach((q: any) => {
        const selected = voteSelections[q.id] || []
        selected.forEach((optionId) => {
          submissions.push({
            villageId: villageId,
            userId: sessionUserId,
            pollId: poll.id,
            questionId: q.id,
            optionId,
          })
        })
      })

    if (submissions.length === 0) {
      toast({ title: 'चुनाव आवश्यक', description: 'कृपया कम से कम एक विकल्प चुनें', variant: 'destructive' })
      return
    }

    try {
      // submit each vote sequentially (could be parallel)
      await Promise.all(submissions.map((p) => submitVoteMutation.mutateAsync(p)))
      // fetch fresh polls from server for this village so we derive submitted state from server response
      try {
        const fresh: any = await queryClient.fetchQuery({ queryKey: ['polls', villageId], queryFn: () => getPollsByVillage(villageId) })
        const freshPolls: any[] = (fresh && (fresh.data || fresh)) || []
        // reset selections for this poll
        const newSel = { ...voteSelections }
          ; (poll.questions || []).forEach((q: any) => delete newSel[q.id])
        setVoteSelections(newSel)

        const updatedPoll = freshPolls[viewIndex]
        if (updatedPoll) {
          initializeFromPoll(updatedPoll)
        } else if (poll?.id) {
          setSubmittedPolls((s) => ({ ...s, [poll.id]: true }))
        }
      } catch (fetchErr) {
        // fallback: mark as submitted locally
        if (poll?.id) setSubmittedPolls((s) => ({ ...s, [poll.id]: true }))
      }

      toast({ title: 'वोट सफल', description: 'वोट सफलतापूर्वक सबमिट किया गया।', variant: 'success' })
      // close the poll view dialog after successful submission
      setViewOpen(false)
    } catch (e) {
      console.error(e)
      toast({ title: 'त्रुटि', description: 'वोट सबमिट करने में त्रुटि', variant: 'destructive' })
    }
  }

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
    setAddFamilyOpen(true)
    // router.push(`/admin/village/${villageId}/add-family?chakolaId=${chokhlaID}`)
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
                <Button onClick={() => router.back()} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
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

                            {
                              userType === "VILLAGE_MEMBER" && (<Button
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
                              </Button>)
                            }

                            {userType === "VILLAGE_MEMBER" && (
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
                              </Button>)
                            }


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
              <div></div>
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
                  <strong>चोखरा:</strong> {villageData?.chakolaName}
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
                  <strong>चोखरा ID:</strong> {villageData?.choklaId}
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
                  src={`https://maps.google.com/maps?q=${villageData.latitude},${villageData.longitude}&z=14&output=embed`}
                />

              ) : (
                <p>स्थान उपलब्ध नहीं है (Location not available)</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Polls Quick Action */}
        <div className="mt-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">Polls</CardTitle>
              <CardDescription>सत्यापित पोल्स देखें</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">कुल पोल्स: {polls?.length || 0}</div>
                <div>
                  <Button onClick={() => openView(0)} className="bg-orange-500 hover:bg-orange-600 text-white">View Polls / पोल देखें</Button>
                </div>
              </div>
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

      {/* Add Family Form Modal */}
      <AddFamilyDialog
        isOpen={addFamilyOpen}
        onClose={() => setAddFamilyOpen(false)}
        onSubmit={async (formData: any) => {
          // noop submit handler for AddFamilyDialog usage on this page
          return Promise.resolve()
        }}
        chakolaId={chokhlaID}
        villageId={villageId}
      />
      {/* Polls View Dialog (carousel) */}
      <Dialog open={viewOpen} onOpenChange={(open) => {
        setViewOpen(open)
        if (!open) {
          // clear selections/disabled state when dialog closes
          setVoteSelections({})
          setDisabledQuestions({})
        } else {
          // if opening and a poll is currently selected, re-init from that poll
          if (typeof viewIndex === 'number' && polls && polls[viewIndex]) {
            openView(viewIndex)
          }
        }
      }}>
        <DialogContent className="w-full sm:w-[95vw] sm:max-w-5xl h-[100vh] sm:h-auto sm:max-h-[90vh] p-4 sm:p-6 rounded-none sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Polls</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-4">
            <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-4 sm:gap-2 border-b sm:border-0 pb-4 sm:pb-0">
              <Button variant="ghost" size="sm" onClick={prevView} aria-label="Previous poll" className="w-20">Prev</Button>
              <div className="text-sm text-gray-500">{viewIndex + 1} / {polls?.length || 0}</div>
              <Button variant="ghost" size="sm" onClick={nextView} aria-label="Next poll" className="w-20">Next</Button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-12rem)] sm:max-h-[70vh] w-full">
              {polls.length === 0 ? (
                <div className="text-center text-sm text-gray-600">No polls available</div>
              ) : (
                (() => {
                  const poll = polls[viewIndex]
                  return (
                    <div>
                      <h3 className="text-lg font-semibold">{poll.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{poll.description}</p>
                      <div className="text-xs text-gray-500 mb-3">Created: {poll.createdAt ? new Date(poll.createdAt).toLocaleDateString('hi-IN') : '-'}</div>
                      <div className="space-y-4">
                        {(poll.questions || []).map((q: any) => {
                          // build vote counts
                          const options = (q.options || []).map((o: any, i: number) => {
                            const count = o.votesCount ?? o.votes ?? o.count ?? 0
                            return { id: o.id, optionText: o.optionText, count, color: undefined }
                          })
                          const total = options.reduce((s: number, it: any) => s + (it.count || 0), 0)
                          const top = options.reduce((best: any, it: any) => (it.count > (best.count || 0) ? it : best), options[0] || { count: 0 })

                          const donutData = options.map((it: any, i: number) => ({ label: it.optionText, value: it.count, color: undefined }))

                          return (
                            <div key={q.id} className="p-3 border rounded-md">
                              <div className="flex flex-col md:flex-row items-start gap-4">
                                <div className="flex-1 w-full">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                                    <div className="font-medium">{q.questionText}</div>
                                    {disabledQuestions[q.id] && (
                                      <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded whitespace-nowrap">वोट पहले से दिया गया</div>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    {(q.options || []).map((o: any) => {
                                      const multiple = q.questionType === 'MULTIPLE_CHOICE'
                                      const checked = (voteSelections[q.id] || []).includes(o.id)
                                      const optionDisabled = Boolean(disabledQuestions[q.id] || o.votedByVillage || o.villageVoted)
                                      const isChosen = checked || o.votedByVillage || o.villageVoted
                                      const count = o.votesCount ?? o.votes ?? o.count ?? 0

                                      return (
                                        <label
                                          key={o.id}
                                          className={`flex items-center gap-3 w-full p-2 rounded ${isChosen ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-50'}`}
                                        >
                                          <input
                                            type={multiple ? 'checkbox' : 'radio'}
                                            name={`view-q-${q.id}`}
                                            checked={checked}
                                            onChange={() => toggleSelection(q.id, o.id, multiple)}
                                            className="w-4 h-4"
                                            disabled={optionDisabled}
                                          />
                                          <span title={o.optionText} className={`text-sm flex-1 ${isChosen ? 'font-semibold text-green-700' : optionDisabled ? 'text-gray-400' : ''}`}>{o.optionText}</span>
                                          <span className="text-xs text-gray-500">{count} वोट</span>
                                          {isChosen && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                        </label>
                                      )
                                    })}
                                  </div>
                                </div>
                                <div className="w-full md:w-48 flex-shrink-0 flex flex-col items-center border-t md:border-t-0 pt-4 md:pt-0">
                                  <DonutChart data={donutData} size={120} strokeWidth={14} showCenterPercent />
                                  <div className="mt-2 text-xs text-gray-600 text-center">Top: {top?.optionText ? String(top.optionText).slice(0, 18) : '—'}</div>
                                  <div className="text-xs text-gray-500">Total: {total}</div>
                                  <div className="mt-2 w-full max-w-[240px]">
                                    {options.map((it: any, i: number) => {
                                      const pct = total ? Math.round((it.count / total) * 100) : 0
                                      const color = DEFAULT_COLORS[i % DEFAULT_COLORS.length]
                                      return (
                                        <div key={it.id} className="flex items-center justify-between text-xs text-gray-600 py-0.5">
                                          <div className="flex items-center gap-2">
                                            <span style={{ background: color }} className="w-3 h-3 rounded-full inline-block" />
                                            <span title={String(it.optionText)} className="truncate max-w-[120px]">{String(it.optionText).slice(0, 24)}</span>
                                          </div>
                                          <div className="ml-2 text-gray-500">{pct}%</div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        <div className="sticky bottom-0 left-0 right-0 mt-4 flex justify-end bg-white border-t p-4 sm:p-0 sm:border-0">
                          <Button
                            onClick={handleSubmitVotesForCurrent}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                            disabled={Boolean((submitVoteMutation as any).isLoading || (polls[viewIndex] && submittedPolls[polls[viewIndex].id]))}
                          >
                            {(submitVoteMutation as any).isLoading ? 'सबमिट कर रहे हैं...' : 'वोट सबमिट करें'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })()
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  )
}

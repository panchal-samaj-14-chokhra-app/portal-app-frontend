"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { LogOut, Plus, Building2, Users, MapPin, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { AddChokhlaForm } from "@/components/forms/add-chokhla-form"
import { ChokhlaSuccessModal } from "@/components/modals/chokhla-success-modal"
import { useCreateChokhla, useGetAllChokhlas } from "@/data-hooks/mutation-query/useQueryAndMutation"

// Loading skeleton component
function SuperAdminSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header Skeleton */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-11 h-11 rounded-full" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function SuperAdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [isAddChokhlaOpen, setIsAddChokhlaOpen] = useState(false)
  const [successData, setSuccessData] = useState<any>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Data fetching
  const {
    data: chokhlas,
    isLoading: chokhlaLoading,
    error: chokhlaError,
    refetch: refetchChokhlas,
    isFetching: chokhlasRefetching,
  } = useGetAllChokhlas()

  // Create chokhla mutation
  const { mutate: createChokhla, isPending: isCreatingChokhla } = useCreateChokhla(
    // Success callback
    (response) => {
      console.log("Chokhla created successfully:", response)

      toast({
        title: "सफलता!",
        description: "चौकला सफलतापूर्वक बनाया गया है।",
        variant: "default",
      })

      setSuccessData(response)
      setShowSuccessModal(true)
      setIsAddChokhlaOpen(false)

      // Refetch chokhlas to show updated list
      refetchChokhlas()
    },
    // Error callback
    (error: any) => {
      console.error("Create chokhla error:", error)

      const message = error?.response?.data?.message || error?.message || "चौकला बनाने में त्रुटि हुई है।"

      toast({
        title: "त्रुटि!",
        description: message,
        variant: "destructive",
      })
    },
  )

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  const handleRefresh = () => {
    refetchChokhlas()
    toast({
      title: "डेटा रिफ्रेश किया गया",
      description: "चौकलों की जानकारी अपडेट की गई है।",
    })
  }

  const handleAddChokhla = (formData: any) => {
    createChokhla(formData)
  }

  // Show loading skeleton while session is loading
  if (status === "loading" || chokhlaLoading) {
    return <SuperAdminSkeleton />
  }

  // Redirect if not authenticated or not super admin
  if (status === "unauthenticated" || session?.user?.role !== "SUPER_ADMIN") {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/main-logo.png"
              alt="Panchal Samaj Logo"
              width={44}
              height={44}
              className="rounded-full shadow-lg"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">पंचाल समाज 14 चोखरा</h1>
              <p className="text-orange-100 text-sm">सुपर एडमिन पैनल</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            लॉगआउट
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">कुल चौकले</CardTitle>
              <Building2 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{chokhlas?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">कुल गांव</CardTitle>
              <MapPin className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {chokhlas?.reduce((total: number, chokhla: any) => total + (chokhla.villages?.length || 0), 0) || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">कुल परिवार</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">0</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">कुल सदस्य</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Chokhlas List */}
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-orange-800">चौकलों की सूची</CardTitle>
              {chokhlasRefetching && <Loader2 className="w-4 h-4 animate-spin text-orange-500" />}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={chokhlasRefetching}
                className="text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${chokhlasRefetching ? "animate-spin" : ""}`} />
                रिफ्रेश
              </Button>

              <Dialog open={isAddChokhlaOpen} onOpenChange={setIsAddChokhlaOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    नया चौकला जोड़ें
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-orange-700 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      नया चौकला जोड़ें
                    </DialogTitle>
                  </DialogHeader>
                  <AddChokhlaForm onSubmit={handleAddChokhla} isLoading={isCreatingChokhla} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            {/* Error State */}
            {chokhlaError && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-700 mb-2">डेटा लोड करने में त्रुटि</h3>
                  <p className="text-red-600 mb-4">{chokhlaError?.message || "चौकलों की जानकारी लोड नहीं हो सकी"}</p>
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                    disabled={chokhlasRefetching}
                  >
                    {chokhlasRefetching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        लोड हो रहा है...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        पुनः प्रयास करें
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Chokhlas Table */}
            {!chokhlaError && (
              <div className="overflow-x-auto">
                <div className="rounded-lg shadow overflow-hidden border border-orange-200 bg-white">
                  <table className="w-full min-w-[800px] divide-y divide-orange-200">
                    <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          चौकला का नाम
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          अध्यक्ष
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          संपर्क नंबर
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          राज्य
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          जिला
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          गांव
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          निर्माण तिथि
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                          कार्रवाई
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-orange-100">
                      {chokhlas && chokhlas.length > 0 ? (
                        chokhlas.map((chokhla: any, idx: number) => (
                          <tr
                            key={chokhla.id}
                            className={
                              idx % 2 === 0
                                ? "bg-orange-50 hover:bg-orange-100 transition-colors"
                                : "bg-white hover:bg-orange-50 transition-colors"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-orange-900">{chokhla.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-orange-800">{chokhla.adhyaksh}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-orange-800">{chokhla.contactNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-orange-800">{chokhla.state}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-orange-800">{chokhla.district}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-orange-800">{chokhla.villageName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-orange-800">
                              {chokhla.createdDate ? new Date(chokhla.createdDate).toLocaleDateString("hi-IN") : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button
                                variant="outline"
                                className="border-orange-400 text-orange-600 hover:bg-orange-100 hover:text-orange-800 transition-colors bg-transparent"
                                onClick={() => router.push(`/admin/chokhla/${chokhla.id}`)}
                              >
                                देखें
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <Building2 className="w-12 h-12 text-gray-400 mb-4" />
                              <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई चौकला नहीं मिला</h3>
                              <p className="text-gray-500 mb-4">अभी तक कोई चौकला नहीं बनाया गया है।</p>
                              <Button
                                onClick={() => setIsAddChokhlaOpen(true)}
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                पहला चौकला जोड़ें
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Success Modal */}
      <ChokhlaSuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} successData={successData} />
    </div>
  )
}

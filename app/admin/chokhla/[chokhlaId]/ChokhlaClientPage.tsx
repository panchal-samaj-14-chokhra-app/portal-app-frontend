"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useChokhlaDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"

// Loading skeleton component
export function ChokhlaPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header Skeleton */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded" />
            <Skeleton className="h-6 w-48" />
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

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

interface ChokhlaClientPageProps {
  chokhlaId: string
}

export default function ChokhlaClientPage({ chokhlaId }: ChokhlaClientPageProps) {
  const router = useRouter()
  const { toast } = useToast()

  const { data: chokhlaData, isLoading, error, refetch, isFetching } = useChokhlaDetails(chokhlaId)

  const handleBack = () => {
    router.push("/admin/superadmin")
  }

  const handleRefresh = () => {
    refetch()
    toast({
      title: "डेटा रिफ्रेश किया गया",
      description: "चौकला की जानकारी अपडेट की गई है।",
    })
  }

  if (isLoading) {
    return <ChokhlaPageSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस
              </Button>
              <h1 className="text-xl md:text-2xl font-bold text-white">चौकला विवरण</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">डेटा लोड करने में त्रुटि</h2>
              <p className="text-red-600 mb-6">{error?.message || "चौकला की जानकारी लोड नहीं हो सकी"}</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleRefresh}
                  disabled={isFetching}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isFetching ? (
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
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  वापस जाएं
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              वापस
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{chokhlaData?.name || "चौकला विवरण"}</h1>
              <p className="text-orange-100 text-sm">चौकला प्रबंधन पैनल</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isFetching}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {isFetching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            रिफ्रेश
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">कुल गांव</CardTitle>
              <MapPin className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{chokhlaData?.villages?.length || 0}</div>
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

          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">स्थिति</CardTitle>
              <Building2 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="bg-green-100 text-green-800">
                सक्रिय
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chokhla Details */}
          <div className="lg:col-span-2">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  चौकला की जानकारी
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">चौकला का नाम</label>
                    <p className="text-orange-900 font-semibold">{chokhlaData?.name || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">अध्यक्ष</label>
                    <p className="text-orange-900">{chokhlaData?.adhyaksh || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">संपर्क नंबर</label>
                    <p className="text-orange-900 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {chokhlaData?.contactNumber || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">राज्य</label>
                    <p className="text-orange-900">{chokhlaData?.state || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">जिला</label>
                    <p className="text-orange-900">{chokhlaData?.district || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">गांव</label>
                    <p className="text-orange-900">{chokhlaData?.villageName || "-"}</p>
                  </div>
                </div>

                {chokhlaData?.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">पता</label>
                    <p className="text-orange-900">{chokhlaData.address}</p>
                  </div>
                )}

                {chokhlaData?.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">विवरण</label>
                    <p className="text-orange-900">{chokhlaData.description}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">निर्माण तिथि</label>
                  <p className="text-orange-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {chokhlaData?.createdDate ? new Date(chokhlaData.createdDate).toLocaleDateString("hi-IN") : "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-orange-800">त्वरित कार्रवाई</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Users className="w-4 h-4 mr-2" />
                  गांव देखें
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  चौकला संपादित करें
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  रिपोर्ट जेनरेट करें
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-orange-800">हाल की गतिविधि</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm text-center py-4">कोई हाल की गतिविधि नहीं मिली</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

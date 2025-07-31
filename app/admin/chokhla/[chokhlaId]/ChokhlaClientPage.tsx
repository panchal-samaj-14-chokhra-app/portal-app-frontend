"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useChokhlaDetails } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Users, MapPin, Phone, ArrowLeft } from "lucide-react"

export function ChokhlaPageSkeleton() {
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
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Title Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

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
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
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
          </div>

          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: chokhla, isLoading, error } = useChokhlaDetails(chokhlaId)

  // Show loading skeleton
  if (status === "loading" || isLoading) {
    return <ChokhlaPageSkeleton />
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <p className="text-red-600 mb-4">चौकला की जानकारी लोड नहीं हो सकी</p>
              <Button onClick={() => router.back()}>वापस जाएं</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              वापस
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{chokhla?.name}</h1>
              <p className="text-orange-100 text-sm">चौकला विवरण</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Chokhla Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <label className="text-sm font-medium text-orange-700">चौकला का नाम</label>
                  <p className="text-orange-900 font-semibold">{chokhla?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-orange-700">अध्यक्ष</label>
                  <p className="text-orange-900">{chokhla?.adhyaksh}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-orange-700">संपर्क नंबर</label>
                  <p className="text-orange-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {chokhla?.contactNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-orange-700">राज्य</label>
                  <p className="text-orange-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {chokhla?.state}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-orange-700">जिला</label>
                  <p className="text-orange-900">{chokhla?.district}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-orange-700">गांव</label>
                  <p className="text-orange-900">{chokhla?.villageName}</p>
                </div>
              </div>
              {chokhla?.address && (
                <div>
                  <label className="text-sm font-medium text-orange-700">पूरा पता</label>
                  <p className="text-orange-900">{chokhla.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="border-orange-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                आंकड़े
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{chokhla?.villages?.length || 0}</div>
                  <div className="text-sm text-orange-700">कुल गांव</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-orange-700">कुल परिवार</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-orange-700">कुल सदस्य</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-orange-700">सक्रिय यूज़र</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Villages List */}
        {chokhla?.villages && chokhla.villages.length > 0 && (
          <Card className="mt-8 border-orange-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-orange-800">गांवों की सूची</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chokhla.villages.map((village: any) => (
                  <div
                    key={village.id}
                    className="border border-orange-200 rounded-lg p-4 hover:bg-orange-50 transition-colors"
                  >
                    <h4 className="font-semibold text-orange-900">{village.name}</h4>
                    <p className="text-sm text-orange-700">{village.district}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-orange-300 text-orange-600 hover:bg-orange-100 bg-transparent"
                      onClick={() => router.push(`/admin/village/${village.id}`)}
                    >
                      विवरण देखें
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

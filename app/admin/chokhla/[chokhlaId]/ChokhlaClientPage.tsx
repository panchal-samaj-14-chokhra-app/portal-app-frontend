"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useChokhlaById, useVillagesByChokhla } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { MapPin, Users, Building, Phone, Mail, Calendar } from "lucide-react"

interface ChokhlaClientPageProps {
  chokhlaId: string
}

export function ChokhlaPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ChokhlaClientPage({ chokhlaId }: ChokhlaClientPageProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const { data: chokhla, isLoading: chokhlaLoading, error: chokhlaError } = useChokhlaById(chokhlaId)

  const { data: villages, isLoading: villagesLoading } = useVillagesByChokhla(chokhlaId)

  if (chokhlaLoading) {
    return <ChokhlaPageSkeleton />
  }

  if (chokhlaError || !chokhla) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">चौकला लोड नहीं हो सका</h2>
            <p className="text-red-600">कृपया बाद में पुनः प्रयास करें या व्यवस्थापक से संपर्क करें।</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalVillages = villages?.length || 0
  const totalPopulation = villages?.reduce((sum, village) => sum + village.population, 0) || 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{chokhla.name}</h1>
          <p className="text-gray-600 mt-1">चौकला प्रबंधन डैशबोर्ड</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          ID: {chokhla.id}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">कुल गांव</p>
                <p className="text-2xl font-bold text-gray-900">{totalVillages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">कुल जनसंख्या</p>
                <p className="text-2xl font-bold text-gray-900">{totalPopulation.toLocaleString("hi-IN")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">स्थापना</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(chokhla.createdAt).toLocaleDateString("hi-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">अवलोकन</TabsTrigger>
          <TabsTrigger value="villages">गांव</TabsTrigger>
          <TabsTrigger value="settings">सेटिंग्स</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>चौकला विवरण</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">ईमेल</p>
                      <p className="font-medium">{chokhla.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">फोन</p>
                      <p className="font-medium">{chokhla.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {chokhla.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">पता</p>
                        <p className="font-medium">{chokhla.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">अंतिम अपडेट</p>
                      <p className="font-medium">{new Date(chokhla.updatedAt).toLocaleDateString("hi-IN")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="villages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>गांव की सूची</CardTitle>
            </CardHeader>
            <CardContent>
              {villagesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : villages && villages.length > 0 ? (
                <div className="space-y-4">
                  {villages.map((village) => (
                    <div
                      key={village.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h3 className="font-semibold">{village.name}</h3>
                        <p className="text-sm text-gray-600">जनसंख्या: {village.population.toLocaleString("hi-IN")}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        विवरण देखें
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">कोई गांव नहीं मिला</p>
                  <Button className="mt-4">नया गांव जोड़ें</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>चौकला सेटिंग्स</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  प्रोफाइल संपादित करें
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  पासवर्ड बदलें
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  सूचना सेटिंग्स
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  चौकला हटाएं
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

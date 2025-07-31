"use client"

import { useChokhlaById } from "@/data-hooks/mutation-query/useQueryAndMutation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, MapPin, Calendar, Phone, Mail } from "lucide-react"

interface ChokhlaClientPageProps {
  chokhlaId: string
}

export function ChokhlaPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded" />
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ChokhlaClientPage({ chokhlaId }: ChokhlaClientPageProps) {
  const { data: chokhla, isLoading, error } = useChokhlaById(chokhlaId)

  if (isLoading) {
    return <ChokhlaPageSkeleton />
  }

  if (error || !chokhla) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">चौकला नहीं मिला</h2>
            <p className="text-gray-600">यह चौकला उपलब्ध नहीं है या हटा दिया गया है।</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{chokhla.name}</h1>
          <p className="text-gray-600">चौकला ID: {chokhla.id}</p>
        </div>
        <Badge variant={chokhla.status === "active" ? "default" : "secondary"}>
          {chokhla.status === "active" ? "सक्रिय" : "निष्क्रिय"}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">गांव</p>
                <p className="text-2xl font-bold">{chokhla.villageCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">परिवार</p>
                <p className="text-2xl font-bold">{chokhla.familyCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">बनाया गया</p>
                <p className="text-sm font-bold">{new Date(chokhla.createdAt).toLocaleDateString("hi-IN")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">स्थिति</p>
                <p className="text-sm font-bold">{chokhla.status === "active" ? "सक्रिय" : "निष्क्रिय"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>एडमिन विवरण</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">नाम:</span>
              <span>{chokhla.adminName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                ईमेल:
              </span>
              <span>{chokhla.adminEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                फोन:
              </span>
              <span>{chokhla.adminPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">स्थिति:</span>
              <Badge variant={chokhla.status === "active" ? "default" : "secondary"}>
                {chokhla.status === "active" ? "सक्रिय" : "निष्क्रिय"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>गतिविधि सारांश</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>गतिविधि डेटा लोड हो रहा है...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

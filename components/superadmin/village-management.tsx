"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Users, Home, Zap, Droplets, GraduationCap, Heart, RouteIcon as Road } from "lucide-react"
import type { Village } from "./types"

interface VillageManagementProps {
  isLoading?: boolean
}

export function VillageManagement({ isLoading = false }: VillageManagementProps) {
  const [villages, setVillages] = useState<Village[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockVillages: Village[] = [
          {
            id: "1",
            name: "रामपुर",
            state: "गुजरात",
            district: "अहमदाबाद",
            pincode: "380001",
            totalFamilies: 45,
            totalMembers: 180,
            hasElectricity: true,
            hasWaterSupply: true,
            hasSchool: true,
            hasHealthCenter: false,
            hasRoadAccess: true,
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15",
          },
          {
            id: "2",
            name: "श्यामपुर",
            state: "राजस्थान",
            district: "जयपुर",
            pincode: "302001",
            totalFamilies: 32,
            totalMembers: 128,
            hasElectricity: true,
            hasWaterSupply: false,
            hasSchool: false,
            hasHealthCenter: true,
            hasRoadAccess: true,
            createdAt: "2024-01-20",
            updatedAt: "2024-01-20",
          },
        ]

        setVillages(mockVillages)
      } catch (error) {
        console.error("Error fetching villages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVillages()
  }, [])

  const getFacilityIcon = (facility: string, hasIt: boolean) => {
    const iconClass = `w-4 h-4 ${hasIt ? "text-green-600" : "text-gray-400"}`

    switch (facility) {
      case "electricity":
        return <Zap className={iconClass} />
      case "water":
        return <Droplets className={iconClass} />
      case "school":
        return <GraduationCap className={iconClass} />
      case "health":
        return <Heart className={iconClass} />
      case "road":
        return <Road className={iconClass} />
      default:
        return null
    }
  }

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Skeleton key={j} className="h-6 w-6 rounded" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">गांव प्रबंधन</h2>
          <p className="text-gray-600">सभी पंजीकृत गांवों की जानकारी</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          कुल गांव: {villages.length}
        </Badge>
      </div>

      {villages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोई गांव पंजीकृत नहीं</h3>
            <p className="text-gray-500 text-center">अभी तक कोई गांव पंजीकृत नहीं किया गया है।</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {villages.map((village) => (
            <Card key={village.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <MapPin className="w-5 h-5" />
                  {village.name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {village.district}, {village.state} - {village.pincode}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{village.totalFamilies}</p>
                      <p className="text-xs text-gray-500">परिवार</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">{village.totalMembers}</p>
                      <p className="text-xs text-gray-500">सदस्य</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">उपलब्ध सुविधाएं:</p>
                  <div className="flex gap-3">
                    {getFacilityIcon("electricity", village.hasElectricity)}
                    {getFacilityIcon("water", village.hasWaterSupply)}
                    {getFacilityIcon("school", village.hasSchool)}
                    {getFacilityIcon("health", village.hasHealthCenter)}
                    {getFacilityIcon("road", village.hasRoadAccess)}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    पंजीकृत: {new Date(village.createdAt).toLocaleDateString("hi-IN")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

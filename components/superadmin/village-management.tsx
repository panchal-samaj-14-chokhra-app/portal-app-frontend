"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Users, Zap, Droplets, GraduationCap, Heart, Plus } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

export function VillageManagement() {
  const { villages, isLoadingVillages, fetchVillages } = useSuperAdmin()

  if (isLoadingVillages) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">गांव प्रबंधन</h1>
          <p className="text-gray-600 mt-1">सभी गांवों की जानकारी और प्रबंधन</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          नया गांव जोड़ें
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {villages.map((village) => (
          <Card
            key={village.id}
            className="bg-white/70 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    {village.name}
                  </CardTitle>
                  <CardDescription>
                    {village.district}, {village.state}
                  </CardDescription>
                </div>
                <Badge variant={village.isActive ? "default" : "secondary"}>
                  {village.isActive ? "सक्रिय" : "निष्क्रिय"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    परिवार:
                  </span>
                  <span className="font-medium">{village.familyCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>जनसंख्या:</span>
                  <span className="font-medium">{village.populationCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>पिनकोड:</span>
                  <span className="font-medium">{village.pincode}</span>
                </div>

                <div className="pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">सुविधाएं:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <Zap className={`w-3 h-3 ${village.hasElectricity ? "text-green-500" : "text-gray-400"}`} />
                      <span className={village.hasElectricity ? "text-green-700" : "text-gray-500"}>बिजली</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Droplets className={`w-3 h-3 ${village.hasWaterSupply ? "text-blue-500" : "text-gray-400"}`} />
                      <span className={village.hasWaterSupply ? "text-blue-700" : "text-gray-500"}>पानी</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <GraduationCap className={`w-3 h-3 ${village.hasSchool ? "text-purple-500" : "text-gray-400"}`} />
                      <span className={village.hasSchool ? "text-purple-700" : "text-gray-500"}>स्कूल</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Heart className={`w-3 h-3 ${village.hasHealthCenter ? "text-red-500" : "text-gray-400"}`} />
                      <span className={village.hasHealthCenter ? "text-red-700" : "text-gray-500"}>स्वास्थ्य</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {villages.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोई गांव नहीं मिला</h3>
            <p className="text-gray-500 text-center mb-4">अभी तक कोई गांव पंजीकृत नहीं है।</p>
            <Button onClick={fetchVillages}>
              <Plus className="w-4 h-4 mr-2" />
              पहला गांव जोड़ें
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

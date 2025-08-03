"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Users, Zap, Droplets, GraduationCap, Heart, Car, Search, Filter, RefreshCw, Eye } from "lucide-react"
import type { Village } from "./types"

interface VillageManagementProps {
  villages: Village[]
  isLoading: boolean
  onRefresh: () => void
}

export function VillageManagement({ villages, isLoading, onRefresh }: VillageManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [facilityFilter, setFacilityFilter] = useState<string>("all")

  const filteredVillages = villages.filter((village) => {
    const matchesSearch =
      village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.district.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesState = stateFilter === "all" || village.state === stateFilter

    const matchesFacility =
      facilityFilter === "all" ||
      (facilityFilter === "electricity" && village.hasElectricity) ||
      (facilityFilter === "water" && village.hasWaterSupply) ||
      (facilityFilter === "school" && village.hasSchool) ||
      (facilityFilter === "health" && village.hasHealthCenter) ||
      (facilityFilter === "road" && village.hasRoadAccess)

    return matchesSearch && matchesState && matchesFacility
  })

  const getFacilityIcon = (facility: string, hasIt: boolean) => {
    const iconClass = hasIt ? "w-4 h-4 text-green-600" : "w-4 h-4 text-gray-400"

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
        return <Car className={iconClass} />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex space-x-2">
                    {Array.from({ length: 5 }).map((_, j) => (
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">गांव प्रबंधन</h2>
          <p className="text-gray-600">कुल {villages.length} गांव पंजीकृत हैं</p>
        </div>
        <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2 bg-transparent">
          <RefreshCw className="w-4 h-4" />
          रीफ्रेश करें
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="गांव या जिले का नाम खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="राज्य चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी राज्य</SelectItem>
                <SelectItem value="गुजरात">गुजरात</SelectItem>
                <SelectItem value="राजस्थान">राजस्थान</SelectItem>
              </SelectContent>
            </Select>
            <Select value={facilityFilter} onValueChange={setFacilityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="सुविधा फिल्टर" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी सुविधाएं</SelectItem>
                <SelectItem value="electricity">बिजली</SelectItem>
                <SelectItem value="water">पानी</SelectItem>
                <SelectItem value="school">स्कूल</SelectItem>
                <SelectItem value="health">स्वास्थ्य केंद्र</SelectItem>
                <SelectItem value="road">सड़क</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Villages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVillages.map((village) => (
          <Card key={village.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    {village.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {village.district}, {village.state}
                  </p>
                  <p className="text-xs text-gray-500">पिन: {village.pincode}</p>
                </div>
                <Badge variant={village.isActive ? "default" : "secondary"}>
                  {village.isActive ? "सक्रिय" : "निष्क्रिय"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Population Stats */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">परिवार</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{village.familyCount}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">जनसंख्या</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{village.populationCount}</p>
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">उपलब्ध सुविधाएं:</h4>
                <div className="flex justify-between items-center p-2 bg-white border rounded-lg">
                  <div className="flex items-center gap-1">
                    {getFacilityIcon("electricity", village.hasElectricity)}
                    <span className="text-xs">बिजली</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getFacilityIcon("water", village.hasWaterSupply)}
                    <span className="text-xs">पानी</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getFacilityIcon("school", village.hasSchool)}
                    <span className="text-xs">स्कूल</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getFacilityIcon("health", village.hasHealthCenter)}
                    <span className="text-xs">स्वास्थ्य</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getFacilityIcon("road", village.hasRoadAccess)}
                    <span className="text-xs">सड़क</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                विवरण देखें
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredVillages.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोई गांव नहीं मिला</h3>
            <p className="text-gray-500 text-center">
              {searchTerm || stateFilter !== "all" || facilityFilter !== "all"
                ? "फिल्टर बदलकर दोबारा कोशिश करें"
                : "अभी तक कोई गांव पंजीकृत नहीं है"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

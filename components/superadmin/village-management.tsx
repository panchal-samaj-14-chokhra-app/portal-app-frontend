"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Zap,
  Droplets,
  GraduationCap,
  Heart,
  RouteIcon as Road,
  Plus,
} from "lucide-react"
import type { Village } from "./types"
import { STATES_DISTRICTS } from "./constants"

interface VillageManagementProps {
  villages: Village[]
  isLoading: boolean
  onRefresh: () => void
}

export function VillageManagement({ villages, isLoading, onRefresh }: VillageManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState<string>("all")
  const [facilityFilter, setFacilityFilter] = useState<string>("all")

  const filteredVillages = villages.filter((village) => {
    const matchesSearch =
      village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.district.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = selectedState === "all" || village.state === selectedState
    const matchesFacility =
      facilityFilter === "all" ||
      (facilityFilter === "electricity" && village.hasElectricity) ||
      (facilityFilter === "water" && village.hasWaterSupply) ||
      (facilityFilter === "school" && village.hasSchool) ||
      (facilityFilter === "health" && village.hasHealthCenter) ||
      (facilityFilter === "road" && village.hasRoadAccess)

    return matchesSearch && matchesState && matchesFacility
  })

  const getFacilityCount = (villages: Village[], facility: keyof Village) => {
    return villages.filter((village) => village[facility] === true).length
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
                  <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-6 w-16" />
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">गांव प्रबंधन</h2>
          <p className="text-gray-600">कुल {villages.length} गांव पंजीकृत हैं</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <Search className="w-4 h-4 mr-2" />
            रिफ्रेश करें
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            नया गांव जोड़ें
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="गांव या जिला खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="राज्य चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी राज्य</SelectItem>
                {Object.keys(STATES_DISTRICTS).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={facilityFilter} onValueChange={setFacilityFilter}>
              <SelectTrigger>
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
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{filteredVillages.length} परिणाम</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{getFacilityCount(villages, "hasElectricity")}</div>
            <div className="text-sm text-gray-600">बिजली</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{getFacilityCount(villages, "hasWaterSupply")}</div>
            <div className="text-sm text-gray-600">पानी</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{getFacilityCount(villages, "hasSchool")}</div>
            <div className="text-sm text-gray-600">स्कूल</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{getFacilityCount(villages, "hasHealthCenter")}</div>
            <div className="text-sm text-gray-600">स्वास्थ्य</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Road className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{getFacilityCount(villages, "hasRoadAccess")}</div>
            <div className="text-sm text-gray-600">सड़क</div>
          </CardContent>
        </Card>
      </div>

      {/* Villages Grid */}
      {filteredVillages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोई गांव नहीं मिला</h3>
            <p className="text-gray-500 text-center">
              {searchTerm || selectedState !== "all" || facilityFilter !== "all"
                ? "फिल्टर बदलकर दोबारा कोशिश करें"
                : "अभी तक कोई गांव पंजीकृत नहीं है"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVillages.map((village) => (
            <Card key={village.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {village.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {village.district}, {village.state}
                    </p>
                    <p className="text-xs text-gray-500">पिनकोड: {village.pincode}</p>
                  </div>
                  <Badge variant={village.isActive ? "default" : "secondary"}>
                    {village.isActive ? "सक्रिय" : "निष्क्रिय"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Population Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-800">{village.familyCount}</div>
                    <div className="text-xs text-blue-600">परिवार</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-800">{village.populationCount}</div>
                    <div className="text-xs text-green-600">जनसंख्या</div>
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">उपलब्ध सुविधाएं:</h4>
                  <div className="flex flex-wrap gap-2">
                    {village.hasElectricity && (
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
                        <Zap className="w-3 h-3 mr-1" />
                        बिजली
                      </Badge>
                    )}
                    {village.hasWaterSupply && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                        <Droplets className="w-3 h-3 mr-1" />
                        पानी
                      </Badge>
                    )}
                    {village.hasSchool && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        स्कूल
                      </Badge>
                    )}
                    {village.hasHealthCenter && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-300">
                        <Heart className="w-3 h-3 mr-1" />
                        स्वास्थ्य
                      </Badge>
                    )}
                    {village.hasRoadAccess && (
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-300">
                        <Road className="w-3 h-3 mr-1" />
                        सड़क
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Location */}
                {village.latitude && village.longitude && (
                  <div className="text-xs text-gray-500">
                    📍 {village.latitude.toFixed(4)}, {village.longitude.toFixed(4)}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="w-4 h-4 mr-1" />
                    देखें
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="w-4 h-4 mr-1" />
                    संपादित करें
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Registration Date */}
                <div className="text-xs text-gray-500 pt-2 border-t">
                  पंजीकृत: {new Date(village.createdAt).toLocaleDateString("hi-IN")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

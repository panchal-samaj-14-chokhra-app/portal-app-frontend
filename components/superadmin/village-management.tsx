"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MapPin,
  Search,
  Filter,
  Users,
  Home,
  Zap,
  Droplets,
  GraduationCap,
  Heart,
  RouteIcon as Road,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [filteredVillages, setFilteredVillages] = useState<Village[]>([])

  // Get unique states
  const states = Array.from(new Set(villages.map((v) => v.state)))

  // Filter villages based on search and filters
  useEffect(() => {
    let filtered = villages

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (village) =>
          village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          village.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
          village.pincode.includes(searchTerm),
      )
    }

    // State filter
    if (stateFilter !== "all") {
      filtered = filtered.filter((village) => village.state === stateFilter)
    }

    // Facility filter
    if (facilityFilter !== "all") {
      switch (facilityFilter) {
        case "electricity":
          filtered = filtered.filter((v) => v.hasElectricity)
          break
        case "water":
          filtered = filtered.filter((v) => v.hasWaterSupply)
          break
        case "school":
          filtered = filtered.filter((v) => v.hasSchool)
          break
        case "health":
          filtered = filtered.filter((v) => v.hasHealthCenter)
          break
        case "road":
          filtered = filtered.filter((v) => v.hasRoadAccess)
          break
      }
    }

    setFilteredVillages(filtered)
  }, [villages, searchTerm, stateFilter, facilityFilter])

  const getFacilityIcons = (village: Village) => {
    const facilities = []
    if (village.hasElectricity) facilities.push({ icon: Zap, color: "text-yellow-600", label: "बिजली" })
    if (village.hasWaterSupply) facilities.push({ icon: Droplets, color: "text-blue-600", label: "पानी" })
    if (village.hasSchool) facilities.push({ icon: GraduationCap, color: "text-green-600", label: "स्कूल" })
    if (village.hasHealthCenter) facilities.push({ icon: Heart, color: "text-red-600", label: "स्वास्थ्य केंद्र" })
    if (village.hasRoadAccess) facilities.push({ icon: Road, color: "text-gray-600", label: "सड़क" })
    return facilities
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
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
                      <Skeleton key={j} className="h-6 w-6 rounded-full" />
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
        <Button onClick={onRefresh} className="bg-blue-600 hover:bg-blue-700">
          रीफ्रेश करें
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="गांव का नाम, जिला या पिनकोड खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="राज्य चुनें" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">सभी राज्य</SelectItem>
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={facilityFilter} onValueChange={setFacilityFilter}>
          <SelectTrigger className="w-48">
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

      {/* Villages Grid */}
      {filteredVillages.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVillages.map((village) => {
            const facilities = getFacilityIcons(village)

            return (
              <Card key={village.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
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
                    <div className="flex items-center gap-2">
                      <Badge variant={village.isActive ? "default" : "secondary"}>
                        {village.isActive ? "सक्रिय" : "निष्क्रिय"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            विवरण देखें
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            संपादित करें
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            हटाएं
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Home className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">परिवार</span>
                      </div>
                      <p className="text-lg font-bold text-blue-900">{village.familyCount}</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">जनसंख्या</span>
                      </div>
                      <p className="text-lg font-bold text-green-900">{village.populationCount}</p>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">उपलब्ध सुविधाएं:</h4>
                    {facilities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {facilities.map((facility, index) => {
                          const Icon = facility.icon
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full"
                              title={facility.label}
                            >
                              <Icon className={`w-3 h-3 ${facility.color}`} />
                              <span className="text-xs text-gray-700">{facility.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">कोई सुविधा उपलब्ध नहीं</p>
                    )}
                  </div>

                  {/* Location */}
                  {village.latitude && village.longitude && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        स्थान: {village.latitude.toFixed(4)}, {village.longitude.toFixed(4)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

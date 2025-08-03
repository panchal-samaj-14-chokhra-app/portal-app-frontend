"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  UserCheck,
  Search,
  MapPin,
  Home,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChokhlaForm } from "./chokhla-form"
import type { Chokhla, ChokhlaFormData } from "./types"

interface ChokhlaManagementProps {
  choklas: Chokhla[]
  isLoading: boolean
  onRefresh: () => void
  onCreateChokhla: (data: ChokhlaFormData) => Promise<void>
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>
}

export function ChokhlaManagement({
  choklas,
  isLoading,
  onRefresh,
  onCreateChokhla,
  onToggleStatus,
}: ChokhlaManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredChoklas, setFilteredChoklas] = useState<Chokhla[]>([])
  const [isCreating, setIsCreating] = useState(false)

  // Filter choklas based on search
  useEffect(() => {
    let filtered = choklas

    if (searchTerm) {
      filtered = filtered.filter(
        (chokhla) =>
          `${chokhla.firstName} ${chokhla.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chokhla.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chokhla.mobileNumber.includes(searchTerm) ||
          chokhla.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chokhla.state.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredChoklas(filtered)
  }, [choklas, searchTerm])

  const handleCreateChokhla = async (data: ChokhlaFormData) => {
    setIsCreating(true)
    try {
      await onCreateChokhla(data)
    } finally {
      setIsCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return "कभी नहीं"
    return new Date(lastLogin).toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
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
                      <Skeleton key={j} className="h-8 w-16" />
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
      <Tabs defaultValue="list" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">चोखला प्रबंधन</h2>
            <p className="text-gray-600">कुल {choklas.length} चोखला पंजीकृत हैं</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onRefresh} variant="outline">
              रीफ्रेश करें
            </Button>
            <TabsList>
              <TabsTrigger value="list">सूची</TabsTrigger>
              <TabsTrigger value="add">नया जोड़ें</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="list" className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="नाम, ईमेल, मोबाइल या स्थान खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Choklas Grid */}
          {filteredChoklas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserCheck className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">कोई चोखला नहीं मिला</h3>
                <p className="text-gray-500 text-center">
                  {searchTerm ? "खोज बदलकर दोबारा कोशिश करें" : "अभी तक कोई चोखला पंजीकृत नहीं है"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChoklas.map((chokhla) => (
                <Card key={chokhla.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                          <UserCheck className="w-5 h-5" />
                          {chokhla.firstName} {chokhla.lastName}
                        </CardTitle>
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span>{chokhla.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{chokhla.mobileNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {chokhla.district}, {chokhla.state}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={chokhla.isActive ? "default" : "secondary"}>
                          {chokhla.isActive ? "सक्रिय" : "निष्क्रिय"}
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
                            <DropdownMenuItem onClick={() => onToggleStatus(chokhla.id, !chokhla.isActive)}>
                              {chokhla.isActive ? (
                                <>
                                  <ToggleLeft className="w-4 h-4 mr-2" />
                                  निष्क्रिय करें
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="w-4 h-4 mr-2" />
                                  सक्रिय करें
                                </>
                              )}
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
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          <span className="text-xs font-medium text-blue-800">गांव</span>
                        </div>
                        <p className="text-sm font-bold text-blue-900">{chokhla.villageCount}</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Home className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-medium text-green-800">परिवार</span>
                        </div>
                        <p className="text-sm font-bold text-green-900">{chokhla.familyCount}</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Calendar className="w-3 h-3 text-purple-600" />
                          <span className="text-xs font-medium text-purple-800">जुड़े</span>
                        </div>
                        <p className="text-xs font-bold text-purple-900">{formatDate(chokhla.createdAt)}</p>
                      </div>
                    </div>

                    {/* Last Login */}
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">अंतिम लॉगिन: {formatLastLogin(chokhla.lastLogin)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <ChokhlaForm onSubmit={handleCreateChokhla} isLoading={isCreating} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  UserCheck,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { ChokhlaForm } from "./chokhla-form"
import type { Chokhla, ChokhlaFormData } from "./types"
import { STATES_DISTRICTS } from "./constants"

interface ChokhlaManagementProps {
  choklas: Chokhla[]
  isLoading: boolean
  onRefresh: () => void
  onCreateChokhla: (data: ChokhlaFormData) => Promise<void>
  onToggleStatus: (id: string, isActive: boolean) => void
}

export function ChokhlaManagement({
  choklas,
  isLoading,
  onRefresh,
  onCreateChokhla,
  onToggleStatus,
}: ChokhlaManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredChoklas = choklas.filter((chokhla) => {
    const matchesSearch =
      chokhla.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.mobileNumber.includes(searchTerm)

    const matchesState = selectedState === "all" || chokhla.state === selectedState
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && chokhla.isActive) ||
      (statusFilter === "inactive" && !chokhla.isActive)

    return matchesSearch && matchesState && matchesStatus
  })

  const activeChoklas = choklas.filter((c) => c.isActive)
  const inactiveChoklas = choklas.filter((c) => !c.isActive)

  const handleCreateChokhla = async (data: ChokhlaFormData) => {
    setIsSubmitting(true)
    try {
      await onCreateChokhla(data)
      setIsFormOpen(false)
    } finally {
      setIsSubmitting(false)
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
          <h2 className="text-2xl font-bold text-gray-900">चोखला प्रबंधन</h2>
          <p className="text-gray-600">
            कुल {choklas.length} चोखला पंजीकृत हैं ({activeChoklas.length} सक्रिय)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <Search className="w-4 h-4 mr-2" />
            रिफ्रेश करें
          </Button>
          <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            नया चोखला जोड़ें
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{choklas.length}</div>
            <div className="text-sm text-gray-600">कुल चोखला</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-green-600">{activeChoklas.length}</div>
            <div className="text-sm text-gray-600">सक्रिय</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-red-600">{inactiveChoklas.length}</div>
            <div className="text-sm text-gray-600">निष्क्रिय</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {choklas.reduce((sum, c) => sum + c.villageCount, 0)}
            </div>
            <div className="text-sm text-gray-600">कुल गांव</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="नाम, ईमेल या मोबाइल खोजें..."
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="स्थिति फिल्टर" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी स्थिति</SelectItem>
                <SelectItem value="active">सक्रिय</SelectItem>
                <SelectItem value="inactive">निष्क्रिय</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{filteredChoklas.length} परिणाम</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Choklas List */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">ग्रिड व्यू</TabsTrigger>
          <TabsTrigger value="list">लिस्ट व्यू</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {filteredChoklas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserCheck className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">कोई चोखला नहीं मिला</h3>
                <p className="text-gray-500 text-center">
                  {searchTerm || selectedState !== "all" || statusFilter !== "all"
                    ? "फिल्टर बदलकर दोबारा कोशिश करें"
                    : "अभी तक कोई चोखला पंजीकृत नहीं है"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChoklas.map((chokhla) => (
                <Card key={chokhla.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                          <UserCheck className="w-5 h-5" />
                          {chokhla.firstName} {chokhla.lastName}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {chokhla.district}, {chokhla.state}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={chokhla.isActive ? "default" : "secondary"}>
                          {chokhla.isActive ? "सक्रिय" : "निष्क्रिय"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => onToggleStatus(chokhla.id, !chokhla.isActive)}>
                          {chokhla.isActive ? (
                            <ToggleRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {chokhla.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {chokhla.mobileNumber}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-800">{chokhla.villageCount}</div>
                        <div className="text-xs text-blue-600">गांव</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-800">{chokhla.familyCount}</div>
                        <div className="text-xs text-green-600">परिवार</div>
                      </div>
                    </div>

                    {/* Last Login */}
                    {chokhla.lastLogin && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        अंतिम लॉगिन: {new Date(chokhla.lastLogin).toLocaleDateString("hi-IN")}
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
                      पंजीकृत: {new Date(chokhla.createdAt).toLocaleDateString("hi-IN")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        चोखला
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        संपर्क
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        स्थान
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        आंकड़े
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        स्थिति
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        कार्य
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredChoklas.map((chokhla) => (
                      <tr key={chokhla.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-700">
                                {chokhla.firstName.charAt(0)}
                                {chokhla.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {chokhla.firstName} {chokhla.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                पंजीकृत: {new Date(chokhla.createdAt).toLocaleDateString("hi-IN")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{chokhla.email}</div>
                          <div className="text-sm text-gray-500">{chokhla.mobileNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{chokhla.district}</div>
                          <div className="text-sm text-gray-500">{chokhla.state}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{chokhla.villageCount} गांव</div>
                          <div className="text-sm text-gray-500">{chokhla.familyCount} परिवार</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Badge variant={chokhla.isActive ? "default" : "secondary"}>
                              {chokhla.isActive ? "सक्रिय" : "निष्क्रिय"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggleStatus(chokhla.id, !chokhla.isActive)}
                            >
                              {chokhla.isActive ? (
                                <ToggleRight className="w-4 h-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-4 h-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Chokhla Form Modal */}
      <ChokhlaForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateChokhla}
        isLoading={isSubmitting}
      />
    </div>
  )
}

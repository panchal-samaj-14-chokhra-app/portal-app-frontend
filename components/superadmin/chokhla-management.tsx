"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Users, MapPin, Mail, Phone, Plus, ToggleLeft, ToggleRight } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"
import type { ChokhlaFormData } from "./types"
import { STATES_DISTRICTS } from "./constants"

export function ChokhlaManagement() {
  const { chokhlas, isLoadingChokhlas, fetchChokhlas } = useSuperAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredChoklas = chokhlas.filter((chokhla) => {
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

  const activeChoklas = chokhlas.filter((c) => c.isActive)
  const inactiveChoklas = chokhlas.filter((c) => !c.isActive)

  const handleCreateChokhla = async (data: ChokhlaFormData) => {
    setIsSubmitting(true)
    try {
      await fetchChokhlas(data)
      setIsFormOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingChokhlas) {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">चोखला प्रबंधन</h1>
          <p className="text-gray-600 mt-1">सभी चोखला की जानकारी और प्रबंधन</p>
        </div>
        <Button
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          नया चोखला जोड़ें
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{chokhlas.length}</div>
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
              {chokhlas.reduce((sum, c) => sum + c.villageCount, 0)}
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
              <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">कोई चोखला नहीं मिला</h3>
                <p className="text-gray-500 text-center mb-4">अभी तक कोई चोखला पंजीकृत नहीं है।</p>
                <Button onClick={fetchChokhlas}>
                  <Plus className="w-4 h-4 mr-2" />
                  पहला चोखला जोड़ें
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChoklas.map((chokhla) => (
                <Card
                  key={chokhla.id}
                  className="bg-white/70 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-green-600" />
                          {chokhla.firstName} {chokhla.lastName}
                        </CardTitle>
                        <CardDescription>
                          {chokhla.district}, {chokhla.state}
                        </CardDescription>
                      </div>
                      <Badge variant={chokhla.isActive ? "default" : "secondary"}>
                        {chokhla.isActive ? "सक्रिय" : "निष्क्रिय"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{chokhla.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{chokhla.mobileNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          गांव:
                        </span>
                        <span className="font-medium">{chokhla.villageCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          परिवार:
                        </span>
                        <span className="font-medium">{chokhla.familyCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>अंतिम लॉगिन:</span>
                        <span className="font-medium">
                          {chokhla.lastLogin ? new Date(chokhla.lastLogin).toLocaleDateString("hi-IN") : "कभी नहीं"}
                        </span>
                      </div>
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
                              onClick={() => fetchChokhlas(chokhla.id, !chokhla.isActive)}
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
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Plus className="w-4 h-4" />
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
      {/* ChokhlaForm component can be added here if needed */}
    </div>
  )
}

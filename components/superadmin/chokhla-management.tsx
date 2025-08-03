"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Filter, RefreshCw, UserPlus, Eye, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { ChokhlaForm } from "./chokhla-form"
import type { Chokhla, ChokhlaFormData } from "./types"

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
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredChoklas = choklas.filter((chokhla) => {
    const matchesSearch =
      chokhla.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.district.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesState = stateFilter === "all" || chokhla.state === stateFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && chokhla.isActive) ||
      (statusFilter === "inactive" && !chokhla.isActive)

    return matchesSearch && matchesState && matchesStatus
  })

  const handleCreateChokhla = async (data: ChokhlaFormData) => {
    setIsSubmitting(true)
    try {
      await onCreateChokhla(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "कभी नहीं"
    return new Date(lastLogin).toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">चोखला प्रबंधन</h2>
          <p className="text-gray-600">कुल {choklas.length} चोखला पंजीकृत हैं</p>
        </div>
        <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2 bg-transparent">
          <RefreshCw className="w-4 h-4" />
          रीफ्रेश करें
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            चोखला सूची
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            नया चोखला जोड़ें
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="नाम, ईमेल या जिले से खोजें..."
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="स्थिति फिल्टर" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी स्थिति</SelectItem>
                    <SelectItem value="active">सक्रिय</SelectItem>
                    <SelectItem value="inactive">निष्क्रिय</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Choklas Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                चोखला सूची ({filteredChoklas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>चोखला जानकारी</TableHead>
                      <TableHead>संपर्क</TableHead>
                      <TableHead>स्थान</TableHead>
                      <TableHead>आंकड़े</TableHead>
                      <TableHead>अंतिम लॉगिन</TableHead>
                      <TableHead>स्थिति</TableHead>
                      <TableHead>कार्य</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChoklas.map((chokhla) => (
                      <TableRow key={chokhla.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-700">
                                {chokhla.firstName.charAt(0)}
                                {chokhla.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {chokhla.firstName} {chokhla.lastName}
                              </p>
                              <p className="text-sm text-gray-500">पंजीकरण: {formatDate(chokhla.createdAt)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-900">{chokhla.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-900">{chokhla.mobileNumber}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{chokhla.district}</p>
                              <p className="text-xs text-gray-500">{chokhla.state}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">{chokhla.villageCount}</span>
                              <span className="text-gray-500 ml-1">गांव</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">{chokhla.familyCount}</span>
                              <span className="text-gray-500 ml-1">परिवार</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-900">{formatLastLogin(chokhla.lastLogin)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={chokhla.isActive}
                              onCheckedChange={(checked) => onToggleStatus(chokhla.id, checked)}
                            />
                            <Badge variant={chokhla.isActive ? "default" : "secondary"}>
                              {chokhla.isActive ? "सक्रिय" : "निष्क्रिय"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            विवरण
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Empty State */}
              {filteredChoklas.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">कोई चोखला नहीं मिला</h3>
                  <p className="text-gray-500 text-center">
                    {searchTerm || stateFilter !== "all" || statusFilter !== "all"
                      ? "फिल्टर बदलकर दोबारा कोशिश करें"
                      : "अभी तक कोई चोखला पंजीकृत नहीं है"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <ChokhlaForm onSubmit={handleCreateChokhla} isSubmitting={isSubmitting} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Village {
  id: string
  name: string
  chokhlaId: string
  chokhlaName: string
  totalFamilies: number
  totalMembers: number
  isActive: boolean
  createdAt: string
}

interface VillageManagementProps {
  villages: Village[]
  isLoading: boolean
}

export default function VillageManagement({ villages, isLoading }: VillageManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChokhla, setSelectedChokhla] = useState("all")

  const filteredVillages = villages.filter((village) => {
    const matchesSearch =
      village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.chokhlaName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesChokhla = selectedChokhla === "all" || village.chokhlaId === selectedChokhla
    return matchesSearch && matchesChokhla
  })

  const uniqueChokhlas = Array.from(new Set(villages.map((v) => v.chokhlaId)))
    .map((id) => villages.find((v) => v.chokhlaId === id))
    .filter(Boolean)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">गांव प्रबंधन</h1>
            <p className="text-gray-600">सभी गांवों की जानकारी देखें और प्रबंधित करें</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">गांव प्रबंधन</h1>
          <p className="text-gray-600">सभी गांवों की जानकारी देखें और प्रबंधित करें</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          नया गांव जोड़ें
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल गांव</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{villages.length}</div>
            <p className="text-xs text-muted-foreground">सभी चोखलों में</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल परिवार</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {villages.reduce((sum, village) => sum + village.totalFamilies, 0)}
            </div>
            <p className="text-xs text-muted-foreground">सभी गांवों में</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल सदस्य</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{villages.reduce((sum, village) => sum + village.totalMembers, 0)}</div>
            <p className="text-xs text-muted-foreground">सभी गांवों में</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">सक्रिय गांव</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{villages.filter((village) => village.isActive).length}</div>
            <p className="text-xs text-muted-foreground">कुल में से</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>फिल्टर और खोज</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="गांव या चोखला का नाम खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedChokhla}
              onChange={(e) => setSelectedChokhla(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">सभी चोखला</option>
              {uniqueChokhlas.map((chokhla) => (
                <option key={chokhla?.chokhlaId} value={chokhla?.chokhlaId}>
                  {chokhla?.chokhlaName}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Villages Table */}
      <Card>
        <CardHeader>
          <CardTitle>गांवों की सूची</CardTitle>
          <CardDescription>
            {filteredVillages.length} गांव मिले (कुल {villages.length} में से)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>गांव का नाम</TableHead>
                  <TableHead>चोखला</TableHead>
                  <TableHead>परिवार</TableHead>
                  <TableHead>सदस्य</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead>बनाया गया</TableHead>
                  <TableHead>कार्य</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVillages.map((village) => (
                  <TableRow key={village.id}>
                    <TableCell className="font-medium">{village.name}</TableCell>
                    <TableCell>{village.chokhlaName}</TableCell>
                    <TableCell>{village.totalFamilies}</TableCell>
                    <TableCell>{village.totalMembers}</TableCell>
                    <TableCell>
                      <Badge variant={village.isActive ? "default" : "secondary"}>
                        {village.isActive ? "सक्रिय" : "निष्क्रिय"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(village.createdAt).toLocaleDateString("hi-IN")}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredVillages.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">कोई गांव नहीं मिला</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedChokhla !== "all" ? "अपने फिल्टर बदलकर देखें" : "नया गांव जोड़ने के लिए ऊपर बटन दबाएं"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

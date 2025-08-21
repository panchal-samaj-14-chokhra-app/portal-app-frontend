"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Building2, Users, MapPin, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Chokhla {
  id: string
  name: string
  description: string
  totalVillages: number
  totalFamilies: number
  totalMembers: number
  isActive: boolean
  createdAt: string
  adminEmail: string
}

interface ChokhlaManagementProps {
  chokhlas: Chokhla[]
  isLoading: boolean
  onAddChokhla: () => void
}

export default function ChokhlaManagement({ chokhlas, isLoading, onAddChokhla }: ChokhlaManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredChokhlas = chokhlas.filter(
    (chokhla) =>
      chokhla.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">चोखला प्रबंधन</h1>
            <p className="text-gray-600">सभी चोखलों की जानकारी देखें और प्रबंधित करें</p>
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
          <h1 className="text-2xl font-bold text-gray-900">चोखला प्रबंधन</h1>
          <p className="text-gray-600">सभी चोखलों की जानकारी देखें और प्रबंधित करें</p>
        </div>
        <Button onClick={onAddChokhla} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          नया चोखला जोड़ें
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल चोखला</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chokhlas.length}</div>
            <p className="text-xs text-muted-foreground">पंजीकृत चोखला</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल गांव</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chokhlas.reduce((sum, chokhla) => sum + chokhla.totalVillages, 0)}
            </div>
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
              {chokhlas.reduce((sum, chokhla) => sum + chokhla.totalFamilies, 0)}
            </div>
            <p className="text-xs text-muted-foreground">सभी चोखलों में</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">सक्रिय चोखला</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chokhlas.filter((chokhla) => chokhla.isActive).length}</div>
            <p className="text-xs text-muted-foreground">कुल में से</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>खोज</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="चोखला का नाम, विवरण या एडमिन ईमेल खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Chokhlas Table */}
      <Card>
        <CardHeader>
          <CardTitle>चोखलों की सूची</CardTitle>
          <CardDescription>
            {filteredChokhlas.length} चोखला मिले (कुल {chokhlas.length} में से)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>चोखला का नाम</TableHead>
                  <TableHead>विवरण</TableHead>
                  <TableHead>एडमिन</TableHead>
                  <TableHead>गांव</TableHead>
                  <TableHead>परिवार</TableHead>
                  <TableHead>सदस्य</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead>बनाया गया</TableHead>
                  <TableHead>कार्य</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChokhlas.map((chokhla) => (
                  <TableRow key={chokhla.id}>
                    <TableCell className="font-medium">{chokhla.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{chokhla.description}</TableCell>
                    <TableCell>{chokhla.adminEmail}</TableCell>
                    <TableCell>{chokhla.totalVillages}</TableCell>
                    <TableCell>{chokhla.totalFamilies}</TableCell>
                    <TableCell>{chokhla.totalMembers}</TableCell>
                    <TableCell>
                      <Badge variant={chokhla.isActive ? "default" : "secondary"}>
                        {chokhla.isActive ? "सक्रिय" : "निष्क्रिय"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(chokhla.createdAt).toLocaleDateString("hi-IN")}</TableCell>
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

          {filteredChokhlas.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">कोई चोखला नहीं मिला</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "अपनी खोज बदलकर देखें" : "नया चोखला जोड़ने के लिए ऊपर बटन दबाएं"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users, MapPin, Phone, Mail } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

export function ChokhlaManagement() {
  const { chokhlas, isLoadingChokhlas } = useSuperAdmin()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredChokhlas = chokhlas.filter(
    (chokhla) =>
      chokhla.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chokhla.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoadingChokhlas) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">चोखला प्रबंधन</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
        <h2 className="text-2xl font-bold text-gray-900">चोखला प्रबंधन</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          नया चोखला जोड़ें
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="चोखला खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChokhlas.map((chokhla) => (
          <Card key={chokhla.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  {chokhla.firstName} {chokhla.lastName}
                </span>
                <Badge variant={chokhla.isActive ? "default" : "secondary"}>
                  {chokhla.isActive ? "सक्रिय" : "निष्क्रिय"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {chokhla.email}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {chokhla.mobileNumber}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {chokhla.district}, {chokhla.state}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">{chokhla.villageCount}</p>
                  <p className="text-xs text-gray-600">गांव</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">{chokhla.familyCount}</p>
                  <p className="text-xs text-gray-600">परिवार</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  विवरण देखें
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  संपादित करें
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChokhlas.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">कोई चोखला नहीं मिला</h3>
          <p className="text-gray-600">खोज शब्द बदलकर पुनः प्रयास करें।</p>
        </div>
      )}
    </div>
  )
}

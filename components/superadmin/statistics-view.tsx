"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Building, MapPin } from "lucide-react"

export default function StatisticsView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">कुल चौकला</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <Building className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">कुल गांव</p>
                <p className="text-3xl font-bold">45</p>
              </div>
              <MapPin className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">कुल परिवार</p>
                <p className="text-3xl font-bold">1,234</p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">कुल सदस्य</p>
                <p className="text-3xl font-bold">5,678</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader>
          <CardTitle className="text-orange-800">विस्तृत आंकड़े</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">आंकड़े जल्द ही उपलब्ध होंगे...</p>
        </CardContent>
      </Card>
    </div>
  )
}

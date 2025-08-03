"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, MapPin } from "lucide-react"

export function StatisticsView() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-blue-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            आँकड़े
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-lg border border-orange-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">कुल गांव</p>
                  <p className="text-2xl font-bold text-orange-800">0</p>
                </div>
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg border border-blue-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">कुल परिवार</p>
                  <p className="text-2xl font-bold text-blue-800">0</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-lg border border-green-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">कुल सदस्य</p>
                  <p className="text-2xl font-bold text-green-800">0</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-lg border border-purple-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">औसत आयु</p>
                  <p className="text-2xl font-bold text-purple-800">0</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            <p>विस्तृत आंकड़े जल्द ही उपलब्ध होंगे</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

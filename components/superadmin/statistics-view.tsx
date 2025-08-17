"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, MapPin } from "lucide-react"

export default function StatisticsView() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
            आँकड़े
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">कुल चोखरा</p>
                  <p className="text-2xl font-bold text-blue-800">0</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <MapPin className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">कुल गांव</p>
                  <p className="text-2xl font-bold text-green-800">0</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">कुल यूज़र</p>
                  <p className="text-2xl font-bold text-purple-800">0</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600 font-medium">कुल परिवार</p>
                  <p className="text-2xl font-bold text-orange-800">0</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            <p>आँकड़े जल्द ही उपलब्ध होंगे</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

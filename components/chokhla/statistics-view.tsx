"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, MapPin } from "lucide-react"

export function StatisticsView() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-orange-100">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <CardTitle className="text-2xl font-bold text-orange-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            आँकड़े
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">कुल गांव</h3>
                  <p className="text-2xl font-bold text-blue-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">कुल परिवार</h3>
                  <p className="text-2xl font-bold text-green-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800">वृद्धि दर</h3>
                  <p className="text-2xl font-bold text-purple-900">0%</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800">औसत आयु</h3>
                  <p className="text-2xl font-bold text-orange-900">0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-600">
            <p>आँकड़े जल्द ही उपलब्ध होंगे</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

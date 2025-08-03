"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReportsView() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            रिपोर्ट्स
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  <Download className="w-3 h-3 mr-1" />
                  डाउनलोड
                </Button>
              </div>
              <h3 className="font-semibold text-blue-800 mb-2">मासिक रिपोर्ट</h3>
              <p className="text-sm text-blue-600">गांव की मासिक गतिविधियों की रिपोर्ट</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <Filter className="w-6 h-6 text-green-600" />
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  <Download className="w-3 h-3 mr-1" />
                  डाउनलोड
                </Button>
              </div>
              <h3 className="font-semibold text-green-800 mb-2">जनसंख्या रिपोर्ट</h3>
              <p className="text-sm text-green-600">गांव की जनसंख्या का विस्तृत विवरण</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-6 h-6 text-purple-600" />
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  <Download className="w-3 h-3 mr-1" />
                  डाउनलोड
                </Button>
              </div>
              <h3 className="font-semibold text-purple-800 mb-2">वार्षिक रिपोर्ट</h3>
              <p className="text-sm text-purple-600">साल भर की गतिविधियों का सारांश</p>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500">
            <p>रिपोर्ट्स जल्द ही उपलब्ध होंगे</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

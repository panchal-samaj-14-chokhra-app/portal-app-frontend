"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReportsView() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-green-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
          <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            रिपोर्ट्स
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-800">मासिक रिपोर्ट</h3>
              </div>
              <p className="text-blue-600 text-sm mb-4">पिछले महीने की गतिविधियों की रिपोर्ट</p>
              <Button
                variant="outline"
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-100 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                डाउनलोड करें
              </Button>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-6 h-6 text-orange-600" />
                <h3 className="font-semibold text-orange-800">गांव रिपोर्ट</h3>
              </div>
              <p className="text-orange-600 text-sm mb-4">सभी गांवों की विस्तृत जानकारी</p>
              <Button
                variant="outline"
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-100 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                डाउनलोड करें
              </Button>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-purple-800">सदस्य रिपोर्ट</h3>
              </div>
              <p className="text-purple-600 text-sm mb-4">सभी सदस्यों की सूची और विवरण</p>
              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-600 hover:bg-purple-100 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                डाउनलोड करें
              </Button>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            <p>रिपोर्ट जेनरेशन सुविधा जल्द ही उपलब्ध होगी</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

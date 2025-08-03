"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReportsView() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-orange-100">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
          <CardTitle className="text-2xl font-bold text-orange-800 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            रिपोर्ट्स
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">गांव रिपोर्ट</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">सभी गांवों की विस्तृत जानकारी</p>
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                डाउनलोड करें
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">मासिक रिपोर्ट</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">मासिक गतिविधियों का सारांश</p>
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                डाउनलोड करें
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">वार्षिक रिपोर्ट</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">वार्षिक प्रगति रिपोर्ट</p>
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                डाउनलोड करें
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-600">
            <p>रिपोर्ट्स जल्द ही उपलब्ध होंगे</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

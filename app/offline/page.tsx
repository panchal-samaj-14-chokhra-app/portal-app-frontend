"use client"

import { Wifi, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
            <Wifi className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">आप ऑफलाइन हैं</CardTitle>
          <CardDescription className="text-gray-600">इंटरनेट कनेक्शन उपलब्ध नहीं है। कृपया अपना कनेक्शन जांचें।</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">ऑफलाइन सुविधाएं उपलब्ध:</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• पहले से देखे गए पेज</li>
              <li>• कैश किए गए डेटा</li>
              <li>• बेसिक नेवीगेशन</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={handleRefresh} className="w-full bg-orange-600 hover:bg-orange-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              दोबारा कोशिश करें
            </Button>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                <Home className="mr-2 h-4 w-4" />
                होम पेज पर जाएं
              </Button>
            </Link>
          </div>

          <div className="text-xs text-gray-500 mt-6">
            <p>जैसे ही इंटरनेट कनेक्शन वापस आएगा,</p>
            <p>आप सभी सुविधाओं का उपयोग कर सकेंगे।</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

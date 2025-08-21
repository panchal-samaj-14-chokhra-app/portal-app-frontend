"use client"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Shield, Calendar, Edit, Settings } from "lucide-react"

interface ProfileViewProps {
  userData: any
}

const ProfileView: React.FC<ProfileViewProps> = ({ userData }) => {
  const user = userData?.user

  if (!user) {
    return (
      <div className="w-full">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <User className="w-5 h-5 mr-2" />
              प्रोफाइल जानकारी
            </CardTitle>
            <CardDescription>आपकी व्यक्तिगत जानकारी और सेटिंग्स</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">प्रोफाइल लोड नहीं हो सकी</h3>
              <p className="text-gray-600">कृपया पुनः लॉगिन करें</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{user.name}</h1>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-orange-100">{user.email}</span>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  <Shield className="w-3 h-3 mr-1" />
                  सुपर एडमिन
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Edit className="w-4 h-4 mr-2" />
                  प्रोफाइल संपादित करें
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Settings className="w-4 h-4 mr-2" />
                  सेटिंग्स
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <User className="w-5 h-5 mr-2" />
              व्यक्तिगत जानकारी
            </CardTitle>
            <CardDescription>आपकी बुनियादी जानकारी</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">पूरा नाम:</span>
                <span className="font-semibold text-gray-900">{user.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">ईमेल पता:</span>
                <span className="font-semibold text-gray-900 break-all">{user.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">भूमिका:</span>
                <Badge className="bg-red-100 text-red-700 border-red-200 w-fit">
                  <Shield className="w-3 h-3 mr-1" />
                  सुपर एडमिन
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">यूज़र ID:</span>
                <span className="font-mono text-sm text-gray-700">{user.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Settings className="w-5 h-5 mr-2" />
              खाता जानकारी
            </CardTitle>
            <CardDescription>आपके खाते की स्थिति और सेटिंग्स</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">खाता स्थिति:</span>
                <Badge className="bg-green-100 text-green-700 border-green-200 w-fit">सक्रिय</Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">अंतिम लॉगिन:</span>
                <span className="text-gray-700">आज, अभी</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">खाता बनाया गया:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">जनवरी 2024</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3">
                <span className="text-gray-600 font-medium">सुरक्षा स्तर:</span>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 w-fit">उच्च</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Permissions */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700">
            <Shield className="w-5 h-5 mr-2" />
            सिस्टम अनुमतियां
          </CardTitle>
          <CardDescription>आपकी सिस्टम एक्सेस अनुमतियां</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">गांव प्रबंधन</span>
              </div>
              <p className="text-sm text-green-600">सभी गांवों को देखना और प्रबंधित करना</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">चोखरा प्रबंधन</span>
              </div>
              <p className="text-sm text-green-600">चोखरा जोड़ना, संपादित करना और हटाना</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">यूज़र प्रबंधन</span>
              </div>
              <p className="text-sm text-green-600">उपयोगकर्ता खाते बनाना और प्रबंधित करना</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">डेटा एक्सेस</span>
              </div>
              <p className="text-sm text-green-600">सभी डेटा और रिपोर्ट्स तक पहुंच</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">सिस्टम सेटिंग्स</span>
              </div>
              <p className="text-sm text-green-600">सिस्टम कॉन्फ़िगरेशन और सेटिंग्स</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">बैकअप और रिस्टोर</span>
              </div>
              <p className="text-sm text-green-600">डेटा बैकअप और रिस्टोर करना</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileView

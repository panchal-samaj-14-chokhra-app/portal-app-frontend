"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Shield, Calendar, Edit, Save, X, Camera } from "lucide-react"

interface ProfileViewProps {
  userData: any
}

export default function ProfileView({ userData }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: userData?.user?.name || "",
    email: userData?.user?.email || "",
    phone: "",
    address: "",
  })

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving profile data:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      fullName: userData?.user?.name || "",
      email: userData?.user?.email || "",
      phone: "",
      address: "",
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">सुपर एडमिन प्रोफाइल</h1>
        <p className="text-gray-600">अपनी व्यक्तिगत जानकारी देखें और अपडेट करें</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="text-2xl">
                  {userData?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-transparent"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <CardTitle className="mt-4">{userData?.user?.name || "उपयोगकर्ता"}</CardTitle>
            <CardDescription>{userData?.user?.email}</CardDescription>
            <Badge className="mx-auto mt-2 bg-orange-100 text-orange-800">
              <Shield className="w-3 h-3 mr-1" />
              सुपर एडमिन
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>सदस्य बने: जनवरी 2024</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>अंतिम लॉगिन: आज</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>ईमेल सत्यापित</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>व्यक्तिगत जानकारी</CardTitle>
              <CardDescription>अपनी प्रोफाइल की जानकारी अपडेट करें</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                संपादित करें
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  सहेजें
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  रद्द करें
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">पूरा नाम</Label>
                {isEditing ? (
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{formData.fullName || "नहीं दिया गया"}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ईमेल पता</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{formData.email || "नहीं दिया गया"}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">फोन नंबर</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="फोन नंबर दर्ज करें"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{formData.phone || "नहीं दिया गया"}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">पता</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="पता दर्ज करें"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{formData.address || "नहीं दिया गया"}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>खाता सेटिंग्स</CardTitle>
          <CardDescription>अपनी खाता सेटिंग्स प्रबंधित करें</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">पासवर्ड बदलें</h4>
                <p className="text-sm text-gray-600">अपना खाता पासवर्ड अपडेट करें</p>
              </div>
              <Button variant="outline">पासवर्ड बदलें</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">दो-कारक प्रमाणीकरण</h4>
                <p className="text-sm text-gray-600">अतिरिक्त सुरक्षा के लिए 2FA सक्षम करें</p>
              </div>
              <Button variant="outline">सक्षम करें</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">लॉगिन इतिहास</h4>
                <p className="text-sm text-gray-600">अपनी हाल की लॉगिन गतिविधि देखें</p>
              </div>
              <Button variant="outline">इतिहास देखें</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>सिस्टम जानकारी</CardTitle>
          <CardDescription>आपकी भूमिका और अनुमतियां</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">भूमिका और अनुमतियां</h4>
              <div className="space-y-2">
                <Badge className="bg-orange-100 text-orange-800">सुपर एडमिन</Badge>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• सभी उपयोगकर्ताओं का प्रबंधन</div>
                  <div>• चोखला और गांव प्रबंधन</div>
                  <div>• सिस्टम सेटिंग्स</div>
                  <div>• रिपोर्ट और आंकड़े</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">खाता विवरण</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">खाता ID:</span>
                  <span className="font-mono">{userData?.user?.id?.substring(0, 8) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">खाता स्थिति:</span>
                  <Badge variant="default">सक्रिय</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ईमेल सत्यापित:</span>
                  <Badge variant="default">हां</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">अंतिम अपडेट:</span>
                  <span>आज</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

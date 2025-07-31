"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Copy, Building2, User, Mail, Lock, Eye, EyeOff, Download } from "lucide-react"

interface SuccessData {
  chokhla?: {
    id: string
    name: string
    adhyaksh: string
    contactNumber: string
    state: string
    district: string
    villageName: string
  }
  user?: {
    id: string
    email: string
    fullName: string
    globalRole: string
    passwordHash?: string
  }
  // Legacy support for old format
  chokhlaId?: string
  userId?: string
  email?: string
  fullName?: string
  role?: string
  password?: string
}

interface ChokhlaSuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  successData: SuccessData | null
}

export function ChokhlaSuccessModal({ open, onOpenChange, successData }: ChokhlaSuccessModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  if (!successData) return null

  // Handle both new and legacy data formats
  const chokhlaData = successData.chokhla || {
    id: successData.chokhlaId || "",
    name: "",
    adhyaksh: "",
    contactNumber: "",
    state: "",
    district: "",
    villageName: "",
  }

  const userData = successData.user || {
    id: successData.userId || "",
    email: successData.email || "",
    fullName: successData.fullName || "",
    globalRole: successData.role || "",
    passwordHash: successData.password || "",
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "कॉपी हो गया!",
        description: `${label} क्लिपबोर्ड में कॉपी हो गया है।`,
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "त्रुटि!",
        description: "कॉपी करने में समस्या हुई है।",
        variant: "destructive",
      })
    }
  }

  const downloadCredentials = () => {
    const credentials = `
चौकला की जानकारी:
==================
चौकला ID: ${chokhlaData.id}
चौकला का नाम: ${chokhlaData.name}
अध्यक्ष: ${chokhlaData.adhyaksh}
संपर्क नंबर: ${chokhlaData.contactNumber}
राज्य: ${chokhlaData.state}
जिला: ${chokhlaData.district}
गांव: ${chokhlaData.villageName}

एडमिन यूज़र की जानकारी:
========================
यूज़र ID: ${userData.id}
नाम: ${userData.fullName}
ईमेल: ${userData.email}
भूमिका: ${userData.globalRole}
पासवर्ड: ${userData.passwordHash}

निर्माण तिथि: ${new Date().toLocaleString("hi-IN")}
    `

    const blob = new Blob([credentials], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chokhla-${chokhlaData.id}-credentials.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "डाउनलोड हो गया!",
      description: "क्रेडेंशियल्स फ़ाइल डाउनलोड हो गई है।",
      variant: "default",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-green-700 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            चौकला सफलतापूर्वक बनाया गया!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">बधाई हो!</h3>
            </div>
            <p className="text-green-700 text-sm">
              आपका चौकला और एडमिन यूज़र अकाउंट सफलतापूर्वक बनाया गया है। कृपया नीचे दी गई जानकारी को सुरक्षित रखें।
            </p>
          </div>

          {/* Chokhla Information */}
          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-orange-700 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                चौकला की जानकारी
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">चौकला ID</label>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono flex-1 break-all">
                      {chokhlaData.id}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(chokhlaData.id, "चौकला ID")}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {chokhlaData.name && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">चौकला का नाम</label>
                    <p className="text-sm bg-gray-50 px-2 py-1 rounded">{chokhlaData.name}</p>
                  </div>
                )}

                {chokhlaData.adhyaksh && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">अध्यक्ष</label>
                    <p className="text-sm bg-gray-50 px-2 py-1 rounded">{chokhlaData.adhyaksh}</p>
                  </div>
                )}

                {chokhlaData.contactNumber && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">संपर्क नंबर</label>
                    <p className="text-sm bg-gray-50 px-2 py-1 rounded">{chokhlaData.contactNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-orange-200" />

          {/* User Information */}
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                <User className="w-5 h-5" />
                एडमिन यूज़र की जानकारी
                <Badge variant="secondary" className="ml-2">
                  {userData.globalRole}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">यूज़र ID</label>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono flex-1 break-all">
                      {userData.id}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(userData.id, "यूज़र ID")}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600">नाम</label>
                  <p className="text-sm bg-gray-50 px-2 py-1 rounded">{userData.fullName}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    ईमेल पता
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="bg-blue-50 px-2 py-1 rounded text-sm font-mono flex-1">{userData.email}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(userData.email, "ईमेल पता")}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    पासवर्ड
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="bg-red-50 px-2 py-1 rounded text-sm font-mono flex-1 border border-red-200">
                      {showPassword ? userData.passwordHash : "••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-8 w-8 p-0"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(userData.passwordHash || "", "पासवर्ड")}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <div className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 text-sm">महत्वपूर्ण सूचना</h4>
                    <p className="text-amber-700 text-sm mt-1">
                      कृपया इस पासवर्ड को सुरक्षित रखें। यह केवल एक बार दिखाया जा रहा है। एडमिन यूज़र पहली लॉगिन के बाद पासवर्ड बदल
                      सकता है।
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={downloadCredentials} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              क्रेडेंशियल्स डाउनलोड करें
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              बंद करें
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Copy, Building2, User, Key, Shield, Download, Share2, Eye, EyeOff } from "lucide-react"

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
    fullName: string
    email: string
    globalRole: string
    passwordHash?: string
  }
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

  const { chokhla, user } = successData

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
        title: "त्रुटि",
        description: "कॉपी करने में समस्या हुई है।",
        variant: "destructive",
      })
    }
  }

  const exportData = () => {
    const data = {
      chokhla: {
        id: chokhla?.id || successData.chokhlaId,
        name: chokhla?.name,
        adhyaksh: chokhla?.adhyaksh,
        contactNumber: chokhla?.contactNumber,
        state: chokhla?.state,
        district: chokhla?.district,
        villageName: chokhla?.villageName,
      },
      admin: {
        id: user?.id || successData.userId,
        fullName: user?.fullName || successData.fullName,
        email: user?.email || successData.email,
        role: user?.globalRole || successData.role,
        password: user?.passwordHash || successData.password,
      },
      createdAt: new Date().toISOString(),
    }

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chokhla-${chokhla?.name || "data"}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "डाउनलोड शुरू",
      description: "चौकला की जानकारी डाउनलोड हो रही है।",
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-green-800">चौकला सफलतापूर्वक बनाया गया!</DialogTitle>
          <p className="text-green-700">चौकला और एडमिन अकाउंट दोनों सफलतापूर्वक बन गए हैं।</p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Chokhla Information */}
            {chokhla && (
              <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">चौकला की जानकारी</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">चौकला ID:</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {chokhla.id || successData.chokhlaId}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(chokhla.id || successData.chokhlaId || "", "चौकला ID")}
                        className="h-6 w-6 p-0 hover:bg-green-100"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">नाम:</span>
                    <span className="font-medium text-green-800">{chokhla.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">अध्यक्ष:</span>
                    <span className="font-medium text-green-800">{chokhla.adhyaksh}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">संपर्क:</span>
                    <span className="font-medium text-green-800">{chokhla.contactNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">राज्य:</span>
                    <span className="font-medium text-green-800">{chokhla.state}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">जिला:</span>
                    <span className="font-medium text-green-800">{chokhla.district}</span>
                  </div>
                  <div className="flex justify-between items-center md:col-span-2">
                    <span className="text-gray-600">गांव:</span>
                    <span className="font-medium text-green-800">{chokhla.villageName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Admin User Information */}
            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">एडमिन अकाउंट की जानकारी</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">यूज़र ID:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {user?.id || successData.userId}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(user?.id || successData.userId || "", "यूज़र ID")}
                      className="h-6 w-6 p-0 hover:bg-blue-100"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">नाम:</span>
                  <span className="font-medium text-blue-800">{user?.fullName || successData.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ईमेल:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-800">{user?.email || successData.email}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(user?.email || successData.email || "", "ईमेल")}
                      className="h-6 w-6 p-0 hover:bg-blue-100"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">भूमिका:</span>
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    <Shield className="w-3 h-3 mr-1" />
                    {user?.globalRole || successData.role}
                  </Badge>
                </div>
                <Separator className="bg-blue-200" />
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">लॉगिन पासवर्ड</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border border-yellow-300 rounded px-3 py-2 font-mono text-sm">
                      {showPassword ? user?.passwordHash || successData.password : "••••••••••••"}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePasswordVisibility}
                      className="h-8 w-8 p-0 hover:bg-yellow-100"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-yellow-600" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(user?.passwordHash || successData.password || "", "पासवर्ड")}
                      className="h-8 w-8 p-0 hover:bg-yellow-100"
                    >
                      <Copy className="w-4 h-4 text-yellow-600" />
                    </Button>
                  </div>
                  <p className="text-xs text-yellow-700 mt-2">
                    ⚠️ यह पासवर्ड केवल एक बार दिखाया जा रहा है। कृपया इसे सुरक्षित रखें।
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">महत्वपूर्ण सूचना:</h4>
              <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                <li>एडमिन को ईमेल और पासवर्ड की जानकारी तुरंत भेज दें</li>
                <li>पासवर्ड को सुरक्षित स्थान पर संग्रहीत करें</li>
                <li>यह जानकारी डाउनलोड करके बैकअप बनाएं</li>
                <li>एडमिन को पहली लॉगिन के बाद पासवर्ड बदलने की सलाह दें</li>
              </ul>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-green-200">
          <Button
            onClick={exportData}
            variant="outline"
            className="flex-1 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            डेटा डाउनलोड करें
          </Button>
          <Button
            onClick={() =>
              copyToClipboard(
                `चौकला ID: ${chokhla?.id || successData.chokhlaId}\nईमेल: ${user?.email || successData.email}\nपासवर्ड: ${user?.passwordHash || successData.password}`,
                "सभी जानकारी",
              )
            }
            variant="outline"
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            सभी जानकारी कॉपी करें
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            समझ गया
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

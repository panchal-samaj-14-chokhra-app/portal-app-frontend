"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Download, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

interface ChokhlaData {
  id: string
  name: string
  adminName: string
  adminEmail: string
  adminPhone: string
  password: string
  createdAt: string
  status: string
}

interface ChokhlaSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  chokhlaData: ChokhlaData | null
}

export function ChokhlaSuccessModal({ isOpen, onClose, chokhlaData }: ChokhlaSuccessModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!chokhlaData) return null

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast.success(`${fieldName} कॉपी किया गया!`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error("कॉपी करने में त्रुटि हुई")
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(chokhlaData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `chokhla-${chokhlaData.name}-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("डेटा एक्सपोर्ट किया गया!")
  }

  const CopyButton = ({ text, fieldName }: { text: string; fieldName: string }) => (
    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(text, fieldName)} className="h-8 w-8 p-0">
      {copiedField === fieldName ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center text-green-600">
            ✅ चौकला सफलतापूर्वक जोड़ा गया!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{chokhlaData.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      ID: {chokhlaData.id}
                    </Badge>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    {chokhlaData.status === "active" ? "सक्रिय" : "निष्क्रिय"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">एडमिन का नाम</p>
                        <p className="font-medium">{chokhlaData.adminName}</p>
                      </div>
                      <CopyButton text={chokhlaData.adminName} fieldName="एडमिन का नाम" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">ईमेल</p>
                        <p className="font-medium">{chokhlaData.adminEmail}</p>
                      </div>
                      <CopyButton text={chokhlaData.adminEmail} fieldName="ईमेल" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">फोन नंबर</p>
                        <p className="font-medium">{chokhlaData.adminPhone}</p>
                      </div>
                      <CopyButton text={chokhlaData.adminPhone} fieldName="फोन नंबर" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">पासवर्ड</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium font-mono">{showPassword ? chokhlaData.password : "••••••••"}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="h-6 w-6 p-0"
                          >
                            {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                      <CopyButton text={chokhlaData.password} fieldName="पासवर्ड" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    बनाया गया: {new Date(chokhlaData.createdAt).toLocaleString("hi-IN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">📋 महत्वपूर्ण जानकारी:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• एडमिन लॉगिन क्रेडेंशियल्स को सुरक्षित रखें</li>
              <li>• पासवर्ड को किसी और के साथ साझा न करें</li>
              <li>• एडमिन अपना पासवर्ड बदल सकता है</li>
              <li>• यह जानकारी केवल एक बार दिखाई जा रही है</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={exportData} className="flex-1 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              डेटा एक्सपोर्ट करें
            </Button>
            <Button onClick={onClose} className="flex-1">
              बंद करें
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

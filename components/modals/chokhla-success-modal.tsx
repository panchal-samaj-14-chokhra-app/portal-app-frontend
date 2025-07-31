"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Download, User, Mail, Phone, MapPin } from "lucide-react"
import { toast } from "sonner"

interface ChokhlaData {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  password: string
  createdAt: string
}

interface ChokhlaSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  chokhlaData: ChokhlaData | null
}

export function ChokhlaSuccessModal({ isOpen, onClose, chokhlaData }: ChokhlaSuccessModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast.success(`${fieldName} कॉपी हो गया`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error("कॉपी करने में त्रुटि")
    }
  }

  const exportData = () => {
    if (!chokhlaData) return

    const dataToExport = {
      "चौकला ID": chokhlaData.id,
      नाम: chokhlaData.name,
      ईमेल: chokhlaData.email,
      फोन: chokhlaData.phone,
      पता: chokhlaData.address || "N/A",
      पासवर्ड: chokhlaData.password,
      "बनाया गया": new Date(chokhlaData.createdAt).toLocaleString("hi-IN"),
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `chokhla-${chokhlaData.name}-${chokhlaData.id}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("डेटा डाउनलोड हो गया")
  }

  if (!chokhlaData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600 text-center">
            ✅ चौकला सफलतापूर्वक जोड़ा गया!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">चौकला विवरण</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ID: {chokhlaData.id}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">नाम</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{chokhlaData.name}</p>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(chokhlaData.name, "नाम")}>
                          {copiedField === "नाम" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">ईमेल</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{chokhlaData.email}</p>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(chokhlaData.email, "ईमेल")}>
                          {copiedField === "ईमेल" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">फोन</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{chokhlaData.phone}</p>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(chokhlaData.phone, "फोन")}>
                          {copiedField === "फोन" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {chokhlaData.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">पता</p>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{chokhlaData.address}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(chokhlaData.address!, "पता")}
                          >
                            {copiedField === "पता" ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">लॉगिन पासवर्ड</p>
                    <p className="font-mono text-lg">{chokhlaData.password}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(chokhlaData.password, "पासवर्ड")}>
                    {copiedField === "पासवर्ड" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-yellow-700 mt-1">⚠️ कृपया इस पासवर्ड को सुरक्षित रखें</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={exportData} variant="outline" className="flex-1 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              डेटा डाउनलोड करें
            </Button>
            <Button onClick={onClose} className="flex-1 bg-blue-600 hover:bg-blue-700">
              बंद करें
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            बनाया गया: {new Date(chokhlaData.createdAt).toLocaleString("hi-IN")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

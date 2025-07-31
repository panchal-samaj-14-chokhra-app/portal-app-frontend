"use client"

import { useState } from "react"
import { Check, Copy, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ChokhlaData {
  id: string
  name: string
  adminName: string
  adminEmail: string
  adminPassword: string
  createdAt: string
}

interface ChokhlaSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  chokhlaData: ChokhlaData
}

export function ChokhlaSuccessModal({ isOpen, onClose, chokhlaData }: ChokhlaSuccessModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(chokhlaData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `chokhla-${chokhlaData.name}-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(text, field)} className="h-8 w-8 p-0">
      {copiedField === field ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-green-600">✅ चौकला सफलतापूर्वक बनाया गया!</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>नया चौकला सफलतापूर्वक सिस्टम में जोड़ दिया गया है। नीचे विवरण देखें:</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">चौकला ID:</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="font-mono">
                  {chokhlaData.id}
                </Badge>
                <CopyButton text={chokhlaData.id} field="id" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">चौकला का नाम:</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{chokhlaData.name}</span>
                <CopyButton text={chokhlaData.name} field="name" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">एडमिन का नाम:</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{chokhlaData.adminName}</span>
                <CopyButton text={chokhlaData.adminName} field="adminName" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">एडमिन ईमेल:</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{chokhlaData.adminEmail}</span>
                <CopyButton text={chokhlaData.adminEmail} field="adminEmail" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">एडमिन पासवर्ड:</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{chokhlaData.adminPassword}</span>
                <CopyButton text={chokhlaData.adminPassword} field="adminPassword" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">बनाया गया:</span>
              <span className="text-sm">{new Date(chokhlaData.createdAt).toLocaleString("hi-IN")}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>महत्वपूर्ण:</strong> कृपया एडमिन की लॉगिन जानकारी को सुरक्षित स्थान पर सेव करें। यह जानकारी दोबारा नहीं दिखाई
              जाएगी।
            </p>
          </div>

          <div className="flex justify-between space-x-2">
            <Button variant="outline" onClick={exportData} className="flex-1 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              डेटा डाउनलोड करें
            </Button>
            <Button onClick={onClose} className="flex-1">
              समझ गया
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

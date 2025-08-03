"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SuccessData } from "./types"
import { CheckCircle, Copy, User, Key, MapPin } from "lucide-react"
import { useState } from "react"

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: SuccessData | null
}

export function SuccessDialog({ open, onOpenChange, data }: SuccessDialogProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            गांव और यूज़र सफलतापूर्वक जोड़ा गया
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Information */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              यूज़र की जानकारी
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">नाम:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{data.user.fullName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(data.user.fullName, "name")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">ईमेल:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{data.user.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(data.user.email, "email")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">पासवर्ड:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{data.password}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(data.password, "password")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  {copied === "password" && <span className="text-xs text-green-600">कॉपी हो गया!</span>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">भूमिका:</span>
                <Badge variant="secondary">{data.user.globalRole}</Badge>
              </div>
            </div>
          </div>

          {/* Village Information */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              गांव की जानकारी
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">सदस्य का नाम:</span>
                <span className="font-medium">{data.village.villageMemberName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">गांव ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{data.village.id}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">यूज़र ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{data.user.id}</span>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <Key className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">महत्वपूर्ण सूचना:</p>
                <p className="text-yellow-700">कृपया लॉगिन जानकारी को सुरक्षित रखें। यह जानकारी दोबारा नहीं दिखाई जाएगी।</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)} className="bg-orange-500 hover:bg-orange-600 text-white">
            बंद करें
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

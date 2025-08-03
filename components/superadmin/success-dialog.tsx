"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, Check } from "lucide-react"
import type { CreatedChokhlaData } from "./types"

interface SuccessDialogProps {
  data: CreatedChokhlaData
  onClose: () => void
}

export function SuccessDialog({ data, onClose }: SuccessDialogProps) {
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

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, field)}
      className="ml-2 h-6 w-6 p-0 text-green-600 hover:bg-green-100"
    >
      {copiedField === field ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </Button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4">
        {/* Header */}
        <div className="p-6 text-center border-b border-green-200 bg-gradient-to-r from-green-50 to-green-100">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-green-800">चौकला सफलतापूर्वक जोड़ा गया!</h2>
          <p className="text-sm text-green-600 mt-2">नीचे दी गई जानकारी को सुरक्षित रखें</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">चौकला ID</p>
                <p className="text-sm font-mono text-gray-800 break-all">{data.chokhlaId}</p>
              </div>
              <CopyButton text={data.chokhlaId} field="chokhlaId" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">यूज़र ID</p>
                <p className="text-sm font-mono text-gray-800 break-all">{data.userId}</p>
              </div>
              <CopyButton text={data.userId} field="userId" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">ईमेल</p>
                <p className="text-sm text-gray-800">{data.email}</p>
              </div>
              <CopyButton text={data.email} field="email" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">पूरा नाम</p>
                <p className="text-sm text-gray-800">{data.fullName}</p>
              </div>
              <CopyButton text={data.fullName} field="fullName" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">भूमिका</p>
                <p className="text-sm text-gray-800">{data.role}</p>
              </div>
              <CopyButton text={data.role} field="role" />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <p className="text-xs text-red-500 uppercase tracking-wide font-medium">पासवर्ड</p>
                <p className="text-sm font-mono text-red-700 bg-red-50 px-2 py-1 rounded">{data.password}</p>
              </div>
              <CopyButton text={data.password} field="password" />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>महत्वपूर्ण:</strong> पासवर्ड को सुरक्षित स्थान पर सहेजें। यह दोबारा नहीं दिखाया जाएगा।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white">
            समझ गया
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Copy } from "lucide-react"
import { useState } from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  data: {
    chokhlaId: string
    userId: string
    email: string
    fullName: string
    role: string
    password: string
  } | null
}

export default function SuccessModal({ isOpen, onClose, data }: SuccessModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!isOpen || !data) return null

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform animate-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-700">चौकला सफलतापूर्वक जोड़ा गया!</h2>
        </div>

        <div className="space-y-3 text-sm">
          {[
            { label: "चौकला ID", value: data.chokhlaId, field: "chokhlaId" },
            { label: "यूज़र ID", value: data.userId, field: "userId" },
            { label: "ईमेल", value: data.email, field: "email" },
            { label: "पूरा नाम", value: data.fullName, field: "fullName" },
            { label: "भूमिका", value: data.role, field: "role" },
            { label: "पासवर्ड", value: data.password, field: "password" },
          ].map(({ label, value, field }) => (
            <div key={field} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <strong className="text-gray-700">{label}:</strong>
                <span className="ml-2 text-gray-900">{value}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(value, field)}
                className="h-8 w-8 p-0 hover:bg-gray-200"
              >
                <Copy className={`w-4 h-4 ${copiedField === field ? "text-green-600" : "text-gray-500"}`} />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
          >
            ठीक है
          </Button>
        </div>
      </div>
    </div>
  )
}

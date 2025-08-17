"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, X } from "lucide-react"
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
  const [copied, setCopied] = useState(false)

  if (!isOpen || !data) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-green-700">सफलतापूर्वक जोड़ा गया!</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-700 mb-1">चोखरा ID:</p>
              <p className="text-gray-900 break-all text-xs sm:text-sm font-mono bg-white p-2 rounded border">
                {data.chokhlaId}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-700 mb-1">यूज़र ID:</p>
              <p className="text-gray-900 break-all text-xs sm:text-sm font-mono bg-white p-2 rounded border">
                {data.userId}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-700 mb-1">ईमेल:</p>
              <p className="text-gray-900 break-all text-xs sm:text-sm bg-white p-2 rounded border">{data.email}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-700 mb-1">पूरा नाम:</p>
              <p className="text-gray-900 text-xs sm:text-sm bg-white p-2 rounded border">{data.fullName}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-700 mb-1">भूमिका:</p>
              <p className="text-gray-900 text-xs sm:text-sm bg-white p-2 rounded border">{data.role}</p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="font-medium text-yellow-800 mb-2">पासवर्ड:</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-yellow-900 font-mono text-xs sm:text-sm break-all bg-white p-2 rounded border">
                    {data.password}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.password)}
                  className="flex-shrink-0 w-full sm:w-auto border-yellow-300 hover:bg-yellow-100"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="text-xs">कॉपी</span>
                </Button>
              </div>
              {copied && <p className="text-green-600 text-xs mt-2 font-medium">✓ कॉपी हो गया!</p>}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
              ठीक है
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

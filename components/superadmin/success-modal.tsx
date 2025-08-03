"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy } from "lucide-react"
import { useState } from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  data: any
}

export default function SuccessModal({ isOpen, onClose, data }: SuccessModalProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!data) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-green-700 flex items-center justify-center gap-2 text-lg sm:text-xl">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            चौकला सफलतापूर्वक जोड़ा गया!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="font-semibold text-green-800 mb-2">चौकला की जानकारी:</p>
            <div className="space-y-1 text-xs sm:text-sm">
              <p>
                <strong>चौकला ID:</strong> {data.chokhlaId}
              </p>
              <p>
                <strong>यूज़र ID:</strong> {data.userId}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-800 mb-2">यूज़र की जानकारी:</p>
            <div className="space-y-1 text-xs sm:text-sm">
              <p>
                <strong>ईमेल:</strong> {data.email}
              </p>
              <p>
                <strong>पूरा नाम:</strong> {data.fullName}
              </p>
              <p>
                <strong>भूमिका:</strong> {data.role}
              </p>
              <div className="flex items-center gap-2">
                <p>
                  <strong>पासवर्ड:</strong> {data.password}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(data.password)}
                  className="h-6 px-2 text-xs"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? "कॉपी हो गया!" : "कॉपी"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="w-full sm:w-auto">
            ठीक है
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

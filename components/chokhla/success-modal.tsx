"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy } from "lucide-react"
import { useState } from "react"

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  successData: any
}

export function SuccessModal({ open, onOpenChange, successData }: SuccessModalProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!successData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-green-700 flex items-center justify-center gap-2 text-lg sm:text-xl">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            सफलतापूर्वक जोड़ा गया!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="font-semibold text-green-800 mb-2">यूज़र की जानकारी:</p>
            <div className="space-y-1 text-xs sm:text-sm">
              <p>
                <strong>नाम:</strong> {successData.user?.fullName}
              </p>
              <p>
                <strong>ईमेल:</strong> {successData.user?.email}
              </p>
              <div className="flex items-center gap-2">
                <p>
                  <strong>पासवर्ड:</strong> {successData.password}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(successData.password)}
                  className="h-6 px-2 text-xs"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? "कॉपी हो गया!" : "कॉपी"}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-800 mb-2">गांव की जानकारी:</p>
            <div className="space-y-1 text-xs sm:text-sm">
              <p>
                <strong>सदस्य:</strong> {successData.village?.villageMemberName}
              </p>
              <p>
                <strong>गांव ID:</strong> {successData.village?.id}
              </p>
              <p>
                <strong>यूज़र ID:</strong> {successData.user?.id}
              </p>
              <p>
                <strong>भूमिका:</strong> {successData.user?.globalRole}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            बंद करें
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

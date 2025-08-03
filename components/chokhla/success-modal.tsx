"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Copy } from "lucide-react"
import { useState } from "react"

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  successData: any
}

export function SuccessModal({ open, onOpenChange, successData }: SuccessModalProps) {
  const [copied, setCopied] = useState(false)

  const copyPassword = () => {
    navigator.clipboard.writeText(successData.password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!successData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-green-800">गांव और यूज़र सफलतापूर्वक जोड़ा गया</DialogTitle>
          </div>
        </DialogHeader>
        <div className="bg-green-50 rounded-lg p-4 space-y-3 text-sm">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between">
              <span className="font-medium text-green-700">यूज़र का नाम:</span>
              <span className="text-green-800">{successData.user.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-green-700">ईमेल:</span>
              <span className="text-green-800">{successData.user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-green-700">पासवर्ड:</span>
              <div className="flex items-center gap-2">
                <span className="text-green-800 font-mono bg-green-100 px-2 py-1 rounded">{successData.password}</span>
                <Button size="sm" variant="ghost" onClick={copyPassword} className="h-8 w-8 p-0 hover:bg-green-200">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {copied && <p className="text-xs text-green-600 text-center">पासवर्ड कॉपी हो गया!</p>}
            <div className="flex justify-between">
              <span className="font-medium text-green-700">गांव सदस्य:</span>
              <span className="text-green-800">{successData.village.villageMemberName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-green-700">भूमिका:</span>
              <span className="text-green-800">{successData.user.globalRole}</span>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => onOpenChange(false)} className="bg-green-600 hover:bg-green-700">
              बंद करें
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

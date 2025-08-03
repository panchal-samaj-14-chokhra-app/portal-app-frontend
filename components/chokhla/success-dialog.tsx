"use client"

import { useState } from "react"
import { CheckCircle, Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SuccessDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  details?: Record<string, any>
}

export function SuccessDialog({ isOpen, onClose, title, message, details }: SuccessDialogProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-green-800">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-center text-gray-600">{message}</p>

          {details && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-800">विवरण:</h4>
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{key}:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-gray-800">
                      {String(value)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(String(value), key)}
                      className="h-6 w-6 p-0"
                    >
                      {copiedField === key ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
            बंद करें
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

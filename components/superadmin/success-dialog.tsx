"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Copy, Check } from "lucide-react"

interface SuccessDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  details?: Record<string, any>
}

export function SuccessDialog({ isOpen, onClose, title, message, details }: SuccessDialogProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => new Set(prev).add(key))
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(key)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">{message}</p>

          {details && (
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-green-800">विवरण:</h4>
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{key}:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {String(value)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(String(value), key)}
                      className="h-6 w-6 p-0"
                    >
                      {copiedItems.has(key) ? (
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
            समझ गया
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

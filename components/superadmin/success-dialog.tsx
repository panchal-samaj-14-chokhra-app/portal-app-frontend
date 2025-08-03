"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"

interface SuccessDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  details?: Record<string, any>
}

export function SuccessDialog({ isOpen, onClose, title, message, details }: SuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              {title}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800">{message}</p>
          </div>

          {details && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">विवरण:</h4>
              <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key}:</span>
                    <span className="text-gray-900 font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
            ठीक है
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

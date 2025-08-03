"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-green-800">{title}</DialogTitle>
              <DialogDescription className="text-green-600 mt-1">{message}</DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0 h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {details && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-3">विवरण:</h4>
            <div className="space-y-2">
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-green-700 font-medium">{key}:</span>
                  <span className="text-sm text-green-600">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
            ठीक है
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

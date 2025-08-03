"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorDialog({ isOpen, onClose, title = "त्रुटि", message, onRetry }: ErrorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-red-800">{title}</DialogTitle>
              <DialogDescription className="text-red-600">{message}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-6">
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              पुनः प्रयास करें
            </Button>
          )}
          <Button onClick={onClose} variant="destructive">
            बंद करें
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

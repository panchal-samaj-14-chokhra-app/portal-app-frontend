"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, X, RefreshCw } from "lucide-react"

interface ErrorDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  onRetry?: () => void
}

export function ErrorDialog({ isOpen, onClose, title, message, onRetry }: ErrorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-red-800">{title}</DialogTitle>
              <DialogDescription className="text-red-600 mt-1">{message}</DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0 h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            बंद करें
          </Button>
          {onRetry && (
            <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              पुनः प्रयास करें
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

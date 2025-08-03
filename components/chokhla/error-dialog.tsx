"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorDialog({ open, onOpenChange, title = "त्रुटि", message, onRetry }: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-700 text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              पुनः प्रयास करें
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            बंद करें
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

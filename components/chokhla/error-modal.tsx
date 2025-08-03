"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface ErrorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  errorMessage: string | null
}

export function ErrorModal({ open, onOpenChange, errorMessage }: ErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-red-800">त्रुटि</DialogTitle>
          </div>
        </DialogHeader>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-4">{errorMessage}</div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              बंद करें
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

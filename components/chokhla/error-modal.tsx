"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  errorMessage: string | null
}

export function ErrorModal({ open, onOpenChange, errorMessage }: ErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-red-700 flex items-center justify-center gap-2 text-lg sm:text-xl">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            त्रुटि
          </DialogTitle>
        </DialogHeader>
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <p className="text-red-700 text-sm text-center">{errorMessage}</p>
        </div>
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            बंद करें
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

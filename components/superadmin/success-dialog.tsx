"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-green-800">{title}</DialogTitle>
                <DialogDescription className="text-green-600">{message}</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {details && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">विवरण:</h4>
              <div className="space-y-2">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{key}:</span>
                    <Badge variant="outline" className="text-sm">
                      {String(value)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
            ठीक है
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

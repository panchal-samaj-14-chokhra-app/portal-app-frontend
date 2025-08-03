"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

export function SuccessDialog() {
  const { showSuccessDialog, setShowSuccessDialog, successMessage } = useSuperAdmin()

  return (
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <DialogTitle>सफलता</DialogTitle>
          </div>
          <DialogDescription className="text-base">{successMessage}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={() => setShowSuccessDialog(false)}>ठीक है</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

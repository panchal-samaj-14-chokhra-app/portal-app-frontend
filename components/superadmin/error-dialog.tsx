"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useSuperAdmin } from "./providers/superadmin-provider"

export function ErrorDialog() {
  const { showErrorDialog, setShowErrorDialog, errorMessage } = useSuperAdmin()

  return (
    <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <DialogTitle>त्रुटि</DialogTitle>
          </div>
          <DialogDescription className="text-base">{errorMessage}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setShowErrorDialog(false)}>
            ठीक है
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

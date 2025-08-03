"use client"

import { useSuperAdmin } from "../providers/superadmin-provider"
import { SuccessDialog } from "../success-dialog"
import { ErrorDialog } from "../error-dialog"

export function SuperAdminDialogs() {
  const { successDialog, errorDialog, setSuccessDialog, setErrorDialog } = useSuperAdmin()

  return (
    <>
      {/* Success Dialog */}
      <SuccessDialog
        isOpen={successDialog.isOpen}
        onClose={() => setSuccessDialog({ ...successDialog, isOpen: false })}
        title={successDialog.title}
        message={successDialog.message}
        details={successDialog.details}
      />

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        title={errorDialog.title}
        message={errorDialog.message}
        onRetry={errorDialog.onRetry}
      />
    </>
  )
}

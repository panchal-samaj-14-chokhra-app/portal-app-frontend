"use client"

import { useSuperAdmin } from "@/components/superadmin/providers/superadmin-provider"
import { SuccessDialog } from "@/components/superadmin/success-dialog"
import { ErrorDialog } from "@/components/superadmin/error-dialog"

export function SuperAdminDialogs() {
  const { showSuccessDialog, setShowSuccessDialog, showErrorDialog, setShowErrorDialog, successMessage, errorMessage } =
    useSuperAdmin()

  return (
    <>
      <SuccessDialog isOpen={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} message={successMessage} />

      <ErrorDialog isOpen={showErrorDialog} onClose={() => setShowErrorDialog(false)} message={errorMessage} />
    </>
  )
}

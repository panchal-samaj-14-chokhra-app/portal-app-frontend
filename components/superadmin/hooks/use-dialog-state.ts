"use client"

import { useState } from "react"

interface DialogState {
  isOpen: boolean
  title: string
  message: string
  details?: Record<string, any>
  onRetry?: () => void
}

export function useDialogState() {
  const [successDialog, setSuccessDialog] = useState<DialogState>({
    isOpen: false,
    title: "",
    message: "",
  })

  const [errorDialog, setErrorDialog] = useState<DialogState>({
    isOpen: false,
    title: "",
    message: "",
  })

  const showSuccess = (title: string, message: string, details?: Record<string, any>) => {
    setSuccessDialog({
      isOpen: true,
      title,
      message,
      details,
    })
  }

  const showError = (title: string, message: string, onRetry?: () => void) => {
    setErrorDialog({
      isOpen: true,
      title,
      message,
      onRetry,
    })
  }

  const closeSuccess = () => {
    setSuccessDialog((prev) => ({ ...prev, isOpen: false }))
  }

  const closeError = () => {
    setErrorDialog((prev) => ({ ...prev, isOpen: false }))
  }

  return {
    successDialog,
    errorDialog,
    showSuccess,
    showError,
    closeSuccess,
    closeError,
    setSuccessDialog,
    setErrorDialog,
  }
}

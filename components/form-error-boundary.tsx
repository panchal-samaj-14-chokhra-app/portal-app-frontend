"use client"

import type React from "react"

import { ErrorBoundary } from "./error-boundary"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface FormErrorBoundaryProps {
  children: React.ReactNode
  formName?: string
  onReset?: () => void
}

export function FormErrorBoundary({ children, formName, onReset }: FormErrorBoundaryProps) {
  const fallback = (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Form Error</AlertTitle>
      <AlertDescription className="mt-2">
        {formName ? `An error occurred in the ${formName} form.` : "An error occurred in this form."} Please try again
        or refresh the page.
      </AlertDescription>
      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (onReset) {
              onReset()
            } else {
              window.location.reload()
            }
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Form
        </Button>
      </div>
    </Alert>
  )

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
}

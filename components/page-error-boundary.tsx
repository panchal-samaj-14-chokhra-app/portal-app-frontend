"use client"

import type React from "react"

import { ErrorBoundary } from "./error-boundary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface PageErrorBoundaryProps {
  children: React.ReactNode
  pageName?: string
}

export function PageErrorBoundary({ children, pageName }: PageErrorBoundaryProps) {
  const router = useRouter()

  const fallback = (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900">Page Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">
            {pageName
              ? `An error occurred while loading the ${pageName} page.`
              : "An error occurred while loading this page."}{" "}
            Please try refreshing or go back to the previous page.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
}

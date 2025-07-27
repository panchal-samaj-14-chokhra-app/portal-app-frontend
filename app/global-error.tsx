"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 hindi-text">कुछ गलत हुआ है</CardTitle>
              <CardDescription className="text-gray-600 hindi-text">
                एप्लिकेशन में एक अप्रत्याशित त्रुटि हुई है। कृपया पुनः प्रयास करें।
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p className="font-medium">Error Details:</p>
                <p className="mt-1 font-mono text-xs break-all">{error.message || "Unknown error occurred"}</p>
                {error.digest && <p className="mt-1 font-mono text-xs text-gray-400">ID: {error.digest}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={reset} className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span className="hindi-text">पुनः प्रयास करें</span>
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full" size="lg">
                  <span className="hindi-text">होम पेज पर जाएं</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}

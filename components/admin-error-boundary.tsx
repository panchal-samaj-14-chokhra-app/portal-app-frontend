"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AdminErrorBoundary caught an error:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })

    // Log to external service in production
    if (process.env.NODE_ENV === "production") {
      // Add your error reporting service here
      // e.g., Sentry, LogRocket, etc.
    }

    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900 hindi-text">कुछ गलत हुआ है</CardTitle>
              <p className="text-gray-600 hindi-text mt-2">एडमिन पैनल में एक त्रुटि हुई है। कृपया पुनः प्रयास करें।</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="bg-gray-50 p-4 rounded-lg">
                  <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="font-medium text-xs text-gray-600">Message:</p>
                      <p className="text-xs font-mono bg-white p-2 rounded border">{this.state.error.message}</p>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <p className="font-medium text-xs text-gray-600">Stack Trace:</p>
                        <pre className="text-xs font-mono bg-white p-2 rounded border overflow-auto max-h-32">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <p className="font-medium text-xs text-gray-600">Component Stack:</p>
                        <pre className="text-xs font-mono bg-white p-2 rounded border overflow-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                  className="flex-1"
                  size="lg"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span className="hindi-text">पुनः प्रयास करें</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/admin")}
                  className="flex-1"
                  size="lg"
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span className="hindi-text">एडमिन होम</span>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">यदि समस्या बनी रहती है, तो कृपया तकनीकी सहायता से संपर्क करें।</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/providers/auth-provider"
import { QueryProvider } from "@/lib/providers/query-provider"
import { IntlProvider } from "@/lib/providers/intl-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Panchal Samaj Census Portal",
  description: "Digital census management system for Panchal Samaj community",
  keywords: ["census", "panchal samaj", "community", "family management"],
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            // Log to external monitoring service
            console.error("Root level error:", error, errorInfo)
            // You can add external logging here (e.g., Sentry, LogRocket)
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <QueryProvider>
                <IntlProvider>
                  {children}
                  <Toaster />
                </IntlProvider>
              </QueryProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

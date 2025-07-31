import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_Devanagari } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/lib/providers/query-provider"
import { ToastProvider } from "@/components/ui/toast/toast-provider"
import { AuthProvider } from "@/lib/providers/auth-provider"
import { AdminErrorBoundary } from "@/components/admin-error-boundary"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-hindi",
})

export const metadata: Metadata = {
  title: "पंचाल समाज 14 चोखरा - डिजिटल जनगणना 2025",
  description: "पंचाल समाज 14 चोखरा का डिजिटल जनगणना पोर्टल - परिवार, सदस्य और चंदा प्रबंधन",
  keywords: "पंचाल समाज, जनगणना, परिवार प्रबंधन, चोखरा, गांव प्रबंधन",
  authors: [{ name: "Panchal Samaj 14 Chokhra" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#f97316",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi" className={`${inter.variable} ${notoSansDevanagari.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <QueryProvider>
            <AdminErrorBoundary>{children}</AdminErrorBoundary>
            <ToastProvider />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

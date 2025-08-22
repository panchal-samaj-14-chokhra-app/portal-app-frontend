import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_Devanagari } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/lib/providers/query-provider"
import { ToastProvider } from "@/components/ui/toast/toast-provider"
import { AuthProvider } from "@/lib/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { PWAWrapper } from "@/components/pwa/pwa-wrapper"

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
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#f97316",
  generator: "v0.dev",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "पंचाल समाज",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "पंचाल समाज",
    "application-name": "पंचाल समाज",
    "msapplication-TileColor": "#f97316",
    "msapplication-config": "/browserconfig.xml",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi" className={`${inter.variable} ${notoSansDevanagari.variable}`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-192x192.png" />
        <link rel="mask-icon" href="/icons/icon-192x192.png" color="#f97316" />
        <meta name="msapplication-TileImage" content="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <QueryProvider>
            <PWAWrapper>
              {children}
              <Toaster position="top-center" richColors closeButton duration={4000} />
              <ToastProvider />
            </PWAWrapper>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

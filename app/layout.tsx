import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_Devanagari } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/lib/providers/query-provider"
import { ToastProvider } from "@/components/ui/toast/toast-provider"
import { AuthProvider } from "@/lib/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-hindi",
})

const BASE_URL = "https://panchalsamaj.online"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "पंचाल समाज चौदह चौखरा | Panchal Samaj 14 Chokhra",
    template: "%s | पंचाल समाज चौदह चौखरा",
  },
  description:
    "पंचाल समाज चौदह चौखरा का आधिकारिक डिजिटल पोर्टल। समाज समाचार, कार्यक्रम, प्रेस विज्ञप्ति, नियमावली, वैवाहिक परिचय और डिजिटल जनगणना — बांसवाड़ा, डूंगरपुर, प्रतापगढ़, राजस्थान।",
  keywords: [
    "पंचाल समाज", "चौदह चौखरा", "Panchal Samaj", "14 Chokhra",
    "बांसवाड़ा", "डूंगरपुर", "प्रतापगढ़", "राजस्थान",
    "समाज समाचार", "नियमावली", "वैवाहिक परिचय", "डिजिटल जनगणना",
  ],
  authors: [{ name: "पंचाल समाज चौदह चौखरा", url: BASE_URL }],
  creator: "पंचाल समाज चौदह चौखरा",
  publisher: "पंचाल समाज चौदह चौखरा",
  category: "community",
  themeColor: "#f97316",
  icons: {
    icon: "/images/main-logo.png",
    apple: "/images/main-logo.png",
    shortcut: "/images/main-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: BASE_URL,
    siteName: "पंचाल समाज चौदह चौखरा",
    title: "पंचाल समाज चौदह चौखरा | Panchal Samaj 14 Chokhra",
    description:
      "पंचाल समाज चौदह चौखरा का आधिकारिक डिजिटल पोर्टल। समाज समाचार, कार्यक्रम, प्रेस विज्ञप्ति और नियमावली।",
    images: [
      {
        url: "/images/main-logo.png",
        width: 400,
        height: 400,
        alt: "पंचाल समाज चौदह चौखरा",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "पंचाल समाज चौदह चौखरा",
    description: "पंचाल समाज चौदह चौखरा का आधिकारिक डिजिटल पोर्टल।",
    images: ["/images/main-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: BASE_URL },
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
            {children}
            <Toaster
              position="top-center" // optional, default is top-right
              richColors
              closeButton
              duration={4000}
            />
            <ToastProvider />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

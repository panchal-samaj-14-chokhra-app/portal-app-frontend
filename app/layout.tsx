import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/lib/providers/query-provider"
import { AuthProvider } from "@/lib/providers/auth-provider"
import { Toaster } from "@/components/ui/toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Panchal Samaj Census",
  description: "Census management system for Panchal Samaj",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <QueryProvider>
                {children}
                <Toaster />
              </QueryProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

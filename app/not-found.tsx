"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl font-bold text-gray-300">404</div>
          <CardTitle className="text-xl font-semibold text-gray-900 hindi-text">पेज नहीं मिला</CardTitle>
          <CardDescription className="text-gray-600 hindi-text">
            आपके द्वारा खोजा गया पेज उपलब्ध नहीं है या हटा दिया गया है।
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full" size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                <span className="hindi-text">होम पेज पर जाएं</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
              <Link href="/dashboard">
                <Search className="mr-2 h-4 w-4" />
                <span className="hindi-text">डैशबोर्ड देखें</span>
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => window.history.back()} className="w-full" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hindi-text">वापस जाएं</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

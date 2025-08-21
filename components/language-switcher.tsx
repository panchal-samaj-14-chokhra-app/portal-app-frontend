"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("hi")

  const toggleLanguage = () => {
    const newLang = currentLang === "hi" ? "en" : "hi"
    setCurrentLang(newLang)
    // Here you would typically update the app's language context
    console.log("Language switched to:", newLang)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
    >
      <Globe className="h-4 w-4" />
      {currentLang === "hi" ? "English" : "हिंदी"}
    </Button>
  )
}

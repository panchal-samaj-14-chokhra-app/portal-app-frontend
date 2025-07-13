"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select"

interface LanguageSwitcherProps {
  currentLocale: string
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [locale, setLocale] = useState(currentLocale)

  const languages = [
    { code: "hin", name: "हिंदी", flag: "🇮🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ]

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale)
    // In a real app, you would update the locale context or router
    console.log("Language changed to:", newLocale)
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-white" />
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

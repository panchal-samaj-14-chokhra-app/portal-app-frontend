"use client"
import { useRouter, usePathname } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select"
import { Globe } from "lucide-react"
import { locales, localeNames, type Locale } from "@/lib/i18n/config"

interface LanguageSwitcherProps {
  currentLocale: string
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale from pathname
    const segments = pathname.split("/")
    if (locales.includes(segments[1] as Locale)) {
      segments.splice(1, 1)
    }

    // Add new locale
    const newPath = `/${newLocale}${segments.join("/")}`
    router.push(newPath)
  }

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-32">
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {localeNames[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

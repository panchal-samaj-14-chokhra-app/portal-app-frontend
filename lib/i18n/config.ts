export const locales = ["en", "hin"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "hin"

export const localeNames: Record<Locale, string> = {
  en: "English",
  hin: "हिंदी",
}

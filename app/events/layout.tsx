import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "कार्यक्रम एवं आयोजन",
  description:
    "पंचाल समाज चौदह चौखरा के आगामी और बीते कार्यक्रम, सामाजिक आयोजन, सामूहिक विवाह, और सांस्कृतिक कार्यक्रमों की जानकारी।",
  openGraph: {
    title: "कार्यक्रम एवं आयोजन | पंचाल समाज चौदह चौखरा",
    description: "पंचाल समाज चौदह चौखरा के सामाजिक कार्यक्रम और आयोजन।",
    url: "https://panchalsamaj.online/events",
    type: "website",
  },
  alternates: { canonical: "https://panchalsamaj.online/events" },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

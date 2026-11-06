import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "प्रेस विज्ञप्ति",
  description:
    "पंचाल समाज चौदह चौखरा की आधिकारिक प्रेस विज्ञप्तियां, समाज के महत्वपूर्ण निर्णय और आधिकारिक सूचनाएं।",
  openGraph: {
    title: "प्रेस विज्ञप्ति | पंचाल समाज चौदह चौखरा",
    description: "पंचाल समाज चौदह चौखरा की आधिकारिक प्रेस विज्ञप्तियां और सूचनाएं।",
    url: "https://panchalsamaj.online/press-release",
    type: "website",
  },
  alternates: { canonical: "https://panchalsamaj.online/press-release" },
}

export default function PressReleaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

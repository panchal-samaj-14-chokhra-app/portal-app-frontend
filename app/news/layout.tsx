import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "समाज समाचार",
  description:
    "पंचाल समाज चौदह चौखरा की ताज़ा खबरें, महत्वपूर्ण सूचनाएं और सामाजिक समाचार। बांसवाड़ा, डूंगरपुर, प्रतापगढ़ क्षेत्र के पंचाल समाज की गतिविधियां।",
  openGraph: {
    title: "समाज समाचार | पंचाल समाज चौदह चौखरा",
    description: "पंचाल समाज चौदह चौखरा की ताज़ा खबरें और सामाजिक समाचार।",
    url: "https://panchalsamaj.online/news",
    type: "website",
  },
  alternates: { canonical: "https://panchalsamaj.online/news" },
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "नियमावली",
  description:
    "पंचाल समाज चौदह चौखरा की सामाजिक नियमावली। शुभ प्रसंग, अशुभ प्रसंग, विवाह, संस्कार एवं सामाजिक उत्तरदायित्व से जुड़े नियम और दिशानिर्देश।",
  openGraph: {
    title: "नियमावली | पंचाल समाज चौदह चौखरा",
    description: "पंचाल समाज चौदह चौखरा की सामाजिक नियमावली — शुभ प्रसंग, विवाह, संस्कार के नियम।",
    url: "https://panchalsamaj.online/niyamavali",
    type: "website",
  },
  alternates: { canonical: "https://panchalsamaj.online/niyamavali" },
}

export default function NiyamavaliLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

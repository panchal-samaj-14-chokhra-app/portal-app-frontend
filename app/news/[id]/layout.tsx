import type { Metadata } from "next"
import type React from "react"

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const BASE_URL = "https://panchalsamaj.online"
  try {
    const res = await fetch(
      `https://backend.shreetripurasundari.com/samaj-news/${params.id}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) throw new Error("not found")
    const json = await res.json()
    const news = json?.data

    const title = news?.title || "समाज समाचार"
    const description = news?.summary || news?.content?.slice(0, 160) || "पंचाल समाज चौदह चौखरा का समाचार।"
    const image = news?.imageUrl || "/images/main-logo.png"
    const url = `${BASE_URL}/news/${params.id}`

    return {
      title,
      description,
      openGraph: {
        title: `${title} | पंचाल समाज चौदह चौखरा`,
        description,
        url,
        type: "article",
        images: [{ url: image, width: 1200, height: 630, alt: title }],
        publishedTime: news?.publishedAt,
        authors: ["पंचाल समाज चौदह चौखरा"],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      alternates: { canonical: url },
    }
  } catch {
    return {
      title: "समाज समाचार",
      description: "पंचाल समाज चौदह चौखरा का समाचार।",
    }
  }
}

export default function NewsDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

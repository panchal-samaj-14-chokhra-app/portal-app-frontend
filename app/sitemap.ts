import type { MetadataRoute } from "next"

const BASE = "https://panchalsamaj.online"

// Static public pages
const STATIC: MetadataRoute.Sitemap = [
  { url: BASE,                   lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
  { url: `${BASE}/news`,         lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE}/events`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE}/press-release`,lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE}/niyamavali`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/community-hub`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
]

async function fetchJson<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`https://backend.shreetripurasundari.com${path}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json?.data ?? []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic news articles for individual URLs
  const news = await fetchJson<{ id: string; publishedAt?: string }>("/samaj-news")

  const newsUrls: MetadataRoute.Sitemap = news.map(item => ({
    url: `${BASE}/news/${item.id}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...STATIC, ...newsUrls]
}

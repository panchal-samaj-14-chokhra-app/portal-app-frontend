import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/news", "/news/", "/press-release", "/events", "/niyamavali", "/community-hub", "/login"],
        disallow: ["/admin/", "/mandir-admin/", "/api/"],
      },
    ],
    sitemap: "https://panchalsamaj.online/sitemap.xml",
    host: "https://panchalsamaj.online",
  }
}

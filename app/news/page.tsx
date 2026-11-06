"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle, Share2, Newspaper, Loader2, ChevronRight } from "lucide-react"
import { useSamajNews, useLikeSamajNews } from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajNews } from "@/data-hooks/requests/samaj-content"
import PageHeader from "@/components/ui/PageHeader"

function NewsCard({ item }: { item: SamajNews }) {
  const [liked, setLiked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("liked-news") || "[]").includes(item.id) } catch { return false }
  })
  const [localLikes, setLocalLikes] = useState(item.likesCount || 0)
  const like = useLikeSamajNews(item.id)

  const handleLike = () => {
    if (liked) return
    setLiked(true)
    setLocalLikes(n => n + 1)
    like.mutate()
    try {
      const arr = JSON.parse(localStorage.getItem("liked-news") || "[]")
      localStorage.setItem("liked-news", JSON.stringify([...arr, item.id]))
    } catch {}
  }

  const handleShare = () => {
    const url = `${window.location.origin}/news/${item.id}`
    if (navigator.share) navigator.share({ title: item.title, url })
    else navigator.clipboard.writeText(url).then(() => alert("लिंक कॉपी हो गया!"))
  }

  const date = new Date(item.publishedAt).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })

  return (
    <article className="group bg-white rounded-2xl border border-orange-50 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden flex flex-col">
      {item.imageUrl && (
        <Link href={`/news/${item.id}`} className="block overflow-hidden bg-gray-50">
          <Image src={item.imageUrl} alt={item.title} width={800} height={450}
            className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500" unoptimized />
        </Link>
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{item.tag}</span>
          <span className="text-gray-400 text-xs">{date}</span>
        </div>
        <Link href={`/news/${item.id}`} className="flex-1">
          <h2 className="font-extrabold text-gray-900 text-base sm:text-lg leading-snug mb-2 group-hover:text-orange-700 transition-colors line-clamp-2">
            {item.title}
          </h2>
        </Link>
        {item.summary && (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">{item.summary}</p>
        )}
        <div className="flex items-center gap-1 pt-3 border-t border-gray-50 mt-auto">
          <button onClick={handleLike} disabled={liked}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${liked ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}>
            <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500" : ""}`} />
            {localLikes > 0 && <span>{localLikes}</span>}
          </button>
          <Link href={`/news/${item.id}#comments`}
            className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            {item._count?.comments || 0}
          </Link>
          <button onClick={handleShare}
            className="flex items-center gap-1.5 text-gray-400 hover:text-green-600 text-xs px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors ml-auto">
            <Share2 className="w-3.5 h-3.5" />शेयर
          </button>
          <Link href={`/news/${item.id}`}
            className="flex items-center gap-1 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
            पढ़ें <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function NewsPage() {
  const { data: news, isLoading } = useSamajNews()
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fffbf5 100%)", fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      <PageHeader title="समाज समाचार" subtitle="पंचाल समाज चौदह चौखरा" icon={Newspaper} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-orange-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm text-gray-400">समाचार लोड हो रहे हैं...</p>
          </div>
        )}
        {!isLoading && (!news || news.length === 0) && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mx-auto mb-5">
              <Newspaper className="w-10 h-10 text-orange-200" />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">कोई समाचार नहीं</h3>
            <p className="text-gray-400 text-sm">अभी कोई समाचार उपलब्ध नहीं है।</p>
          </div>
        )}
        {news && news.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {news.map(item => <NewsCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  )
}

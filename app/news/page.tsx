"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Heart, MessageCircle, Share2, Newspaper, Loader2, ChevronRight } from "lucide-react"
import { useSamajNews, useLikeSamajNews } from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajNews } from "@/data-hooks/requests/samaj-content"

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
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
      {item.imageUrl && (
        <Link href={`/news/${item.id}`}>
          <div className="w-full overflow-hidden bg-gray-50">
            <Image src={item.imageUrl} alt={item.title} width={800} height={450}
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300" unoptimized />
          </div>
        </Link>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{item.tag}</span>
          <span className="text-gray-400 text-xs">{date}</span>
        </div>
        <Link href={`/news/${item.id}`}>
          <h2 className="font-extrabold text-gray-800 text-lg leading-snug mb-2 group-hover:text-orange-700 transition-colors line-clamp-2">
            {item.title}
          </h2>
        </Link>
        {item.summary && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{item.summary}</p>
        )}
        <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
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
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fffbf5 100%)", fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-orange-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-orange-50 text-gray-500 hover:text-orange-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900">समाज समाचार</h1>
              <p className="text-xs text-gray-400">पंचाल समाज चौदह चौखरा</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex justify-center py-20 text-orange-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        {!isLoading && (!news || news.length === 0) && (
          <div className="text-center py-20 text-gray-400">
            <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>अभी कोई समाचार नहीं है।</p>
          </div>
        )}
        {news && news.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {news.map(item => <NewsCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { ArrowLeft, Heart, MessageCircle, Share2, Send, Loader2, Calendar, Tag } from "lucide-react"
import {
  useSamajNewsById, useLikeSamajNews,
  useSamajNewsComments, useAddSamajNewsComment,
} from "@/data-hooks/mutation-query/useSamajContent"

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: news, isLoading } = useSamajNewsById(id)
  const { data: comments } = useSamajNewsComments(id)
  const like = useLikeSamajNews(id)
  const addComment = useAddSamajNewsComment(id)

  const [liked, setLiked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("liked-news") || "[]").includes(id) } catch { return false }
  })
  const [localLikes, setLocalLikes] = useState<number | null>(null)
  const [commentName, setCommentName] = useState("")
  const [commentText, setCommentText] = useState("")

  const handleLike = () => {
    if (liked) return
    setLiked(true)
    setLocalLikes((news?.likesCount || 0) + 1)
    like.mutate()
    try {
      const arr = JSON.parse(localStorage.getItem("liked-news") || "[]")
      localStorage.setItem("liked-news", JSON.stringify([...arr, id]))
    } catch {}
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) navigator.share({ title: news?.title || "समाज समाचार", url })
    else navigator.clipboard.writeText(url).then(() => alert("लिंक कॉपी हो गया!"))
  }

  const handleComment = () => {
    if (!commentText.trim()) return
    addComment.mutate(
      { authorName: commentName.trim() || "अज्ञात", content: commentText.trim() },
      { onSuccess: () => { setCommentText(""); setCommentName("") } }
    )
  }

  const likeCount = localLikes !== null ? localLikes : (news?.likesCount || 0)
  const date = news ? new Date(news.publishedAt).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric", weekday: "long" }) : ""

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  )

  if (!news) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-orange-50">
      <p className="text-gray-500">समाचार नहीं मिला।</p>
      <Link href="/news" className="text-orange-600 hover:underline text-sm">← वापस जाएं</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50"
      style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>

      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-orange-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/news" className="p-2 rounded-xl hover:bg-orange-50 text-gray-500 hover:text-orange-700 transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-sm font-bold text-gray-700 truncate flex-1">{news.title}</h1>
          <button onClick={handleShare}
            className="p-2 rounded-xl hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors shrink-0">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Image */}
        {news.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-6 shadow-sm bg-gray-50">
            <Image src={news.imageUrl} alt={news.title} width={1200} height={700}
              className="w-full h-auto" unoptimized priority />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
            <Tag className="w-3 h-3" />{news.tag}
          </span>
          <span className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Calendar className="w-3.5 h-3.5" />{date}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug mb-4">{news.title}</h1>

        {/* Summary */}
        {news.summary && (
          <p className="text-orange-700 font-semibold text-base border-l-4 border-orange-400 pl-4 mb-6 leading-relaxed">
            {news.summary}
          </p>
        )}

        {/* Content */}
        {news.content && (
          <div className="prose prose-orange max-w-none text-gray-700 leading-loose text-[15px] mb-6
            [&_p]:mb-4 [&_h2]:text-orange-900 [&_h2]:font-extrabold [&_h2]:text-xl [&_h2]:mt-6
            [&_h3]:text-orange-800 [&_h3]:font-bold [&_h3]:mt-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1
            [&_strong]:text-orange-900"
            dangerouslySetInnerHTML={{ __html: news.content }} />
        )}

        {/* Like + Share bar */}
        <div className="flex items-center gap-3 py-4 border-y border-gray-100 mb-8">
          <button onClick={handleLike} disabled={liked}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${liked ? "bg-red-50 text-red-500 border border-red-100" : "bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 border border-gray-100"}`}>
            <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
            {likeCount > 0 ? likeCount : ""} {liked ? "पसंद किया" : "पसंद करें"}
          </button>
          <button onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-600 font-semibold text-sm border border-gray-100 transition-all">
            <Share2 className="w-4 h-4" />शेयर करें
          </button>
        </div>

        {/* Comments */}
        <div id="comments">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-800 mb-5">
            <MessageCircle className="w-5 h-5 text-orange-500" />
            टिप्पणियां {comments && comments.length > 0 && <span className="text-orange-500">({comments.length})</span>}
          </h2>

          {/* Comment form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex gap-2 mb-3">
              <input value={commentName} onChange={e => setCommentName(e.target.value)}
                placeholder="आपका नाम (वैकल्पिक)"
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:border-orange-400" />
            </div>
            <div className="flex gap-2">
              <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
                placeholder="अपनी टिप्पणी यहाँ लिखें..."
                rows={2}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:border-orange-400 resize-none" />
              <button onClick={handleComment} disabled={!commentText.trim() || addComment.isPending}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 shrink-0 self-end">
                {addComment.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Comments list */}
          {!comments || comments.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">अभी कोई टिप्पणी नहीं। पहले टिप्पणी करें।</p>
          ) : (
            <div className="space-y-3">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {c.authorName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-sm">{c.authorName}</span>
                      <span className="text-gray-400 text-xs">
                        {new Date(c.createdAt).toLocaleDateString("hi-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

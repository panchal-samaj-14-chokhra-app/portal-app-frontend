"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle, Share2, Send } from "lucide-react"
import {
  useToggleSamajPostLike,
  useAddSamajPostComment,
  useSamajPostComments,
} from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajPost } from "@/data-hooks/requests/samaj-content"

export default function PostCard({ post }: { post: SamajPost }) {
  const [liked, setLiked]               = useState(false)
  const [localLikes, setLocalLikes]     = useState(post.likesCount)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText]   = useState("")
  const [commentName, setCommentName]   = useState("")

  const toggleLike = useToggleSamajPostLike()
  const { data: comments } = useSamajPostComments(showComments ? post.id : undefined)
  const addComment = useAddSamajPostComment(post.id)

  const initials = (post.authorName || "?").slice(0, 2).toUpperCase()
  const timeAgo  = new Date(post.createdAt).toLocaleDateString("hi-IN", { day: "numeric", month: "short" })

  const handleLike = () => {
    setLiked(l => !l)
    setLocalLikes(n => liked ? n - 1 : n + 1)
    toggleLike.mutate(post.id)
  }

  const handleComment = () => {
    if (!commentText.trim()) return
    addComment.mutate(
      { authorName: commentName || "अज्ञात", content: commentText },
      { onSuccess: () => { setCommentText(""); setCommentName("") } },
    )
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({ title: `${post.authorName} की पोस्ट`, text: post.content, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-800 text-sm">{post.authorName}</div>
          <div className="text-gray-400 text-xs">{post.authorRole ? `${post.authorRole} · ` : ""}{timeAgo}</div>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 text-sm leading-relaxed mb-3">{post.content}</p>

      {/* Image */}
      {post.imageUrl && (
        <div className="relative rounded-xl overflow-hidden mb-3 bg-gray-100">
          <Image src={post.imageUrl} alt="पोस्ट इमेज" width={600} height={400} className="w-full object-cover max-h-64" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-gray-50">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs transition-colors px-3 py-1.5 rounded-lg ${liked ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}>
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500" : ""}`} />
          {localLikes > 0 && localLikes}
        </button>
        <button onClick={() => setShowComments(s => !s)}
          className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50">
          <MessageCircle className="w-3.5 h-3.5" />{post._count?.comments || 0}
        </button>
        <button onClick={sharePost}
          className="flex items-center gap-1.5 text-gray-400 hover:text-green-600 text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-green-50 ml-auto">
          <Share2 className="w-3.5 h-3.5" />शेयर
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3 space-y-2 border-t border-gray-50 pt-3">
          {comments?.map(c => (
            <div key={c.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0">
                {c.authorName.slice(0, 1)}
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                <span className="text-xs font-semibold text-gray-700">{c.authorName} </span>
                <span className="text-xs text-gray-600">{c.content}</span>
              </div>
            </div>
          ))}
          <div className="flex gap-2 items-center mt-2">
            <input value={commentName} onChange={e => setCommentName(e.target.value)}
              placeholder="आपका नाम"
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-24 focus:outline-none focus:border-orange-400" />
            <input value={commentText} onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleComment()}
              placeholder="टिप्पणी करें..."
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs flex-1 focus:outline-none focus:border-orange-400" />
            <button onClick={handleComment} disabled={addComment.isPending}
              className="p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

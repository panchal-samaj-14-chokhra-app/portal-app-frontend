"use client"

import Link from "next/link"
import { ArrowLeft, MessageSquare, Loader2 } from "lucide-react"
import { useSamajPosts } from "@/data-hooks/mutation-query/useSamajContent"
import PostCard from "@/components/samaj/PostCard"
import CreatePostBox from "@/components/samaj/CreatePostBox"

export default function PostsPage() {
  const { data: posts, isLoading } = useSamajPosts()
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Noto Sans Devanagari','Hind',sans-serif" }}>
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg hover:bg-orange-50 text-gray-500 hover:text-orange-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">समाज पोस्ट</h1>
            <p className="text-xs text-gray-400">पंचाल समाज के सदस्यों की पोस्ट</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <CreatePostBox />

        {isLoading && (
          <div className="text-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin inline" />
          </div>
        )}
        {!isLoading && (!posts || posts.length === 0) && (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400">अभी कोई पोस्ट नहीं है। सबसे पहले कुछ साझा करें।</p>
          </div>
        )}
        {posts?.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  )
}

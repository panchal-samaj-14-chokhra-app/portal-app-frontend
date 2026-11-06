"use client"

import { useState } from "react"
import { PlusCircle, Send, Image as ImageIcon, Loader2 } from "lucide-react"
import { useCreateSamajPost } from "@/data-hooks/mutation-query/useSamajContent"
import type { SamajPost } from "@/data-hooks/requests/samaj-content"

export default function CreatePostBox() {
  const [open, setOpen]         = useState(false)
  const [name, setName]         = useState("")
  const [role, setRole]         = useState("")
  const [content, setContent]   = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const createPost = useCreateSamajPost()

  const handleSubmit = () => {
    if (!content.trim()) return
    createPost.mutate(
      { authorName: name || "अज्ञात", authorRole: role || undefined, content, imageUrl: imageUrl || undefined },
      { onSuccess: () => { setContent(""); setName(""); setRole(""); setImageUrl(""); setOpen(false) } },
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
      {!open ? (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setOpen(true)}>
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <PlusCircle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-pointer">
            कुछ साझा करें...
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="आपका नाम *"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:border-orange-400" />
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="भूमिका (वैकल्पिक)"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:border-orange-400" />
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="कुछ साझा करें..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="इमेज URL (वैकल्पिक)"
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs flex-1 focus:outline-none focus:border-orange-400" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setOpen(false)}
              className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              रद्द करें
            </button>
            <button onClick={handleSubmit} disabled={!content.trim() || createPost.isPending}
              className="flex items-center gap-1.5 px-5 py-1.5 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50">
              {createPost.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              पोस्ट करें
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

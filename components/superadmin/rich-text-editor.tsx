"use client"

import { useEffect, useRef, useState } from "react"
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Quote, Pilcrow, ImageIcon, Loader2, ZoomIn, ZoomOut } from "lucide-react"
import { uploadBlogImage } from "@/data-hooks/requests/blog"
import { useToast } from "@/hooks/use-toast"

interface RichTextEditorProps {
  initialValue?: string
  onChange: (html: string) => void
  placeholder?: string
}

// Lightweight contentEditable editor (no external deps). Uncontrolled: seeds from
// initialValue on mount, emits HTML on input. Remount with a `key` to load new content.
export default function RichTextEditor({ initialValue, onChange, placeholder }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialValue || ""
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const emit = () => onChange(ref.current?.innerHTML || "")

  const exec = (command: string, value?: string) => {
    ref.current?.focus()
    document.execCommand(command, false, value)
    emit()
  }

  const addLink = () => {
    const url = window.prompt("लिंक URL दर्ज करें (https://...)")
    if (url) exec("createLink", url)
  }

  const insertImages = async (files: FileList | null) => {
    if (!files || !files.length) return
    ref.current?.focus()
    try {
      setUploading(true)
      for (const file of Array.from(files)) {
        const url = await uploadBlogImage(file)
        document.execCommand(
          "insertHTML",
          false,
          `<img src="${url}" alt="" style="max-width:100%;border-radius:8px;margin:8px 0;" />`
        )
      }
      emit()
    } catch (e: any) {
      toast({ title: "अपलोड त्रुटि", description: e?.message, variant: "destructive" })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const IMAGE_SIZE_STEPS = [25, 50, 75, 100]

  const currentImagePercent = () => {
    const m = /^(\d+(?:\.\d+)?)%$/.exec(selectedImg?.style.width || "")
    return m ? Math.round(parseFloat(m[1])) : 100
  }

  const resizeSelectedImage = (dir: 1 | -1) => {
    if (!selectedImg) return
    const cur = currentImagePercent()
    const closestIdx = IMAGE_SIZE_STEPS.reduce(
      (best, step, i) => (Math.abs(step - cur) < Math.abs(IMAGE_SIZE_STEPS[best] - cur) ? i : best),
      0
    )
    const nextIdx = Math.min(IMAGE_SIZE_STEPS.length - 1, Math.max(0, closestIdx + dir))
    selectedImg.style.width = `${IMAGE_SIZE_STEPS[nextIdx]}%`
    selectedImg.style.height = "auto"
    emit()
  }

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    setSelectedImg(target.tagName === "IMG" ? (target as HTMLImageElement) : null)
  }

  const Btn = ({ onClick, title, children, disabled }: any) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`p-2 rounded hover:bg-orange-100 text-gray-700 ${disabled ? "opacity-40 cursor-not-allowed hover:bg-transparent" : ""}`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1">
        <Btn title="Bold" onClick={() => exec("bold")}><Bold className="w-4 h-4" /></Btn>
        <Btn title="Italic" onClick={() => exec("italic")}><Italic className="w-4 h-4" /></Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <Btn title="शीर्षक (H2)" onClick={() => exec("formatBlock", "<h2>")}><Heading2 className="w-4 h-4" /></Btn>
        <Btn title="उपशीर्षक (H3)" onClick={() => exec("formatBlock", "<h3>")}><Heading3 className="w-4 h-4" /></Btn>
        <Btn title="पैराग्राफ" onClick={() => exec("formatBlock", "<p>")}><Pilcrow className="w-4 h-4" /></Btn>
        <Btn title="उद्धरण" onClick={() => exec("formatBlock", "<blockquote>")}><Quote className="w-4 h-4" /></Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <Btn title="बुलेट सूची" onClick={() => exec("insertUnorderedList")}><List className="w-4 h-4" /></Btn>
        <Btn title="क्रमित सूची" onClick={() => exec("insertOrderedList")}><ListOrdered className="w-4 h-4" /></Btn>
        <Btn title="लिंक" onClick={addLink}><Link2 className="w-4 h-4" /></Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <Btn title="इमेज जोड़ें (एक से अधिक चुन सकते हैं)" onClick={() => fileInputRef.current?.click()}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </Btn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => insertImages(e.target.files)}
        />
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <Btn title="इमेज छोटी करें" disabled={!selectedImg} onClick={() => resizeSelectedImage(-1)}>
          <ZoomOut className="w-4 h-4" />
        </Btn>
        <Btn title="इमेज बड़ी करें" disabled={!selectedImg} onClick={() => resizeSelectedImage(1)}>
          <ZoomIn className="w-4 h-4" />
        </Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={emit}
        onClick={handleEditorClick}
        data-placeholder={placeholder || "यहाँ ब्लॉग लिखें..."}
        className="prose prose-sm max-w-none min-h-[260px] px-4 py-3 focus:outline-none text-gray-800 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-orange-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600 [&_img]:cursor-pointer empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        suppressContentEditableWarning
      />
    </div>
  )
}

"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Link2, Quote, Pilcrow, ImageIcon, Loader2,
  ZoomIn, ZoomOut, AlignLeft, AlignCenter, AlignRight, Printer,
} from "lucide-react"
import { uploadBlogImage } from "@/data-hooks/requests/blog"
import { useToast } from "@/hooks/use-toast"

interface RichTextEditorProps {
  initialValue?: string
  onChange: (html: string) => void
  placeholder?: string
}

// A4 at 96 dpi
const A4_W = 794
const A4_H = 1123

const SIZE_STEPS = [25, 33, 50, 66, 75, 100]

export default function RichTextEditor({ initialValue, onChange, placeholder }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null)
  const [imgSize, setImgSize] = useState<number>(100)
  const { toast } = useToast()

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialValue || ""
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const emit = useCallback(() => onChange(ref.current?.innerHTML || ""), [onChange])

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
          "insertHTML", false,
          `<img src="${url}" alt="" style="display:block;max-width:100%;width:100%;border-radius:8px;margin:8px auto;" />`
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

  // ── Image selection ──────────────────────────────────────────────────────────
  const selectImg = (img: HTMLImageElement | null) => {
    // Remove outline from previous
    if (selectedImg) selectedImg.style.outline = ""
    if (img) {
      img.style.outline = "2px solid #f97316"
      const pct = parseFloat(img.style.width) || 100
      setImgSize(Math.round(pct))
    }
    setSelectedImg(img)
  }

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement
    selectImg(t.tagName === "IMG" ? (t as HTMLImageElement) : null)
  }

  // ── Image resize (% based) ───────────────────────────────────────────────────
  const resizeImage = (dir: 1 | -1) => {
    if (!selectedImg) return
    const cur = imgSize
    const idx = SIZE_STEPS.reduce(
      (best, step, i) => Math.abs(step - cur) < Math.abs(SIZE_STEPS[best] - cur) ? i : best, 0
    )
    const next = Math.min(SIZE_STEPS.length - 1, Math.max(0, idx + dir))
    const pct = SIZE_STEPS[next]
    selectedImg.style.width = `${pct}%`
    selectedImg.style.height = "auto"
    setImgSize(pct)
    emit()
  }

  // ── Image alignment ──────────────────────────────────────────────────────────
  const alignImage = (align: "left" | "center" | "right") => {
    if (!selectedImg) return
    if (align === "left") {
      selectedImg.style.float = "left"
      selectedImg.style.display = ""
      selectedImg.style.marginRight = "12px"
      selectedImg.style.marginLeft = "0"
      selectedImg.style.marginTop = "4px"
      selectedImg.style.marginBottom = "4px"
    } else if (align === "right") {
      selectedImg.style.float = "right"
      selectedImg.style.display = ""
      selectedImg.style.marginLeft = "12px"
      selectedImg.style.marginRight = "0"
      selectedImg.style.marginTop = "4px"
      selectedImg.style.marginBottom = "4px"
    } else {
      selectedImg.style.float = ""
      selectedImg.style.display = "block"
      selectedImg.style.marginLeft = "auto"
      selectedImg.style.marginRight = "auto"
    }
    emit()
  }

  // ── Print ────────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const html = ref.current?.innerHTML || ""
    const win = window.open("", "_blank", "width=900,height=700")
    if (!win) return
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>नियमावली</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap"/>
  <style>
    @page { size: A4; margin: 20mm; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Noto Sans Devanagari', sans-serif;
      font-size: 11pt;
      color: #1a1a1a;
      line-height: 1.8;
      margin: 0;
    }
    img { max-width: 100%; height: auto; border-radius: 6px; }
    h2 { font-size: 16pt; font-weight: 700; margin-top: 16pt; }
    h3 { font-size: 13pt; font-weight: 600; margin-top: 12pt; }
    ul, ol { padding-left: 20pt; }
    blockquote { border-left: 4px solid #f97316; padding-left: 10pt; color: #555; }
    a { color: #2563eb; }
  </style>
</head>
<body>${html}</body>
</html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  // ── Toolbar button ───────────────────────────────────────────────────────────
  const Btn = ({ onClick, title, children, disabled, active }: any) => (
    <button
      type="button" title={title} disabled={disabled}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors text-gray-700
        ${disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-orange-100"}
        ${active ? "bg-orange-100 text-orange-700" : ""}`}
    >{children}</button>
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5 sticky top-0 z-10">
        {/* Text formatting */}
        <Btn title="Bold" onClick={() => exec("bold")}><Bold className="w-4 h-4" /></Btn>
        <Btn title="Italic" onClick={() => exec("italic")}><Italic className="w-4 h-4" /></Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <Btn title="शीर्षक H2" onClick={() => exec("formatBlock", "<h2>")}><Heading2 className="w-4 h-4" /></Btn>
        <Btn title="उपशीर्षक H3" onClick={() => exec("formatBlock", "<h3>")}><Heading3 className="w-4 h-4" /></Btn>
        <Btn title="पैराग्राफ" onClick={() => exec("formatBlock", "<p>")}><Pilcrow className="w-4 h-4" /></Btn>
        <Btn title="उद्धरण" onClick={() => exec("formatBlock", "<blockquote>")}><Quote className="w-4 h-4" /></Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <Btn title="बुलेट सूची" onClick={() => exec("insertUnorderedList")}><List className="w-4 h-4" /></Btn>
        <Btn title="क्रमित सूची" onClick={() => exec("insertOrderedList")}><ListOrdered className="w-4 h-4" /></Btn>
        <Btn title="लिंक" onClick={addLink}><Link2 className="w-4 h-4" /></Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        {/* Image upload */}
        <Btn title="इमेज जोड़ें" onClick={() => fileInputRef.current?.click()}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </Btn>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => insertImages(e.target.files)} />
        <span className="w-px h-5 bg-gray-300 mx-1" />
        {/* Image resize */}
        <Btn title="इमेज छोटी करें" disabled={!selectedImg} onClick={() => resizeImage(-1)}>
          <ZoomOut className="w-4 h-4" />
        </Btn>
        {selectedImg && (
          <span className="text-xs font-mono bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded min-w-[38px] text-center">
            {imgSize}%
          </span>
        )}
        <Btn title="इमेज बड़ी करें" disabled={!selectedImg} onClick={() => resizeImage(1)}>
          <ZoomIn className="w-4 h-4" />
        </Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        {/* Image alignment */}
        <Btn title="इमेज बाईं ओर" disabled={!selectedImg} onClick={() => alignImage("left")}>
          <AlignLeft className="w-4 h-4" />
        </Btn>
        <Btn title="इमेज बीच में" disabled={!selectedImg} onClick={() => alignImage("center")}>
          <AlignCenter className="w-4 h-4" />
        </Btn>
        <Btn title="इमेज दाईं ओर" disabled={!selectedImg} onClick={() => alignImage("right")}>
          <AlignRight className="w-4 h-4" />
        </Btn>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        {/* Print */}
        <Btn title="प्रिंट करें (A4)" onClick={handlePrint}>
          <Printer className="w-4 h-4" />
        </Btn>
      </div>

      {/* ── A4 Canvas ── */}
      <div className="bg-gray-300 overflow-auto"
        style={{ minHeight: `${A4_H * 0.6}px`, maxHeight: "72vh" }}>
        <div className="flex justify-center py-6 px-4">
          {/* Page shadow wrapper — simulates a stack of pages */}
          <div
            style={{
              width: A4_W,
              minHeight: A4_H,
              position: "relative",
            }}
          >
            {/* Page break guide lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  transparent 0px,
                  transparent ${A4_H - 1}px,
                  #bbb ${A4_H - 1}px,
                  #bbb ${A4_H}px
                )`,
                zIndex: 1,
              }}
            />
            {/* Page label at each break */}
            <div
              style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}
              aria-hidden
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: (i + 1) * A4_H,
                    left: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{
                    fontSize: 10,
                    color: "#888",
                    background: "#d4d4d4",
                    padding: "1px 8px",
                    borderRadius: 4,
                    userSelect: "none",
                  }}>
                    — पृष्ठ {i + 2} —
                  </span>
                </div>
              ))}
            </div>

            {/* The actual editable A4 page */}
            <div
              ref={ref}
              contentEditable
              onInput={emit}
              onClick={handleEditorClick}
              data-placeholder={placeholder || "यहाँ सामग्री लिखें..."}
              suppressContentEditableWarning
              style={{
                width: A4_W,
                minHeight: A4_H,
                background: "#ffffff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                padding: "56px 64px",
                fontSize: 13,
                lineHeight: 2,
                fontFamily: "'Noto Sans Devanagari','Hind',sans-serif",
                color: "#1a1a1a",
                outline: "none",
                position: "relative",
                zIndex: 3,
                boxSizing: "border-box",
              }}
              className="
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-1 [&_h2]:text-gray-900
                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:text-gray-800
                [&_p]:mb-2
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
                [&_li]:mb-1
                [&_a]:text-blue-600 [&_a]:underline
                [&_blockquote]:border-l-4 [&_blockquote]:border-orange-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600 [&_blockquote]:my-2
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:cursor-pointer
                empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none
              "
            />
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-50 border-t border-gray-200 text-xs text-gray-400">
        <span>A4 कैनवास — {A4_W} × {A4_H} px</span>
        {selectedImg
          ? <span className="text-orange-600 font-medium">इमेज चुनी गई — {imgSize}% आकार</span>
          : <span>इमेज पर क्लिक करें → आकार / स्थान बदलें</span>
        }
      </div>
    </div>
  )
}

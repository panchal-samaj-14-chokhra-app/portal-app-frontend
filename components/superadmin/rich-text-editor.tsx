"use client"

import { useEffect, useRef } from "react"
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Quote, Pilcrow } from "lucide-react"

interface RichTextEditorProps {
  initialValue?: string
  onChange: (html: string) => void
  placeholder?: string
}

// Lightweight contentEditable editor (no external deps). Uncontrolled: seeds from
// initialValue on mount, emits HTML on input. Remount with a `key` to load new content.
export default function RichTextEditor({ initialValue, onChange, placeholder }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)

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

  const Btn = ({ onClick, title, children }: any) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="p-2 rounded hover:bg-orange-100 text-gray-700"
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
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={emit}
        data-placeholder={placeholder || "यहाँ ब्लॉग लिखें..."}
        className="prose prose-sm max-w-none min-h-[260px] px-4 py-3 focus:outline-none text-gray-800 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-orange-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        suppressContentEditableWarning
      />
    </div>
  )
}

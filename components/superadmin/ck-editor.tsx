"use client"

// CKEditor wrapper — dynamically imported so it never runs on the server (SSR-safe)
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

interface CkEditorProps {
  value: string
  onChange: (v: string) => void
}

// Inner component that actually mounts CKEditor
function CkEditorInner({ value, onChange }: CkEditorProps) {
  // These imports are only resolved on the client
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { CKEditor } = require("@ckeditor/ckeditor5-react")
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ClassicEditor = require("@ckeditor/ckeditor5-build-classic")

  return (
    <div className="ck-editor-portal">
      <style>{`
        .ck-editor-portal .ck-editor__editable {
          min-height: 320px;
          font-size: 14px;
          font-family: inherit;
          line-height: 1.7;
          color: #1f2937;
        }
        .ck-editor-portal .ck.ck-toolbar {
          border-color: #fed7aa;
          background: #fff7ed;
        }
        .ck-editor-portal .ck.ck-editor__main > .ck-editor__editable {
          border-color: #fed7aa;
        }
        .ck-editor-portal .ck.ck-editor__main > .ck-editor__editable:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 2px rgba(249,115,22,0.2);
        }
      `}</style>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "undo",
            "redo",
          ],
          language: "hi",
        }}
        onChange={(_: any, editor: any) => onChange(editor.getData())}
        onError={(error: any) => {
          if (error?.willEditorRestart) return
          console.error("CKEditor error:", error)
        }}
      />
    </div>
  )
}

// Dynamically import so Next.js never tries to SSR it
const CkEditorDynamic = dynamic(() => Promise.resolve(CkEditorInner), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-40 border border-orange-200 rounded-lg bg-orange-50">
      <Loader2 className="w-5 h-5 animate-spin text-orange-400 mr-2" />
      <span className="text-sm text-orange-500">एडिटर लोड हो रहा है...</span>
    </div>
  ),
})

export default CkEditorDynamic

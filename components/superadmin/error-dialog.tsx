"use client"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorDialogProps {
  title?: string
  message: string
  onClose: () => void
  onRetry?: () => void
}

export function ErrorDialog({ title = "त्रुटि हुई", message, onClose, onRetry }: ErrorDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4">
        {/* Header */}
        <div className="p-6 text-center border-b border-red-200 bg-gradient-to-r from-red-50 to-red-100">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-red-800">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm leading-relaxed">{message}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              💡 <strong>सुझाव:</strong> कृपया अपना इंटरनेट कनेक्शन जांचें और दोबारा कोशिश करें।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            बंद करें
          </Button>
          {onRetry && (
            <Button onClick={onRetry} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              दोबारा कोशिश करें
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

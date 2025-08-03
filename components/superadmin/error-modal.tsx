"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export default function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform animate-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-700">त्रुटि!</h2>
        </div>

        <p className="text-center text-gray-700 mb-6">{message}</p>

        <div className="flex justify-center">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
          >
            ठीक है
          </Button>
        </div>
      </div>
    </div>
  )
}

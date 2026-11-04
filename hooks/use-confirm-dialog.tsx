"use client"

import { useCallback, useRef, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Promise-based replacement for window.confirm(), rendered as a proper AlertDialog
// instead of the browser's native confirm() popup.
// Usage: const { confirm, ConfirmDialog } = useConfirmDialog()
//        if (!(await confirm("क्या आप वाकई इसे हटाना चाहते हैं?"))) return
//        ...render {ConfirmDialog} once, anywhere in the component tree...
export function useConfirmDialog() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const resolver = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((msg: string) => {
    setMessage(msg)
    setOpen(true)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const settle = (value: boolean) => {
    setOpen(false)
    resolver.current?.(value)
    resolver.current = null
  }

  const ConfirmDialog = (
    <AlertDialog open={open} onOpenChange={(o) => !o && settle(false)}>
      <AlertDialogContent className="sm:max-w-[420px]">
        <AlertDialogHeader>
          <AlertDialogTitle>पुष्टि करें</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => settle(false)}>रद्द करें</AlertDialogCancel>
          <AlertDialogAction onClick={() => settle(true)} className="bg-red-600 hover:bg-red-700 text-white">
            हां, हटाएं
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return { confirm, ConfirmDialog }
}

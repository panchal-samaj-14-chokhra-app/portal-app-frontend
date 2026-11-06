"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, type LucideIcon } from "lucide-react"

interface Props {
  title: string
  subtitle?: string
  icon?: LucideIcon
  backHref?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, icon: Icon, backHref = "/", action }: Props) {
  return (
    <header className="sticky top-0 z-30 print:hidden"
      style={{ background: "linear-gradient(90deg,#7c2d12 0%,#9a3412 40%,#c2410c 100%)", boxShadow: "0 2px 12px rgba(124,45,18,0.3)" }}>
      <div className="h-1" style={{ background: "repeating-linear-gradient(90deg,#fbbf24 0,#fbbf24 8px,#c2410c 8px,#c2410c 16px)" }} />
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href={backHref}
          className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-white font-extrabold text-base sm:text-lg leading-tight truncate">{title}</h1>
            {subtitle && <p className="text-orange-200 text-xs truncate">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  )
}

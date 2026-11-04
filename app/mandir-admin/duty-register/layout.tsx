"use client";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const DUTY_SUB_TABS = [
  { href: "/mandir-admin/duty-register/register", label: "रजिस्टर" },
  { href: "/mandir-admin/duty-register/members", label: "सदस्य प्रोफाइल्स" },
  { href: "/mandir-admin/duty-register/settings", label: "सेटिंग्स" },
  { href: "/mandir-admin/duty-register/reports", label: "रिपोर्ट" },
]

export default function DutyRegisterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border bg-white p-1 shadow-sm">
        {DUTY_SUB_TABS.map((t) => {
          const active = pathname.startsWith(t.href)
          return (
            <Link key={t.href} href={t.href}>
              <Button
                size="sm"
                variant={active ? "default" : "ghost"}
                className={active ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" : ""}
              >
                {t.label}
              </Button>
            </Link>
          )
        })}
      </div>

      {children}
    </div>
  )
}

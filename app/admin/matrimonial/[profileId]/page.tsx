"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import MatrimonialEdit from "@/components/superadmin/matrimonial-edit"

// Deep-link fallback. The primary edit flow renders MatrimonialEdit inside the
// super-admin tab (so the app header/nav stays); this route supports direct URLs.
export default function MatrimonialEditPage() {
  const router = useRouter()
  const profileId = useParams().profileId as string
  const viewOnly = useSearchParams().get("view") === "1"
  return (
    <div className="min-h-screen bg-orange-50/40 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <MatrimonialEdit
          profileId={profileId}
          viewOnly={viewOnly}
          onBack={() => router.push("/admin/superadmin?tab=matrimonial")}
        />
      </div>
    </div>
  )
}

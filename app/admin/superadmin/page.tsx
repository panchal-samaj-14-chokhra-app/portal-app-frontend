"use client"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Home, Building2, BarChart3, Users, User } from "lucide-react"
import SuperAdmin from "@/components/superadmin/SuperAdmin"

const SIDEBAR_TABS = [
  { key: "village", label: "गांव प्रबंधन", icon: Home, shortLabel: "गांव" },
  { key: "chokhla", label: "चोखरा प्रबंधन", icon: Building2, shortLabel: "चोखरा" },
  { key: "statics", label: "आँकड़े", icon: BarChart3, shortLabel: "आँकड़े" },
  { key: "user", label: "यूज़र प्रबंधन", icon: Users, shortLabel: "यूज़र" },
  { key: "profile", label: "सुपर एडमिन प्रोफ़ाइल", icon: User, shortLabel: "प्रोफ़ाइल" },
]

interface CreatedData {
  chokhlaId: string
  userId: string
  email: string
  fullName: string
  role: string
  password: string
}

export default async function SuperAdminPage() {
  const session = await getServerSession(authOptions)

  console.log("SuperAdminPage: Session check:", session)

  // Check if user is authenticated
  if (!session?.user) {
    console.log("SuperAdminPage: No session, redirecting to login")
    redirect("/login")
  }

  // Check if user has SUPER_ADMIN role
  const userRole = (session.user as any).role
  console.log("SuperAdminPage: User role:", userRole)

  if (userRole !== "SUPER_ADMIN") {
    console.log("SuperAdminPage: User is not SUPER_ADMIN, redirecting to login")
    redirect("/login")
  }

  console.log("SuperAdminPage: Access granted for SUPER_ADMIN")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Development Authentication Status */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Authentication Status:</strong> ✅ Authenticated as SUPER_ADMIN
              </p>
              <p className="text-xs text-green-600 mt-1">
                User: {session.user.email} | Role: {(session.user as any).role}
              </p>
            </div>
          </div>
        </div>
      )}

      <SuperAdmin />
    </div>
  )
}

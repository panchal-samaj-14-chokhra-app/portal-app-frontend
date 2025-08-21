import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SuperAdminClient from "./SuperAdminClient"

export default async function SuperAdminPage() {
  const session = await getServerSession(authOptions)

  console.log("SuperAdminPage: Session check:", session)

  if (!session?.user) {
    console.log("SuperAdminPage: No session, redirecting to login")
    redirect("/login")
  }

  const userRole = (session.user as any).role
  console.log("SuperAdminPage: User role:", userRole)

  if (userRole !== "SUPER_ADMIN") {
    console.log("SuperAdminPage: Unauthorized access, redirecting to login")
    redirect("/login")
  }

  console.log("SuperAdminPage: Access granted for SUPER_ADMIN")

  return (
    <div className="min-h-screen bg-gray-50">
      {process.env.NODE_ENV === "development" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 text-sm">
          <strong>Development Mode:</strong> Authenticated as {session.user.email} ({userRole})
        </div>
      )}
      <SuperAdminClient session={session} />
    </div>
  )
}

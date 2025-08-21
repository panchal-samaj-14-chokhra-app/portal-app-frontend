import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { CheckCircle, XCircle } from "lucide-react"

export default async function TestAuthPage() {
  const session = await getServerSession(authOptions)

  const testResults = [
    {
      test: "Session Exists",
      passed: !!session,
      details: session ? "Session found" : "No session found",
    },
    {
      test: "User Object",
      passed: !!session?.user,
      details: session?.user ? "User object exists" : "No user object",
    },
    {
      test: "User Role",
      passed: !!(session?.user as any)?.role,
      details: (session?.user as any)?.role || "No role found",
    },
    {
      test: "User Email",
      passed: !!session?.user?.email,
      details: session?.user?.email || "No email found",
    },
    {
      test: "User ID",
      passed: !!(session?.user as any)?.id,
      details: (session?.user as any)?.id || "No ID found",
    },
    {
      test: "Auth Token",
      passed: !!(session?.user as any)?.token,
      details: (session?.user as any)?.token ? "Token exists" : "No token found",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Test Dashboard</h1>
          <p className="text-gray-600">Verify authentication status and session data</p>
        </div>

        {/* Overall Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {session ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <span>Authentication Status</span>
            </CardTitle>
            <CardDescription>{session ? "User is authenticated" : "User is not authenticated"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Session Data:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{JSON.stringify(session, null, 2)}</pre>
              </div>
              <div>
                <h3 className="font-semibold mb-2">User Role Access:</h3>
                <div className="space-y-2">
                  {(session?.user as any)?.role === "SUPER_ADMIN" && (
                    <Badge className="bg-green-100 text-green-800">✅ Super Admin Access</Badge>
                  )}
                  {(session?.user as any)?.role === "VILLAGE_MEMBER" && (
                    <Badge className="bg-blue-100 text-blue-800">✅ Village Member Access</Badge>
                  )}
                  {(session?.user as any)?.role === "CHOKHLA_MEMBER" && (
                    <Badge className="bg-purple-100 text-purple-800">✅ Chokhla Member Access</Badge>
                  )}
                  {!(session?.user as any)?.role && <Badge variant="destructive">❌ No Role Assigned</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Tests</CardTitle>
            <CardDescription>Detailed test results for authentication components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <h4 className="font-medium">{result.test}</h4>
                      <p className="text-sm text-gray-600">{result.details}</p>
                    </div>
                  </div>
                  <Badge variant={result.passed ? "default" : "destructive"}>{result.passed ? "PASS" : "FAIL"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <a
                href="/login"
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Go to Login
              </a>
              {session && (session.user as any)?.role === "SUPER_ADMIN" && (
                <a
                  href="/admin/superadmin"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Go to Super Admin Dashboard
                </a>
              )}
              {session && (session.user as any)?.role === "VILLAGE_MEMBER" && (
                <a
                  href={`/admin/village/${(session.user as any)?.villageId}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go to Village Dashboard
                </a>
              )}
              {session && (session.user as any)?.role === "CHOKHLA_MEMBER" && (
                <a
                  href={`/admin/chokhla/${(session.user as any)?.choklaId}`}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Go to Chokhla Dashboard
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

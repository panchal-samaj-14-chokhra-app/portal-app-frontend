import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Shield, User, Clock } from "lucide-react"

export default async function TestAuthPage() {
  const session = await getServerSession(authOptions)

  const testResults = {
    sessionExists: !!session,
    userExists: !!session?.user,
    hasRole: !!(session?.user as any)?.role,
    hasEmail: !!session?.user?.email,
    hasId: !!(session?.user as any)?.id,
    hasToken: !!(session?.user as any)?.token,
  }

  const allTestsPassed = Object.values(testResults).every(Boolean)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Test Dashboard</h1>
          <p className="text-gray-600">Comprehensive authentication system testing and verification</p>
        </div>

        {/* Overall Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {allTestsPassed ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              Overall Authentication Status
            </CardTitle>
            <CardDescription>
              {allTestsPassed ? "All authentication tests passed successfully" : "Some authentication tests failed"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={allTestsPassed ? "default" : "destructive"} className="text-sm">
              {allTestsPassed ? "✅ AUTHENTICATED" : "❌ AUTHENTICATION ISSUES"}
            </Badge>
          </CardContent>
        </Card>

        {/* Session Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Session Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {session ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Session Exists:</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Object:</span>
                    {session.user ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm text-gray-600">{session.user?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Role:</span>
                    <Badge variant="outline">{(session.user as any)?.role || "N/A"}</Badge>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm">No active session found</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {session?.user ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User ID:</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {(session.user as any)?.id || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chokhla ID:</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {(session.user as any)?.choklaId || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Village ID:</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {(session.user as any)?.villageId || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Has Token:</span>
                    {(session.user as any)?.token ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">No user data available</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Authentication Tests
            </CardTitle>
            <CardDescription>Individual test results for authentication components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(testResults).map(([test, passed]) => (
                <div key={test} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium capitalize">{test.replace(/([A-Z])/g, " $1")}</span>
                  {passed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Raw Session Data */}
        <Card>
          <CardHeader>
            <CardTitle>Raw Session Data</CardTitle>
            <CardDescription>Complete session object for debugging purposes</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
              {JSON.stringify(session, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="mt-8 flex gap-4">
          <a
            href="/login"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go to Login
          </a>
          {session?.user && (session.user as any)?.role === "SUPER_ADMIN" && (
            <a
              href="/admin/superadmin"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Super Admin Dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

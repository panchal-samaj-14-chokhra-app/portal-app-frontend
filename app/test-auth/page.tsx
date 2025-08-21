import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card"
import { Badge } from "@/components/ui/badge/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default async function TestAuthPage() {
  const session = await getServerSession(authOptions)

  const testResults = [
    {
      name: "Session Exists",
      status: !!session,
      description: "NextAuth session is available",
    },
    {
      name: "User Data",
      status: !!session?.user,
      description: "User object exists in session",
    },
    {
      name: "User Role",
      status: !!(session?.user as any)?.role,
      description: "User role is available",
    },
    {
      name: "User Email",
      status: !!session?.user?.email,
      description: "User email is available",
    },
    {
      name: "Auth Token",
      status: !!(session?.user as any)?.token,
      description: "Authentication token is available",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Authentication Test Dashboard</h1>
          <p className="text-gray-600 mt-2">Verify authentication status and session data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Authentication component tests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResults.map((test, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{test.name}</p>
                    <p className="text-sm text-gray-500">{test.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {test.status ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Pass
                        </Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Fail
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Data</CardTitle>
              <CardDescription>Current session information</CardDescription>
            </CardHeader>
            <CardContent>
              {session ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm">{session.user?.email || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-sm">{(session.user as any)?.role || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-sm">{(session.user as any)?.id || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Village ID</p>
                    <p className="text-sm">{(session.user as any)?.villageId || "Not applicable"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Chokhla ID</p>
                    <p className="text-sm">{(session.user as any)?.choklaId || "Not applicable"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Token</p>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                      {(session.user as any)?.token
                        ? `${(session.user as any).token.substring(0, 50)}...`
                        : "Not available"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <p>No active session found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Raw Session Object</CardTitle>
            <CardDescription>Complete session data for debugging</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">{JSON.stringify(session, null, 2)}</pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

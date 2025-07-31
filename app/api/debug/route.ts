import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      nextjsVersion: process.env.npm_package_dependencies_next || "unknown",
      requestUrl: process.env.NEXT_PUBLIC_REQUEST_URL,
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url,
      method: request.method,
      userAgent: request.headers.get("user-agent"),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    }

    return NextResponse.json({
      success: true,
      data: debugInfo,
      message: "Debug information retrieved successfully",
    })
  } catch (error) {
    console.error("Debug API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

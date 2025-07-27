import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic health check
    const timestamp = new Date().toISOString()

    return NextResponse.json({
      status: "healthy",
      timestamp,
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
    })
  } catch (error) {
    return NextResponse.json({ status: "unhealthy", error: "Internal server error" }, { status: 500 })
  }
}

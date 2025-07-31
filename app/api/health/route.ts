import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check backend API health
    const backendHealth = await fetch(`${process.env.NEXT_PUBLIC_REQUEST_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const isBackendHealthy = backendHealth.ok

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        frontend: "healthy",
        backend: isBackendHealthy ? "healthy" : "unhealthy",
        database: isBackendHealthy ? "healthy" : "unknown",
      },
      version: process.env.npm_package_version || "1.0.0",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        services: {
          frontend: "healthy",
          backend: "unhealthy",
          database: "unknown",
        },
        error: "Backend connection failed",
      },
      { status: 503 },
    )
  }
}

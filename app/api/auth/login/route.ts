import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Make request to your backend API
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_REQUEST_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const backendData = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json({ error: backendData.message || "Login failed" }, { status: backendResponse.status })
    }

    // Return user data for NextAuth
    return NextResponse.json({
      userId: backendData.user.id,
      email: backendData.user.email,
      role: backendData.user.role,
      token: backendData.token,
      choklaId: backendData.user.choklaId,
      villageId: backendData.user.villageId,
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

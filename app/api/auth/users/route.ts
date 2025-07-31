import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin privileges
    if ((session.user as any).role !== "superadmin") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Fetch users from backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_REQUEST_URL}/users`, {
      headers: {
        Authorization: `Bearer ${(session.user as any).token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }

    const users = await response.json()
    return NextResponse.json(users)
  } catch (error) {
    console.error("Users API error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await request.json()

    // Create user via backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_REQUEST_URL}/users/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${(session.user as any).token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.message || "Failed to create user" }, { status: response.status })
    }

    const newUser = await response.json()
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Create user API error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Keeps signed-out visitors out of /admin/* and sends them to the login page, remembering where they wanted to go.
// This only reads the login cookie (no backend call): the API itself still checks every token, and the pages
// renew the access token. A login whose refresh token has run out, or that was ended, counts as signed out.
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const signedIn = !!token && !token.error && Number(token.refreshTokenExpires) > Date.now()

  if (!signedIn) {
    const login = new URL("/login", req.url)
    login.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
    if (token) login.searchParams.set("reason", "expired")
    return NextResponse.redirect(login)
  }

  // the super admin area is for super admins only
  if (req.nextUrl.pathname.startsWith("/admin/superadmin") && token.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

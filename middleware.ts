import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Allow access to login page and public routes
    if (pathname === "/login" || pathname === "/" || pathname === "/help") {
      return NextResponse.next()
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }

      // Role-based access control
      const role = token.role as string

      if (pathname.startsWith("/admin/superadmin") && role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url))
      }

      if (pathname.startsWith("/admin/village") && role !== "VILLAGE_MEMBER") {
        return NextResponse.redirect(new URL("/login", req.url))
      }

      if (pathname.startsWith("/admin/chokhla") && role !== "CHOKHLA_MEMBER") {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow public routes
        if (pathname === "/login" || pathname === "/" || pathname === "/help") {
          return true
        }

        // Require authentication for admin routes
        if (pathname.startsWith("/admin")) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

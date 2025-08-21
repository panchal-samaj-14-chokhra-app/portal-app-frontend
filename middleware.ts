import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    console.log("Middleware - Path:", pathname, "Token:", token)

    // Allow access to login page and public routes
    if (pathname === "/login" || pathname === "/" || pathname === "/help") {
      return NextResponse.next()
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (!token) {
        console.log("No token, redirecting to login")
        return NextResponse.redirect(new URL("/login", req.url))
      }

      // Role-based access control
      const role = token.role as string
      console.log("User role:", role)

      if (pathname.startsWith("/admin/superadmin") && role !== "SUPER_ADMIN") {
        console.log("Unauthorized access to superadmin")
        return NextResponse.redirect(new URL("/login", req.url))
      }

      if (pathname.startsWith("/admin/village") && role !== "VILLAGE_MEMBER") {
        console.log("Unauthorized access to village")
        return NextResponse.redirect(new URL("/login", req.url))
      }

      if (pathname.startsWith("/admin/chokhla") && role !== "CHOKHLA_MEMBER") {
        console.log("Unauthorized access to chokhla")
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

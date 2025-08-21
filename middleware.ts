import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    console.log("Middleware - Path:", pathname, "Token role:", token?.role)

    // Allow access to login page and public routes
    if (pathname === "/login" || pathname === "/" || pathname === "/help" || pathname === "/reset-password") {
      return NextResponse.next()
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (!token) {
        console.log("Middleware: No token, redirecting to login")
        return NextResponse.redirect(new URL("/login", req.url))
      }

      // Role-based access control
      const role = token.role as string
      const villageId = token.villageId as string
      const choklaId = token.choklaId as string

      console.log("Middleware: User role:", role, "VillageId:", villageId, "ChoklaId:", choklaId)

      // Super Admin access
      if (pathname.startsWith("/admin/superadmin")) {
        if (role !== "SUPER_ADMIN") {
          console.log("Middleware: Unauthorized access to superadmin, redirecting to login")
          return NextResponse.redirect(new URL("/login", req.url))
        }
      }

      // Village Member access
      if (pathname.startsWith("/admin/village")) {
        if (role !== "VILLAGE_MEMBER") {
          console.log("Middleware: Unauthorized access to village, redirecting to login")
          return NextResponse.redirect(new URL("/login", req.url))
        }
        // Check if accessing correct village
        const pathVillageId = pathname.split("/")[3]
        if (pathVillageId && pathVillageId !== villageId) {
          console.log("Middleware: Accessing wrong village, redirecting to correct village")
          return NextResponse.redirect(new URL(`/admin/village/${villageId}`, req.url))
        }
      }

      // Chokhla Member access
      if (pathname.startsWith("/admin/chokhla")) {
        if (role !== "CHOKHLA_MEMBER") {
          console.log("Middleware: Unauthorized access to chokhla, redirecting to login")
          return NextResponse.redirect(new URL("/login", req.url))
        }
        // Check if accessing correct chokhla
        const pathChoklaId = pathname.split("/")[3]
        if (pathChoklaId && pathChoklaId !== choklaId) {
          console.log("Middleware: Accessing wrong chokhla, redirecting to correct chokhla")
          return NextResponse.redirect(new URL(`/admin/chokhla/${choklaId}`, req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow public routes
        if (pathname === "/login" || pathname === "/" || pathname === "/help" || pathname === "/reset-password") {
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

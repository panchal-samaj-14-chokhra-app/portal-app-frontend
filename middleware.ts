import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/login", "/help", "/reset-password"]

    if (publicRoutes.includes(pathname)) {
      // If user is authenticated and trying to access login page, redirect based on role
      if (pathname === "/login" && token) {
        const userRole = token.role as string
        if (userRole === "admin") {
          return NextResponse.redirect(new URL("/admin", req.url))
        } else if (userRole === "chokhra") {
          return NextResponse.redirect(new URL("/chokhra", req.url))
        } else if (userRole === "village") {
          return NextResponse.redirect(new URL("/village/village-1", req.url))
        }
      }
      return NextResponse.next()
    }

    // If no token and trying to access protected route
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Role-based access control
    const userRole = token.role as string

    // Admin can access everything
    if (userRole === "admin") {
      return NextResponse.next()
    }

    // Chokhra can access chokhra and village routes
    if (userRole === "chokhra" && (pathname.startsWith("/chokhra") || pathname.startsWith("/village"))) {
      return NextResponse.next()
    }

    // Village can only access village routes
    if (userRole === "village" && pathname.startsWith("/village")) {
      return NextResponse.next()
    }

    // If user doesn't have permission, redirect to their appropriate dashboard
    if (userRole === "village") {
      return NextResponse.redirect(new URL("/village/village-1", req.url))
    }
    if (userRole === "chokhra") {
      return NextResponse.redirect(new URL("/chokhra", req.url))
    }
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Default redirect to login
    return NextResponse.redirect(new URL("/login", req.url))
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        const publicRoutes = ["/", "/login", "/help", "/reset-password"]

        // Allow public routes
        if (publicRoutes.includes(pathname)) {
          return true
        }

        // Require token for protected routes
        return !!token
      },
    },
  },
)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|placeholder).*)"],
}

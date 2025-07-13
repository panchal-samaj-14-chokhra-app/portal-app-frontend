import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const pathname = req.nextUrl.pathname

    // Define public routes
    const publicRoutes = ["/", "/login", "/help", "/reset-password"]
    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/images")

    // Define protected routes
    const protectedRoutes = ["/village", "/chokhra", "/admin"]
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // If user is authenticated and trying to access login page, redirect based on role
    if (pathname === "/login" && isAuth) {
      // Redirect based on user role or default to village
      const userRole = token?.role || "village"
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url))
      } else if (userRole === "chokhra") {
        return NextResponse.redirect(new URL("/chokhra", req.url))
      } else {
        return NextResponse.redirect(new URL("/village", req.url))
      }
    }

    // Allow access to public routes
    if (isPublicRoute) {
      return NextResponse.next()
    }

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (!isAuth && isProtectedRoute) {
      let from = pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle the logic
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)",
  ],
}

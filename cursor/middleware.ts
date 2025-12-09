import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Protected routes
    const protectedRoutes = [
      "/generate",
      "/dashboard",
      "/content",
      "/analytics",
      "/referrals",
      "/settings",
    ]

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )

    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Check if user needs onboarding
    if (token && pathname !== "/onboarding") {
      // We'll check this in the page itself since we need DB access
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/generate/:path*",
    "/dashboard/:path*",
    "/content/:path*",
    "/analytics/:path*",
    "/referrals/:path*",
    "/settings/:path*",
  ],
}


/**
 * Authentication Middleware
 *
 * This middleware protects specified routes by verifying user authentication.
 * It intercepts requests to protected paths and redirects unauthenticated users
 * to the signin page, preserving the original URL as a callback destination.
 */

// Next.js server imports
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Authentication imports
import { getToken } from "next-auth/jwt"

/**
 * Middleware function that runs on every request matching the config matcher
 *
 * @param request - The incoming request object
 * @returns NextResponse - Either redirects to signin or allows the request to proceed
 */
export async function middleware(request: NextRequest) {
  // Extract the pathname from the request URL
  const { pathname } = request.nextUrl

  // Define routes that require authentication
  const protectedPaths = ["/dashboard"]

  // Check if the current path matches any protected path or is a sub-path
  const isPathProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Only perform authentication check for protected paths
  if (isPathProtected) {
    console.log("Token verification for path:", pathname)

    // Attempt to get the authentication token from the request
    const token = await getToken({ req: request })

    // Log authentication status for debugging
    console.log("Token exists:", !!token)
    if (token) {
      console.log("Token user:", token.email || token.sub)
    }

    // If no token exists, the user is not authenticated
    if (!token) {
      console.log("User is not authenticated, redirecting to signin page")

      // Create redirect URL to the signin page
      const url = new URL(`/signin`, request.url)

      // Add the original path as a callback URL parameter
      // This allows redirecting back after successful authentication
      url.searchParams.set("callbackUrl", encodeURI(pathname))

      // Redirect to the signin page
      return NextResponse.redirect(url)
    }
  }

  // Allow the request to proceed
  return NextResponse.next()
}

/**
 * Middleware matcher configuration
 *
 * This defines which paths the middleware should run on.
 * The regex pattern excludes Next.js internal routes, static files,
 * and authentication API routes from middleware processing.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth.js API routes)
     * - _next (Next.js internals)
     * - .*\\. (static files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next|.*\\..*|favicon.ico).*)",
  ],
}

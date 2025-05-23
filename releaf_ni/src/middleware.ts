import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const protectedPaths = ["/dashboard"]
  const isPathProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  if (isPathProtected) {
    console.log("Token verification for path:", pathname)

    const token = await getToken({ req: request })
    
    console.log("Token exists:", !!token)
    if (token) {
      console.log("Token user:", token.email || token.sub)
    }
    // Redirect to signin if not authenticated
    if (!token) {
      console.log("User is not authenticated, redirecting to signin page")
      const url = new URL(`/signin`, request.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

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


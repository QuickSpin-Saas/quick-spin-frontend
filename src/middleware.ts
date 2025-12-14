import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl
  const isAuthPage = pathname.startsWith("/auth")
  const isApiRoute = pathname.startsWith("/api")
  const isRootPage = pathname === "/"
  
  // // Development bypass - skip authentication in development or for QA
  // if (process.env.NODE_ENV === "development") {
  //   return NextResponse.next()
  // }
  
  // TEMPORARY QA BYPASS: Allow all traffic for UI review
  return NextResponse.next()

  // 1. Root Path Redirect (301 Permanent)
  if (isRootPage) {
    console.log(`[Middleware] Redirecting root access to /auth/login`)
    return NextResponse.redirect(new URL("/auth/login", request.url), 301)
  }

  // 2. Allow API routes to be handled by their own authentication
  if (isApiRoute) {
    return NextResponse.next()
  }
  
  // 3. Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  
  // 4. Redirect unauthenticated users to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  
  // 5. Add user info to headers for server components
  const userId = token?.id
  const userRole = token?.role
  const userEmail = token?.email

  if (userId && userRole && userEmail) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", userId as string)
    requestHeaders.set("x-user-role", userRole as string)
    requestHeaders.set("x-user-email", userEmail as string)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

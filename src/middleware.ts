import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")
  
  // Allow API routes to be handled by their own authentication
  if (isApiRoute) {
    return NextResponse.next()
  }
  
  // Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  
  // Redirect unauthenticated users to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  
  // Add user info to headers for server components
  if (token) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", token.id as string)
    requestHeaders.set("x-user-role", token.role as string)
    requestHeaders.set("x-user-email", token.email as string)
    
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
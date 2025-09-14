import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware to protect routes without using NextAuth
export function middleware(request: NextRequest) {
  // Get the path
  const { pathname } = request.nextUrl;
  
  // Define public routes
  const isPublicRoute = 
    pathname === "/" || 
    pathname === "/auth/signin" || 
    pathname === "/auth/signup" ||
    pathname.startsWith("/api/test") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico");

  // Define protected routes
  const isProtectedRoute = 
    pathname.startsWith("/dashboard/") || 
    pathname.startsWith("/admin/");

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, we would normally check for a session
  // But in middleware, we'll just allow the request to proceed
  // and let the page component handle authentication
  if (isProtectedRoute) {
    // In a real implementation, we would check for a valid session token
    // For now, we'll allow the request to proceed to the page
    return NextResponse.next();
  }

  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
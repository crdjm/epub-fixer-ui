import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { simpleAuthMiddleware } from "@/lib/simple-auth-middleware";

// Simple middleware to protect routes without using NextAuth
export async function middleware(request: NextRequest) {
  // Clone the request headers and set a new header `x-url`
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  // Get the path
  const { pathname } = request.nextUrl;

  // Define public routes
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/auth/signin" ||
    pathname === "/auth/signup" ||
    pathname === "/simple-login" || // Add our simple login page
    pathname.startsWith("/api/test") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico");

  // Define protected routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard/") || pathname.startsWith("/admin/");

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For protected routes, check our simple authentication
  if (isProtectedRoute) {
    console.log(
      "Middleware: Protected route, calling simpleAuthMiddleware for",
      pathname,
    );
    const nextResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    return simpleAuthMiddleware(request, nextResponse);
  }

  // Allow all other requests
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
